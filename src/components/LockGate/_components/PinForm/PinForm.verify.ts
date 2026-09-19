import { isOnline } from "@/src/lib/platform/connectivity";

export async function verifyPassword(password: string): Promise<string | null> {
  try {
    const response = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) return null;
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? "That password is not right";
  } catch {
    return "Could not reach the server";
  }
}

// Offline, there is nothing to ask: a biometric check is the whole of what this
// device can verify, and refusing it would strand a ledger that reads locally.
export async function hasLiveSession(): Promise<boolean> {
  if (!isOnline()) return true;
  try {
    const response = await fetch("/api/unlock", { cache: "no-store" });
    if (!response.ok) return false;
    const body = (await response.json()) as { unlocked?: unknown };
    return body.unlocked === true;
  } catch {
    return true;
  }
}
