import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "../domain.types";
import { apiRequest, putBinary } from "./apiClient";
import type { SyncPullResult, UploadTicket } from "./sync.types";

export function pullChanges(since: string | null) {
  const query = since === null ? "" : `?since=${encodeURIComponent(since)}`;
  return apiRequest<SyncPullResult>(`/sync${query}`);
}

export function pushTransaction(transaction: Transaction) {
  return apiRequest<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
}

export function pushTransactionDeletion(id: string) {
  return apiRequest<void>(`/transactions/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function pushFiling(filing: Filing) {
  return apiRequest<Filing>("/filings", { method: "POST", body: JSON.stringify(filing) });
}

export function pushPeriod(period: TaxPeriod) {
  return apiRequest<TaxPeriod>("/periods", { method: "POST", body: JSON.stringify(period) });
}

export function pushDocument(document: StoredDocument) {
  return apiRequest<StoredDocument>("/documents", {
    method: "POST",
    body: JSON.stringify(document),
  });
}

export function pushSettings(settings: TaxSettings) {
  return apiRequest<TaxSettings>("/settings", { method: "PUT", body: JSON.stringify(settings) });
}

export function requestUploadTicket(fileKey: string, contentType: string) {
  return apiRequest<UploadTicket>("/uploads", {
    method: "POST",
    body: JSON.stringify({ fileKey, contentType }),
  });
}

export function uploadFile(ticket: UploadTicket, blob: Blob, contentType: string) {
  return putBinary(ticket.uploadUrl, blob, contentType);
}

export function documentFileUrl(documentId: string) {
  return `/api/documents/${encodeURIComponent(documentId)}/file`;
}

export function exportUrl(taxPeriodId: string, format: string) {
  return `/api/export?periodId=${encodeURIComponent(taxPeriodId)}&format=${format}`;
}
