import type { TaxSettings } from "./domain.types";

export const DEFAULT_SETTINGS: TaxSettings = {
  id: "default",
  hstRate: 13,
  filingFrequency: "quarterly",
  incomeTaxReservePct: null,
  fiscalYearStart: "2026-01-01",
  isHstRegistered: true,
  categoryClaimablePct: {},
};
