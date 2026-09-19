"use client";

import * as Select from "@radix-ui/react-select";
import { Icon } from "@/src/components/Icon";
import { usePointerFocus } from "@/src/hooks";
import {
  CategoryMenu,
  CategoryOption,
  CategorySwatch,
  CategoryTrigger,
  TriggerIcon,
} from "./CategoryPicker.styles";
import type { CategoryPickerProps } from "./CategoryPicker.types";

export function CategoryPicker({ value, categories, onChange }: CategoryPickerProps) {
  const selected = categories.find((category) => category.id === value) ?? null;
  const pointerFocus = usePointerFocus();

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <CategoryTrigger aria-label="Category" $color={selected?.color ?? null} {...pointerFocus}>
        {selected === null ? null : <CategorySwatch $color={selected.color} aria-hidden />}
        <Select.Value placeholder="Category" />
        <TriggerIcon>
          <Icon name={value === "" ? "plus" : "caretDown"} size={18} />
        </TriggerIcon>
      </CategoryTrigger>
      <Select.Portal>
        <CategoryMenu position="popper" sideOffset={8} align="start">
          <Select.Viewport>
            {categories.map((category) => (
              <CategoryOption key={category.id} value={category.id} $color={category.color}>
                <CategorySwatch $color={category.color} aria-hidden />
                <Select.ItemText>{category.label}</Select.ItemText>
              </CategoryOption>
            ))}
          </Select.Viewport>
        </CategoryMenu>
      </Select.Portal>
    </Select.Root>
  );
}
