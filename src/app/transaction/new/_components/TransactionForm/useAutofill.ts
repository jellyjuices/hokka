"use client";

import { useRef, useState } from "react";
import { readReceipt } from "@/src/data/capture";
import type { ReceiptReading } from "@/src/lib/ocr";
import type { Attachment } from "./TransactionForm.types";
import type { TransactionFormApi } from "./useTransactionForm";

const READING = "Reading the receipt on this device…";
const UNREADABLE = "Nothing readable in that file yet, so it is attached as a reference.";
const UNSURE = "Read with low confidence, so check the vendor, date and amounts before saving.";
const FAILED = "The reader could not start, so the file is attached as a reference.";
const SURE_ENOUGH = 0.6;

export function useAutofill(form: TransactionFormApi) {
  const [pending, setPending] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const readings = useRef(new Map<string, ReceiptReading>());

  async function readInto(attachment: Attachment) {
    setPending(null);
    if (attachment.file === null || isReading) return;
    setIsReading(true);
    setNotice(READING);
    try {
      const reading = await readReceipt(attachment.file, form.hstRate);
      if (reading === null || reading.receipt === null) {
        setNotice(UNREADABLE);
        return;
      }
      readings.current.set(attachment.id, reading);
      form.applyParsed(reading.receipt);
      setNotice(reading.receipt.confidence >= SURE_ENOUGH ? null : UNSURE);
    } catch {
      setNotice(FAILED);
    } finally {
      setIsReading(false);
    }
  }

  function offer(added: Attachment[]) {
    const [first] = added;
    if (first === undefined || first.file === null) return;
    if (form.isEmpty) {
      void readInto(first);
      return;
    }
    setPending(first);
  }

  return {
    notice,
    isReading,
    readingFor(attachmentId: string) {
      return readings.current.get(attachmentId) ?? null;
    },
    isPromptOpen: pending !== null,
    offer,
    confirm() {
      if (pending !== null) void readInto(pending);
    },
    dismiss() {
      setPending(null);
    },
  };
}
