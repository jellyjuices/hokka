"use client";

import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { LinkButton } from "@/src/components/Button";
import { useLedger } from "@/src/context/Ledger";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { searchTransactions } from "@/src/lib/search";
import * as styles from "./SearchResults.styles";
import type { SearchResultsProps } from "./SearchResults.types";

export function SearchResults({ query }: SearchResultsProps) {
  const { transactions } = useLedger();
  const matches = searchTransactions(transactions, query);

  if (matches.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="search"
          title={query === "" ? "Nothing searched yet" : "No matches"}
          description="Search looks at counterparty, category and notes across every recorded transaction."
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
    <Card title={`${matches.length} matches`}>
      {matches.map((transaction) => (
        <styles.Row key={transaction.id}>
          <styles.Counterparty>{transaction.counterparty}</styles.Counterparty>
          <styles.Meta>{formatDate(transaction.txnDate)}</styles.Meta>
          <styles.Amount>{formatCurrency(transaction.total)}</styles.Amount>
        </styles.Row>
      ))}
    </Card>
  );
}
