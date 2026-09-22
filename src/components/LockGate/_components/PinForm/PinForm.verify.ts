import {
  hasDevicePassword,
  matchesDevicePassword,
  rememberDevicePassword,
} from "@/src/lib/devicePassword";
import { isOnline } from "@/src/lib/platform/connectivity";

async function verifyOnDevice(password: string): Promise<string | null> {
  if (!hasDevicePassword()) {
    return isOnline()
      ? "Could not reach the server"
      : "Unlock online once before this device can unlock offline";
  }
  if (await matchesDevicePassword(password)) return null;
  return "That password is not right";
}

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

export function warmUnlock() {
  if (!isOnline()) return;
  void fetch("/api/unlock", { cache: "no-store" }).catch(() => undefined);
}
