import type { TransactionDraft } from "@/src/context/Ledger";
import type { LineItem, Transaction } from "@/src/data/domain.types";
import { roundToCents, toAmount } from "@/src/lib/money";
import type { TransactionFormState, TransactionTotals } from "./TransactionForm.types";

function lineItemsFrom(state: TransactionFormState): LineItem[] {
  if (state.subtotal !== null) return [];
  return state.items
    .filter((item) => item.name.trim() !== "" || toAmount(item.amount) !== 0)
    .map((item) => ({ name: item.name.trim(), amount: roundToCents(toAmount(item.amount)) }));
}

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
    vendor: state.vendor.trim(),
    txnDate: state.txnDate,
    subtotal: totals.subtotal,
    hstAmount: totals.hstAmount,
    total: totals.total,
    category: state.categoryId,
    claimablePct: toAmount(state.claimablePct),
    title: state.title.trim(),
    items: lineItemsFrom(state),
  };
}
