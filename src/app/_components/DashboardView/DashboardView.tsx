"use client";

import { useState } from "react";
import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageDots } from "@/src/components/PageDots";
import { PageHeader } from "@/src/components/PageHeader";
import { useMediaQuery, useScrollSnapIndex } from "@/src/hooks";
import { breakpoints } from "@/src/lib/breakpoints";
import { currentYear } from "@/src/lib/dates";
import { formatCurrency } from "@/src/lib/money";
import { ActivityList } from "../ActivityList";
import { ObligationHistory } from "../ObligationHistory";
import { ObligationsPanel } from "../ObligationsPanel";
import { StreamPanel } from "../StreamPanel";
import { SummaryDeck } from "../SummaryDeck";
import { YearSelect } from "../YearSelect";
import { DashboardAction, DashboardPagination } from "./DashboardView.styles";
import type { DashboardSlide } from "./DashboardView.types";
import { useDashboardTotals } from "./useDashboardTotals";

const SLIDES: DashboardSlide[] = [
  { id: "income", label: "Income" },
  { id: "expenses", label: "Expenses" },
  { id: "taxes", label: "Taxes" },
];

const NARROW_QUERY = `(max-width: ${breakpoints.smTablet}px)`;

export function DashboardView() {
  const thisYear = currentYear();
  const [year, setYear] = useState(thisYear);

  const isNarrow = useMediaQuery(NARROW_QUERY);
  const { trackRef, activeIndex, goTo } = useScrollSnapIndex(isNarrow ? SLIDES.length : 0);

  const { yearTotals, obligations, incomeItems, expenseItems, recentItems } =
    useDashboardTotals(year);

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
            <DashboardAction>
              <LinkButton href="/transaction/new" tone="accent" trailingIcon="plus">
                New
              </LinkButton>
            </DashboardAction>
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
          <ObligationsPanel obligations={obligations} />
        </GridItem>
      </SummaryDeck>

      <GridItem>
        <DashboardPagination>
          <PageDots
            count={SLIDES.length}
            activeIndex={activeIndex}
            label="Summary panels"
            onSelect={goTo}
            getSlideLabel={(index) => SLIDES[index].label}
          />
        </DashboardPagination>
      </GridItem>

      <GridItem span={4}>
        <ActivityList
          visibility="wide"
          title="Recent invoices"
          items={incomeItems}
          emptyTitle="No invoices yet"
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
          ctaHref="/transactions"
          ctaLabel="See all transactions"
        />
      </GridItem>

      <GridItem>
        <ObligationHistory
          obligations={obligations.filter((obligation) => obligation.state === "collected")}
        />
      </GridItem>
    </Grid>
  );
}
