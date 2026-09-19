const STORAGE_KEY = "hokka:unlocked";

const listeners = new Set<() => void>();

function readUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function subscribeUnlocked(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getUnlockedSnapshot() {
  return readUnlocked();
}

export function getUnlockedServerSnapshot(): boolean | null {
  return null;
}

export function writeUnlocked() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    return;
  } finally {
    for (const listener of listeners) listener();
  }
}
