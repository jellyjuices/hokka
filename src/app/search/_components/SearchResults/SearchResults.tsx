"use client";

import { LinkButton } from "@/src/components/Button";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { TransactionCard } from "@/src/components/TransactionCard";
import { useLedger } from "@/src/context/Ledger";
import { searchTransactions } from "@/src/lib/filters";
import { ResultCount, ResultItems, ResultLayout } from "./SearchResults.styles";
import type { SearchResultsProps } from "./SearchResults.types";

export function SearchResults({ query }: SearchResultsProps) {
  const { transactions } = useLedger();
  const matches = searchTransactions(transactions, query);

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<Icon name={MagnifyingGlassIcon} size={32} weight="bold" />}
        title={query === "" ? "Nothing searched yet" : "No matches"}
        description="Search looks at counterparty, category and notes across every recorded transaction."
        action={
          <LinkButton href="/" variant="primary" leadingIcon={ArrowLeftIcon}>
            Back to dashboard
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
            <TransactionCard transaction={transaction} href={`/transaction/${transaction.id}`} />
          </li>
        ))}
      </ResultItems>
    </ResultLayout>
  );
}
