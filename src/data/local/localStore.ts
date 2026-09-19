import { readValue, writeValue } from "@/src/lib/storage/keyval";
import { DEFAULT_SETTINGS } from "../defaults";
import type { TaxSettings } from "../domain.types";
import type {
  LocalCollectionName,
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
const listeners = new Set<() => void>();

function byDateDescending(left: string, right: string) {
  return right.localeCompare(left);
}

function buildSnapshot(isHydrated: boolean): LocalSnapshot {
  return {
    transactions: Object.values(tables.transactions).sort((a, b) =>
      byDateDescending(a.txnDate, b.txnDate),
    ),
    filings: Object.values(tables.filings).sort((a, b) =>
      byDateDescending(a.filedDate, b.filedDate),
    ),
    periods: Object.values(tables.periods).sort((a, b) => a.startDate.localeCompare(b.startDate)),
    documents: Object.values(tables.documents).sort((a, b) =>
      byDateDescending(a.uploadedAt, b.uploadedAt),
    ),
    settings,
    isHydrated,
  };
}

function tableFor<Name extends LocalCollectionName>(collection: Name) {
  return tables[collection] as Record<string, LocalRecordMap[Name]>;
}

function publish() {
  snapshot = buildSnapshot(true);
  for (const listener of listeners) listener();
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
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
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
      settings = (await readValue<TaxSettings>(SETTINGS_KEY)) ?? DEFAULT_SETTINGS;
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
  publish();
  await persist(collection);
}

export async function removeLocalRecord(collection: LocalCollectionName, id: string) {
  if (!(id in tables[collection])) return;
  delete tables[collection][id];
  publish();
  await persist(collection);
}

export async function mergeLocalRecords<Name extends LocalCollectionName>(
  collection: Name,
  incoming: LocalRecordMap[Name][],
  removedIds: string[],
) {
  if (incoming.length === 0 && removedIds.length === 0) return;
  const table = tableFor(collection);
  for (const record of incoming) table[record.id] = record;
  for (const id of removedIds) delete table[id];
  publish();
  await persist(collection);
}

export async function putLocalSettings(next: TaxSettings) {
  settings = next;
  publish();
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
