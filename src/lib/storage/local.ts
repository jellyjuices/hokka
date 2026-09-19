// localStorage throws in a private window and when the quota is full, so nothing in the
// app touches it directly. A read that cannot happen is "nothing stored", and a write
// that cannot happen is dropped — neither is worth failing a render over.
export function readLocal(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function clearLocal(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
}
