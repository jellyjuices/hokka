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

export function toAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function sanitizeAmount(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length === 0 ? whole : `${whole}.${rest.join("").slice(0, 2)}`;
}

export function sanitizePercent(value: string) {
  const digits = value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
  return digits === "" ? "" : String(Math.min(Number(digits), 100));
}
