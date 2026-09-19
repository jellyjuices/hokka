import { createSubscribers } from "./subscribers";

const subscribers = createSubscribers();
let snapshot = true;

function publish() {
  const next = isOnline();
  if (next === snapshot) return;
  snapshot = next;
  subscribers.publish();
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
  if (subscribers.size === 0) {
    snapshot = isOnline();
    window.addEventListener("online", publish);
    window.addEventListener("offline", publish);
  }
  subscribers.add(listener);
  return () => {
    subscribers.remove(listener);
    if (subscribers.size > 0) return;
    window.removeEventListener("online", publish);
    window.removeEventListener("offline", publish);
  };
}
