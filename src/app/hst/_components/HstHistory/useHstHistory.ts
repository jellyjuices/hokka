"use client";

import { useMemo } from "react";
import { useLedger } from "@/src/context/Ledger";
import type { Filing, Transaction } from "@/src/data/domain.types";
import { periodFromId, periodLabel } from "@/src/lib/periods";
import { calculatePeriodTotals } from "@/src/lib/tax";

type PeriodGroup = { transactions: Transaction[]; filings: Filing[] };

function groupFor(groups: Map<string, PeriodGroup>, id: string) {
  const existing = groups.get(id);
  if (existing) return existing;
  const created: PeriodGroup = { transactions: [], filings: [] };
  groups.set(id, created);
  return created;
}

export function useHstHistory() {
  const { transactions, filings, settings } = useLedger();

  return useMemo(() => {
    const groups = new Map<string, PeriodGroup>();
    for (const transaction of transactions) {
      groupFor(groups, transaction.taxPeriodId).transactions.push(transaction);
    }
    for (const filing of filings) {
      if (filing.filingType === "hst") groupFor(groups, filing.taxPeriodId).filings.push(filing);
    }

    return [...groups.entries()]
      .map(([id, group]) => {
        const period = periodFromId(id);
        return {
          id,
          title: periodLabel(period),
          startDate: period.startDate,
          totals: calculatePeriodTotals(group.transactions, group.filings, settings),
        };
      })
      .sort((a, b) => b.startDate.localeCompare(a.startDate));
  }, [filings, settings, transactions]);
}
