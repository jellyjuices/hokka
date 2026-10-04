import type { Transaction } from "@/src/data/domain.types";
import { todayIsoDate } from "@/src/lib/dates";
import { roundToCents } from "@/src/lib/money";
import { newId } from "@/src/lib/platform/id";
import { hstAtRate } from "./TransactionForm.totals";
import type { TransactionFormState } from "./TransactionForm.types";

export function initialState(): TransactionFormState {
  return {
    direction: "expense",
    title: "",
    categoryId: "",
    txnDate: todayIsoDate(),
    vendor: "",
    items: [],
    subtotal: null,
    isTaxed: true,
    hstAmount: "",
    tips: "",
    claimablePct: "100",
  };
}

// The stored subtotal folds tips in with the items, so whatever the items do not account
// for is the tip.
function tipsFrom(transaction: Transaction) {
  const itemsTotal = transaction.items.reduce((running, item) => running + item.amount, 0);
  const tips = roundToCents(transaction.subtotal - itemsTotal);
  return tips > 0 ? tips.toFixed(2) : "";
}

export function stateFrom(transaction: Transaction, hstRate: number): TransactionFormState {
  const isTaxed = transaction.hstAmount > 0;
  const hasItems = transaction.items.length > 0;
  // The row stores the pre-tax total and the HST apart, and neither says how much of the
  // subtotal was taxed, so the stored HST is carried as-is rather than re-derived.
  const isAtRate = transaction.hstAmount === hstAtRate(transaction.subtotal, hstRate);

  return {
    direction: transaction.direction,
    title: transaction.title,
    categoryId: transaction.category,
    txnDate: transaction.txnDate,
    vendor: transaction.vendor,
    items: transaction.items.map((item) => ({
      id: newId(),
      name: item.name,
      amount: item.amount.toFixed(2),
    })),
    subtotal: hasItems ? null : transaction.subtotal.toFixed(2),
    isTaxed,
    hstAmount: isTaxed && !isAtRate ? transaction.hstAmount.toFixed(2) : "",
    tips: hasItems ? tipsFrom(transaction) : "",
    claimablePct: String(transaction.claimablePct),
  };
}
