import { findCategory } from "@/src/data/categories";
import type { ParsedReceiptItem } from "@/src/lib/ocr/ocr.types";
import type { CategoryGuess, CategoryScore } from "./classify.types";
import { embedOne } from "./embedder";
import { keywordReading, receiptText } from "./keywords";
import { recallReading } from "./memory";
import { categoryPrototypes } from "./prototypes";
import { bestOf, cosine, softmax } from "./vectors";

// DECISION: cosine gaps between receipt wordings are narrow, so a low temperature
// is what turns them into a usable spread. Tune against real receipts, not guesses.
const TEMPERATURE = 0.07;
const MINIMUM_CONFIDENCE = 0.45;

// A remembered correction outweighs a keyword hit, which outweighs a description match.
const KEYWORD_WEIGHT = 1;
const PROTOTYPE_WEIGHT = 0.8;
const MEMORY_WEIGHT = 1.4;

type Source = { scores: CategoryScore[]; weight: number };

function blend(sources: Source[]): CategoryScore[] {
  const totals = new Map<string, number>();
  let weighed = 0;

  for (const source of sources) {
    if (source.weight <= 0 || source.scores.length === 0) continue;
    weighed += source.weight;
    for (const entry of source.scores) {
      totals.set(
        entry.categoryId,
        (totals.get(entry.categoryId) ?? 0) + entry.score * source.weight,
      );
    }
  }

  if (weighed === 0) return [];
  return [...totals].map(([categoryId, score]) => ({ categoryId, score: score / weighed }));
}

async function prototypeReading(vector: number[]) {
  const prototypes = await categoryPrototypes();
  if (prototypes === null) return { scores: [], strength: 0 };

  const raw = Object.entries(prototypes).map(([categoryId, prototype]) => ({
    categoryId,
    score: cosine(vector, prototype),
  }));
  const scores = softmax(raw, TEMPERATURE);
  return { scores, strength: bestOf(scores)?.score ?? 0 };
}

async function vectorSources(vector: number[]): Promise<Source[]> {
  const [prototype, memory] = await Promise.all([prototypeReading(vector), recallReading(vector)]);
  return [
    { scores: prototype.scores, weight: PROTOTYPE_WEIGHT * prototype.strength },
    { scores: memory.scores, weight: MEMORY_WEIGHT * memory.strength },
  ];
}

export async function guessCategory(
  vendor: string | null,
  items: ParsedReceiptItem[],
  lines: string[],
): Promise<CategoryGuess | null> {
  const keyword = keywordReading(vendor, items, lines);
  const vector = await embedOne(receiptText(vendor, items, lines));

  const fromKeywords = { scores: keyword.scores, weight: KEYWORD_WEIGHT * keyword.strength };
  const sources =
    vector === null ? [fromKeywords] : [fromKeywords, ...(await vectorSources(vector))];

  const best = bestOf(blend(sources));
  if (best === null || best.score < MINIMUM_CONFIDENCE) return null;
  if (findCategory(best.categoryId) === null) return null;
  return { categoryId: best.categoryId, confidence: Math.round(best.score * 100) / 100 };
}
