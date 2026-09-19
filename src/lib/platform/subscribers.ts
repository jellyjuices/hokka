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
