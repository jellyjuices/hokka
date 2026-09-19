import { timingSafeEqual } from "node:crypto";
import { createSessionCookie } from "@/src/lib/session";
import { handleRoute, jsonError, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.PASSWORD ?? "";

function isMatch(candidate: string) {
  const expected = Buffer.from(PASSWORD);
  const given = Buffer.from(candidate);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    if (PASSWORD === "") {
      return jsonError("The app password is not configured: set PASSWORD", 503);
    }
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password !== "string" || !isMatch(body.password)) {
      return jsonError("That password is not right", 401);
    }
    const response = jsonResponse({ unlocked: true });
    response.headers.append("Set-Cookie", await createSessionCookie());
    return response;
  });
}
