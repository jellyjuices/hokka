const MAX_EDGE = 2200;
const MIN_EDGE = 1000;
const MAX_UPSCALE = 2;
const HISTOGRAM_BUCKETS = 256;
const CLIP_SHARE = 0.02;

function scaleFor(width: number, height: number) {
  const longest = Math.max(width, height);
  if (longest > MAX_EDGE) return MAX_EDGE / longest;
  if (longest < MIN_EDGE) return Math.min(MAX_UPSCALE, MIN_EDGE / longest);
  return 1;
}

function percentileBounds(histogram: number[], pixelCount: number) {
  const clip = pixelCount * CLIP_SHARE;
  let low = 0;
  let high = HISTOGRAM_BUCKETS - 1;
  let running = 0;
  for (let level = 0; level < HISTOGRAM_BUCKETS; level += 1) {
    running += histogram[level] ?? 0;
    if (running >= clip) {
      low = level;
      break;
    }
  }
  running = 0;
  for (let level = HISTOGRAM_BUCKETS - 1; level >= 0; level -= 1) {
    running += histogram[level] ?? 0;
    if (running >= clip) {
      high = level;
      break;
    }
  }
  return high - low < 16 ? { low: 0, high: HISTOGRAM_BUCKETS - 1 } : { low, high };
}

function stretchContrast(context: CanvasRenderingContext2D, width: number, height: number) {
  const image = context.getImageData(0, 0, width, height);
  const pixels = image.data;
  const histogram = new Array<number>(HISTOGRAM_BUCKETS).fill(0);
  const levels = new Uint8ClampedArray(pixels.length / 4);

  for (let index = 0; index < levels.length; index += 1) {
    const offset = index * 4;
    const level = Math.round(
      0.299 * (pixels[offset] ?? 0) +
        0.587 * (pixels[offset + 1] ?? 0) +
        0.114 * (pixels[offset + 2] ?? 0),
    );
    levels[index] = level;
    histogram[level] = (histogram[level] ?? 0) + 1;
  }

  const { low, high } = percentileBounds(histogram, levels.length);
  const span = high - low;
  for (let index = 0; index < levels.length; index += 1) {
    const offset = index * 4;
    const stretched = Math.max(0, Math.min(255, (((levels[index] ?? 0) - low) * 255) / span));
    pixels[offset] = stretched;
    pixels[offset + 1] = stretched;
    pixels[offset + 2] = stretched;
  }
  context.putImageData(image, 0, 0);
}

export async function prepareImage(blob: Blob): Promise<Blob | HTMLCanvasElement> {
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") return blob;
  try {
    const bitmap = await createImageBitmap(blob);
    const scale = scaleFor(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context === null) {
      bitmap.close();
      return blob;
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    stretchContrast(context, canvas.width, canvas.height);
    return canvas;
  } catch {
    return blob;
  }
}
