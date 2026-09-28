import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";

// A migration that rewrites rows in place (the notes and counterparty renames, the move to
// T2125 category ids) does not touch updated_at, so an older cursor would never re-pull them.
const CURSOR_KEY = "hokka.sync.cursor.v3";

export function readCursor() {
  return readLocal(CURSOR_KEY);
}

export function writeCursor(value: string) {
  writeLocal(CURSOR_KEY, value);
}

export function clearCursor() {
  clearLocal(CURSOR_KEY);
}
