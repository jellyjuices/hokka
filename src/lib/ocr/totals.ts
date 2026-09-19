import { hasTaxLabel, NOT_A_TOTAL, SUBTOTAL_LABEL, TIP_LABEL, TOTAL_LABEL } from "./keywords";
import { roundToCents } from "@/src/lib/money";
import { isCloseEnough, lastAmount } from "./amounts";
import type { ParsedReceiptItem, ReceiptTotals } from "./ocr.types";

export type TotalsLabel = "subtotal" | "tip" | "tax" | "total";

export type LabelledAmount = {
  label: TotalsLabel;
  value: number;
  index: number;
};

export function labelFor(line: string): TotalsLabel | null {
  if (SUBTOTAL_LABEL.test(line)) return "subtotal";
  if (TIP_LABEL.test(line)) return "tip";
  if (hasTaxLabel(line)) return "tax";
  if (TOTAL_LABEL.test(line) && !NOT_A_TOTAL.test(line)) return "total";
  return null;
}

function labelAmounts(lines: string[]): LabelledAmount[] {
  const found: LabelledAmount[] = [];
  lines.forEach((line, index) => {
    const label = labelFor(line);
    if (label === null) return;
    const amount = lastAmount(line);
    if (amount === null || amount.value <= 0) return;
    found.push({ label, value: amount.value, index });
  });
  return found;
}

function valuesFor(found: LabelledAmount[], label: TotalsLabel) {
  return found.filter((entry) => entry.label === label).map((entry) => entry.value);
}

function largest(values: number[]) {
  return values.length === 0 ? 0 : Math.max(...values);
}

function closestToGap(values: number[], gap: number) {
  const distinct = [...new Set(values)];
  const sum = roundToCents(distinct.reduce((running, value) => running + value, 0));
  const max = largest(distinct);
  if (isCloseEnough(sum, gap)) return sum;
  if (isCloseEnough(max, gap)) return max;
  return gap > 0 ? roundToCents(gap) : max;
}

function chooseTax(taxes: number[], subtotal: number, total: number, tips: number) {
  const credible = total > 0 ? taxes.filter((value) => value < total * 0.5) : taxes;
  if (credible.length === 0) return 0;
  if (subtotal === 0 || total === 0) return largest(credible);
  return closestToGap(credible, roundToCents(total - subtotal - tips));
}

const EMPTY_TOTALS: ReceiptTotals = {
  subtotal: 0,
  hstAmount: 0,
  total: 0,
  tips: 0,
  isTaxed: false,
  isReconciled: false,
};

export function extractTotals(lines: string[], hstRate: number): ReceiptTotals {
  const found = labelAmounts(lines);
  const tips = largest(valuesFor(found, "tip"));
  const claimedSubtotal = largest(valuesFor(found, "subtotal"));
  const claimedTotal = largest(valuesFor(found, "total"));
  const taxSeen = lines.some(hasTaxLabel);

  let total = claimedTotal;
  let subtotal = claimedSubtotal;
  let hstAmount = chooseTax(valuesFor(found, "tax"), subtotal, total, tips);
  const isTaxInferred =
    hstAmount === 0 &&
    taxSeen &&
    subtotal > 0 &&
    (total === 0 || isCloseEnough(total, roundToCents(subtotal + tips)));

  if (isTaxInferred) {
    hstAmount = roundToCents(subtotal * (hstRate / 100));
    total = roundToCents(subtotal + hstAmount + tips);
  }

  if (total === 0 && subtotal > 0) total = roundToCents(subtotal + hstAmount + tips);
  if (total <= 0) return EMPTY_TOTALS;

  if (subtotal === 0 && hstAmount > 0) subtotal = roundToCents(total - hstAmount - tips);
  if (subtotal === 0 && taxSeen) {
    subtotal = roundToCents((total - tips) / (1 + hstRate / 100));
    hstAmount = roundToCents(total - tips - subtotal);
  }
  if (subtotal === 0) subtotal = roundToCents(total - tips);

  const isReconciled =
    !isTaxInferred && isCloseEnough(roundToCents(subtotal + hstAmount + tips), total);
  if (!isReconciled) subtotal = roundToCents(total - tips - hstAmount);
  if (subtotal < 0) return EMPTY_TOTALS;

  return { subtotal, hstAmount, total, tips, isTaxed: hstAmount > 0, isReconciled };
}

export function totalsFromItems(items: ParsedReceiptItem[]): ReceiptTotals {
  const subtotal = roundToCents(items.reduce((running, item) => running + item.amount, 0));
  if (subtotal <= 0) return EMPTY_TOTALS;
  return { subtotal, hstAmount: 0, total: subtotal, tips: 0, isTaxed: false, isReconciled: false };
}
