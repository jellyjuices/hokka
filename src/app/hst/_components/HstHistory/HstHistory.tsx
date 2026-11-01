"use client";

import { ArrowElbowDownRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { StatTile } from "@/src/components/StatTile";
import { formatCurrency } from "@/src/lib/money";
import { PeriodFileLink, PeriodItems } from "./HstHistory.styles";
import { useHstHistory } from "./useHstHistory";

function filingHref(periodId: string, amount: number) {
  const query = new URLSearchParams({
    period: periodId,
    type: "hst",
    amount: Math.abs(amount).toFixed(2),
  });
  return `/filings/new?${query.toString()}`;
}

export function HstHistory() {
  const periods = useHstHistory();

  if (periods.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icon name={ArrowElbowDownRightIcon} size={32} weight="regular" />}
          title="No periods yet"
          description="HST owed appears here once a transaction is logged."
        />
      </Card>
    );
  }

  return (
    <PeriodItems>
      {periods.map(({ id, title, totals }) => (
        <li key={id}>
          <StatTile
            size="compact"
            label={totals.netHstOwing < 0 ? `${title} · Claim` : title}
            value={formatCurrency(Math.abs(totals.netHstOwing))}
            badge={
              totals.netHstOwing !== 0 && (
                <PeriodFileLink
                  href={filingHref(id, totals.netHstOwing)}
                  aria-label={`File HST for ${title}`}
                >
                  <Icon name={CheckIcon} size={18} weight="bold" />
                </PeriodFileLink>
              )
            }
            caption={`Collected ${formatCurrency(totals.hstCollected)} · ITCs ${formatCurrency(totals.itcClaimed)} · Remitted ${formatCurrency(totals.hstRemitted)}`}
          />
        </li>
      ))}
    </PeriodItems>
  );
}
