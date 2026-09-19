import type { FilingType } from "@/src/data/domain.types";

export type FilingDefaults = {
  taxPeriodId?: string;
  filingType?: FilingType;
  amountFiled?: string;
};

export type FilingFormProps = {
  defaults: FilingDefaults;
};
