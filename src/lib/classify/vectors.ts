import type { CategoryScore } from "./classify.types";

export function cosine(left: number[], right: number[]) {
  let dot = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
  }
  return dot;
}

export function normalize(vector: number[]) {
  const length = Math.sqrt(cosine(vector, vector));
  if (length === 0) return vector;
  return vector.map((value) => value / length);
}

export function softmax(scores: CategoryScore[], temperature: number) {
  const scaled = scores.map((entry) => entry.score / temperature);
  const peak = Math.max(...scaled);
  const weights = scaled.map((value) => Math.exp(value - peak));
  const sum = weights.reduce((running, weight) => running + weight, 0);
  return scores.map((entry, index) => ({
    categoryId: entry.categoryId,
    score: weights[index] / sum,
  }));
}

export function bestOf(scores: CategoryScore[]) {
  return scores.reduce<CategoryScore | null>(
    (best, entry) => (best === null || entry.score > best.score ? entry : best),
    null,
  );
}
