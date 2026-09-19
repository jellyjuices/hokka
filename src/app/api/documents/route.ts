import type { StoredDocument } from "@/src/data/domain.types";
import { saveDocument } from "@/src/data/server/ledger";
import { handleRoute, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const document = (await request.json()) as StoredDocument;
    return jsonResponse(await saveDocument(document));
  });
}
