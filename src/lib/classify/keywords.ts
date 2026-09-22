import type { ParsedReceiptItem } from "@/src/lib/ocr/ocr.types";
import type { CategoryScore } from "./classify.types";
import { CATEGORY_SIGNALS, type CategorySignals } from "./keywords.registry";

const VENDOR_WEIGHT = 4;
const BODY_VENDOR_WEIGHT = 2;
const MAX_TERM_HITS = 3;
const CERTAIN_SCORE = 8;

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

export function receiptText(vendor: string | null, items: ParsedReceiptItem[], lines: string[]) {
  const body = [...lines, ...items.map((item) => item.name)].join(" ");
  return vendor === null ? body : `${vendor}. ${body}`;
}

export function keywordReading(
  vendor: string | null,
  items: ParsedReceiptItem[],
  lines: string[],
): { scores: CategoryScore[]; strength: number } {
  const vendorText = normalize(vendor ?? "");
  const bodyText = normalize([...lines, ...items.map((item) => item.name)].join(" "));

  const raw = CATEGORY_SIGNALS.map((signals) => ({
    categoryId: signals.categoryId,
    score: scoreFor(signals, vendorText, bodyText),
  }));

  const total = raw.reduce((running, entry) => running + entry.score, 0);
  if (total === 0) return { scores: [], strength: 0 };

  const peak = raw.reduce((running, entry) => Math.max(running, entry.score), 0);
  return {
    scores: raw.map((entry) => ({ categoryId: entry.categoryId, score: entry.score / total })),
    strength: Math.min(1, peak / CERTAIN_SCORE),
  };
}
