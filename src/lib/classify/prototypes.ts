import { readValue, writeValue } from "@/src/lib/storage/keyval";
import { embed } from "./embedder";

const PROTOTYPE_KEY = "classify.prototypes.v1";

type PrototypeCache = {
  signature: string;
  vectors: Record<string, number[]>;
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  client_work:
    "An invoice billed to a client for design, development or consulting work delivered by the business.",
  software:
    "A recurring charge for an online tool, app, SaaS plan, seat licence, domain name, API usage or cloud compute, billed monthly or yearly and renewing automatically.",
  hardware:
    "A physical device or accessory: a laptop, monitor, keyboard with switches and keycaps, mouse, headphones, drive, dock, cable or charger.",
  home_office:
    "A desk, chair, shelf, lamp, binder, stationery or printer paper, or a bill for home internet, hydro or heating.",
  travel:
    "A flight, train, taxi, rideshare, fuel fill-up, parking, transit fare, car rental or hotel stay taken for work.",
  meals:
    "A restaurant, cafe, coffee shop, bar, food delivery or catering bill, with a server, table, tip or menu items.",
  professional:
    "A fee charged by a lawyer, accountant, bookkeeper, notary, insurance broker or professional association.",
};

// Reword a description and the cached vectors must be thrown away, so the
// signature hashes the wording itself rather than its length.
function signatureOf() {
  const text = Object.entries(CATEGORY_DESCRIPTIONS)
    .map(([categoryId, description]) => `${categoryId}:${description}`)
    .join("|");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}

async function buildPrototypes(): Promise<Record<string, number[]> | null> {
  const categoryIds = Object.keys(CATEGORY_DESCRIPTIONS);
  const vectors = await embed(categoryIds.map((id) => CATEGORY_DESCRIPTIONS[id]));
  if (vectors === null) return null;
  return Object.fromEntries(categoryIds.map((id, index) => [id, vectors[index]]));
}

let inFlight: Promise<Record<string, number[]> | null> | null = null;

async function loadPrototypes() {
  const signature = signatureOf();
  const cached = await readValue<PrototypeCache>(PROTOTYPE_KEY);
  if (cached !== null && cached.signature === signature) return cached.vectors;

  const vectors = await buildPrototypes();
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
