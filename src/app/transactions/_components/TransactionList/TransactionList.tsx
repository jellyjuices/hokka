"use client";

import { useMemo, useState } from "react";
import { LinkButton } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { Menu } from "@/src/components/Menu";
import { TransactionCard } from "@/src/components/TransactionCard";
import { useLedger, useSyncState } from "@/src/context/Ledger";
import { NO_FILTER, filterTransactions, transactionYears } from "@/src/lib/filters";
import { ConfirmDelete } from "./_components/ConfirmDelete";
import { TransactionFilters } from "./_components/TransactionFilters";
import { ListItems, ListLayout, ListNotice } from "./TransactionList.styles";
import { useTransactionActions } from "./useTransactionActions";

export function TransactionList() {
  const { transactions, isHydrated } = useLedger();
  const { pendingCount } = useSyncState();
  const [filter, setFilter] = useState(NO_FILTER);
  const actions = useTransactionActions();

  const years = useMemo(() => transactionYears(transactions), [transactions]);
  const visible = useMemo(() => filterTransactions(transactions, filter), [transactions, filter]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="receipt" size={32} weight="fill" />}
        title={isHydrated ? "No transactions yet" : "Loading transactions…"}
        description="Log an invoice or a receipt and the HST split is tracked from there."
        action={
          <LinkButton href="/transaction/new" tone="accent" trailingIcon="plus">
            New transaction
          </LinkButton>
        }
      />
    );
  }

  return (
    <ListLayout>
      <TransactionFilters
        filter={filter}
        years={years}
        resultCount={visible.length}
        onChange={setFilter}
      />
      {pendingCount > 0 && <ListNotice>{`${pendingCount} waiting to sync`}</ListNotice>}
      {visible.length === 0 ? (
        <EmptyState
          icon={<Icon name="filter" size={32} weight="fill" />}
          title="Nothing matches these filters"
          description="Widen the type, category or year to see more."
        />
      ) : (
        <ListItems>
          {visible.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard
                transaction={transaction}
                action={<Menu label="Transaction options" items={actions.itemsFor(transaction)} />}
              />
            </li>
          ))}
        </ListItems>
      )}
      <ConfirmDelete
        open={actions.pending !== null}
        title={actions.pending?.counterparty || "This transaction"}
        isDeleting={actions.isDeleting}
        onOpenChange={(open) => {
          if (!open) actions.cancelDelete();
        }}
        onConfirm={() => void actions.confirmDelete()}
      />
    </ListLayout>
  );
}
