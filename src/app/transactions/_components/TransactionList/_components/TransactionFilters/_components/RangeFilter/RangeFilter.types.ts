import type { DateRange } from "@/src/lib/ranges";

export type RangeFilterProps = {
  range: DateRange;
  onChange: (range: DateRange) => void;
};
