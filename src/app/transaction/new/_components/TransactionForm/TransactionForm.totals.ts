import { claimablePctFor } from "@/src/data/categories";
import type { CategoryClaimablePct } from "@/src/data/domain.types";
import { roundToCents, toAmount } from "@/src/lib/money";
import type { TransactionFormState, TransactionTotals } from "./TransactionForm.types";

export function computeTotals(state: TransactionFormState, hstRate: number): TransactionTotals {
  const itemsTotal =
    state.subtotal === null
      ? roundToCents(state.items.reduce((running, item) => running + toAmount(item.amount), 0))
      : roundToCents(toAmount(state.subtotal));
  const tipsAmount = roundToCents(toAmount(state.tips));
  const subtotal = roundToCents(itemsTotal + tipsAmount);
  const hstAmount = state.isTaxed ? roundToCents(itemsTotal * (hstRate / 100)) : 0;
  const claimable = toAmount(state.claimablePct) / 100;

  return {
    itemsTotal,
    tipsAmount,
    subtotal,
    hstAmount,
    total: roundToCents(subtotal + hstAmount),
    claimBack: roundToCents(state.direction === "expense" ? hstAmount * claimable : hstAmount),
  };
}

export function defaultClaimablePct(categoryId: string, overrides: CategoryClaimablePct) {
  return String(claimablePctFor(categoryId, overrides));
}

export function hasContent(state: TransactionFormState) {
  return (
    state.title.trim() !== "" ||
    state.counterparty.trim() !== "" ||
    state.categoryId !== "" ||
    toAmount(state.subtotal ?? "") > 0 ||
    state.items.some((item) => item.name.trim() !== "" || toAmount(item.amount) > 0)
  );
}
