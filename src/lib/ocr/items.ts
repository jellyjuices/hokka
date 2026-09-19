import { extractDate } from "./dates";
import { ADDRESS_LABEL, CONTACT_LABEL, PAYMENT_LABEL } from "./keywords";
import { lastAmount } from "./money";
import type { ParsedReceiptItem } from "./ocr.types";
import { labelFor } from "./totals";

const MAX_ITEMS = 40;
const MAX_ITEM_AMOUNT = 100_000;
const UNIT_PRICE_LINE = /(@|\/\s?(kg|lb|g|ea|l)\b|\bper\b)/i;
const LEADING_CODE = /^\s*(\d{5,}|\d+\s*[x*]\s*)/i;
const NAME_TAIL = /[\s.*\-–—:$]+$/;

function totalsStart(lines: string[]) {
  const index = lines.findIndex((line) => labelFor(line) !== null);
  return index === -1 ? lines.length : index;
}

function isItemLine(line: string, today: Date) {
  if (UNIT_PRICE_LINE.test(line)) return false;
  if (labelFor(line) !== null) return false;
  if (PAYMENT_LABEL.test(line) || CONTACT_LABEL.test(line) || ADDRESS_LABEL.test(line))
    return false;
  return extractDate([line], today) === null;
}

function itemFrom(line: string, today: Date): ParsedReceiptItem | null {
  if (!isItemLine(line, today)) return null;
  const amount = lastAmount(line);
  if (amount === null || amount.value <= 0 || amount.value > MAX_ITEM_AMOUNT) return null;
  const name = line.slice(0, amount.start).replace(LEADING_CODE, "").replace(NAME_TAIL, "").trim();
  if ((name.match(/[a-z]/gi)?.length ?? 0) < 2) return null;
  return { name, amount: amount.value };
}

export function extractItems(lines: string[], today: Date): ParsedReceiptItem[] {
  const items: ParsedReceiptItem[] = [];
  for (const line of lines.slice(0, totalsStart(lines))) {
    const item = itemFrom(line, today);
    if (item !== null) items.push(item);
    if (items.length === MAX_ITEMS) break;
  }
  return items;
}
