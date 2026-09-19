const CURSOR_KEY = "hokka.sync.cursor.v1";

export function readCursor(): string | null {
  try {
    return localStorage.getItem(CURSOR_KEY);
  } catch {
    return null;
  }
}

export function writeCursor(value: string) {
  try {
    localStorage.setItem(CURSOR_KEY, value);
  } catch {
    return;
  }
}

export function clearCursor() {
  try {
    localStorage.removeItem(CURSOR_KEY);
  } catch {
    return;
  }
}
