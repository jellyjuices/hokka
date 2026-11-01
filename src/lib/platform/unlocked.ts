import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";
import { clearSession, readSession, writeSession } from "@/src/lib/storage/session";
import { createSubscribers } from "./subscribers";

const STORAGE_KEY = "hokka:unlocked-until";
const LAPSED_KEY = "hokka:session-lapsed";

export const LOCK_AFTER_MINUTES = 5;

const IDLE_LIMIT = LOCK_AFTER_MINUTES * 60 * 1000;
const HIDDEN_GRACE = 60 * 1000;
const REFRESH_STEP = 10 * 1000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

const subscribers = createSubscribers();
let timer: ReturnType<typeof setTimeout> | null = null;

function readExpiry() {
  const raw = readSession(STORAGE_KEY);
  if (raw === null) return 0;
  const expiry = Number(raw);
  return Number.isFinite(expiry) ? expiry : 0;
}

function stopTimer() {
  if (timer === null) return;
  clearTimeout(timer);
  timer = null;
}

function scheduleLock(expiry: number) {
  stopTimer();
  const remaining = expiry - Date.now();
  if (remaining <= 0) return;
  timer = setTimeout(clearUnlocked, remaining);
}

function moveExpiry(expiry: number) {
  writeSession(STORAGE_KEY, String(expiry));
  scheduleLock(expiry);
}

function onActivity() {
  const expiry = readExpiry();
  if (expiry <= Date.now()) return;
  const next = Date.now() + IDLE_LIMIT;
  if (next - expiry < REFRESH_STEP) return;
  moveExpiry(next);
}

function onVisibilityChange() {
  const expiry = readExpiry();
  const isHidden = document.visibilityState === "hidden";
  if (expiry <= Date.now()) {
    if (!isHidden) clearUnlocked();
    return;
  }
  moveExpiry(isHidden ? Math.min(expiry, Date.now() + HIDDEN_GRACE) : Date.now() + IDLE_LIMIT);
}

export function subscribeUnlocked(listener: () => void) {
  if (subscribers.size === 0) {
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    scheduleLock(readExpiry());
  }
  subscribers.add(listener);
  return () => {
    subscribers.remove(listener);
    if (subscribers.size > 0) return;
    for (const event of ACTIVITY_EVENTS) window.removeEventListener(event, onActivity);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    stopTimer();
  };
}

export function getUnlockedSnapshot() {
  return readExpiry() > Date.now();
}

export function getUnlockedServerSnapshot(): boolean | null {
  return null;
}

export function writeUnlocked() {
  moveExpiry(Date.now() + IDLE_LIMIT);
  subscribers.publish();
}

export function clearUnlocked() {
  clearSession(STORAGE_KEY);
  stopTimer();
  subscribers.publish();
}

export function isSessionLapsed() {
  return readLocal(LAPSED_KEY) !== null;
}

export function getSessionLapsedServerSnapshot() {
  return false;
}

// A biometric pass opens the screen without asking the server, so it cannot renew a lapsed
// cookie: it would reopen the ledger straight into the next 401, over and over. Once a 401 says
// the cookie is gone, only the password opens the ledger again. The mark sits in localStorage,
// unlike the stamp, because the cookie it describes outlives the tab.
export function expireSession() {
  writeLocal(LAPSED_KEY, "true");
  clearUnlocked();
}

export function renewSession() {
  clearLocal(LAPSED_KEY);
  subscribers.publish();
}
