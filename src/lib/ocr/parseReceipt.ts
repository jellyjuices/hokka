import { classifyReceipt } from "./classify";
import { extractDate } from "./dates";
import { extractItems } from "./items";
import { isCloseEnough } from "./money";
import type { OcrPage, ParsedReceipt, ParseReceiptOptions } from "./ocr.types";
import { extractTotals, totalsFromItems } from "./totals";
import { extractVendor } from "./vendor";

const RECONCILED_WEIGHT = 0.4;
const DATE_WEIGHT = 0.2;
const VENDOR_WEIGHT = 0.2;
const ITEMS_WEIGHT = 0.2;

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function sumOf(amounts: number[]) {
  return amounts.reduce((running, amount) => running + amount, 0);
}

function scoreOf(signals: Record<string, boolean>, ocrConfidence: number) {
  const weights = {
    reconciled: RECONCILED_WEIGHT,
    date: DATE_WEIGHT,
    vendor: VENDOR_WEIGHT,
    items: ITEMS_WEIGHT,
  };
  const structural = Object.entries(weights).reduce(
    (running, [name, weight]) => running + (signals[name] ? weight : 0),
    0,
  );
  return Math.round(ocrConfidence * structural * 100) / 100;
}

export function parseReceiptText(
  page: OcrPage,
  options: ParseReceiptOptions,
): ParsedReceipt | null {
  const today = options.today ?? new Date();
  const lines = page.lines.map((line) => line.text);
  const items = extractItems(lines, today);
  const labelled = extractTotals(lines, options.hstRate);
  const totals = labelled.total > 0 ? labelled : totalsFromItems(items);
  if (totals.total <= 0) return null;

  const vendor = extractVendor(lines);
  const txnDate = extractDate(lines, today);
  const itemsMatchSubtotal =
    items.length > 0 &&
    isCloseEnough(sumOf(items.map((item) => item.amount)), totals.subtotal, 0.05);

  return {
    counterparty: vendor ?? "",
    txnDate: txnDate ?? toIsoDate(today),
    subtotal: totals.subtotal,
    hstAmount: totals.hstAmount,
    total: totals.total,
    tips: totals.tips,
    items,
    itemsCoverSubtotal: itemsMatchSubtotal,
    categoryId: classifyReceipt(vendor, items, lines),
    isTaxed: totals.isTaxed,
    confidence: scoreOf(
      {
        reconciled: totals.isReconciled,
        date: txnDate !== null,
        vendor: vendor !== null,
        items: itemsMatchSubtotal,
      },
      Math.max(0, Math.min(1, page.confidence / 100)),
    ),
  };
}
