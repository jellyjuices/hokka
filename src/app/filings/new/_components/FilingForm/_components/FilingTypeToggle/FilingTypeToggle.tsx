"use client";

import { ArrowElbowDownRightIcon, PiggyBankIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon, type IconName } from "@/src/components/Icon";
import type { FilingType } from "@/src/data/domain.types";
import { ToggleOption, ToggleTrack } from "./FilingTypeToggle.styles";
import type { FilingTypeToggleProps } from "./FilingTypeToggle.types";

const OPTIONS: { filingType: FilingType; label: string; icon: IconName }[] = [
  { filingType: "hst", label: "HST", icon: ArrowElbowDownRightIcon },
  { filingType: "income_tax", label: "Income tax", icon: PiggyBankIcon },
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
