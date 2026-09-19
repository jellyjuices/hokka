import { pingDatabase } from "@/src/data/server/tables";
import { handleRoute, jsonResponse } from "@/src/lib/api/respond";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    await pingDatabase();
    return jsonResponse({ status: "ok", checkedAt: new Date().toISOString() });
  });
}
