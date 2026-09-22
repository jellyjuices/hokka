import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

const WORKER_SRC = "/ocr/pdf.worker.min.mjs";
const STANDARD_FONTS = "/ocr/fonts/";
// pdf.js is served from public/ocr rather than bundled, so half a megabyte of
// reader never lands in a route chunk and the browser caches it beside the
// worker it already loads from there. The specifier is held in a variable so
// the bundler cannot follow it.
const PDFJS_SRC = "/ocr/pdf.min.mjs";

let pdfjsModule: Promise<typeof import("pdfjs-dist")> | null = null;

function loadPdfjs() {
  pdfjsModule ??= import(/* turbopackIgnore: true */ PDFJS_SRC) as Promise<
    typeof import("pdfjs-dist")
  >;
  return pdfjsModule;
}

export type PageRender = {
  canvas: HTMLCanvasElement;
  pointWidth: number;
  pointHeight: number;
};

export async function openPdf(bytes: Uint8Array) {
  const pdfjs = await loadPdfjs();
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;
  return pdfjs.getDocument({ data: bytes, standardFontDataUrl: STANDARD_FONTS });
}

export async function withPdf<T>(
  bytes: Uint8Array,
  read: (document: PDFDocumentProxy) => Promise<T>,
): Promise<T> {
  const task = await openPdf(bytes);
  const document = await task.promise;
  try {
    return await read(document);
  } finally {
    await task.destroy();
  }
}

export async function eachPage<T>(
  document: PDFDocumentProxy,
  limit: number,
  read: (page: PDFPageProxy, index: number) => Promise<T[]>,
) {
  const collected: T[] = [];
  const count = Math.min(document.numPages, limit);
  for (let number = 1; number <= count; number += 1) {
    const page = await document.getPage(number);
    collected.push(...(await read(page, number - 1)));
    page.cleanup();
  }
  return collected;
}

export async function pageTextLength(page: PDFPageProxy) {
  const content = await page.getTextContent();
  return content.items.reduce(
    (running, item) => ("str" in item ? running + item.str.trim().length : running),
    0,
  );
}

export async function renderPage(
  page: PDFPageProxy,
  renderWidth: number,
  maxScale: number,
  background: string | null,
): Promise<PageRender | null> {
  const unscaled = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: Math.min(maxScale, renderWidth / unscaled.width) });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const context = canvas.getContext("2d");
  if (context === null) return null;
  if (background !== null) {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  await page.render({ canvas, viewport }).promise;
  return { canvas, pointWidth: unscaled.width, pointHeight: unscaled.height };
}
