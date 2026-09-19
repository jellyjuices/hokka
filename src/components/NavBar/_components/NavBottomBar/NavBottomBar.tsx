"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/src/components/Icon";
import { NAV_ITEMS } from "../../NavBar.registry";
import { NavAccount } from "../NavAccount";
import { isNavItemActive } from "../../isNavItemActive";
import {
  BottomBar,
  BottomBarItem,
  BottomBarItemLabel,
  BottomBarItems,
} from "./NavBottomBar.styles";
import type { NavBottomBarProps } from "./NavBottomBar.types";

export function NavBottomBar({ initials }: NavBottomBarProps) {
  const pathname = usePathname();

  return (
    <BottomBar aria-label="Primary">
      <BottomBarItems>
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <li key={item.href}>
              <BottomBarItem
                href={item.href}
                $isActive={isActive}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} size={32} />
                <BottomBarItemLabel>{item.label}</BottomBarItemLabel>
              </BottomBarItem>
            </li>
          );
        })}
      </BottomBarItems>
      <NavAccount initials={initials} isCollapsed />
    </BottomBar>
  );
}
