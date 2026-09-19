export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);
}

export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(isoDate));
}

export function formatPercent(fraction: number) {
  return new Intl.NumberFormat("en-CA", { style: "percent", maximumFractionDigits: 1 }).format(
    fraction,
  );
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
