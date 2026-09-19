"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@/src/components/Icon";
import { NAV_ITEMS } from "../../NavBar.registry";
import { NavAccount } from "../NavAccount";
import { NavNewButton } from "../NavNewButton";
import { NavSearch } from "../NavSearch";
import { isNavItemActive } from "../../isNavItemActive";
import * as styles from "./NavRail.styles";
import type { NavRailProps } from "./NavRail.types";

export function NavRail({
  brand,
  initials,
  isCollapsed,
  railRef,
  onPeek,
  onHoverStart,
  onHoverEnd,
}: NavRailProps) {
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldFocusSearchRef = useRef(false);

  useEffect(() => {
    if (isCollapsed || !shouldFocusSearchRef.current) return;
    shouldFocusSearchRef.current = false;
    searchInputRef.current?.focus();
  }, [isCollapsed]);

  function handleSearchActivate() {
    shouldFocusSearchRef.current = true;
    onPeek();
  }

  return (
    <styles.Root
      ref={railRef}
      $isCollapsed={isCollapsed}
      aria-label="Primary"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <styles.Head $isCollapsed={isCollapsed}>
        <styles.Brand href="/" $isCollapsed={isCollapsed}>
          <styles.BrandMark src="/logo/ui.svg" alt="" width={26} height={26} />
          <styles.BrandName $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
            {brand}
          </styles.BrandName>
        </styles.Brand>
      </styles.Head>

      <styles.Items>
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <li key={item.href}>
              <styles.Item
                href={item.href}
                $isActive={isActive}
                $isCollapsed={isCollapsed}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon name={item.icon} size={24} />
                <styles.ItemLabel $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
                  {item.label}
                </styles.ItemLabel>
              </styles.Item>
            </li>
          );
        })}
      </styles.Items>

      <styles.Foot>
        <NavNewButton isCollapsed={isCollapsed} />
        <NavSearch
          isCollapsed={isCollapsed}
          inputRef={searchInputRef}
          onActivate={handleSearchActivate}
        />
        <NavAccount initials={initials} isCollapsed={isCollapsed} />
      </styles.Foot>
    </styles.Root>
  );
}
