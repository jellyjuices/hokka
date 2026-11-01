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

    // A redirect to R2 is cross-origin, so fetch() needs CORS on the bucket and
    // reading it into pdf.js fails without it. ?inline streams it same-origin.
    if (!new URL(request.url).searchParams.has("inline")) return Response.redirect(url, 302);

    const upstream = await fetch(url);
    if (!upstream.ok || !upstream.body) return jsonError("Document file unavailable", 502);
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
      },
    });
  });
}
