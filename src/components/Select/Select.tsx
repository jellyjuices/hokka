"use client";

import { useState } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { ChoiceTakeover, useTakeover } from "@/src/components/Takeover";
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
  const { isPopoverOpen, isTakeoverOpen, setIsOpen } = useTakeover();
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value ?? internal;

  function commit(next: string) {
    setInternal(next);
    onChange?.(next);
  }

  return (
    <RadixSelect.Root
      name={name}
      value={current}
      open={isPopoverOpen}
      onOpenChange={setIsOpen}
      onValueChange={commit}
    >
      <SelectTrigger id={id} aria-label={label} $variant={variant} {...pointerFocus}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <Icon name={CaretDownIcon} size={16} />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectMenu position="popper" sideOffset={8} align="start" collisionPadding={16}>
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
      <ChoiceTakeover
        open={isTakeoverOpen}
        onOpenChange={setIsOpen}
        title={label}
        value={current}
        options={options}
        onConfirm={commit}
      />
    </RadixSelect.Root>
  );
}
