import { CATEGORIES } from "@/src/data/categories";
import { readValue, writeValue } from "@/src/lib/storage/keyval";
import { embedOne } from "./embedder";
import { CATEGORY_EXAMPLES } from "./prototypes.registry";

const PROTOTYPE_KEY = "classify.prototypes.v2";

type PrototypeCache = {
  signature: string;
  vectors: Record<string, number[][]>;
};

type SentenceGroup = { categoryId: string; sentences: string[] };

// A category is read as its example receipts plus the description a person sees in Settings.
function sentenceGroups(): SentenceGroup[] {
  return CATEGORIES.flatMap((category) => {
    const examples = CATEGORY_EXAMPLES[category.id];
    if (examples === undefined) return [];
    return [{ categoryId: category.id, sentences: [...examples, category.description] }];
  });
}

// Reword a sentence and the cached vectors must be thrown away, so the
// signature hashes the wording itself rather than its length.
function signatureOf(groups: SentenceGroup[]) {
  const text = groups.map((group) => `${group.categoryId}:${group.sentences.join("|")}`).join("|");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}

// One sentence per call, the way a receipt is embedded. The uint8 model quantises its
// activations per batch, so a sentence padded beside a longer one comes out shifted.
async function buildPrototypes(groups: SentenceGroup[]) {
  const vectors: Record<string, number[][]> = {};
  for (const { categoryId, sentences } of groups) {
    const list: number[][] = [];
    for (const sentence of sentences) {
      const vector = await embedOne(sentence);
      if (vector === null) return null;
      list.push(vector);
    }
    vectors[categoryId] = list;
  }
  return vectors;
}

let inFlight: Promise<Record<string, number[][]> | null> | null = null;

async function loadPrototypes() {
  const groups = sentenceGroups();
  const signature = signatureOf(groups);
  const cached = await readValue<PrototypeCache>(PROTOTYPE_KEY);
  if (cached !== null && cached.signature === signature) return cached.vectors;

  const vectors = await buildPrototypes(groups);
  if (vectors === null) return null;
  await writeValue(PROTOTYPE_KEY, { signature, vectors });
  return vectors;
}

export function categoryPrototypes() {
  if (inFlight === null) {
    inFlight = loadPrototypes().catch(() => {
      inFlight = null;
      return null;
    });
  }
  return inFlight;
}
