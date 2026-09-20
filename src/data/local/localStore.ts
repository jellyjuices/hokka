import { createSubscribers } from "@/src/lib/platform/subscribers";
import { readValue, writeValue } from "@/src/lib/storage/keyval";
import { DEFAULT_SETTINGS } from "../defaults";
import type { TaxSettings } from "../domain.types";
import type {
  LocalCollectionName,
  LocalMergeBatch,
  LocalRecordMap,
  LocalSnapshot,
  LocalTables,
} from "./localStore.types";

const COLLECTION_KEYS: Record<LocalCollectionName, string> = {
  transactions: "ledger.transactions.v1",
  filings: "ledger.filings.v1",
  periods: "ledger.periods.v1",
  documents: "ledger.documents.v1",
};

const SETTINGS_KEY = "ledger.settings.v1";
const COLLECTION_NAMES = Object.keys(COLLECTION_KEYS) as LocalCollectionName[];

function emptyTables(): LocalTables {
  return { transactions: {}, filings: {}, periods: {}, documents: {} };
}

export const EMPTY_SNAPSHOT: LocalSnapshot = {
  transactions: [],
  filings: [],
  periods: [],
  documents: [],
  settings: DEFAULT_SETTINGS,
  isHydrated: false,
};

let tables = emptyTables();
let settings = DEFAULT_SETTINGS;
let snapshot = EMPTY_SNAPSHOT;
let hydration: Promise<void> | null = null;
const subscribers = createSubscribers();

function byDateDescending(left: string, right: string) {
  return right.localeCompare(left);
}

function resort(collection: LocalCollectionName, into: LocalSnapshot) {
  switch (collection) {
    case "transactions":
      into.transactions = Object.values(tables.transactions).sort((a, b) =>
        byDateDescending(a.txnDate, b.txnDate),
      );
      return;
    case "filings":
      into.filings = Object.values(tables.filings).sort((a, b) =>
        byDateDescending(a.filedDate, b.filedDate),
      );
      return;
    case "periods":
      into.periods = Object.values(tables.periods).sort((a, b) =>
        a.startDate.localeCompare(b.startDate),
      );
      return;
    case "documents":
      into.documents = Object.values(tables.documents).sort((a, b) =>
        byDateDescending(a.uploadedAt, b.uploadedAt),
      );
  }
}

function tableFor<Name extends LocalCollectionName>(collection: Name) {
  return tables[collection] as Record<string, LocalRecordMap[Name]>;
}

function publish(changed: LocalCollectionName[] = COLLECTION_NAMES) {
  const next: LocalSnapshot = { ...snapshot, settings, isHydrated: true };
  for (const collection of changed) resort(collection, next);
  snapshot = next;
  subscribers.publish();
}

async function persist(collection: LocalCollectionName) {
  await writeValue(COLLECTION_KEYS[collection], tables[collection]);
}

export function getLocalSnapshot() {
  return snapshot;
}

export function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function subscribeLocalStore(listener: () => void) {
  subscribers.add(listener);
  return () => {
    subscribers.remove(listener);
  };
}

export function hydrateLocalStore(): Promise<void> {
  if (!hydration) {
    hydration = (async () => {
      const loaded = emptyTables();
      await Promise.all(
        COLLECTION_NAMES.map(async (collection) => {
          const stored = await readValue<Record<string, never>>(COLLECTION_KEYS[collection]);
          if (stored) Object.assign(loaded[collection], stored);
        }),
      );
      tables = loaded;

      settings = { ...DEFAULT_SETTINGS, ...((await readValue<TaxSettings>(SETTINGS_KEY)) ?? {}) };
      publish();
    })();
  }
  return hydration;
}

export async function putLocalRecord<Name extends LocalCollectionName>(
  collection: Name,
  record: LocalRecordMap[Name],
) {
  tableFor(collection)[record.id] = record;
  publish([collection]);
  await persist(collection);
}

export async function removeLocalRecord(collection: LocalCollectionName, id: string) {
  if (!(id in tables[collection])) return;
  delete tables[collection][id];
  publish([collection]);
  await persist(collection);
}

export async function mergeLocalBatch(batches: LocalMergeBatch[]) {
  const changed: LocalCollectionName[] = [];

  for (const batch of batches) {
    if (batch.incoming.length === 0 && batch.removedIds.length === 0) continue;
    const table = tableFor(batch.collection);
    for (const record of batch.incoming) table[record.id] = record;
    for (const id of batch.removedIds) delete table[id];
    changed.push(batch.collection);
  }

  if (changed.length === 0) return;
  publish(changed);
  await Promise.all(changed.map(persist));
}

export async function putLocalSettings(next: TaxSettings) {
  settings = next;
  publish([]);
  await writeValue(SETTINGS_KEY, next);
}

export function getLocalRecord<Name extends LocalCollectionName>(
  collection: Name,
  id: string,
): LocalRecordMap[Name] | null {
  return tableFor(collection)[id] ?? null;
}

export function getLocalSettings() {
  return settings;
}
