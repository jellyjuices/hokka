import { INCOME_TAX_RATES, type TaxBracket } from "@/src/data/incomeTaxRates";

type IncomeTaxEstimate = {
  netIncome: number;
  federalTax: number;
  ontarioTax: number;
  cppContributions: number;
  totalOwing: number;
  effectiveRate: number;
};

const EMPTY_ESTIMATE: IncomeTaxEstimate = {
  netIncome: 0,
  federalTax: 0,
  ontarioTax: 0,
  cppContributions: 0,
  totalOwing: 0,
  effectiveRate: 0,
};

function applyBrackets(amount: number, brackets: TaxBracket[]) {
  let remaining = Math.max(amount, 0);
  let floor = 0;
  let total = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const ceiling = bracket.upTo ?? Infinity;
    const taxable = Math.min(remaining, ceiling - floor);
    total += taxable * bracket.rate;
    remaining -= taxable;
    floor = ceiling;
  }

  return total;
}

function cppContributions(netIncome: number) {
  const { cppSelfEmployedRate, cppBasicExemption, cppMaxPensionableEarnings } = INCOME_TAX_RATES;
  const pensionable = Math.min(Math.max(netIncome, 0), cppMaxPensionableEarnings);
  return Math.max(pensionable - cppBasicExemption, 0) * cppSelfEmployedRate;
}

function federalTax(netIncome: number) {
  const { federalBrackets, federalBasicPersonalAmount, federalLowestRate } = INCOME_TAX_RATES;
  const credit = federalBasicPersonalAmount * federalLowestRate;
  return Math.max(applyBrackets(netIncome, federalBrackets) - credit, 0);
}

function ontarioTax(netIncome: number) {
  const {
    ontarioBrackets,
    ontarioBasicPersonalAmount,
    ontarioLowestRate,
    ontarioSurtaxThresholds,
  } = INCOME_TAX_RATES;
  const credit = ontarioBasicPersonalAmount * ontarioLowestRate;
  const baseTax = Math.max(applyBrackets(netIncome, ontarioBrackets) - credit, 0);
  return baseTax + applyBrackets(baseTax, ontarioSurtaxThresholds);
}

function estimateIncomeTax(netIncome: number): IncomeTaxEstimate {
  if (netIncome <= 0) return EMPTY_ESTIMATE;

  const federal = federalTax(netIncome);
  const ontario = ontarioTax(netIncome);
  const cpp = cppContributions(netIncome);
  const totalOwing = federal + ontario + cpp;

  return {
    netIncome,
    federalTax: federal,
    ontarioTax: ontario,
    cppContributions: cpp,
    totalOwing,
    effectiveRate: totalOwing / netIncome,
  };
}

function derivedReservePct(netIncome: number) {
  return estimateIncomeTax(netIncome).effectiveRate * 100;
}

export function resolveReservePct(netIncome: number, overridePct: number | null) {
  return overridePct ?? derivedReservePct(netIncome);
}
