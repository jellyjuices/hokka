import { newId } from "@/src/lib/id";
import { parseReceiptText, recognizeDocument } from "@/src/lib/ocr";
import type { ReceiptReading } from "@/src/lib/ocr";
import type { DocumentKind, OcrStatus, StoredDocument } from "./domain.types";
import { savePendingFile } from "./local";
import { documentFileUrl } from "./remote";
import { repository } from "./repository";

const PARSED_CONFIDENCE = 0.6;

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

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
  const fileKey = buildFileKey(documentId, file.name);

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
    fileName: file.name,
    contentType: file.type === "" ? DEFAULT_CONTENT_TYPE : file.type,
    size: file.size,
    blob: file,
  });

  await repository.saveDocument(document);
  return document;
}

export function documentHref(document: StoredDocument) {
  return documentFileUrl(document.id);
}

export async function readReceipt(blob: Blob, hstRate: number): Promise<ReceiptReading | null> {
  const page = await recognizeDocument(blob);
  if (page === null) return null;
  return {
    text: page.text,
    confidence: page.confidence,
    receipt: parseReceiptText(page, { hstRate }),
  };
}
