"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsThreeOutlineIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { MenuOption, MenuPanel, MenuTrigger } from "./Menu.styles";
import type { MenuProps } from "./Menu.types";

export function Menu({ label, items }: MenuProps) {
  return (
    <DropdownMenu.Root>
      <MenuTrigger aria-label={label}>
        <Icon name={DotsThreeOutlineIcon} size={22} weight="fill" />
      </MenuTrigger>
      <DropdownMenu.Portal>
        <MenuPanel align="end" sideOffset={6}>
          {items.map((item) => (
            <MenuOption
              key={item.id}
              $isDestructive={item.isDestructive ?? false}
              onSelect={item.onSelect}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              {item.label}
            </MenuOption>
          ))}
        </MenuPanel>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
