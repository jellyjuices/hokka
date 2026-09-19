import type { CompressedFile } from "./compress.types";
import { compressImage } from "./image";
import { compressPdf } from "./pdf";

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

function unchanged(file: File): CompressedFile {
  return {
    blob: file,
    fileName: file.name,
    contentType: file.type === "" ? DEFAULT_CONTENT_TYPE : file.type,
    originalSize: file.size,
  };
}

export async function compressForUpload(file: File): Promise<CompressedFile> {
  try {
    const compressed = (await compressImage(file)) ?? (await compressPdf(file));
    return compressed ?? unchanged(file);
  } catch {
    return unchanged(file);
  }
}

export { compressImage } from "./image";
export { compressPdf } from "./pdf";
export type { CompressedFile } from "./compress.types";
