import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";

const CURSOR_KEY = "hokka.sync.cursor.v1";

export function readCursor() {
  return readLocal(CURSOR_KEY);
}

export function writeCursor(value: string) {
  writeLocal(CURSOR_KEY, value);
}

export function clearCursor() {
  clearLocal(CURSOR_KEY);
}
