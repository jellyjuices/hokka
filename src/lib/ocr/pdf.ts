import type { PDFPageProxy } from "pdfjs-dist";
import { eachPage, renderPage, withPdf } from "@/src/lib/pdfjs";
import type { OcrWord } from "./layout";

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

async function canvasForPage(page: PDFPageProxy) {
  const rendered = await renderPage(page, RENDER_WIDTH, MAX_RENDER_SCALE, PAGE_BACKGROUND);
  return rendered === null ? [] : [rendered.canvas];
}

function textLength(words: OcrWord[]) {
  return words.reduce((running, word) => running + word.text.length, 0);
}

export async function readPdf(blob: Blob): Promise<PdfReading> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return withPdf(bytes, async (document) => {
    let offset = 0;
    const words = await eachPage(document, MAX_PAGES, async (page) => {
      const height = page.getViewport({ scale: 1 }).height;
      const found = await wordsOnPage(page, height, offset);
      offset += height + PAGE_GAP;
      return found;
    });
    if (textLength(words) >= MIN_TEXT_LENGTH) return { words, pages: [] };
    return { words: [], pages: await eachPage(document, MAX_PAGES, canvasForPage) };
  });
}
