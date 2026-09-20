"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { usePointerFocus } from "@/src/hooks";
import { SelectMenu, SelectOptionRow, SelectTick, SelectTrigger } from "./Select.styles";
import type { SelectProps } from "./Select.types";

export function Select({
  label,
  options,
  id,
  name,
  value,
  defaultValue,
  placeholder,
  variant = "primary",
  onChange,
}: SelectProps) {
  const pointerFocus = usePointerFocus();

  return (
    <RadixSelect.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
      <SelectTrigger id={id} aria-label={label} $variant={variant} {...pointerFocus}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <Icon name={CaretDownIcon} size={16} />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectMenu position="popper" sideOffset={8} align="start">
          <RadixSelect.Viewport>
            {options.map((option) => (
              <SelectOptionRow key={option.value} value={option.value}>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <SelectTick>
                  <Icon name={CheckIcon} size={16} />
                </SelectTick>
              </SelectOptionRow>
            ))}
          </RadixSelect.Viewport>
        </SelectMenu>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
