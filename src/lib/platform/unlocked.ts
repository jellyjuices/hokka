import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";
import { createSubscribers } from "./subscribers";

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
