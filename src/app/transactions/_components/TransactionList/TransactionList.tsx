"use client";

import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { LinkButton } from "@/src/components/Button";
import { useLedger, useSyncState } from "@/src/context/Ledger";
import { formatCurrency, formatDate } from "@/src/lib/format";
import * as styles from "./TransactionList.styles";

export function TransactionList() {
  const { transactions, isHydrated } = useLedger();
  const { pendingCount } = useSyncState();

  if (transactions.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="receipt"
          title={isHydrated ? "No transactions yet" : "Loading transactions…"}
          description="Add one by hand, or capture a receipt and confirm the parsed fields."
          action={
            <LinkButton href="/transactions/new" tone="accent">
              Add transaction
            </LinkButton>
          }
        />
      </Card>
    );
  }

  return (
    <Card title={pendingCount === 0 ? undefined : `${pendingCount} waiting to sync`}>
      {transactions.map((transaction) => (
        <styles.Row key={transaction.id}>
          <span>{transaction.counterparty}</span>
          <span>{formatDate(transaction.txnDate)}</span>
          <span>{formatCurrency(transaction.total)}</span>
        </styles.Row>
      ))}
    </Card>
  );
}
