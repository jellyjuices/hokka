import type { ParsedReceiptItem } from "@/src/lib/ocr/ocr.types";
import type { CategoryScore } from "./classify.types";
import { CATEGORY_SIGNALS } from "./keywords.registry";

const VENDOR_WEIGHT = 4;
const BODY_VENDOR_WEIGHT = 2;
const MAX_TERM_HITS = 3;
const CERTAIN_SCORE = 8;

type Needle = { categoryId: string; phrase: string; isVendor: boolean };

function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

function phrases(list: string) {
  return list
    .split(/[,\n]/)
    .map((phrase) => normalize(phrase).trim())
    .filter((phrase) => phrase !== "");
}

// Longest first, and a match is cut out of the text once counted, so "uber eats" is read as
// a meal before "uber" can claim it as a ride, and a coworking "hot desk" never counts as a desk.
const NEEDLES: Needle[] = CATEGORY_SIGNALS.flatMap(({ categoryId, vendors, terms }) => [
  ...phrases(vendors).map((phrase) => ({ categoryId, phrase, isVendor: true })),
  ...phrases(terms).map((phrase) => ({ categoryId, phrase, isVendor: false })),
]).sort((left, right) => right.phrase.length - left.phrase.length);

function cut(text: string, phrase: string) {
  for (const form of [` ${phrase} `, ` ${phrase}s `]) {
    if (text.includes(form)) return text.replace(form, " ");
  }
  return null;
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
  let vendorText = normalize(vendor ?? "");
  let bodyText = normalize([...lines, ...items.map((item) => item.name)].join(" "));
  const points = new Map<string, number>();
  const termHits = new Map<string, number>();

  for (const { categoryId, phrase, isVendor } of NEEDLES) {
    let gained = 0;
    const vendorRest = isVendor ? cut(vendorText, phrase) : null;
    if (vendorRest !== null) {
      vendorText = vendorRest;
      gained += VENDOR_WEIGHT;
    }
    const bodyRest = cut(bodyText, phrase);
    if (bodyRest !== null) {
      bodyText = bodyRest;
      const hits = termHits.get(categoryId) ?? 0;
      if (isVendor) gained += BODY_VENDOR_WEIGHT;
      else if (hits < MAX_TERM_HITS) {
        termHits.set(categoryId, hits + 1);
        gained += 1;
      }
    }
    if (gained > 0) points.set(categoryId, (points.get(categoryId) ?? 0) + gained);
  }

  const total = [...points.values()].reduce((running, score) => running + score, 0);
  if (total === 0) return { scores: [], strength: 0 };

  const peak = Math.max(...points.values());
  return {
    scores: [...points].map(([categoryId, score]) => ({ categoryId, score: score / total })),
    strength: Math.min(1, peak / CERTAIN_SCORE),
  };
}
