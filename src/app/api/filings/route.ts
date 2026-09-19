import type { Filing } from "@/src/data/domain.types";
import { saveFiling } from "@/src/data/server/ledger";
import { handleRoute, jsonResponse } from "@/src/lib/api/respond";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const filing = (await request.json()) as Filing;
    return jsonResponse(await saveFiling(filing));
  });
}
