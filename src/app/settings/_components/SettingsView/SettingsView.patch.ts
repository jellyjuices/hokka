import type { FilingFrequency, TaxSettings } from "@/src/data/domain.types";

const FREQUENCIES: FilingFrequency[] = ["monthly", "quarterly", "annual"];

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toFrequency(value: string, fallback: FilingFrequency): FilingFrequency {
  return FREQUENCIES.includes(value as FilingFrequency) ? (value as FilingFrequency) : fallback;
}

export function readSettingsPatch(form: FormData, current: TaxSettings): Partial<TaxSettings> {
  const hstRate = Number(toText(form.get("hstRate")));
  const reserve = toText(form.get("incomeTaxReservePct"));
  const fiscalYearStart = toText(form.get("fiscalYearStart"));

  return {
    hstRate: Number.isFinite(hstRate) && hstRate > 0 ? hstRate : current.hstRate,
    filingFrequency: toFrequency(toText(form.get("filingFrequency")), current.filingFrequency),
    incomeTaxReservePct: reserve === "" ? null : Number(reserve),
    fiscalYearStart: fiscalYearStart === "" ? current.fiscalYearStart : fiscalYearStart,
  };
}
