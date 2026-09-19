"use client";

import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { LinkButton } from "@/src/components/Button";
import { ListRow } from "@/src/components/ListRow";
import { useLedger } from "@/src/context/Ledger";
import { formatCurrency, formatDate } from "@/src/lib/format";

const FILING_LABEL = { hst: "HST remittance", income_tax: "Income tax instalment" };

export function FilingLog() {
  const { filings } = useLedger();

  if (filings.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="filings"
          title="No filings logged"
          description="Record what you remitted and when, and the net HST owing updates on the next read."
          action={
            <LinkButton href="/filings/new" tone="accent">
              Log a filing
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
