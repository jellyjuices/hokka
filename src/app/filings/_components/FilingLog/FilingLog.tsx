"use client";

import { Card } from "@/src/components/Card";
import { InvoiceIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { LinkButton } from "@/src/components/Button";
import { ListRow } from "@/src/components/ListRow";
import { useLedger } from "@/src/context/Ledger";
import { formatCurrency } from "@/src/lib/money";
import { formatDate } from "@/src/lib/dates";

const FILING_LABEL = { hst: "HST remittance", income_tax: "Income tax instalment" };

export function FilingLog() {
  const { filings } = useLedger();

  if (filings.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icon name={InvoiceIcon} size={32} weight="fill" />}
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
    <Card>
      {filings.map((filing) => (
        <ListRow
          key={filing.id}
          meta={`${formatDate(filing.filedDate)} · ${filing.taxPeriodId}`}
          title={FILING_LABEL[filing.filingType]}
          value={formatCurrency(filing.amountFiled)}
        />
      ))}
    </Card>
  );
}
