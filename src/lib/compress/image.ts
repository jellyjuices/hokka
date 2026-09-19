import { canRasterise, drawBitmap, encodeCanvas, supportsWebp, WEBP_TYPE } from "./canvas";
import type { CompressedFile } from "./compress.types";

const VECTOR_AND_ANIMATED = ["image/gif", "image/svg+xml", "image/apng", "image/avif"];
const MAX_EDGE = 2000;
const MIN_EDGE = 900;
const TARGET_BYTES = 320 * 1024;
const MAX_QUALITY = 0.82;
const MIN_QUALITY = 0.4;
const QUALITY_STEPS = 5;
const SHRINK_FACTOR = 0.72;
const SHRINK_ATTEMPTS = 3;

function startingScale(width: number, height: number) {
  const longest = Math.max(width, height);
  return longest > MAX_EDGE ? MAX_EDGE / longest : 1;
}

function webpName(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  const stem = dot <= 0 ? fileName : fileName.slice(0, dot);
  return `${stem}.webp`;
}

async function smallestUnderBudget(canvas: HTMLCanvasElement) {
  let floor = await encodeCanvas(canvas, WEBP_TYPE, MIN_QUALITY);
  if (floor === null || floor.size > TARGET_BYTES) return floor;

  let low = MIN_QUALITY;
  let high = MAX_QUALITY;
  for (let step = 0; step < QUALITY_STEPS; step += 1) {
    const quality = (low + high) / 2;
    const candidate = await encodeCanvas(canvas, WEBP_TYPE, quality);
    if (candidate === null) break;
    if (candidate.size <= TARGET_BYTES) {
      floor = candidate;
      low = quality;
    } else {
      high = quality;
    }
  }
  return floor;
}

async function encodeWithinBudget(bitmap: ImageBitmap) {
  let scale = startingScale(bitmap.width, bitmap.height);
  let smallest: Blob | null = null;

  for (let attempt = 0; attempt < SHRINK_ATTEMPTS; attempt += 1) {
    const canvas = drawBitmap(bitmap, scale);
    if (canvas === null) return smallest;
    const encoded = await smallestUnderBudget(canvas);
    if (encoded === null) return smallest;
    smallest = encoded;
    if (encoded.size <= TARGET_BYTES) return smallest;
    if (Math.max(canvas.width, canvas.height) <= MIN_EDGE) return smallest;
    scale *= SHRINK_FACTOR;
  }
  return smallest;
}

export async function compressImage(file: File): Promise<CompressedFile | null> {
  if (!file.type.startsWith("image/")) return null;
  if (VECTOR_AND_ANIMATED.includes(file.type)) return null;
  if (!canRasterise() || !(await supportsWebp())) return null;

  const bitmap = await createImageBitmap(file);
  try {
    const encoded = await encodeWithinBudget(bitmap);
    if (encoded === null || encoded.size >= file.size) return null;
    return {
      blob: encoded,
      fileName: webpName(file.name),
      contentType: WEBP_TYPE,
      originalSize: file.size,
    };
  } finally {
    bitmap.close();
  }
}
