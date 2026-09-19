import type { TaxPeriod } from "@/src/data/domain.types";
import { savePeriod } from "@/src/data/server/ledger";
import { handleRoute, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const period = (await request.json()) as TaxPeriod;
    return jsonResponse(await savePeriod(period));
  });
}
