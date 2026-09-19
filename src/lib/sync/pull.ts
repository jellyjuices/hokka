import { hasPendingOp, mergeLocalRecords, putLocalSettings } from "@/src/data/local";
import type { LocalCollectionName, OutboxEntity } from "@/src/data/local";
import { pullChanges } from "@/src/data/remote";
import type { SyncCollection } from "@/src/data/remote";
import { readCursor, writeCursor } from "./cursor";

type IdentifiedRecord = { id: string };

function withoutPendingLocalEdits<T extends IdentifiedRecord>(
  entity: OutboxEntity,
  collection: SyncCollection<T>,
) {
  return {
    changed: collection.changed.filter((record) => !hasPendingOp(entity, record.id)),
    removedIds: collection.removedIds.filter((id) => !hasPendingOp(entity, id)),
  };
}

async function mergeCollection<T extends IdentifiedRecord>(
  name: LocalCollectionName,
  entity: OutboxEntity,
  collection: SyncCollection<T>,
) {
  const safe = withoutPendingLocalEdits(entity, collection);
  await mergeLocalRecords(name, safe.changed as never, safe.removedIds);
  return safe.changed.length + safe.removedIds.length;
}

export async function pullIntoLocal(): Promise<number> {
  const result = await pullChanges(readCursor());

  let merged = 0;
  merged += await mergeCollection("documents", "document", result.documents);
  merged += await mergeCollection("periods", "period", result.periods);
  merged += await mergeCollection("transactions", "transaction", result.transactions);
  merged += await mergeCollection("filings", "filing", result.filings);

  if (result.settings && !hasPendingOp("settings", result.settings.id)) {
    await putLocalSettings(result.settings);
    merged += 1;
  }

  writeCursor(result.serverTime);
  return merged;
}
