"use client";

import { useMemo, useState } from "react";
import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageDots } from "@/src/components/PageDots";
import { PageHeader } from "@/src/components/PageHeader";
import { useMediaQuery, useScrollSnapIndex } from "@/src/hooks";
import { breakpoints } from "@/src/lib/breakpoints";
import { formatCurrency } from "@/src/lib/format";
import { ActivityList } from "../ActivityList";
import type { Obligation } from "../ObligationCard";
import { ObligationHistory } from "../ObligationHistory";
import { ObligationsPanel } from "../ObligationsPanel";
import { StreamPanel } from "../StreamPanel";
import { SummaryDeck } from "../SummaryDeck";
import { YearSelect } from "../YearSelect";
import * as styles from "./DashboardView.styles";
import type { DashboardSlide } from "./DashboardView.types";
import { useDashboardTotals } from "./useDashboardTotals";

const SLIDES: DashboardSlide[] = [
  { id: "income", label: "Income" },
  { id: "expenses", label: "Expenses" },
  { id: "taxes", label: "Taxes" },
];

const NARROW_QUERY = `(max-width: ${breakpoints.smTablet}px)`;

function obligationState(id: string, amount: number, filedIds: string[]): Obligation["state"] {
  if (filedIds.includes(id)) return "collected";
  return amount === 0 ? "collecting" : "claimable";
}

export function DashboardView() {
  const thisYear = new Date().getUTCFullYear();
  const [year, setYear] = useState(thisYear);
  const [filedIds, setFiledIds] = useState<string[]>([]);

  const isNarrow = useMediaQuery(NARROW_QUERY);
  const { trackRef, activeIndex, goTo } = useScrollSnapIndex(isNarrow ? SLIDES.length : 0);

  const { period, periodTitle, yearTotals, periodTotals, incomeItems, expenseItems, recentItems } =
    useDashboardTotals(year);

  const obligations = useMemo(
    () =>
      [
        {
          id: `reserve-${year}`,
          label: "Set aside",
          amount: yearTotals.incomeTaxSetAside,
          value: formatCurrency(yearTotals.incomeTaxSetAside),
          caption: `For ${year} taxes`,
          icon: "reserve" as const,
        },
        {
          id: `hst-${period.id}`,
          label: periodTotals.netHstOwing < 0 ? "Claim HST" : "Remit HST",
          amount: periodTotals.netHstOwing,
          value: formatCurrency(Math.abs(periodTotals.netHstOwing)),
          caption: `This period (${periodTitle})`,
          icon: "claim" as const,
        },
      ].map((seed) => ({ ...seed, state: obligationState(seed.id, seed.amount, filedIds) })),
    [
      filedIds,
      period.id,
      periodTitle,
      periodTotals.netHstOwing,
      yearTotals.incomeTaxSetAside,
      year,
    ],
  );

  function handleToggle(id: string) {
    setFiledIds((current) =>
      current.includes(id) ? current.filter((filed) => filed !== id) : [...current, id],
    );
  }

  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Dashboard"
          mobileTitle={SLIDES[activeIndex].label}
          icon="dashboard"
          meta={
            <YearSelect
              value={year}
              years={[thisYear, thisYear - 1, thisYear - 2]}
              onChange={setYear}
            />
          }
          action={
            <LinkButton href="/new" tone="accent" trailingIcon="plus">
              New
            </LinkButton>
          }
        />
      </GridItem>

      <SummaryDeck label="Yearly summary" trackRef={trackRef}>
        <GridItem span={4}>
          <StreamPanel
            label="Income"
            icon="money"
            value={formatCurrency(yearTotals.incomeTotal)}
            caption="This year"
            metricLabel="HST collected"
            metricValue={formatCurrency(yearTotals.hstCollected)}
          />
        </GridItem>
        <GridItem span={4}>
          <StreamPanel
            label="Expenses"
            icon="coins"
            value={formatCurrency(yearTotals.expenseTotal)}
            caption="This year"
            metricLabel="Total ITCs"
            metricValue={formatCurrency(yearTotals.itcClaimed)}
          />
        </GridItem>
        <GridItem span={4} rowSpan={2}>
          <ObligationsPanel obligations={obligations} onToggle={handleToggle} />
        </GridItem>
      </SummaryDeck>

      <GridItem>
        <styles.Pagination>
          <PageDots
            count={SLIDES.length}
            activeIndex={activeIndex}
            label="Summary panels"
            onSelect={goTo}
            getSlideLabel={(index) => SLIDES[index].label}
          />
        </styles.Pagination>
      </GridItem>

      <GridItem span={4}>
        <ActivityList
          visibility="wide"
          title="Recent invoices"
          items={incomeItems}
          emptyTitle="No invoices yet"
          emptyDescription="Paid invoices you record show up here with the HST you charged."
          ctaHref="/transactions"
          ctaLabel="See all invoices"
        />
      </GridItem>
      <GridItem span={4}>
        <ActivityList
          visibility="wide"
          title="Recent expenses"
          items={expenseItems}
          emptyTitle="No expenses yet"
          emptyDescription="Capture a receipt and the claimable HST lands here as an ITC."
          ctaHref="/transactions"
          ctaLabel="See all expenses"
        />
      </GridItem>

      <GridItem>
        <ActivityList
          visibility="narrow"
          title="All recent"
          items={recentItems}
          emptyTitle="Nothing recorded yet"
          emptyDescription="Capture a receipt or add a transaction by hand to open the period."
          ctaHref="/transactions"
          ctaLabel="See all transactions"
        />
      </GridItem>

      <GridItem>
        <ObligationHistory
          obligations={obligations.filter((obligation) => obligation.state === "collected")}
          onToggle={handleToggle}
        />
      </GridItem>
    </Grid>
  );
}
