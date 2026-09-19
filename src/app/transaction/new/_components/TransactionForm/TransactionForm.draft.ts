import type { TransactionDraft } from "@/src/context/Ledger";
import { toAmount } from "@/src/lib/money";
import type { TransactionFormState, TransactionTotals } from "./TransactionForm.types";

export function buildDraft(
  state: TransactionFormState,
  totals: TransactionTotals,
  documentIds: string[],
): TransactionDraft {
  return {
    documentIds,
    direction: state.direction,
    counterparty: state.counterparty.trim(),
    txnDate: state.txnDate,
    subtotal: totals.subtotal,
    hstAmount: totals.hstAmount,
    total: totals.total,
    category: state.categoryId,
    claimablePct: toAmount(state.claimablePct),
    notes: state.title.trim(),
  };
}
