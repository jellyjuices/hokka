"use client";

import { Card } from "@/src/components/Card";
import { InvoiceIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { LinkButton } from "@/src/components/Button";
import { FilingCard } from "@/src/components/FilingCard";
import { useLedger } from "@/src/context/Ledger";
import { FilingItems } from "./FilingLog.styles";

export function FilingLog() {
  const { filings } = useLedger();

  if (filings.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icon name={InvoiceIcon} size={32} weight="regular" />}
          title="No filings logged"
          description="Record remittences and the net HST claimed."
          action={
            <LinkButton href="/filings/new" variant="tertiary" trailingIcon={PlusIcon}>
              Add Filing
            </LinkButton>
          }
        />
      </Card>
    );
  }

  return (
    <FilingItems>
      {filings.map((filing) => (
        <li key={filing.id}>
          <FilingCard filing={filing} />
        </li>
      ))}
    </FilingItems>
  );
}
