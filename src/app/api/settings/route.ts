import type { TaxSettings } from "@/src/data/domain.types";
import { getSettings, saveSettings } from "@/src/data/server/ledger";
import { handleRoute, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => jsonResponse(await getSettings()));
}

export async function PUT(request: Request) {
  return handleRoute(async () => {
    const settings = (await request.json()) as TaxSettings;
    return jsonResponse(await saveSettings(settings));
  });
}
