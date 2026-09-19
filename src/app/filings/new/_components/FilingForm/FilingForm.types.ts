import type { FilingType } from "@/src/data/domain.types";

export type FilingDefaults = {
  taxPeriodId?: string;
  filingType?: FilingType;
  amountFiled?: string;
};

export type FilingFormProps = {
  defaults: FilingDefaults;
};

export type FilingFormState = {
  filingType: FilingType;
  taxPeriodId: string;
  filedDate: string;
  amountFiled: string;
  referenceNumber: string;
  notes: string;
};
