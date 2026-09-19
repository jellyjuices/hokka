import { findCategory } from "@/src/data/categories";
import { CATEGORY_SIGNALS, type CategorySignals } from "./classify.registry";
import type { ParsedReceiptItem } from "./ocr.types";

const VENDOR_WEIGHT = 4;
const BODY_VENDOR_WEIGHT = 2;
const MAX_TERM_HITS = 3;
const MINIMUM_SCORE = 3;

function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

function matches(haystack: string, needle: string) {
  const word = normalize(needle).trim();
  return haystack.includes(` ${word} `) || haystack.includes(` ${word}s `);
}

function countHits(haystack: string, needles: string[]) {
  return needles.filter((needle) => matches(haystack, needle)).length;
}

function scoreFor(signals: CategorySignals, vendorText: string, bodyText: string) {
  const vendorHits = countHits(vendorText, signals.vendors);
  const bodyVendorHits = countHits(bodyText, signals.vendors);
  const termHits = Math.min(countHits(bodyText, signals.terms), MAX_TERM_HITS);
  return vendorHits * VENDOR_WEIGHT + bodyVendorHits * BODY_VENDOR_WEIGHT + termHits;
}

export function classifyReceipt(
  vendor: string | null,
  items: ParsedReceiptItem[],
  lines: string[],
) {
  const vendorText = normalize(vendor ?? "");
  const bodyText = normalize([...lines, ...items.map((item) => item.name)].join(" "));

  let best: { categoryId: string; score: number } | null = null;
  for (const signals of CATEGORY_SIGNALS) {
    const score = scoreFor(signals, vendorText, bodyText);
    if (score >= MINIMUM_SCORE && (best === null || score > best.score)) {
      best = { categoryId: signals.categoryId, score };
    }
  }

  if (best === null) return null;
  return findCategory(best.categoryId) === null ? null : best.categoryId;
}
