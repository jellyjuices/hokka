import type { TransactionDraft } from "@/src/context/Ledger";
import type { Transaction } from "@/src/data/domain.types";
import { toAmount } from "@/src/lib/money";
import type { TransactionFormState, TransactionTotals } from "./TransactionForm.types";

export function buildDraft(
  state: TransactionFormState,
  totals: TransactionTotals,
  documentIds: string[],
  existing?: Transaction,
): TransactionDraft {
  return {
    id: existing?.id,
    taxPeriodId: existing?.taxPeriodId,
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
