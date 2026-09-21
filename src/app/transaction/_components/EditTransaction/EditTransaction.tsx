"use client";

import { ArrowLeftIcon, CardsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { useLedger } from "@/src/context/Ledger";
import { TransactionForm } from "../TransactionForm";
import type { EditTransactionProps } from "./EditTransaction.types";

export function EditTransaction({ id }: EditTransactionProps) {
  const { transactions, isHydrated } = useLedger();
  const transaction = transactions.find((entry) => entry.id === id);

  if (transaction === undefined) {
    return (
      <EmptyState
        icon={<Icon name={CardsThreeIcon} size={32} weight="fill" />}
        title={isHydrated ? "That transaction is gone" : "Loading transaction…"}
        description="It may have been deleted on another device."
        action={
          <LinkButton href="/transactions" variant="tertiary" leadingIcon={ArrowLeftIcon}>
            Back to transactions
          </LinkButton>
        }
      />
    );
  }

  return <TransactionForm key={transaction.id} transaction={transaction} />;
}
