import {
  hasDevicePassword,
  matchesDevicePassword,
  rememberDevicePassword,
} from "@/src/lib/devicePassword";
import { isOnline } from "@/src/lib/platform/connectivity";

const SESSION_ASK_LIMIT = 6 * 1000;

async function verifyOnDevice(password: string): Promise<string | null> {
  if (!hasDevicePassword()) {
    return isOnline()
      ? "Could not reach the server"
      : "Unlock online once before this device can unlock offline";
  }
  if (await matchesDevicePassword(password)) return null;
  return "That password is not right";
}

// The server owns the password, so it answers whenever it can be reached. When it
// cannot, the verifier this device kept from its last real unlock answers instead,
// which keeps the password working when biometrics do not.
export async function verifyPassword(password: string): Promise<string | null> {
  if (!isOnline()) return verifyOnDevice(password);
  try {
    const response = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      void rememberDevicePassword(password);
      return null;
    }
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? "That password is not right";
  } catch {
    return verifyOnDevice(password);
  }
}

// Hosting puts an idle instance to sleep, and the first request after that pays for
// waking it. Spending that wait while the password is still being typed is the
// difference between a gate that opens and a gate that thinks about it.
export function warmUnlock() {
  if (!isOnline()) return;
  void fetch("/api/unlock", { cache: "no-store" }).catch(() => undefined);
}

// Offline, there is nothing to ask: a biometric check is the whole of what this
// device can verify, and refusing it would strand a ledger that reads locally. A
// sleeping instance is the same answer arriving late, so the ask is capped rather
// than waited on, which otherwise held the screen open after a fingerprint landed.
export async function hasLiveSession(): Promise<boolean> {
  if (!isOnline()) return true;
  try {
    const response = await fetch("/api/unlock", {
      cache: "no-store",
      signal: AbortSignal.timeout(SESSION_ASK_LIMIT),
    });
    if (!response.ok) return false;
    const body = (await response.json()) as { unlocked?: unknown };
    return body.unlocked === true;
  } catch {
    return true;
  }
}
