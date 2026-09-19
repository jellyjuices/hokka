import type { FilingFrequency, TaxPeriod } from "@/src/data/domain.types";

const MONTH_NAME = new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: "UTC" });

const MONTHS_PER_PERIOD: Record<FilingFrequency, number> = {
  monthly: 1,
  quarterly: 3,
  annual: 12,
};

function toIsoDate(year: number, monthIndex: number, day: number) {
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

export function currentPeriod(frequency: FilingFrequency, referenceDate: Date): TaxPeriod {
  const span = MONTHS_PER_PERIOD[frequency];
  const year = referenceDate.getUTCFullYear();
  const startMonth = Math.floor(referenceDate.getUTCMonth() / span) * span;

  return {
    id: periodId(frequency, year, startMonth),
    periodType: frequency,
    startDate: toIsoDate(year, startMonth, 1),
    endDate: toIsoDate(year, startMonth + span, 0),
    status: "open",
  };
}

export function generatePeriods(frequency: FilingFrequency, fiscalYearStart: string): TaxPeriod[] {
  const start = new Date(fiscalYearStart);
  const span = MONTHS_PER_PERIOD[frequency];
  const year = start.getUTCFullYear();

  return Array.from({ length: 12 / span }, (item, index) => {
    const startMonth = start.getUTCMonth() + index * span;
    return {
      id: periodId(frequency, year, startMonth),
      periodType: frequency,
      startDate: toIsoDate(year, startMonth, 1),
      endDate: toIsoDate(year, startMonth + span, 0),
      status: "open" as const,
    };
  });
}

export function findOpenPeriod(periods: TaxPeriod[]) {
  return periods.find((period) => period.status === "open") ?? null;
}
