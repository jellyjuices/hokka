import { captureDocument } from "@/src/data/capture";
import type { Filing, TaxSettings, Transaction } from "@/src/data/domain.types";
import { getLocalSettings } from "@/src/data/local";
import { ensurePeriod, repository } from "@/src/data/repository";
import { newId } from "@/src/lib/platform/id";
import { currentPeriod } from "@/src/lib/periods";
import type { FilingDraft, LedgerActionsValue, TransactionDraft } from "./Ledger.types";

async function resolveTaxPeriodId(draft: TransactionDraft, settings: TaxSettings) {
  if (draft.taxPeriodId) return draft.taxPeriodId;
  const period = currentPeriod(settings.filingFrequency, draft.txnDate);
  await ensurePeriod(period);
  return period.id;
}

async function saveTransaction(draft: TransactionDraft): Promise<Transaction> {
  const settings = getLocalSettings();
  const transaction: Transaction = {
    ...draft,
    id: draft.id ?? newId(),
    taxPeriodId: await resolveTaxPeriodId(draft, settings),
  };
  return repository.saveTransaction(transaction);
}

async function saveFiling(draft: FilingDraft): Promise<Filing> {
  return repository.saveFiling({ ...draft, id: draft.id ?? newId() });
}

async function updateSettings(patch: Partial<TaxSettings>): Promise<TaxSettings> {
  return repository.saveSettings({ ...getLocalSettings(), ...patch });
}

function deleteTransaction(id: string) {
  return repository.deleteTransaction(id);
}

function closePeriod(id: string) {
  return repository.closePeriod(id);
}

export const ledgerActions: LedgerActionsValue = {
  saveTransaction,
  deleteTransaction,
  saveFiling,
  closePeriod,
  updateSettings,
  captureDocument,
};
