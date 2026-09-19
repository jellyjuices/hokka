"use client";

import * as Select from "@radix-ui/react-select";
import { Icon } from "@/src/components/Icon";
import { YearMenu, YearOption, YearTrigger } from "./YearSelect.styles";
import type { YearSelectProps } from "./YearSelect.types";

export function YearSelect({ value, years, onChange }: YearSelectProps) {
  return (
    <Select.Root value={String(value)} onValueChange={(next) => onChange(Number(next))}>
      <YearTrigger aria-label="Tax year">
        <Select.Value />
        <Select.Icon>
          <Icon name="caretDown" size={18} />
        </Select.Icon>
      </YearTrigger>
      <Select.Portal>
        <YearMenu position="popper" sideOffset={8}>
          <Select.Viewport>
            {years.map((year) => (
              <YearOption key={year} value={String(year)}>
                <Select.ItemText>{year}</Select.ItemText>
              </YearOption>
            ))}
          </Select.Viewport>
        </YearMenu>
      </Select.Portal>
    </Select.Root>
  );
}
