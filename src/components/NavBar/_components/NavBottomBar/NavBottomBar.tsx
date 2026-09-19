"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/src/components/Icon";
import { NAV_ITEMS } from "../../NavBar.registry";
import { NavAccount } from "../NavAccount";
import { isNavItemActive } from "../../isNavItemActive";
import * as styles from "./NavBottomBar.styles";
import type { NavBottomBarProps } from "./NavBottomBar.types";

export function NavBottomBar({ initials }: NavBottomBarProps) {
  const pathname = usePathname();

  return (
    <styles.Root aria-label="Primary">
      <styles.Items>
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <li key={item.href}>
              <styles.Item
                href={item.href}
                $isActive={isActive}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} size={32} />
                <styles.ItemLabel>{item.label}</styles.ItemLabel>
              </styles.Item>
            </li>
          );
        })}
      </styles.Items>
      <NavAccount initials={initials} isCollapsed />
    </styles.Root>
  );
}
