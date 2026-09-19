import {
  deletePendingFile,
  getLocalRecord,
  getLocalSettings,
  readOutbox,
  readPendingFile,
  recordOpFailure,
  removeOp,
} from "@/src/data/local";
import type { OutboxOp } from "@/src/data/local";
import {
  isRetryable,
  pushEntity,
  pushTransactionDeletion,
  requestUploadTicket,
  uploadFile,
} from "@/src/data/remote";
import type { EntityName, EntityRecord } from "@/src/data/entities";
import type { PushResult } from "./engine.types";

const MAX_ATTEMPTS = 5;

async function pushDocumentOp(id: string) {
  const document = getLocalRecord("documents", id);
  if (!document) return;
  const pending = await readPendingFile(id);
  if (pending) {
    const ticket = await requestUploadTicket(pending.fileKey, pending.contentType);
    await uploadFile(ticket, pending.blob, pending.contentType);
  }
  await pushEntity("document", document);
  if (pending) await deletePendingFile(id);
}

function storedPusher<Name extends EntityName>(
  entity: Name,
  load: (id: string) => EntityRecord[Name] | null,
) {
  return async (id: string) => {
    const record = load(id);
    if (record) await pushEntity(entity, record);
  };
}

// Keyed by EntityName rather than tested with a chain of ifs: the map has to name every
// entity, so a new one is a type error here instead of a silent settings push.
const PUSH_UPSERT: { [Name in EntityName]: (id: string) => Promise<void> } = {
  transaction: storedPusher("transaction", (id) => getLocalRecord("transactions", id)),
  filing: storedPusher("filing", (id) => getLocalRecord("filings", id)),
  period: storedPusher("period", (id) => getLocalRecord("periods", id)),
  document: pushDocumentOp,
  settings: async () => {
    await pushEntity("settings", getLocalSettings());
  },
};

async function runOp(op: OutboxOp) {
  if (op.entity === "transaction" && op.action === "delete") {
    await pushTransactionDeletion(op.id);
    return;
  }
  await PUSH_UPSERT[op.entity](op.id);
}

export async function pushOutbox(): Promise<PushResult> {
  let pushed = 0;

  for (const op of readOutbox()) {
    try {
      await runOp(op);
      await removeOp(op);
      pushed += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      if (isRetryable(error)) {
        await recordOpFailure(op, message);
        return { pushed, blocked: true };
      }
      await recordOpFailure(op, message);
      if (op.attempts + 1 >= MAX_ATTEMPTS) await removeOp(op);
    }
  }

  return { pushed, blocked: false };
}
