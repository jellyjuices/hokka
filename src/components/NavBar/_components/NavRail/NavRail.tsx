"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@/src/components/Icon";
import { NAV_ITEMS } from "../../NavBar.registry";
import { NavAccount } from "../NavAccount";
import { NavNewButton } from "../NavNewButton";
import { NavSearch } from "../NavSearch";
import { isNavItemActive } from "../../isNavItemActive";
import {
  Rail,
  RailBrand,
  RailBrandMark,
  RailBrandName,
  RailFoot,
  RailHead,
  RailItem,
  RailItemLabel,
  RailItems,
} from "./NavRail.styles";
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
    <Rail
      ref={railRef}
      $isCollapsed={isCollapsed}
      aria-label="Primary"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <RailHead $isCollapsed={isCollapsed}>
        <RailBrand href="/" $isCollapsed={isCollapsed}>
          <RailBrandMark src="/logo/ui.svg" alt="" width={26} height={26} />
          <RailBrandName $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
            {brand}
          </RailBrandName>
        </RailBrand>
      </RailHead>

      <RailItems>
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <li key={item.href}>
              <RailItem
                href={item.href}
                $isActive={isActive}
                $isCollapsed={isCollapsed}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon name={item.icon} size={24} weight={isActive ? "fill" : "regular"} />
                <RailItemLabel $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
                  {item.label}
                </RailItemLabel>
              </RailItem>
            </li>
          );
        })}
      </RailItems>

      <RailFoot>
        <NavNewButton isCollapsed={isCollapsed} />
        <NavSearch
          isCollapsed={isCollapsed}
          inputRef={searchInputRef}
          onActivate={handleSearchActivate}
        />
        <NavAccount initials={initials} isCollapsed={isCollapsed} />
      </RailFoot>
    </Rail>
  );
}
