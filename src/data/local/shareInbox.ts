import { newId } from "@/src/lib/platform/id";
import { deleteValue, listKeys, readValue, writeValue } from "@/src/lib/storage/keyval";
import { isIdbAvailable } from "@/src/lib/storage/idb";
import type { SharedFile } from "./shareInbox.types";

// public/sw.js writes these keys when the share sheet POSTs to /share-target. The prefix and
// the record shape are repeated there because a service worker cannot import from the bundle.
const SHARE_INBOX_PREFIX = "share.inbox.v1.";

// The localStorage fallback behind keyval cannot hold a Blob, so a browser without IndexedDB
// hands the files over in memory instead. The handoff is one client-side navigation long.
let held: File[] = [];

export async function saveSharedFiles(files: File[]): Promise<void> {
  if (files.length === 0) return;
  if (!isIdbAvailable()) {
    held = [...held, ...files];
    return;
  }
  const sharedAt = new Date().toISOString();
  for (const file of files) {
    const id = newId();
    const entry: SharedFile = {
      id,
      fileName: file.name,
      contentType: file.type,
      sharedAt,
      blob: file,
    };
    await writeValue(`${SHARE_INBOX_PREFIX}${id}`, entry);
  }
}

export async function takeSharedFiles(): Promise<File[]> {
  const keys = await listKeys(SHARE_INBOX_PREFIX);
  const shared: SharedFile[] = [];
  for (const key of keys) {
    const entry = await readValue<SharedFile>(key);
    await deleteValue(key);
    if (entry !== null) shared.push(entry);
  }
  const taken = held;
  held = [];
  return [
    ...shared
      .sort((first, second) => first.sharedAt.localeCompare(second.sharedAt))
      .map((entry) => new File([entry.blob], entry.fileName, { type: entry.contentType })),
    ...taken,
  ];
}
