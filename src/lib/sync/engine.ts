import { hydrateLocalStore, hydrateOutbox, readOutbox, subscribeOutbox } from "@/src/data/local";
import { isOnline } from "@/src/lib/platform/connectivity";
import type { SyncEngine, SyncEngineDeps } from "./engine.types";
import { pullIntoLocal } from "./pull";
import { pushOutbox } from "./push";

const PERIODIC_INTERVAL_MS = 5 * 60 * 1000;
const RETRY_DELAY_MS = 30 * 1000;
const QUEUE_DEBOUNCE_MS = 800;

export function createSyncEngine(deps: SyncEngineDeps): SyncEngine {
  let isStarted = false;
  let inFlight: Promise<void> | null = null;
  let intervalId: number | null = null;
  let retryId: number | null = null;
  let debounceId: number | null = null;
  let unsubscribeQueue: (() => void) | null = null;

  function clearRetry() {
    if (retryId === null) return;
    window.clearTimeout(retryId);
    retryId = null;
  }

  function scheduleRetry() {
    clearRetry();
    retryId = window.setTimeout(() => {
      retryId = null;
      void runSync();
    }, RETRY_DELAY_MS);
  }

  async function runSync() {
    if (!isOnline()) {
      deps.onStatusChanged("offline");
      return;
    }

    deps.onStatusChanged("syncing");
    try {
      await hydrateLocalStore();
      await hydrateOutbox();
      const result = await pushOutbox();
      await pullIntoLocal();
      deps.onSyncedAtChanged(Date.now());

      if (result.blocked) {
        deps.onStatusChanged("error");
        scheduleRetry();
        return;
      }

      deps.onErrorChanged(null);
      deps.onStatusChanged("idle");
      clearRetry();
    } catch (error) {
      deps.onErrorChanged(error instanceof Error ? error.message : "Sync failed");
      deps.onStatusChanged(isOnline() ? "error" : "offline");
      scheduleRetry();
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

  function handleQueueChanged() {
    if (readOutbox().length === 0) return;
    if (debounceId !== null) window.clearTimeout(debounceId);
    debounceId = window.setTimeout(() => {
      debounceId = null;
      void syncNow();
    }, QUEUE_DEBOUNCE_MS);
  }

  function handleOnline() {
    deps.onStatusChanged("idle");
    void syncNow();
  }

  function handleOffline() {
    deps.onStatusChanged("offline");
  }

  function handleVisibility() {
    if (document.visibilityState !== "visible") return;
    void syncNow();
  }

  function start() {
    if (isStarted) return;
    isStarted = true;
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);
    unsubscribeQueue = subscribeOutbox(handleQueueChanged);
    intervalId = window.setInterval(() => {
      void syncNow();
    }, PERIODIC_INTERVAL_MS);
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
    clearRetry();
  }

  return { start, stop, syncNow };
}
