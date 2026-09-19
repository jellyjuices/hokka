import type { FilingType } from "@/src/data/domain.types";

export type FilingTypeToggleProps = {
  value: FilingType;
  onChange: (filingType: FilingType) => void;
};
