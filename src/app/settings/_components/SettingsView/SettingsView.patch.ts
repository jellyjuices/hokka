import { CATEGORIES, clampClaimablePct } from "@/src/data/categories";
import type { CategoryClaimablePct, FilingFrequency, TaxSettings } from "@/src/data/domain.types";

const FREQUENCIES: FilingFrequency[] = ["monthly", "quarterly", "annual"];

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toFrequency(value: string, fallback: FilingFrequency): FilingFrequency {
  return FREQUENCIES.includes(value as FilingFrequency) ? (value as FilingFrequency) : fallback;
}

export function claimableFieldName(categoryId: string) {
  return `claimablePct.${categoryId}`;
}

// A blank tile is not a zero: it drops the override and hands the category back to its
// own default, the way a blank reserve hands the rate back to the bracket estimate.
function readClaimable(form: FormData, current: CategoryClaimablePct): CategoryClaimablePct {
  const next = { ...current };

  for (const category of CATEGORIES) {
    const field = form.get(claimableFieldName(category.id));
    if (field === null) continue;
    const text = toText(field);
    if (text === "") {
      delete next[category.id];
      continue;
    }
    const value = Number(text);
    if (Number.isFinite(value)) next[category.id] = clampClaimablePct(value);
  }

  return next;
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
    categoryClaimablePct: readClaimable(form, current.categoryClaimablePct),
  };
}
