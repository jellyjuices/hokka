import type { FilingFrequency, TaxPeriod } from "@/src/data/domain.types";

const MONTH_NAME = new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: "UTC" });

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
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);
  if (period.periodType === "annual") return `${start.getUTCFullYear()}`;
  if (period.periodType === "monthly")
    return `${MONTH_NAME.format(start)} ${start.getUTCFullYear()}`;
  return `${MONTH_NAME.format(start)} – ${MONTH_NAME.format(end)}`;
}

// The reference is a calendar date, not an instant: a transaction belongs to the period
// its date falls in, whatever hour it was entered and whatever the browser's offset is.
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
