const DB_NAME = "hokka";
const STORE_NAME = "keyval";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function isIdbAvailable() {
  return typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const request = run(transaction.objectStore(STORE_NAME));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

export function idbGet<T>(key: string): Promise<T | null> {
  return runTransaction<T | undefined>("readonly", (store) => store.get(key)).then(
    (value) => value ?? null,
  );
}

export function idbSet(key: string, value: unknown): Promise<void> {
  return runTransaction("readwrite", (store) => store.put(value, key)).then(() => undefined);
}

export function idbDelete(key: string): Promise<void> {
  return runTransaction("readwrite", (store) => store.delete(key)).then(() => undefined);
}

export function idbKeys(): Promise<string[]> {
  return runTransaction<IDBValidKey[]>("readonly", (store) => store.getAllKeys()).then(
    (keys) => keys as string[],
  );
}
