import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";

// The transactions rename (notes to title, counterparty to vendor) does not touch
// updated_at, so a v1 cursor would never re-pull the renamed rows into the mirror.
const CURSOR_KEY = "hokka.sync.cursor.v2";

export function readCursor() {
  return readLocal(CURSOR_KEY);
}

export function writeCursor(value: string) {
  writeLocal(CURSOR_KEY, value);
}

export function clearCursor() {
  clearLocal(CURSOR_KEY);
}
