import { NextResponse } from "next/server";

export function POST(request: Request) {
  return NextResponse.redirect(new URL("/transaction/new", request.url), 303);
}
