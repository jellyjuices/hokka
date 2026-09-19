const listeners = new Set<() => void>();
let snapshot = true;

function publish() {
  const next = typeof navigator === "undefined" ? true : navigator.onLine;
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

export function isOnline() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

export function getConnectivitySnapshot() {
  return snapshot;
}

export function getConnectivityServerSnapshot() {
  return true;
}

export function subscribeConnectivity(listener: () => void) {
  if (listeners.size === 0) {
    snapshot = isOnline();
    window.addEventListener("online", publish);
    window.addEventListener("offline", publish);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener("online", publish);
    window.removeEventListener("offline", publish);
  };
}
