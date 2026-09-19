import { pullSince } from "@/src/data/server/ledger";
import { handleRoute, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const since = new URL(request.url).searchParams.get("since");
    return jsonResponse(await pullSince(since === "" ? null : since));
  });
}
