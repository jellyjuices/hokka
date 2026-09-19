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
  pushDocument,
  pushFiling,
  pushPeriod,
  pushSettings,
  pushTransaction,
  pushTransactionDeletion,
  requestUploadTicket,
  uploadFile,
} from "@/src/data/remote";
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
  await pushDocument(document);
  if (pending) await deletePendingFile(id);
}

async function runOp(op: OutboxOp) {
  if (op.entity === "transaction") {
    if (op.action === "delete") {
      await pushTransactionDeletion(op.id);
      return;
    }
    const transaction = getLocalRecord("transactions", op.id);
    if (transaction) await pushTransaction(transaction);
    return;
  }

  if (op.entity === "filing") {
    const filing = getLocalRecord("filings", op.id);
    if (filing) await pushFiling(filing);
    return;
  }

  if (op.entity === "period") {
    const period = getLocalRecord("periods", op.id);
    if (period) await pushPeriod(period);
    return;
  }

  if (op.entity === "document") {
    await pushDocumentOp(op.id);
    return;
  }

  await pushSettings(getLocalSettings());
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
