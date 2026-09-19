"use client";

import { LinkButton } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { TransactionCard } from "@/src/components/TransactionCard";
import { useLedger } from "@/src/context/Ledger";
import { searchTransactions } from "@/src/lib/search";
import { ResultCount, ResultItems, ResultLayout } from "./SearchResults.styles";
import type { SearchResultsProps } from "./SearchResults.types";

export function SearchResults({ query }: SearchResultsProps) {
  const { transactions } = useLedger();
  const matches = searchTransactions(transactions, query);

  if (matches.length === 0) {
    return (
      <EmptyState
        icon="search"
        title={query === "" ? "Nothing searched yet" : "No matches"}
        description="Search looks at counterparty, category and notes across every recorded transaction."
        action={
          <LinkButton href="/transaction/new" tone="accent" trailingIcon="plus">
            New transaction
          </LinkButton>
        }
      />
    );
  }

  return (
    <ResultLayout>
      <ResultCount>{`${matches.length} ${matches.length === 1 ? "match" : "matches"}`}</ResultCount>
      <ResultItems>
        {matches.map((transaction) => (
          <li key={transaction.id}>
            <TransactionCard transaction={transaction} />
          </li>
        ))}
      </ResultItems>
    </ResultLayout>
  );
}
