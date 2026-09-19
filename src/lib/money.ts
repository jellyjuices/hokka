// One rounding rule for the whole app. A receipt read, a form total and a period total
// have to agree to the cent, so they round in the same place.
const CURRENCY = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
const DECIMAL = new Intl.NumberFormat("en-CA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function roundToCents(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function formatCurrency(amount: number) {
  return CURRENCY.format(amount);
}

export function formatAmount(amount: number) {
  return DECIMAL.format(amount);
}
