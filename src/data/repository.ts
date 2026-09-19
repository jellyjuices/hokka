import {
  enqueueOp,
  getLocalRecord,
  getLocalSettings,
  getLocalSnapshot,
  hydrateLocalStore,
  hydrateOutbox,
  putLocalRecord,
  putLocalSettings,
  removeLocalRecord,
} from "./local";
import type { TaxPeriod } from "./domain.types";
import type { Repository } from "./repository.types";

export { DEFAULT_SETTINGS } from "./defaults";

export function hydrateRepository() {
  return Promise.all([hydrateLocalStore(), hydrateOutbox()]).then(() => undefined);
}

export const repository: Repository = {
  listTransactions: async (taxPeriodId) => {
    await hydrateRepository();
    return getLocalSnapshot().transactions.filter(
      (transaction) => transaction.taxPeriodId === taxPeriodId,
    );
  },

  getTransaction: async (id) => {
    await hydrateRepository();
    return getLocalRecord("transactions", id);
  },

  saveTransaction: async (transaction) => {
    await hydrateRepository();
    await putLocalRecord("transactions", transaction);
    await enqueueOp("transaction", "upsert", transaction.id);
    return transaction;
  },

  deleteTransaction: async (id) => {
    await hydrateRepository();
    await removeLocalRecord("transactions", id);
    await enqueueOp("transaction", "delete", id);
  },

  listPeriods: async () => {
    await hydrateRepository();
    return getLocalSnapshot().periods;
  },

  closePeriod: async (id) => {
    await hydrateRepository();
    const period = getLocalRecord("periods", id);
    if (!period) throw new Error(`Unknown tax period: ${id}`);
    const filed: TaxPeriod = { ...period, status: "filed" };
    await putLocalRecord("periods", filed);
    await enqueueOp("period", "upsert", filed.id);
    return filed;
  },

  listFilings: async (taxPeriodId) => {
    await hydrateRepository();
    return getLocalSnapshot().filings.filter((filing) => filing.taxPeriodId === taxPeriodId);
  },

  saveFiling: async (filing) => {
    await hydrateRepository();
    await putLocalRecord("filings", filing);
    await enqueueOp("filing", "upsert", filing.id);
    return filing;
  },

  listDocuments: async () => {
    await hydrateRepository();
    return getLocalSnapshot().documents;
  },

  saveDocument: async (document) => {
    await hydrateRepository();
    await putLocalRecord("documents", document);
    await enqueueOp("document", "upsert", document.id);
    return document;
  },

  getSettings: async () => {
    await hydrateRepository();
    return getLocalSettings();
  },

  saveSettings: async (settings) => {
    await hydrateRepository();
    await putLocalSettings(settings);
    await enqueueOp("settings", "upsert", settings.id);
    return settings;
  },
};

export async function savePeriod(period: TaxPeriod) {
  await hydrateRepository();
  await putLocalRecord("periods", period);
  await enqueueOp("period", "upsert", period.id);
  return period;
}

export async function ensurePeriod(period: TaxPeriod) {
  await hydrateRepository();
  if (getLocalRecord("periods", period.id)) return;
  await savePeriod(period);
}
