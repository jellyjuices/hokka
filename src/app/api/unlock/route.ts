import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  createSessionCookie,
  isSessionConfigured,
  isValidSessionToken,
} from "@/src/lib/session";
import {
  clearFailures,
  clientKey,
  recordFailure,
  retryAfterSeconds,
} from "@/src/lib/loginAttempts";
import { handleRoute, jsonError, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.PASSWORD ?? "";

function isMatch(candidate: string) {
  const expected = Buffer.from(PASSWORD);
  const given = Buffer.from(candidate);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(given, expected);
}

export async function GET() {
  return handleRoute(async () => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    return jsonResponse({ unlocked: await isValidSessionToken(token) });
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    if (!isSessionConfigured()) {
      return jsonError("The app password is not configured: set PASSWORD and SESSION_SECRET", 503);
    }

    const key = clientKey(request);
    const retryAfter = retryAfterSeconds(key);
    if (retryAfter > 0) {
      const response = jsonError("Too many attempts. Try again later", 429);
      response.headers.set("Retry-After", String(retryAfter));
      return response;
    }

    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password !== "string" || !isMatch(body.password)) {
      recordFailure(key);
      return jsonError("That password is not right", 401);
    }

    clearFailures(key);
    const response = jsonResponse({ unlocked: true });
    response.headers.append("Set-Cookie", await createSessionCookie());
    return response;
  });
}
