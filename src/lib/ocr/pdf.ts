import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import type { OcrWord } from "./layout";

const WORKER_SRC = "/ocr/pdf.worker.min.mjs";
const STANDARD_FONTS = "/ocr/fonts/";
const MAX_PAGES = 3;
const PAGE_GAP = 40;
const RENDER_WIDTH = 1600;
const MAX_RENDER_SCALE = 3;
const MIN_TEXT_LENGTH = 40;
export const PDF_TEXT_CONFIDENCE = 96;
const PAGE_BACKGROUND = "#ffffff";

export type PdfReading = {
  words: OcrWord[];
  pages: HTMLCanvasElement[];
};

async function openPdf(blob: Blob) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;
  return pdfjs.getDocument({
    data: new Uint8Array(await blob.arrayBuffer()),
    standardFontDataUrl: STANDARD_FONTS,
  });
}

async function wordsOnPage(page: PDFPageProxy, pageHeight: number, offset: number) {
  const content = await page.getTextContent();
  return content.items.flatMap<OcrWord>((item) => {
    if (!("str" in item) || item.str.trim() === "") return [];
    const left = Number(item.transform[4]);
    const baseline = Number(item.transform[5]);
    const height = item.height > 0 ? item.height : Math.abs(Number(item.transform[3]));
    const top = pageHeight - baseline - height + offset;
    return [
      {
        text: item.str.trim(),
        confidence: PDF_TEXT_CONFIDENCE,
        left,
        right: left + item.width,
        top,
        bottom: top + height,
      },
    ];
  });
}

async function renderPage(page: PDFPageProxy) {
  const unscaled = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({
    scale: Math.min(MAX_RENDER_SCALE, RENDER_WIDTH / unscaled.width),
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const context = canvas.getContext("2d");
  if (context === null) return [];
  context.fillStyle = PAGE_BACKGROUND;
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvas, viewport }).promise;
  return [canvas];
}

function textLength(words: OcrWord[]) {
  return words.reduce((running, word) => running + word.text.length, 0);
}

async function readEachPage<T>(
  document: PDFDocumentProxy,
  read: (page: PDFPageProxy, index: number) => Promise<T[]>,
) {
  const collected: T[] = [];
  const count = Math.min(document.numPages, MAX_PAGES);
  for (let number = 1; number <= count; number += 1) {
    const page = await document.getPage(number);
    collected.push(...(await read(page, number - 1)));
    page.cleanup();
  }
  return collected;
}

export async function readPdf(blob: Blob): Promise<PdfReading> {
  const task = await openPdf(blob);
  const document = await task.promise;
  try {
    let offset = 0;
    const words = await readEachPage(document, async (page) => {
      const height = page.getViewport({ scale: 1 }).height;
      const found = await wordsOnPage(page, height, offset);
      offset += height + PAGE_GAP;
      return found;
    });
    if (textLength(words) >= MIN_TEXT_LENGTH) return { words, pages: [] };
    return { words: [], pages: await readEachPage(document, renderPage) };
  } finally {
    await task.destroy();
  }
}
