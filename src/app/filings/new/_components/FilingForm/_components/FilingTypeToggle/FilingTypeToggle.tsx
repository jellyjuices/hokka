"use client";

import { Icon } from "@/src/components/Icon";
import type { FilingType } from "@/src/data/domain.types";
import { ToggleOption, ToggleTrack } from "./FilingTypeToggle.styles";
import type { FilingTypeToggleProps } from "./FilingTypeToggle.types";

const OPTIONS: { filingType: FilingType; label: string; icon: "claim" | "reserve" }[] = [
  { filingType: "hst", label: "HST", icon: "claim" },
  { filingType: "income_tax", label: "Income tax", icon: "reserve" },
];

export function FilingTypeToggle({ value, onChange }: FilingTypeToggleProps) {
  return (
    <ToggleTrack role="radiogroup" aria-label="Filing type">
      {OPTIONS.map((option) => (
        <ToggleOption
          key={option.filingType}
          type="button"
          role="radio"
          aria-checked={value === option.filingType}
          $isSelected={value === option.filingType}
          onClick={() => onChange(option.filingType)}
        >
          <Icon
            name={option.icon}
            size={22}
            weight={value === option.filingType ? "fill" : "regular"}
          />
          {option.label}
        </ToggleOption>
      ))}
    </ToggleTrack>
  );
}
