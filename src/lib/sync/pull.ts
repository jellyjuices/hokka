import { hasPendingOp, mergeLocalBatch, putLocalSettings } from "@/src/data/local";
import type { LocalMergeBatch, OutboxEntity } from "@/src/data/local";
import { pullChanges } from "@/src/data/remote";
import type { SyncCollection } from "@/src/data/remote";
import { readCursor, writeCursor } from "./cursor";

type IdentifiedRecord = { id: string };

function withoutPendingLocalEdits<T extends IdentifiedRecord>(
  entity: OutboxEntity,
  collection: SyncCollection<T>,
) {
  return {
    incoming: collection.changed.filter((record) => !hasPendingOp(entity, record.id)),
    removedIds: collection.removedIds.filter((id) => !hasPendingOp(entity, id)),
  };
}

export async function pullIntoLocal(): Promise<number> {
  const result = await pullChanges(readCursor());

  const batches: LocalMergeBatch[] = [
    { collection: "documents", ...withoutPendingLocalEdits("document", result.documents) },
    { collection: "periods", ...withoutPendingLocalEdits("period", result.periods) },
    { collection: "transactions", ...withoutPendingLocalEdits("transaction", result.transactions) },
    { collection: "filings", ...withoutPendingLocalEdits("filing", result.filings) },
  ];
  await mergeLocalBatch(batches);

  let merged = batches.reduce(
    (count, batch) => count + batch.incoming.length + batch.removedIds.length,
    0,
  );

  if (result.settings && !hasPendingOp("settings", result.settings.id)) {
    await putLocalSettings(result.settings);
    merged += 1;
  }

  writeCursor(result.serverTime);
  return merged;
}
