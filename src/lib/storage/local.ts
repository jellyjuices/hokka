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
