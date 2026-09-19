import { getDocument } from "@/src/data/server/ledger";
import { handleRoute, jsonError } from "@/src/lib/http";
import { isR2Configured, presignR2Url } from "@/src/lib/r2";

export const dynamic = "force-dynamic";

const DOWNLOAD_EXPIRY_SECONDS = 300;

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    if (!isR2Configured()) return jsonError("R2 is not configured", 501);

    const { id } = await context.params;
    const document = await getDocument(id);
    if (!document) return jsonError("Document not found", 404);

    const url = await presignR2Url({
      method: "GET",
      key: document.fileKey,
      expiresIn: DOWNLOAD_EXPIRY_SECONDS,
    });

    return Response.redirect(url, 302);
  });
}
