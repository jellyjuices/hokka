"use client";

import * as Select from "@radix-ui/react-select";
import { CaretDownIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { ChoiceTakeover, useTakeover } from "@/src/components/Takeover";
import { usePointerFocus } from "@/src/hooks";
import {
  CategoryMenu,
  CategoryOption,
  CategoryGlyph,
  CategoryTrigger,
  TriggerGlyph,
  TriggerIcon,
} from "./CategoryPicker.styles";
import type { CategoryPickerProps } from "./CategoryPicker.types";

export function CategoryPicker({ value, categories, onChange }: CategoryPickerProps) {
  const selected = categories.find((category) => category.id === value) ?? null;
  const pointerFocus = usePointerFocus();
  const { isPopoverOpen, isTakeoverOpen, setIsOpen } = useTakeover();

  return (
    <Select.Root
      value={value}
      open={isPopoverOpen}
      onOpenChange={setIsOpen}
      onValueChange={onChange}
    >
      <CategoryTrigger aria-label="Category" $color={selected?.color ?? null} {...pointerFocus}>
        {selected === null ? null : (
          <TriggerGlyph aria-hidden>
            <Icon name={selected.icon} size={18} weight="fill" />
          </TriggerGlyph>
        )}
        <Select.Value placeholder="Category" />
        <TriggerIcon>
          <Icon name={value === "" ? PlusIcon : CaretDownIcon} size={18} />
        </TriggerIcon>
      </CategoryTrigger>
      <Select.Portal>
        <CategoryMenu position="popper" sideOffset={8} align="start" collisionPadding={16}>
          <Select.Viewport>
            {categories.map((category) => (
              <CategoryOption key={category.id} value={category.id} $color={category.color}>
                <CategoryGlyph $color={category.color} aria-hidden>
                  <Icon name={category.icon} size={16} weight="fill" />
                </CategoryGlyph>
                <Select.ItemText>{category.label}</Select.ItemText>
              </CategoryOption>
            ))}
          </Select.Viewport>
        </CategoryMenu>
      </Select.Portal>
      <ChoiceTakeover
        open={isTakeoverOpen}
        onOpenChange={setIsOpen}
        title="Category"
        value={value}
        options={categories.map((category) => ({
          value: category.id,
          label: category.label,
          leading: (
            <CategoryGlyph $color={category.color} aria-hidden>
              <Icon name={category.icon} size={18} weight="fill" />
            </CategoryGlyph>
          ),
        }))}
        onConfirm={onChange}
      />
    </Select.Root>
  );
}
