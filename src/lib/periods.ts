import type { FilingFrequency, TaxPeriod } from "@/src/data/domain.types";
import { formatMonth, formatMonthAndYear } from "@/src/lib/dates";

const MONTHS_PER_PERIOD: Record<FilingFrequency, number> = {
  monthly: 1,
  quarterly: 3,
  annual: 12,
};

function utcIsoDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day)).toISOString().slice(0, 10);
}

function periodId(frequency: FilingFrequency, year: number, startMonth: number) {
  if (frequency === "annual") return `${year}`;
  if (frequency === "quarterly") return `${year}-Q${startMonth / 3 + 1}`;
  return `${year}-${String(startMonth + 1).padStart(2, "0")}`;
}

export function periodLabel(period: TaxPeriod) {
  if (period.periodType === "annual") return period.startDate.slice(0, 4);
  if (period.periodType === "monthly") return formatMonthAndYear(period.startDate);
  return `${formatMonth(period.startDate)} – ${formatMonth(period.endDate)}`;
}

export function currentPeriod(frequency: FilingFrequency, isoDate: string): TaxPeriod {
  const span = MONTHS_PER_PERIOD[frequency];
  const year = Number(isoDate.slice(0, 4));
  const startMonth = Math.floor((Number(isoDate.slice(5, 7)) - 1) / span) * span;

  return {
    id: periodId(frequency, year, startMonth),
    periodType: frequency,
    startDate: utcIsoDate(year, startMonth, 1),
    endDate: utcIsoDate(year, startMonth + span, 0),
    status: "open",
  };
}
