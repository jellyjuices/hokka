export const WEBP_TYPE = "image/webp";
export const JPEG_TYPE = "image/jpeg";

let webpSupport: Promise<boolean> | null = null;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function encodeCanvas(canvas: HTMLCanvasElement, type: string, quality: number) {
  const blob = await toBlob(canvas, type, quality);
  return blob !== null && blob.type === type ? blob : null;
}

async function probeWebp() {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return (await encodeCanvas(canvas, WEBP_TYPE, 1)) !== null;
}

export function supportsWebp() {
  if (webpSupport === null) webpSupport = probeWebp().catch(() => false);
  return webpSupport;
}

export function canRasterise() {
  return typeof document !== "undefined" && typeof createImageBitmap === "function";
}

export function drawBitmap(bitmap: ImageBitmap, scale: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (context === null) return null;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}
