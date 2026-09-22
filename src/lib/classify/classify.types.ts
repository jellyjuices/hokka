export type CategoryGuess = {
  categoryId: string;
  confidence: number;
};

export type CategoryScore = {
  categoryId: string;
  score: number;
};

export type Recollection = {
  categoryId: string;
  vector: number[];
  savedAt: string;
};
