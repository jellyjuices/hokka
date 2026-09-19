"use client";

import { NavBottomBar } from "./_components/NavBottomBar";
import { NavFab } from "./_components/NavFab";
import { NavRail } from "./_components/NavRail";
import { useNavCollapse } from "./useNavCollapse";
import type { NavBarProps } from "./NavBar.types";

export function NavBar({ brand, initials }: NavBarProps) {
  const { isCollapsed, railRef, peek, hoverStart, hoverEnd } = useNavCollapse();

  return (
    <>
      <NavRail
        brand={brand}
        initials={initials}
        isCollapsed={isCollapsed}
        railRef={railRef}
        onPeek={peek}
        onHoverStart={hoverStart}
        onHoverEnd={hoverEnd}
      />
      <NavFab />
      <NavBottomBar initials={initials} />
    </>
  );
}
