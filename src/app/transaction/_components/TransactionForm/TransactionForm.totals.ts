import { claimablePctFor } from "@/src/data/categories";
import type { CategoryClaimablePct } from "@/src/data/domain.types";
import { roundToCents, toAmount } from "@/src/lib/money";
import type { TransactionFormState, TransactionTotals } from "./TransactionForm.types";

export function hstAtRate(taxedTotal: number, hstRate: number) {
  return roundToCents(taxedTotal * (hstRate / 100));
}

// A receipt's printed tax wins over the rate: part of a bill can be zero-rated, so 13% of
// the subtotal is only the fallback when no amount was read or typed.
function hstFor(entered: string, atRate: number) {
  return entered === "" ? atRate : roundToCents(toAmount(entered));
}

export function computeTotals(state: TransactionFormState, hstRate: number): TransactionTotals {
  const itemsTotal =
    state.subtotal === null
      ? roundToCents(state.items.reduce((running, item) => running + toAmount(item.amount), 0))
      : roundToCents(toAmount(state.subtotal));
  const tipsAmount = roundToCents(toAmount(state.tips));
  const subtotal = roundToCents(itemsTotal + tipsAmount);
  const atRate = hstAtRate(itemsTotal, hstRate);
  const hstAmount = state.isTaxed ? hstFor(state.hstAmount, atRate) : 0;
  const claimable = toAmount(state.claimablePct) / 100;

  return {
    itemsTotal,
    tipsAmount,
    subtotal,
    hstAmount,
    hstAtRate: atRate,
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
    state.vendor.trim() !== "" ||
    state.categoryId !== "" ||
    toAmount(state.subtotal ?? "") > 0 ||
    state.items.some((item) => item.name.trim() !== "" || toAmount(item.amount) > 0)
  );
}
