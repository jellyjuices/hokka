import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/src/lib/session";

const OPEN_PATHS = new Set(["/api/unlock", "/api/health"]);

export const config = { matcher: "/api/:path*" };

export async function middleware(request: NextRequest) {
  if (OPEN_PATHS.has(request.nextUrl.pathname)) return NextResponse.next();
  if (await isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }
  return NextResponse.json(
    { error: "This ledger is locked" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}
