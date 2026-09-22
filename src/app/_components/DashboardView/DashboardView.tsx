"use client";

import { useState } from "react";
import {
  InvoiceIcon,
  CoinsIcon,
  MoneyIcon,
  PlusIcon,
  SquaresFourIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageDots } from "@/src/components/PageDots";
import { PageHeader } from "@/src/components/PageHeader";
import { useLedger } from "@/src/context/Ledger";
import { useMediaQuery, useScrollSnapIndex } from "@/src/hooks";
import { breakpoints } from "@/src/lib/breakpoints";
import { currentYear } from "@/src/lib/dates";
import { formatCurrency } from "@/src/lib/money";
import { ActivityList } from "../ActivityList";
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

  const { isHydrated } = useLedger();
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const { trackRef, activeIndex, goTo } = useScrollSnapIndex(isNarrow ? SLIDES.length : 0);

  const { yearTotals, obligations, incomeItems, expenseItems, recentItems, filingItems } =
    useDashboardTotals(year);

  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Dashboard"
          mobileTitle={SLIDES[activeIndex].label}
          icon={SquaresFourIcon}
          meta={
            <YearSelect
              value={year}
              years={[thisYear, thisYear - 1, thisYear - 2]}
              onChange={setYear}
            />
          }
          action={
            <DashboardAction>
              <LinkButton href="/transaction/new" variant="primary" trailingIcon={PlusIcon}>
                New item
              </LinkButton>
            </DashboardAction>
          }
        />
      </GridItem>

      <SummaryDeck label="Yearly summary" trackRef={trackRef}>
        <GridItem span={4}>
          <StreamPanel
            label="Income"
            icon={MoneyIcon}
            value={yearTotals.incomeTotal}
            caption="This year"
            metricLabel="HST collected"
            metricValue={formatCurrency(yearTotals.hstCollected)}
          />
        </GridItem>
        <GridItem span={4}>
          <StreamPanel
            label="Expenses"
            icon={CoinsIcon}
            value={yearTotals.expenseTotal}
            caption="This year"
            metricLabel="ITCs earned"
            metricValue={formatCurrency(yearTotals.itcClaimed)}
          />
        </GridItem>
        <GridItem span={4}>
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
          isLoading={!isHydrated}
          visibility="wide"
          title="Recent invoices"
          items={incomeItems}
          emptyTitle="No invoices yet"
          ctaHref="/transactions"
          ctaLabel="See all invoices"
          icon={CurrencyDollarIcon}
        />
      </GridItem>
      <GridItem span={4}>
        <ActivityList
          isLoading={!isHydrated}
          visibility="wide"
          title="Recent expenses"
          items={expenseItems}
          emptyTitle="No expenses yet"
          ctaHref="/transactions"
          ctaLabel="See all expenses"
          icon={CoinsIcon}
        />
      </GridItem>
      <GridItem span={4}>
        <ActivityList
          isLoading={!isHydrated}
          visibility="wide"
          title="Filing history"
          items={filingItems}
          emptyTitle="No filings yet"
          ctaHref="/filings"
          ctaLabel="See all filings"
          icon={InvoiceIcon}
        />
      </GridItem>

      <GridItem>
        <ActivityList
          isLoading={!isHydrated}
          visibility="narrow"
          title="All recent"
          items={recentItems}
          emptyTitle="Nothing recorded yet"
          ctaHref="/transactions"
          ctaLabel="See all transactions"
        />
      </GridItem>
    </Grid>
  );
}
