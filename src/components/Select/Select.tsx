"use client";

import * as Select from "@radix-ui/react-select";
import { Icon } from "@/src/components/Icon";
import { ChipMenu, ChipOption, ChipTrigger } from "./SelectChip.styles";
import type { SelectChipProps } from "./SelectChip.types";

export function SelectChip({ label, value, placeholder, options, onChange }: SelectChipProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <ChipTrigger aria-label={label}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <Icon name="caretDown" size={16} />
        </Select.Icon>
      </ChipTrigger>
      <Select.Portal>
        <ChipMenu position="popper" sideOffset={8} align="start">
          <Select.Viewport>
            {options.map((option) => (
              <ChipOption key={option.value} value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
              </ChipOption>
            ))}
          </Select.Viewport>
        </ChipMenu>
      </Select.Portal>
    </Select.Root>
  );
}
