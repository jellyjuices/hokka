import { eachPage, pageTextLength, renderPage, withPdf } from "@/src/lib/pdfjs";
import { encodeCanvas, JPEG_TYPE } from "./canvas";
import type { CompressedFile } from "./compress.types";

export const PDF_TYPE = "application/pdf";
const PDF_SIGNATURE = "%PDF-";
const UNKNOWN_TYPES = ["", "application/octet-stream"];
const TEXT_LAYER_LENGTH = 40;
const MAX_RASTER_PAGES = 30;
const RENDER_WIDTH = 1400;
const MAX_RENDER_SCALE = 2;
const PAGE_QUALITY = 0.62;
const PAGE_BACKGROUND = "#ffffff";

async function looksLikePdf(file: File) {
  if (file.type === PDF_TYPE) return true;
  if (!UNKNOWN_TYPES.includes(file.type)) return false;
  return (await file.slice(0, PDF_SIGNATURE.length).text()) === PDF_SIGNATURE;
}

async function restructure(bytes: Uint8Array) {
  const { PDFDocument } = await import("pdf-lib");
  const document = await PDFDocument.load(bytes, { updateMetadata: false });
  return document.save({ useObjectStreams: true });
}

async function hasTextLayer(bytes: Uint8Array) {
  const lengths = await withPdf(bytes, (document) =>
    eachPage(document, MAX_RASTER_PAGES, async (page) => [await pageTextLength(page)]),
  );
  return lengths.reduce((running, length) => running + length, 0) >= TEXT_LAYER_LENGTH;
}

async function rasterise(bytes: Uint8Array) {
  const { PDFDocument } = await import("pdf-lib");
  const rebuilt = await PDFDocument.create();

  const drawn = await withPdf(bytes, (document) => {
    if (document.numPages > MAX_RASTER_PAGES) return Promise.resolve([]);
    return eachPage(document, MAX_RASTER_PAGES, async (page) => {
      const rendered = await renderPage(page, RENDER_WIDTH, MAX_RENDER_SCALE, PAGE_BACKGROUND);
      if (rendered === null) return [];
      const encoded = await encodeCanvas(rendered.canvas, JPEG_TYPE, PAGE_QUALITY);
      if (encoded === null) return [];
      const image = await rebuilt.embedJpg(await encoded.arrayBuffer());
      const sheet = rebuilt.addPage([rendered.pointWidth, rendered.pointHeight]);
      sheet.drawImage(image, {
        x: 0,
        y: 0,
        width: rendered.pointWidth,
        height: rendered.pointHeight,
      });
      return [true];
    });
  });

  if (drawn.length === 0) return null;
  return rebuilt.save({ useObjectStreams: true });
}

async function isScan(bytes: Uint8Array) {
  try {
    return !(await hasTextLayer(bytes));
  } catch {
    return false;
  }
}

async function attempt(work: () => Promise<Uint8Array | null>) {
  try {
    return await work();
  } catch {
    return null;
  }
}

function smallest(candidates: (Uint8Array | null)[]) {
  return candidates.reduce<Uint8Array | null>(
    (best, bytes) =>
      bytes !== null && (best === null || bytes.length < best.length) ? bytes : best,
    null,
  );
}

function pdfBlob(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  return new Blob([copy], { type: PDF_TYPE });
}

export async function compressPdf(file: File): Promise<CompressedFile | null> {
  if (!(await looksLikePdf(file))) return null;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const restructured = await attempt(() => restructure(bytes.slice()));
  const rasterised = (await isScan(bytes.slice()))
    ? await attempt(() => rasterise(bytes.slice()))
    : null;

  const best = smallest([restructured, rasterised]);
  if (best === null || best.length >= file.size) return null;

  return {
    blob: pdfBlob(best),
    fileName: file.name,
    contentType: PDF_TYPE,
    originalSize: file.size,
  };
}
