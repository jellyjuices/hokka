import { clearLocal, readLocal, writeLocal } from "./local";
import { idbDelete, idbGet, idbKeys, idbSet, isIdbAvailable } from "./idb";

const FALLBACK_PREFIX = "hokka:";

function fallbackKey(key: string) {
  return `${FALLBACK_PREFIX}${key}`;
}

function readFallback<T>(key: string): T | null {
  const raw = readLocal(fallbackKey(key));
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeFallback(key: string, value: unknown) {
  try {
    writeLocal(fallbackKey(key), JSON.stringify(value));
  } catch {
    return;
  }
}

export async function readValue<T>(key: string): Promise<T | null> {
  if (isIdbAvailable()) {
    try {
      return await idbGet<T>(key);
    } catch {
      return readFallback<T>(key);
    }
  }
  return readFallback<T>(key);
}

export async function writeValue(key: string, value: unknown): Promise<void> {
  if (isIdbAvailable()) {
    try {
      await idbSet(key, value);
      return;
    } catch {
      writeFallback(key, value);
      return;
    }
  }
  writeFallback(key, value);
}

export async function deleteValue(key: string): Promise<void> {
  if (isIdbAvailable()) {
    try {
      await idbDelete(key);
    } catch {
      return;
    }
  }
  clearLocal(fallbackKey(key));
}

export async function listKeys(prefix: string): Promise<string[]> {
  if (!isIdbAvailable()) return [];
  try {
    const keys = await idbKeys();
    return keys.filter((key) => key.startsWith(prefix));
  } catch {
    return [];
  }
}
