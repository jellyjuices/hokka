"use client";

import * as Select from "@radix-ui/react-select";
import { Icon } from "@/src/components/Icon";
import * as styles from "./YearSelect.styles";
import type { YearSelectProps } from "./YearSelect.types";

export function YearSelect({ value, years, onChange }: YearSelectProps) {
  return (
    <Select.Root value={String(value)} onValueChange={(next) => onChange(Number(next))}>
      <styles.Trigger aria-label="Tax year">
        <Select.Value />
        <Select.Icon>
          <Icon name="caretDown" size={18} />
        </Select.Icon>
      </styles.Trigger>
      <Select.Portal>
        <styles.Content position="popper" sideOffset={8}>
          <Select.Viewport>
            {years.map((year) => (
              <styles.Option key={year} value={String(year)}>
                <Select.ItemText>{year}</Select.ItemText>
              </styles.Option>
            ))}
          </Select.Viewport>
        </styles.Content>
      </Select.Portal>
    </Select.Root>
  );
}
