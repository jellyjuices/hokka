"use client";

import { useMemo, useState } from "react";
import {
  FunnelSimpleIcon,
  PlusIcon,
  CardsThreeIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { SkeletonList } from "@/src/components/Skeleton";
import { TransactionCard } from "@/src/components/TransactionCard";
import { useLedger, useSyncState } from "@/src/context/Ledger";
import { NO_FILTER, filterTransactions } from "@/src/lib/filters";
import { ExportButton } from "./_components/ExportButton";
import { TransactionFilters } from "./_components/TransactionFilters";
import { ListItems, ListLayout, ListNotice, ListNoticeIcon } from "./TransactionList.styles";

export function TransactionList() {
  const { transactions, isHydrated } = useLedger();
  const { pendingCounts } = useSyncState();
  const [filter, setFilter] = useState(NO_FILTER);

  const visible = useMemo(() => filterTransactions(transactions, filter), [transactions, filter]);

  if (!isHydrated) return <SkeletonList label="Loading transactions" rows={6} rowHeight={72} />;

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Icon name={CardsThreeIcon} size={32} weight="fill" />}
        title="No transactions yet"
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
        onChange={setFilter}
        action={<ExportButton transactions={visible} range={filter.range} />}
      />
      {pendingCounts.transaction > 0 && (
        <ListNotice role="status">
          <ListNoticeIcon>
            <Icon name={WarningIcon} size={18} weight="fill" />
          </ListNoticeIcon>
          {`${pendingCounts.transaction} ${pendingCounts.transaction === 1 ? "change is" : "changes are"} waiting to sync`}
        </ListNotice>
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
              <TransactionCard transaction={transaction} />
            </li>
          ))}
        </ListItems>
      )}
    </ListLayout>
  );
}
