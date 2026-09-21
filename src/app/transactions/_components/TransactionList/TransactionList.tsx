"use client";

import { useMemo, useState } from "react";
import { FunnelSimpleIcon, PlusIcon, CardsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { Menu } from "@/src/components/Menu";
import { TransactionCard } from "@/src/components/TransactionCard";
import { useLedger, useSyncState } from "@/src/context/Ledger";
import { NO_FILTER, filterTransactions } from "@/src/lib/filters";
import { ConfirmDelete } from "./_components/ConfirmDelete";
import { ExportButton } from "./_components/ExportButton";
import { TransactionFilters } from "./_components/TransactionFilters";
import { ListItems, ListLayout, ListNotice } from "./TransactionList.styles";
import { useTransactionActions } from "./useTransactionActions";

export function TransactionList() {
  const { transactions, isHydrated } = useLedger();
  const { pendingCounts } = useSyncState();
  const [filter, setFilter] = useState(NO_FILTER);
  const actions = useTransactionActions();

  const visible = useMemo(() => filterTransactions(transactions, filter), [transactions, filter]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Icon name={CardsThreeIcon} size={32} weight="fill" />}
        title={isHydrated ? "No transactions yet" : "Loading transactions…"}
        description="Log an invoice or a receipt."
        action={
          <LinkButton href="/transaction/new" variant="tertiary" trailingIcon={PlusIcon}>
            New item
          </LinkButton>
        }
      />
    );
  }

  return (
    <ListLayout>
      <TransactionFilters
        filter={filter}
        resultCount={visible.length}
        onChange={setFilter}
        action={<ExportButton transactions={visible} range={filter.range} />}
      />
      {pendingCounts.transaction > 0 && (
        <ListNotice>{`${pendingCounts.transaction} waiting to sync`}</ListNotice>
      )}
      {visible.length === 0 ? (
        <EmptyState
          icon={<Icon name={FunnelSimpleIcon} size={32} weight="fill" />}
          title="Nothing matches these filters"
          description="Widen the type, category or year to see more."
        />
      ) : (
        <ListItems>
          {visible.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard
                transaction={transaction}
                href={`/transaction/${transaction.id}`}
                action={<Menu label="Transaction options" items={actions.itemsFor(transaction)} />}
              />
            </li>
          ))}
        </ListItems>
      )}
      <ConfirmDelete
        open={actions.pending !== null}
        title={actions.pending?.title || actions.pending?.vendor || "This transaction"}
        isDeleting={actions.isDeleting}
        onOpenChange={(open) => {
          if (!open) actions.cancelDelete();
        }}
        onConfirm={() => void actions.confirmDelete()}
      />
    </ListLayout>
  );
}
