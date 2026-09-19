"use client";

import { useMemo, useState } from "react";
import { useLedger } from "@/src/context/Ledger";
import { categoriesFor } from "@/src/data/categories";
import type { ParsedReceipt } from "@/src/lib/ocr";
import type { CategoryClaimablePct, TransactionDirection } from "@/src/data/domain.types";
import { todayIsoDate } from "@/src/lib/dates";
import { sanitizeAmount } from "@/src/lib/money";
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
    items: [emptyItem()],
    isTaxed: true,
    tips: "",
    claimablePct: "100",
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

function withTrailingRow(items: TransactionItem[]) {
  const last = items[items.length - 1];
  if (last && last.name === "" && last.amount === "") return items;
  return [...items, emptyItem()];
}

export function useTransactionForm() {
  const { settings } = useLedger();
  const [state, setState] = useState<TransactionFormState>(initialState);

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
      items: withTrailingRow(
        current.items.map((item) =>
          item.id === id
            ? { ...item, [field]: field === "amount" ? sanitizeAmount(value) : value }
            : item,
        ),
      ),
    }));
  }

  function removeItem(id: string) {
    setState((current) => ({
      ...current,
      items: withTrailingRow(current.items.filter((item) => item.id !== id)),
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
      items: withTrailingRow(itemsFrom(parsed)),
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
    setClaimablePct: (claimablePct: string) => patch({ claimablePct }),
    setDirection,
    setCategory,
    setItem,
    removeItem,
    applyParsed,
  };
}

export type TransactionFormApi = ReturnType<typeof useTransactionForm>;
