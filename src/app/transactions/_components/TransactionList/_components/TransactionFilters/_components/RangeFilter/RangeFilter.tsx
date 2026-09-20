"use client";

import { useState } from "react";
import { DatePicker } from "@/src/components/Calendar";
import { Select } from "@/src/components/Select";
import type { RangePresetId } from "@/src/lib/ranges";
import {
  CUSTOM_RANGE,
  RANGE_PRESETS,
  isRangeSet,
  matchRangePreset,
  resolveRangePreset,
} from "@/src/lib/ranges";
import { RangeDates } from "./RangeFilter.styles";
import type { RangeFilterProps } from "./RangeFilter.types";

const OPTIONS = [
  ...RANGE_PRESETS.map((preset) => ({ value: preset.id, label: preset.label })),
  { value: CUSTOM_RANGE, label: "Custom range" },
];

export function RangeFilter({ range, onChange }: RangeFilterProps) {
  const preset = isRangeSet(range) ? matchRangePreset(range) : "all";
  const [isCustom, setIsCustom] = useState(preset === null);

  function handlePreset(value: string) {
    if (value === CUSTOM_RANGE) {
      setIsCustom(true);
      return;
    }
    setIsCustom(false);
    onChange(resolveRangePreset(value as RangePresetId));
  }

  return (
    <>
      <Select
        label="Date range"
        placeholder="All time"
        value={isCustom || preset === null ? CUSTOM_RANGE : preset}
        options={OPTIONS}
        onChange={handlePreset}
      />
      {(isCustom || preset === null) && (
        <RangeDates>
          <DatePicker
            id="range-from"
            name="rangeFrom"
            variant="secondary"
            placeholder="From"
            value={range.from}
            onChange={(from) => onChange({ ...range, from })}
          />
          <DatePicker
            id="range-to"
            name="rangeTo"
            variant="secondary"
            placeholder="To"
            value={range.to}
            onChange={(to) => onChange({ ...range, to })}
          />
        </RangeDates>
      )}
    </>
  );
}
