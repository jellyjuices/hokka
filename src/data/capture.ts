import { compressForUpload } from "@/src/lib/compress";
import { newId } from "@/src/lib/platform/id";
import type { ParsedReceipt, ReceiptReading } from "@/src/lib/ocr";
import type { DocumentKind, OcrStatus, StoredDocument } from "./domain.types";
import { savePendingFile } from "./local";
import { documentFileUrl } from "./remote";
import { repository } from "./repository";

const PARSED_CONFIDENCE = 0.6;

function fileExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot <= 0) return "";
  return fileName.slice(dot).toLowerCase();
}

export function buildFileKey(documentId: string, fileName: string) {
  return `documents/${documentId}${fileExtension(fileName)}`;
}

function statusFor(reading: ReceiptReading | null): OcrStatus {
  if (reading === null) return "pending";
  const receipt = reading.receipt;
  return receipt !== null && receipt.confidence >= PARSED_CONFIDENCE ? "parsed" : "needs_review";
}

export async function captureDocument(
  file: File,
  kind: DocumentKind,
  reading: ReceiptReading | null = null,
): Promise<StoredDocument> {
  const documentId = newId();
  const stored = await compressForUpload(file);
  const fileKey = buildFileKey(documentId, stored.fileName);

  const document: StoredDocument = {
    id: documentId,
    kind,
    fileKey,
    uploadedAt: new Date().toISOString(),
    ocrStatus: statusFor(reading),
    rawOcrJson: reading === null ? null : { ...reading, parsedAt: new Date().toISOString() },
  };

  await savePendingFile({
    documentId,
    fileKey,
    fileName: stored.fileName,
    contentType: stored.contentType,
    size: stored.blob.size,
    blob: stored.blob,
  });

  await repository.saveDocument(document);
  return document;
}

export function documentHref(document: StoredDocument) {
  return documentFileUrl(document.id);
}

async function withCategory(receipt: ParsedReceipt | null, lines: string[]) {
  if (receipt === null) return null;
  const { guessCategory } = await import("@/src/lib/classify");
  const guess = await guessCategory(receipt.vendor || null, receipt.items, lines);
  if (guess === null) return receipt;
  return { ...receipt, categoryId: guess.categoryId, categoryConfidence: guess.confidence };
}

// The reader and the classifier are the heaviest code in the app and only a
// receipt ever needs them, so they load on the first read rather than with the
// module that every screen imports for captureDocument.
export async function readReceipt(blob: Blob, hstRate: number): Promise<ReceiptReading | null> {
  const { parseReceiptText, recognizeDocument } = await import("@/src/lib/ocr");
  const page = await recognizeDocument(blob);
  if (page === null) return null;
  const lines = page.lines.map((line) => line.text);
  return {
    text: page.text,
    confidence: page.confidence,
    receipt: await withCategory(parseReceiptText(page, { hstRate }), lines),
  };
}
