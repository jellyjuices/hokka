import { ENTITIES } from "../entities";
import type { EntityName, EntityRecord } from "../entities";
import { apiRequest, putBinary } from "./apiClient";
import type { SyncPullResult, UploadTicket } from "./sync.types";

export function pullChanges(since: string | null) {
  const query = since === null ? "" : `?since=${encodeURIComponent(since)}`;
  return apiRequest<SyncPullResult>(`/sync${query}`);
}

export function pushEntity<Name extends EntityName>(entity: Name, record: EntityRecord[Name]) {
  const { path, method } = ENTITIES[entity];
  return apiRequest<EntityRecord[Name]>(path, { method, body: JSON.stringify(record) });
}

export function pushTransactionDeletion(id: string) {
  return apiRequest<void>(`/transactions/${encodeURIComponent(id)}`, { method: "DELETE" });
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
