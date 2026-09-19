import { newId } from "@/src/lib/id";
import type { DocumentKind, StoredDocument } from "./domain.types";
import { savePendingFile } from "./local";
import { documentFileUrl } from "./remote";
import { repository } from "./repository";

export type ParsedReceipt = {
  counterparty: string;
  txnDate: string;
  subtotal: number;
  hstAmount: number;
  total: number;
  confidence: number;
};

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

function fileExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot <= 0) return "";
  return fileName.slice(dot).toLowerCase();
}

export function buildFileKey(documentId: string, fileName: string) {
  return `documents/${documentId}${fileExtension(fileName)}`;
}

export async function captureDocument(file: File, kind: DocumentKind): Promise<StoredDocument> {
  const documentId = newId();
  const fileKey = buildFileKey(documentId, file.name);

  const document: StoredDocument = {
    id: documentId,
    kind,
    fileKey,
    uploadedAt: new Date().toISOString(),
    ocrStatus: "pending",
    rawOcrJson: null,
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

export async function parseDocument(document: StoredDocument): Promise<ParsedReceipt | null> {
  void document;
  return null;
}
