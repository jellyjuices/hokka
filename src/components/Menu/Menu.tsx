"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsThreeOutlineIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { MenuOption, MenuPanel, MenuTrigger } from "./Menu.styles";
import type { MenuProps } from "./Menu.types";

export function Menu({ label, items, open, onOpenChange }: MenuProps) {
  const isPressed = useRef(false);

  // Radix selects an item on a bare pointerup so a mouse can press the trigger and release on a
  // choice. A long press opens this menu under a finger that is still down, and lifting it would
  // fire whatever item the menu happened to open beneath it.
  function guardRelease(event: PointerEvent) {
    if (event.pointerType !== "mouse" && !isPressed.current) event.preventDefault();
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <MenuTrigger aria-label={label}>
        <Icon name={DotsThreeOutlineIcon} size={22} weight="fill" />
      </MenuTrigger>
      <DropdownMenu.Portal>
        <MenuPanel
          align="end"
          sideOffset={6}
          collisionPadding={16}
          onPointerDownCapture={() => {
            isPressed.current = true;
          }}
          onCloseAutoFocus={() => {
            isPressed.current = false;
          }}
        >
          {items.map((item) => (
            <MenuOption
              key={item.id}
              $isDestructive={item.isDestructive ?? false}
              onPointerUp={guardRelease}
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
