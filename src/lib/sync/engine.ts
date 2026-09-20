import { hydrateLocalStore, hydrateOutbox, readOutbox, subscribeOutbox } from "@/src/data/local";
import { isOnline } from "@/src/lib/platform/connectivity";
import type { SyncEngine, SyncEngineDeps, SyncEvent } from "./engine.types";
import { pullIntoLocal } from "./pull";
import { pushOutbox } from "./push";

const PERIODIC_INTERVAL_MS = 5 * 60 * 1000;
const RECONNECT_INTERVAL_MS = 3 * 60 * 1000;
const QUEUE_DEBOUNCE_MS = 800;

export function createSyncEngine(deps: SyncEngineDeps): SyncEngine {
  let isStarted = false;
  let inFlight: Promise<void> | null = null;
  let intervalId: number | null = null;
  let reconnectId: number | null = null;
  let debounceId: number | null = null;
  let unsubscribeQueue: (() => void) | null = null;
  let isWaitingForNetwork = false;
  let hasReportedOffline = false;
  let hasReportedFailure = false;

  function reportOffline() {
    if (hasReportedOffline) return;
    hasReportedOffline = true;
    deps.onEvent({ kind: "offline" });
  }

  function reportOnline() {
    if (!hasReportedOffline) return;
    hasReportedOffline = false;
    deps.onEvent({ kind: "online" });
  }

  function reportFailure(event: SyncEvent) {
    if (hasReportedFailure) return;
    hasReportedFailure = true;
    deps.onEvent(event);
  }

  function stopWaitingForNetwork() {
    isWaitingForNetwork = false;
    if (reconnectId === null) return;
    window.clearInterval(reconnectId);
    reconnectId = null;
  }

  function waitForNetwork() {
    isWaitingForNetwork = true;
    if (reconnectId !== null) return;
    reconnectId = window.setInterval(() => {
      if (!isOnline()) return;
      void syncNow();
    }, RECONNECT_INTERVAL_MS);
  }

  async function runSync() {
    if (!isOnline()) {
      deps.onStatusChanged("offline");
      reportOffline();
      waitForNetwork();
      return;
    }

    deps.onStatusChanged("syncing");
    try {
      await hydrateLocalStore();
      await hydrateOutbox();
      const result = await pushOutbox();
      await pullIntoLocal();
      deps.onSyncedAtChanged(Date.now());

      reportOnline();
      if (result.pushed > 0) deps.onEvent({ kind: "pushed", count: result.pushed });

      if (result.blocked) {
        deps.onStatusChanged("error");
        reportFailure({ kind: "blocked" });
        waitForNetwork();
        return;
      }

      deps.onErrorChanged(null);
      deps.onStatusChanged("idle");
      hasReportedFailure = false;
      stopWaitingForNetwork();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      deps.onErrorChanged(message);
      deps.onStatusChanged(isOnline() ? "error" : "offline");
      if (isOnline()) reportFailure({ kind: "failed", message });
      else reportOffline();
      waitForNetwork();
    }
  }

  function syncNow() {
    if (!inFlight) {
      inFlight = runSync().finally(() => {
        inFlight = null;
      });
    }
    return inFlight;
  }

  function requestSync() {
    if (isWaitingForNetwork) return;
    void syncNow();
  }

  function handleQueueChanged() {
    if (readOutbox().length === 0) return;
    if (isWaitingForNetwork) return;
    if (debounceId !== null) window.clearTimeout(debounceId);
    debounceId = window.setTimeout(() => {
      debounceId = null;
      requestSync();
    }, QUEUE_DEBOUNCE_MS);
  }

  function handleOnline() {
    stopWaitingForNetwork();
    deps.onStatusChanged("idle");
    void syncNow();
  }

  function handleOffline() {
    deps.onStatusChanged("offline");
    reportOffline();
    waitForNetwork();
  }

  function handleVisibility() {
    if (document.visibilityState !== "visible") return;
    requestSync();
  }

  function start() {
    if (isStarted) return;
    isStarted = true;
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);
    unsubscribeQueue = subscribeOutbox(handleQueueChanged);
    intervalId = window.setInterval(requestSync, PERIODIC_INTERVAL_MS);
    void syncNow();
  }

  function stop() {
    if (!isStarted) return;
    isStarted = false;
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    document.removeEventListener("visibilitychange", handleVisibility);
    unsubscribeQueue?.();
    unsubscribeQueue = null;
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
    if (debounceId !== null) window.clearTimeout(debounceId);
    debounceId = null;
    stopWaitingForNetwork();
  }

  return { start, stop, syncNow };
}
