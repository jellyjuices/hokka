// Both browser signals the app watches — connectivity and the unlock flag — are read
// with useSyncExternalStore, which wants one subscriber set and one way to publish.
export function createSubscribers() {
  const listeners = new Set<() => void>();

  return {
    get size() {
      return listeners.size;
    },
    add(listener: () => void) {
      listeners.add(listener);
    },
    remove(listener: () => void) {
      listeners.delete(listener);
    },
    publish() {
      for (const listener of listeners) listener();
    },
  };
}
