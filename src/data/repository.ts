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
import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "./domain.types";
import type { Repository } from "./repository.types";

export { DEFAULT_SETTINGS } from "./defaults";

export function hydrateRepository() {
  return Promise.all([hydrateLocalStore(), hydrateOutbox()]).then(() => undefined);
}

function hydrated<Args extends unknown[], Result>(run: (...args: Args) => Result) {
  return async (...args: Args): Promise<Awaited<Result>> => {
    await hydrateRepository();
    return await run(...args);
  };
}

export const repository: Repository = {
  listTransactions: hydrated((taxPeriodId: string) =>
    getLocalSnapshot().transactions.filter(
      (transaction) => transaction.taxPeriodId === taxPeriodId,
    ),
  ),

  getTransaction: hydrated((id: string) => getLocalRecord("transactions", id)),

  saveTransaction: hydrated(async (transaction: Transaction) => {
    await putLocalRecord("transactions", transaction);
    await enqueueOp("transaction", "upsert", transaction.id);
    return transaction;
  }),

  deleteTransaction: hydrated(async (id: string) => {
    await removeLocalRecord("transactions", id);
    await enqueueOp("transaction", "delete", id);
  }),

  listPeriods: hydrated(() => getLocalSnapshot().periods),

  closePeriod: hydrated(async (id: string) => {
    const period = getLocalRecord("periods", id);
    if (!period) throw new Error(`Unknown tax period: ${id}`);
    const filed: TaxPeriod = { ...period, status: "filed" };
    await putLocalRecord("periods", filed);
    await enqueueOp("period", "upsert", filed.id);
    return filed;
  }),

  listFilings: hydrated((taxPeriodId: string) =>
    getLocalSnapshot().filings.filter((filing) => filing.taxPeriodId === taxPeriodId),
  ),

  saveFiling: hydrated(async (filing: Filing) => {
    await putLocalRecord("filings", filing);
    await enqueueOp("filing", "upsert", filing.id);
    return filing;
  }),

  listDocuments: hydrated(() => getLocalSnapshot().documents),

  saveDocument: hydrated(async (document: StoredDocument) => {
    await putLocalRecord("documents", document);
    await enqueueOp("document", "upsert", document.id);
    return document;
  }),

  getSettings: hydrated(() => getLocalSettings()),

  saveSettings: hydrated(async (settings: TaxSettings) => {
    await putLocalSettings(settings);
    await enqueueOp("settings", "upsert", settings.id);
    return settings;
  }),
};

export const savePeriod = hydrated(async (period: TaxPeriod) => {
  await putLocalRecord("periods", period);
  await enqueueOp("period", "upsert", period.id);
  return period;
});

export const ensurePeriod = hydrated(async (period: TaxPeriod) => {
  if (getLocalRecord("periods", period.id)) return;
  await savePeriod(period);
});
