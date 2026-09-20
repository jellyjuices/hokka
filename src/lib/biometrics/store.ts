import { createSubscribers } from "@/src/lib/platform/subscribers";
import { clearLocal, readLocal, writeLocal } from "@/src/lib/storage/local";

const STORAGE_KEY = "hokka:biometric-credential";

const subscribers = createSubscribers();

export function readCredentialId() {
  return readLocal(STORAGE_KEY);
}

export function saveCredentialId(credentialId: string) {
  writeLocal(STORAGE_KEY, credentialId);
  subscribers.publish();
}

export function forgetCredentialId() {
  clearLocal(STORAGE_KEY);
  subscribers.publish();
}

export function getBiometricsSnapshot() {
  return readCredentialId() !== null;
}

export function getBiometricsServerSnapshot() {
  return false;
}

export function subscribeBiometrics(listener: () => void) {
  subscribers.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    subscribers.remove(listener);
    window.removeEventListener("storage", listener);
  };
}
