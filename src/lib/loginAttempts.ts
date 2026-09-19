// An unlimited guess rate turns one password into an online brute force, so failures
// are counted per client and the door closes for a while once they pile up. The store
// is in-process: there is one user and one small instance, and a counter that resets
// on redeploy still costs an attacker far more than no counter at all.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const failures = new Map<string, { count: number; firstAt: number }>();

// Only production counts, so a mistyped password while developing never locks the
// app. The switch is the build mode rather than the client address, because
// x-forwarded-for is set by the caller: trusting a loopback value in it would let
// anyone claim to be localhost and skip the limit entirely.
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
