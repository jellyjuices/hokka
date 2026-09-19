import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isDevUnlocked } from "@/src/lib/devUnlock";
import { SESSION_COOKIE, isValidSessionToken } from "@/src/lib/session";

const OPEN_PATHS = new Set(["/api/unlock", "/api/health"]);

// The open paths are kept out of the matcher, not just waved through inside it: an
// early return still costs the invocation, and the unlock request is the one nobody
// is waiting on twice. OPEN_PATHS stays as the second lock on the same door.
export const config = { matcher: "/api/((?!unlock$|health$).*)" };

export async function middleware(request: NextRequest) {
  if (OPEN_PATHS.has(request.nextUrl.pathname)) return NextResponse.next();
  if (isDevUnlocked()) return NextResponse.next();
  if (await isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }
  return NextResponse.json(
    { error: "This ledger is locked" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}
