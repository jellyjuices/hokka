"use client";

import { useRef, useState } from "react";
import { readReceipt } from "@/src/data/capture";
import type { ReceiptReading } from "@/src/lib/ocr";
import type { Attachment, AutofillNotice } from "./TransactionForm.types";
import type { TransactionFormApi } from "./useTransactionForm";

const READING: AutofillNotice = {
  variant: "info",
  text: "Reading the receipt on this device…",
};
const UNREADABLE: AutofillNotice = {
  variant: "warning",
  text: "Nothing readable in that file yet, so it is attached as a reference.",
};
const UNSURE: AutofillNotice = {
  variant: "warning",
  text: "Read with low confidence, so check the vendor, date and amounts before saving.",
};
const FAILED: AutofillNotice = {
  variant: "warning",
  text: "The reader could not start, so the file is attached as a reference.",
};
const SURE: AutofillNotice = {
  variant: "success",
  text: "Read with high confidence, so the amounts below came off the receipt.",
};
const SURE_ENOUGH = 0.6;

export function useAutofill(form: TransactionFormApi) {
  const [pending, setPending] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState<AutofillNotice | null>(null);
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
      setNotice(reading.receipt.confidence >= SURE_ENOUGH ? SURE : UNSURE);
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
    forget(attachmentId: string) {
      readings.current.delete(attachmentId);
      setPending(null);
      setNotice(null);
    },
    confirm() {
      if (pending !== null) void readInto(pending);
    },
    dismiss() {
      setPending(null);
    },
  };
}
