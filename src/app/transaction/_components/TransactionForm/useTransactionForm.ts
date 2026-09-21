"use client";

import { useMemo, useState } from "react";
import { useLedger } from "@/src/context/Ledger";
import { categoriesFor } from "@/src/data/categories";
import type { ParsedReceipt } from "@/src/lib/ocr";
import type {
  CategoryClaimablePct,
  Transaction,
  TransactionDirection,
} from "@/src/data/domain.types";
import { todayIsoDate } from "@/src/lib/dates";
import { roundToCents, sanitizeAmount, sanitizePercent } from "@/src/lib/money";
import { newId } from "@/src/lib/platform/id";
import { computeTotals, defaultClaimablePct, hasContent } from "./TransactionForm.totals";
import type { TransactionFormState, TransactionItem } from "./TransactionForm.types";

function emptyItem(): TransactionItem {
  return { id: newId(), name: "", amount: "" };
}

function initialState(): TransactionFormState {
  return {
    direction: "expense",
    title: "",
    categoryId: "",
    txnDate: todayIsoDate(),
    counterparty: "",
    items: [],
    subtotal: null,
    isTaxed: true,
    tips: "",
    claimablePct: "100",
  };
}

function stateFrom(transaction: Transaction, hstRate: number): TransactionFormState {
  const isTaxed = transaction.hstAmount > 0;
  // The row stores only the pre-tax total, so the taxed part is read back off the HST
  // amount and whatever is left of the subtotal is the untaxed tip.
  const taxedTotal =
    isTaxed && hstRate > 0
      ? roundToCents(transaction.hstAmount / (hstRate / 100))
      : transaction.subtotal;
  const tips = roundToCents(transaction.subtotal - taxedTotal);

  return {
    direction: transaction.direction,
    title: transaction.notes,
    categoryId: transaction.category,
    txnDate: transaction.txnDate,
    counterparty: transaction.counterparty,
    items: [],
    subtotal: taxedTotal.toFixed(2),
    isTaxed,
    tips: tips > 0 ? tips.toFixed(2) : "",
    claimablePct: String(transaction.claimablePct),
  };
}

function itemsFrom(parsed: ParsedReceipt): TransactionItem[] {
  if (parsed.itemsCoverSubtotal) {
    return parsed.items.map((item) => ({
      id: newId(),
      name: item.name,
      amount: item.amount.toFixed(2),
    }));
  }
  return [
    {
      id: newId(),
      name: parsed.counterparty || "Receipt total",
      amount: parsed.subtotal.toFixed(2),
    },
  ];
}

function categoryPatch(
  current: TransactionFormState,
  parsed: ParsedReceipt,
  overrides: CategoryClaimablePct,
) {
  if (current.direction !== "expense") return null;
  if (current.categoryId !== "" || parsed.categoryId === null) return null;
  return {
    categoryId: parsed.categoryId,
    claimablePct: defaultClaimablePct(parsed.categoryId, overrides),
  };
}

export function useTransactionForm(transaction?: Transaction) {
  const { settings } = useLedger();
  const [state, setState] = useState<TransactionFormState>(() =>
    transaction === undefined ? initialState() : stateFrom(transaction, settings.hstRate),
  );

  const categories = useMemo(() => categoriesFor(state.direction), [state.direction]);
  const totals = useMemo(() => computeTotals(state, settings.hstRate), [state, settings.hstRate]);

  function patch(next: Partial<TransactionFormState>) {
    setState((current) => ({ ...current, ...next }));
  }

  function setDirection(direction: TransactionDirection) {
    setState((current) => ({
      ...current,
      direction,
      categoryId: "",
      claimablePct: direction === "income" ? "100" : current.claimablePct,
    }));
  }

  function setCategory(categoryId: string) {
    patch({
      categoryId,
      claimablePct: defaultClaimablePct(categoryId, settings.categoryClaimablePct),
    });
  }

  function setItem(id: string, field: "name" | "amount", value: string) {
    setState((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "amount" ? sanitizeAmount(value) : value }
          : item,
      ),
    }));
  }

  function addSubtotal() {
    patch({ subtotal: "", items: [] });
  }

  function addItem() {
    setState((current) => ({ ...current, items: [...current.items, emptyItem()] }));
  }

  function removeItem(id: string) {
    setState((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }

  function applyParsed(parsed: ParsedReceipt) {
    setState((current) => ({
      ...current,
      ...categoryPatch(current, parsed, settings.categoryClaimablePct),
      counterparty: parsed.counterparty || current.counterparty,
      title: current.title === "" ? parsed.counterparty : current.title,
      txnDate: parsed.txnDate || current.txnDate,
      isTaxed: parsed.isTaxed,
      tips: parsed.tips > 0 ? parsed.tips.toFixed(2) : current.tips,
      items: itemsFrom(parsed),
      subtotal: null,
    }));
  }

  return {
    state,
    totals,
    categories,
    hstRate: settings.hstRate,
    isEmpty: !hasContent(state),
    setTitle: (title: string) => patch({ title }),
    setDate: (txnDate: string) => patch({ txnDate }),
    setCounterparty: (counterparty: string) => patch({ counterparty }),
    setTaxed: (isTaxed: boolean) => patch({ isTaxed }),
    setTips: (tips: string) => patch({ tips: sanitizeAmount(tips) }),
    setClaimablePct: (claimablePct: string) =>
      patch({ claimablePct: sanitizePercent(claimablePct) }),
    setDirection,
    setCategory,
    setItem,
    addItem,
    removeItem,
    addSubtotal,
    setSubtotal: (subtotal: string) => patch({ subtotal: sanitizeAmount(subtotal) }),
    applyParsed,
  };
}

export type TransactionFormApi = ReturnType<typeof useTransactionForm>;
