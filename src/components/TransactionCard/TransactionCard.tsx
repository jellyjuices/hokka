"use client";

import { CoinsIcon, HandCoinsIcon } from "@phosphor-icons/react/dist/ssr";
import { EntryCard } from "@/src/components/EntryCard";
import { findCategory } from "@/src/data/categories";
import { formatCurrency, roundToCents } from "@/src/lib/money";
import { formatDate } from "@/src/lib/dates";
import { ConfirmDelete } from "./ConfirmDelete";
import type { TransactionCardProps } from "./TransactionCard.types";
import { useTransactionActions } from "./useTransactionActions";

export function TransactionCard({ transaction }: TransactionCardProps) {
  const actions = useTransactionActions();
  const isIncome = transaction.direction === "income";
  const title = transaction.title || transaction.vendor || "Untitled";
  const category = findCategory(transaction.category);

  return (
    <>
      <EntryCard
        icon={category?.icon ?? (isIncome ? HandCoinsIcon : CoinsIcon)}
        color={category?.color ?? null}
        date={formatDate(transaction.txnDate)}
        detail={
          roundToCents(transaction.hstAmount) === 0
            ? undefined
            : `HST ${formatCurrency(transaction.hstAmount)}`
        }
        title={title}
        amount={`${isIncome ? "+" : "−"}${formatCurrency(transaction.total)}`}
        isIncome={isIncome}
        href={`/transaction/edit?id=${transaction.id}`}
        menuLabel="Transaction options"
        menuItems={actions.itemsFor(transaction)}
      />
      <ConfirmDelete
        open={actions.pending !== null}
        title={title}
        isDeleting={actions.isDeleting}
        onOpenChange={(open) => {
          if (!open) actions.cancelDelete();
        }}
        onConfirm={() => void actions.confirmDelete()}
      />
    </>
  );
}
