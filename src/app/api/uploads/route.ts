import { handleRoute, jsonError, jsonResponse } from "@/src/lib/http";
import { isR2Configured, presignR2Url } from "@/src/lib/r2";

export const dynamic = "force-dynamic";

const UPLOAD_EXPIRY_SECONDS = 900;

export async function POST(request: Request) {
  return handleRoute(async () => {
    if (!isR2Configured()) return jsonError("R2 is not configured", 501);

    const { fileKey } = (await request.json()) as { fileKey: string; contentType: string };
    if (!fileKey) return jsonError("fileKey is required", 400);

    const uploadUrl = await presignR2Url({
      method: "PUT",
      key: fileKey,
      expiresIn: UPLOAD_EXPIRY_SECONDS,
    });

    return jsonResponse({ fileKey, uploadUrl, expiresIn: UPLOAD_EXPIRY_SECONDS });
  });
}
