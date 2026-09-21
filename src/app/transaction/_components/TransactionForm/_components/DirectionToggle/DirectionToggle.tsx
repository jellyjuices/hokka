"use client";

import { CoinsIcon, HandCoinsIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon, type IconName } from "@/src/components/Icon";
import type { TransactionDirection } from "@/src/data/domain.types";
import { ToggleOption, ToggleTrack } from "./DirectionToggle.styles";
import type { DirectionToggleProps } from "./DirectionToggle.types";

const OPTIONS: { direction: TransactionDirection; label: string; icon: IconName }[] = [
  { direction: "expense", label: "Expense", icon: CoinsIcon },
  { direction: "income", label: "Invoice", icon: HandCoinsIcon },
];

export function DirectionToggle({ value, onChange }: DirectionToggleProps) {
  return (
    <ToggleTrack role="radiogroup" aria-label="Transaction type">
      {OPTIONS.map((option) => (
        <ToggleOption
          key={option.direction}
          type="button"
          role="radio"
          aria-checked={value === option.direction}
          $isSelected={value === option.direction}
          onClick={() => onChange(option.direction)}
        >
          <Icon
            name={option.icon}
            size={22}
            weight={value === option.direction ? "fill" : "regular"}
          />
          {option.label}
        </ToggleOption>
      ))}
    </ToggleTrack>
  );
}
