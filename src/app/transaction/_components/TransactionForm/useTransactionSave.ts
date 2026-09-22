"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLedgerActions } from "@/src/context/Ledger";
import type { DocumentKind, Transaction } from "@/src/data/domain.types";
import type { ReceiptReading } from "@/src/lib/ocr";
import { buildDraft } from "./TransactionForm.draft";
import type { Attachment, TransactionFormState, TransactionTotals } from "./TransactionForm.types";

type CaptureDocument = (
  file: File,
  kind: DocumentKind,
  reading: ReceiptReading | null,
) => Promise<{ id: string }>;

async function storeAttachments(
  attachments: Attachment[],
  kind: DocumentKind,
  capture: CaptureDocument,
  readingFor: (attachmentId: string) => ReceiptReading | null,
) {
  const documentIds: string[] = [];
  for (const attachment of attachments) {
    if (attachment.documentId !== null) {
      documentIds.push(attachment.documentId);
    } else if (attachment.file !== null) {
      const stored = await capture(attachment.file, kind, readingFor(attachment.id));
      documentIds.push(stored.id);
    }
  }
  return documentIds;
}

// The category the human settled on is the only label this app ever gets, so it
// teaches the on-device classifier what this vendor means. A failure here is
// never worth failing a saved transaction over.
async function learnCategory(
  attachments: Attachment[],
  categoryId: string,
  readingFor: (attachmentId: string) => ReceiptReading | null,
) {
  if (categoryId === "") return;
  const readings = attachments.map((attachment) => readingFor(attachment.id));
  if (readings.every((reading) => reading === null)) return;
  const { rememberReceipt } = await import("@/src/lib/classify");
  for (const reading of readings) {
    if (reading === null) continue;
    await rememberReceipt(reading, categoryId).catch(() => undefined);
  }
}

export function useTransactionSave() {
  const { captureDocument, saveTransaction } = useLedgerActions();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(
    state: TransactionFormState,
    totals: TransactionTotals,
    attachments: Attachment[],
    readingFor: (attachmentId: string) => ReceiptReading | null,
    existing?: Transaction,
  ) {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const kind: DocumentKind = state.direction === "income" ? "invoice" : "receipt";
      const documentIds = await storeAttachments(attachments, kind, captureDocument, readingFor);
      await saveTransaction(buildDraft(state, totals, documentIds, existing));
      await learnCategory(attachments, state.categoryId, readingFor);
      router.push("/transactions");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the transaction");
      setIsSaving(false);
    }
  }

  return { isSaving, error, save };
}
