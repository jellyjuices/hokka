import { deleteValue, listKeys, readValue } from "@/src/lib/storage/keyval";
import type { SharedFile } from "./shareInbox.types";

// public/sw.js writes these keys when the share sheet POSTs to /share-target. The prefix and
// the record shape are repeated there because a service worker cannot import from the bundle.
const SHARE_INBOX_PREFIX = "share.inbox.v1.";

export async function takeSharedFiles(): Promise<File[]> {
  const keys = await listKeys(SHARE_INBOX_PREFIX);
  const shared: SharedFile[] = [];
  for (const key of keys) {
    const entry = await readValue<SharedFile>(key);
    await deleteValue(key);
    if (entry !== null) shared.push(entry);
  }
  return shared
    .sort((first, second) => first.sharedAt.localeCompare(second.sharedAt))
    .map((entry) => new File([entry.blob], entry.fileName, { type: entry.contentType }));
}
