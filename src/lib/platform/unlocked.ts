import { clearSession, readSession, writeSession } from "@/src/lib/storage/session";
import { createSubscribers } from "./subscribers";

const STORAGE_KEY = "hokka:unlocked-until";

export const LOCK_AFTER_MINUTES = 5;

// The stamp lives in sessionStorage, so closing the app or the tab locks the
// ledger with no timer involved. IDLE_LIMIT closes it after a spell of no input,
// and HIDDEN_GRACE shortens that the moment the tab goes away — short, because a
// hidden tab may be a phone in someone else's hand, but not instant, because
// attaching a receipt sends you to a photo picker and back.
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

// A background tab has its timers throttled, so the grace may lapse without the
// timeout ever firing. Coming back is the second place the clock is read.
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
