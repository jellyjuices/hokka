import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";
import { createSubscribers } from "./subscribers";

// The cookie set by /api/unlock is httpOnly, so the UI cannot read it. This flag is the
// offline-readable shadow of that session: it decides whether the app renders the ledger
// or the password screen, and a 401 from any route clears it.
const STORAGE_KEY = "hokka:unlocked";

const subscribers = createSubscribers();

export function subscribeUnlocked(listener: () => void) {
  subscribers.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    subscribers.remove(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getUnlockedSnapshot() {
  return readLocal(STORAGE_KEY) === "true";
}

export function getUnlockedServerSnapshot(): boolean | null {
  return null;
}

export function writeUnlocked() {
  writeLocal(STORAGE_KEY, "true");
  subscribers.publish();
}

export function clearUnlocked() {
  clearLocal(STORAGE_KEY);
  subscribers.publish();
}
