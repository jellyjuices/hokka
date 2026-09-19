import { recognizeImage } from "./engine";
import { linesFromWords } from "./layout";
import type { OcrPage } from "./ocr.types";
import { toOcrPage } from "./page";
import { PDF_TEXT_CONFIDENCE, readPdf } from "./pdf";

const PDF_TYPE = "application/pdf";
const PDF_SIGNATURE = "%PDF-";
const UNKNOWN_TYPES = ["", "application/octet-stream"];

async function looksLikePdf(blob: Blob) {
  if (blob.type === PDF_TYPE) return true;
  if (!UNKNOWN_TYPES.includes(blob.type)) return false;
  return (await blob.slice(0, PDF_SIGNATURE.length).text()) === PDF_SIGNATURE;
}

function average(values: number[]) {
  return values.reduce((running, value) => running + value, 0) / Math.max(1, values.length);
}

function mergePages(pages: OcrPage[]) {
  return toOcrPage(
    pages.flatMap((page) => page.lines),
    average(pages.map((page) => page.confidence)),
  );
}

async function recognizePdf(blob: Blob): Promise<OcrPage | null> {
  const reading = await readPdf(blob);
  if (reading.words.length > 0) {
    return toOcrPage(linesFromWords(reading.words), PDF_TEXT_CONFIDENCE);
  }
  const pages: OcrPage[] = [];
  for (const canvas of reading.pages) {
    pages.push(await recognizeImage(canvas));
  }
  return pages.length === 0 ? null : mergePages(pages);
}

export async function recognizeDocument(blob: Blob): Promise<OcrPage | null> {
  if (await looksLikePdf(blob)) return recognizePdf(blob);
  if (blob.type.startsWith("image/")) return recognizeImage(blob);
  return null;
}
