import { findCategory } from "@/src/data/categories";
import type { TransactionDirection } from "@/src/data/domain.types";
import type { TransactionDraft } from "@/src/context/Ledger";

function toNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function readTransactionDraft(form: FormData, documentId: string | null): TransactionDraft {
  const direction = toText(form.get("direction")) as TransactionDirection;
  const category = toText(form.get("category"));
  const subtotal = toNumber(form.get("subtotal"));
  const hstAmount = toNumber(form.get("hstAmount"));
  const enteredTotal = toText(form.get("total"));
  const enteredClaimable = toText(form.get("claimablePct"));
  const categoryDefault = findCategory(category)?.defaultClaimablePct ?? 100;
  const txnDate = toText(form.get("txnDate"));

  return {
    documentId,
    direction: direction === "income" ? "income" : "expense",
    counterparty: toText(form.get("counterparty")),
    txnDate: txnDate === "" ? todayIsoDate() : txnDate,
    subtotal,
    hstAmount,
    total: enteredTotal === "" ? subtotal + hstAmount : Number(enteredTotal),
    category,
    claimablePct: enteredClaimable === "" ? categoryDefault : Number(enteredClaimable),
    notes: toText(form.get("notes")),
  };
}
