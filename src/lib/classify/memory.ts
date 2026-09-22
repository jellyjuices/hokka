import { readValue, writeValue } from "@/src/lib/storage/keyval";
import type { CategoryScore, Recollection } from "./classify.types";
import { embedOne } from "./embedder";
import { cosine } from "./vectors";

const MEMORY_KEY = "classify.memory.v1";
const MEMORY_LIMIT = 150;
const NEIGHBOURS = 5;
const PRECISION = 1000;
// Two unrelated receipts still sit around 0.5 cosine, so only the gap above that carries weight.
const NEAR_FLOOR = 0.55;

function compact(vector: number[]) {
  return vector.map((value) => Math.round(value * PRECISION) / PRECISION);
}

async function readMemory() {
  return (await readValue<Recollection[]>(MEMORY_KEY)) ?? [];
}

export async function rememberCategory(text: string, categoryId: string) {
  const vector = await embedOne(text);
  if (vector === null) return;
  const entry: Recollection = {
    categoryId,
    vector: compact(vector),
    savedAt: new Date().toISOString(),
  };
  const kept = [entry, ...(await readMemory())].slice(0, MEMORY_LIMIT);
  await writeValue(MEMORY_KEY, kept);
}

export async function forgetCategories() {
  await writeValue(MEMORY_KEY, []);
}

export async function recallReading(
  vector: number[],
): Promise<{ scores: CategoryScore[]; strength: number }> {
  const memory = await readMemory();
  if (memory.length === 0) return { scores: [], strength: 0 };

  const neighbours = memory
    .map((entry) => ({ categoryId: entry.categoryId, score: cosine(vector, entry.vector) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, NEIGHBOURS);

  const totals = new Map<string, number>();
  for (const neighbour of neighbours) {
    const weight = Math.max(0, neighbour.score);
    totals.set(neighbour.categoryId, (totals.get(neighbour.categoryId) ?? 0) + weight);
  }

  const sum = [...totals.values()].reduce((running, weight) => running + weight, 0);
  if (sum === 0) return { scores: [], strength: 0 };

  return {
    scores: [...totals].map(([categoryId, weight]) => ({ categoryId, score: weight / sum })),
    strength: Math.max(0, Math.min(1, (neighbours[0].score - NEAR_FLOOR) / (1 - NEAR_FLOOR))),
  };
}
