import { fromBase64Url, toBase64Url } from "@/src/lib/base64url";
import { readLocal, writeLocal } from "@/src/lib/storage/local";
import type { DeviceVerifier } from "./devicePassword.types";

const STORAGE_KEY = "hokka:device-password";
const ITERATIONS = 600_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;
const encoder = new TextEncoder();

function readVerifier(): DeviceVerifier | null {
  const raw = readLocal(STORAGE_KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DeviceVerifier>;
    if (typeof parsed.salt !== "string" || typeof parsed.hash !== "string") return null;
    if (typeof parsed.iterations !== "number") return null;
    return { salt: parsed.salt, iterations: parsed.iterations, hash: parsed.hash };
  } catch {
    return null;
  }
}

async function derive(password: string, salt: BufferSource, iterations: number) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    KEY_BITS,
  );
  return toBase64Url(bits);
}

export function hasDevicePassword() {
  return readVerifier() !== null;
}

// The server holds the password, so a device with no connection has nothing to ask.
// What it keeps instead is a slow-derived verifier, written on every unlock that the
// server did answer, so the password still opens the screen on a subway platform and
// biometrics are never the only way in. It opens the screen, never the gate: no
// session cookie is minted here, and the first API call to come back 401 re-locks.
export async function rememberDevicePassword(password: string) {
  const salt = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(salt);
  const hash = await derive(password, salt, ITERATIONS);
  writeLocal(
    STORAGE_KEY,
    JSON.stringify({ salt: toBase64Url(salt), iterations: ITERATIONS, hash }),
  );
}

export async function matchesDevicePassword(password: string) {
  const verifier = readVerifier();
  if (verifier === null) return false;
  const hash = await derive(password, fromBase64Url(verifier.salt), verifier.iterations);
  return hash === verifier.hash;
}
