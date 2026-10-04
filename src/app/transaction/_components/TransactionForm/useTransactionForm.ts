"use client";

import { useMemo, useState } from "react";
import { useLedger } from "@/src/context/Ledger";
import { categoriesFor, orderCategories } from "@/src/data/categories";
import type { ParsedReceipt } from "@/src/lib/ocr";
import type {
  CategoryClaimablePct,
  Transaction,
  TransactionDirection,
} from "@/src/data/domain.types";
import { sanitizeAmount, sanitizePercent } from "@/src/lib/money";
import { newId } from "@/src/lib/platform/id";
import {
  computeTotals,
  defaultClaimablePct,
  hasContent,
  hstAtRate,
} from "./TransactionForm.totals";
import { initialState, stateFrom } from "./TransactionForm.state";
import type { TransactionFormState, TransactionItem } from "./TransactionForm.types";

function emptyItem(): TransactionItem {
  return { id: newId(), name: "", amount: "" };
}

function hstFrom(parsed: ParsedReceipt, hstRate: number) {
  if (!parsed.isTaxed) return "";
  return parsed.hstAmount === hstAtRate(parsed.subtotal, hstRate)
    ? ""
    : parsed.hstAmount.toFixed(2);
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
      name: parsed.vendor || "Receipt total",
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

  const categories = useMemo(
    () => orderCategories(categoriesFor(state.direction)),
    [state.direction],
  );
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
      vendor: parsed.vendor || current.vendor,
      title: current.title === "" ? parsed.vendor : current.title,
      txnDate: parsed.txnDate || current.txnDate,
      isTaxed: parsed.isTaxed,
      hstAmount: hstFrom(parsed, settings.hstRate),
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
    setVendor: (vendor: string) => patch({ vendor }),
    setTaxed: (isTaxed: boolean) => patch({ isTaxed }),
    setHstAmount: (hstAmount: string) => patch({ hstAmount: sanitizeAmount(hstAmount) }),
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
