export function readSession(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function clearSession(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    return;
  }
}
