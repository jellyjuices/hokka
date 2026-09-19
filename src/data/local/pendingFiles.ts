import { deleteValue, listKeys, readValue, writeValue } from "@/src/lib/storage/keyval";
import type { PendingFile } from "./pendingFiles.types";

const PENDING_FILE_PREFIX = "ledger.file.v1.";

function pendingFileKey(documentId: string) {
  return `${PENDING_FILE_PREFIX}${documentId}`;
}

export function savePendingFile(file: PendingFile) {
  return writeValue(pendingFileKey(file.documentId), file);
}

export function readPendingFile(documentId: string) {
  return readValue<PendingFile>(pendingFileKey(documentId));
}

export function deletePendingFile(documentId: string) {
  return deleteValue(pendingFileKey(documentId));
}

export async function listPendingFileIds() {
  const keys = await listKeys(PENDING_FILE_PREFIX);
  return keys.map((key) => key.slice(PENDING_FILE_PREFIX.length));
}
