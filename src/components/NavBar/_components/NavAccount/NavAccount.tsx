"use client";

import { usePathname } from "next/navigation";
import { isNavItemActive } from "../../isNavItemActive";
import { AccountAvatar, AccountLabel, AccountLink } from "./NavAccount.styles";
import type { NavAccountProps } from "./NavAccount.types";

const HREF = "/settings";

export function NavAccount({ initials, isCollapsed = false }: NavAccountProps) {
  const isSelected = isNavItemActive(usePathname(), HREF);

  return (
    <AccountLink
      href={HREF}
      $isCollapsed={isCollapsed}
      $isSelected={isSelected}
      aria-current={isSelected ? "page" : undefined}
      aria-label="Settings"
    >
      <AccountAvatar>{initials.slice(0, 1)}</AccountAvatar>
      <AccountLabel $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
        {initials}
      </AccountLabel>
    </AccountLink>
  );
}
