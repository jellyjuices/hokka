"use client";

import { useMemo } from "react";
import { ArrowElbowDownRightIcon, PiggyBankIcon } from "@phosphor-icons/react/dist/ssr";
import type { ActivityItem } from "../ActivityList";
import type { Obligation, ObligationState } from "../ObligationCard";
import { useLedger } from "@/src/context/Ledger";
import type { Filing, Transaction } from "@/src/data/domain.types";
import { currentYear, todayIsoDate } from "@/src/lib/dates";
import { currentPeriod, periodLabel } from "@/src/lib/periods";
import { calculatePeriodTotals } from "@/src/lib/tax";

const RECENT_LIMIT = 4;

type ObligationSeed = {
  id: string;
  label: string;
  caption: string;
  icon: Obligation["icon"];
  amount: number;
  isFiled: boolean;
  href: string;
};

function inYear(isoDate: string, year: number) {
  return isoDate.startsWith(String(year));
}

function toActivityItem(transaction: Transaction): ActivityItem {
  return { kind: "transaction", transaction };
}

function toFilingItem(filing: Filing): ActivityItem {
  return { kind: "filing", filing };
}

type DatedItem = { sortDate: string; item: ActivityItem };

function byRecency(a: DatedItem, b: DatedItem) {
  return b.sortDate.localeCompare(a.sortDate);
}

function obligationState(amount: number, isFiled: boolean): ObligationState {
  if (isFiled) return "collected";
  return amount === 0 ? "collecting" : "claimable";
}

function toObligation(seed: ObligationSeed): Obligation {
  const state = obligationState(seed.amount, seed.isFiled);

  return {
    id: seed.id,
    label: seed.label,
    amount: Math.abs(seed.amount),
    caption: seed.caption,
    icon: seed.icon,
    state,
    href: seed.href,
  };
}

export function useDashboardTotals(year: number) {
  const { transactions, filings, settings } = useLedger();

  return useMemo(() => {
    const isCurrentYear = year === currentYear();
    const reference = isCurrentYear ? todayIsoDate() : `${year}-12-31`;
    const period = currentPeriod(settings.filingFrequency, reference);

    const yearTransactions = transactions.filter((transaction) =>
      inYear(transaction.txnDate, year),
    );
    const yearFilings = filings.filter((filing) => inYear(filing.filedDate, year));
    const periodTransactions = transactions.filter(
      (transaction) => transaction.taxPeriodId === period.id,
    );
    const periodFilings = filings.filter((filing) => filing.taxPeriodId === period.id);

    const income = yearTransactions.filter((transaction) => transaction.direction === "income");
    const expenses = yearTransactions.filter((transaction) => transaction.direction === "expense");

    const yearTotals = calculatePeriodTotals(yearTransactions, yearFilings, settings);
    const periodTotals = calculatePeriodTotals(periodTransactions, periodFilings, settings);
    const periodTitle = periodLabel(period);
    // Unclaimed ITCs and unremitted HST from earlier periods still count against what is owed now.
    const owingTotals = calculatePeriodTotals(
      transactions.filter((transaction) => transaction.txnDate <= period.endDate),
      filings.filter((filing) => filing.filingType === "hst"),
      settings,
    );

    return {
      period,
      periodTitle,
      yearTotals,
      periodTotals,
      obligations: [
        toObligation({
          id: `reserve-${year}`,
          label: "Set aside",
          caption: `For ${year} taxes`,
          icon: PiggyBankIcon,
          amount: yearTotals.incomeTaxSetAside,
          isFiled: yearFilings.some((filing) => filing.filingType === "income_tax"),
          href: "/filings",
        }),
        toObligation({
          id: `hst-${period.id}`,
          label: owingTotals.netHstOwing < 0 ? "Claim HST" : "HST owed",
          caption: `All periods to ${periodTitle}`,
          icon: ArrowElbowDownRightIcon,
          amount: owingTotals.netHstOwing,
          isFiled: false,
          href: "/hst",
        }),
      ],
      incomeItems: income.slice(0, RECENT_LIMIT).map(toActivityItem),
      expenseItems: expenses.slice(0, RECENT_LIMIT).map(toActivityItem),
      recentItems: [
        ...yearTransactions.map((transaction) => ({
          sortDate: transaction.txnDate,
          item: toActivityItem(transaction),
        })),
        ...yearFilings.map((filing) => ({
          sortDate: filing.filedDate,
          item: toFilingItem(filing),
        })),
      ]
        .sort(byRecency)
        .slice(0, RECENT_LIMIT)
        .map(({ item }) => item),
      filingItems: yearFilings
        .map((filing) => ({ sortDate: filing.filedDate, item: toFilingItem(filing) }))
        .sort(byRecency)
        .map(({ item }) => item),
    };
  }, [filings, settings, transactions, year]);
}
