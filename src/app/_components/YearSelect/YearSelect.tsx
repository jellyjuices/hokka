"use client";

import * as Select from "@radix-ui/react-select";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { ChoiceTakeover, useTakeover } from "@/src/components/Takeover";
import { YearIcon, YearMenu, YearOption, YearTrigger } from "./YearSelect.styles";
import type { YearSelectProps } from "./YearSelect.types";

export function YearSelect({ value, years, onChange }: YearSelectProps) {
  const { isPopoverOpen, isTakeoverOpen, setIsOpen } = useTakeover();

  return (
    <Select.Root
      value={String(value)}
      open={isPopoverOpen}
      onOpenChange={setIsOpen}
      onValueChange={(next) => onChange(Number(next))}
    >
      <YearTrigger aria-label="Tax year">
        <Select.Value />
        <YearIcon>
          <Icon name={CaretDownIcon} size={18} />
        </YearIcon>
      </YearTrigger>
      <Select.Portal>
        <YearMenu position="popper" sideOffset={8} collisionPadding={16}>
          <Select.Viewport>
            {years.map((year) => (
              <YearOption key={year} value={String(year)}>
                <Select.ItemText>{year}</Select.ItemText>
              </YearOption>
            ))}
          </Select.Viewport>
        </YearMenu>
      </Select.Portal>
      <ChoiceTakeover
        open={isTakeoverOpen}
        onOpenChange={setIsOpen}
        title="Tax year"
        value={String(value)}
        options={years.map((year) => ({ value: String(year), label: String(year) }))}
        onConfirm={(next) => onChange(Number(next))}
      />
    </Select.Root>
  );
}
