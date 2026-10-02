"use client";

import { ArrowElbowDownRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/src/components/Card";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { StatTile } from "@/src/components/StatTile";
import { formatCurrency } from "@/src/lib/money";
import { PeriodItems } from "./HstHistory.styles";
import { useHstHistory } from "./useHstHistory";

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
            caption={`Collected ${formatCurrency(totals.hstCollected)} · ITCs ${formatCurrency(totals.itcClaimed)} · Remitted ${formatCurrency(totals.hstRemitted)}`}
          />
        </li>
      ))}
    </PeriodItems>
  );
}
