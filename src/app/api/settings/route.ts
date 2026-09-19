import { getSettings } from "@/src/data/server/ledger";
import { upsertRoute } from "@/src/data/server/routes";
import { handleRoute, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => jsonResponse(await getSettings()));
}

export const PUT = upsertRoute("settings");
