"use client";

import * as Select from "@radix-ui/react-select";
import { Icon } from "@/src/components/Icon";
import { CategoryMenu, CategoryOption, CategoryTrigger } from "./CategoryPicker.styles";
import type { CategoryPickerProps } from "./CategoryPicker.types";

export function CategoryPicker({ value, categories, onChange }: CategoryPickerProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <CategoryTrigger aria-label="Category">
        <Select.Value placeholder="Category" />
        <Select.Icon>
          <Icon name={value === "" ? "plus" : "caretDown"} size={18} />
        </Select.Icon>
      </CategoryTrigger>
      <Select.Portal>
        <CategoryMenu position="popper" sideOffset={8} align="start">
          <Select.Viewport>
            {categories.map((category) => (
              <CategoryOption key={category.id} value={category.id}>
                <Select.ItemText>{category.label}</Select.ItemText>
              </CategoryOption>
            ))}
          </Select.Viewport>
        </CategoryMenu>
      </Select.Portal>
    </Select.Root>
  );
}
