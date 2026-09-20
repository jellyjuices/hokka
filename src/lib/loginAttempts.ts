const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const failures = new Map<string, { count: number; firstAt: number }>();

function isEnforced() {
  return process.env.NODE_ENV === "production";
}

function prune(now: number) {
  for (const [key, entry] of failures) {
    if (now - entry.firstAt >= WINDOW_MS) failures.delete(key);
  }
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim() ?? "";
  return first || request.headers.get("x-real-ip") || "unknown";
}

export function retryAfterSeconds(key: string) {
  if (!isEnforced()) return 0;
  const now = Date.now();
  prune(now);
  const entry = failures.get(key);
  if (!entry || entry.count < MAX_FAILURES) return 0;
  return Math.ceil((entry.firstAt + WINDOW_MS - now) / 1000);
}

export function recordFailure(key: string) {
  if (!isEnforced()) return;
  const now = Date.now();
  prune(now);
  const entry = failures.get(key);
  failures.set(key, entry ? { ...entry, count: entry.count + 1 } : { count: 1, firstAt: now });
}

export function clearFailures(key: string) {
  failures.delete(key);
}
