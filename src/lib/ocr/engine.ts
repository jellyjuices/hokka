import type { Page, Worker } from "tesseract.js";
import { linesFromWords, type OcrWord } from "./layout";
import type { OcrPage } from "./ocr.types";
import { pageFromText, toOcrPage } from "./page";
import { prepareImage } from "./preprocess";
import { PDF_TEXT_CONFIDENCE, readPdf } from "./pdf";

const OCR_LANGUAGE = "eng";
const WORKER_PATH = "/ocr/worker.min.js";
const CORE_PATH = "/ocr/core";
const LANG_PATH = "/ocr/lang";
const IDLE_TIMEOUT = 45_000;

let workerPromise: Promise<Worker> | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

async function startWorker() {
  const tesseract = await import("tesseract.js");
  const worker = await tesseract.createWorker(OCR_LANGUAGE, tesseract.OEM.LSTM_ONLY, {
    workerPath: WORKER_PATH,
    corePath: CORE_PATH,
    langPath: LANG_PATH,
  });
  await worker.setParameters({
    tessedit_pageseg_mode: tesseract.PSM.SINGLE_BLOCK,
    preserve_interword_spaces: "1",
  });
  return worker;
}

function getWorker() {
  if (workerPromise === null) {
    workerPromise = startWorker().catch((cause) => {
      workerPromise = null;
      throw cause;
    });
  }
  return workerPromise;
}

async function releaseWorker() {
  const running = workerPromise;
  workerPromise = null;
  if (running === null) return;
  const worker = await running.catch(() => null);
  await worker?.terminate();
}

function scheduleRelease() {
  if (idleTimer !== null) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    idleTimer = null;
    void releaseWorker();
  }, IDLE_TIMEOUT);
}

function wordsOf(page: Page): OcrWord[] {
  return (page.blocks ?? []).flatMap((block) =>
    block.paragraphs.flatMap((paragraph) =>
      paragraph.lines.flatMap((line) =>
        line.words.map((word) => ({
          text: word.text,
          confidence: word.confidence,
          left: word.bbox.x0,
          right: word.bbox.x1,
          top: word.bbox.y0,
          bottom: word.bbox.y1,
        })),
      ),
    ),
  );
}

export async function recognizeImage(source: Blob | HTMLCanvasElement): Promise<OcrPage> {
  const worker = await getWorker();
  if (idleTimer !== null) clearTimeout(idleTimer);
  try {
    const image = source instanceof Blob ? await prepareImage(source) : source;
    const { data } = await worker.recognize(image, {}, { text: true, blocks: true });
    const lines = linesFromWords(wordsOf(data));
    return lines.length > 0
      ? toOcrPage(lines, data.confidence)
      : pageFromText(data.text, data.confidence);
  } finally {
    scheduleRelease();
  }
}

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
