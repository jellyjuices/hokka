"use client";

import { usePathname } from "next/navigation";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { NEW_TRANSACTION_HREF } from "../../NavBar.registry";
import { NewButtonLabel, NewButtonLink } from "./NavNewButton.styles";
import type { NavNewButtonProps } from "./NavNewButton.types";

export function NavNewButton({ isCollapsed }: NavNewButtonProps) {
  if (usePathname() === NEW_TRANSACTION_HREF) return null;

  return (
    <NewButtonLink
      href={NEW_TRANSACTION_HREF}
      $isCollapsed={isCollapsed}
      aria-label="New transaction"
    >
      <Icon name={PlusIcon} size={24} />
      <NewButtonLabel $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
        New
      </NewButtonLabel>
    </NewButtonLink>
  );
}
