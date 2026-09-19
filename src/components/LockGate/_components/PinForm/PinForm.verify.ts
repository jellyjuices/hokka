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
