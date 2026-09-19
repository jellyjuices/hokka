"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/src/components/Icon";
import { NEW_TRANSACTION_HREF } from "../../NavBar.registry";
import { FabLink } from "./NavFab.styles";

export function NavFab() {
  if (usePathname() === NEW_TRANSACTION_HREF) return null;

  return (
    <FabLink href={NEW_TRANSACTION_HREF} aria-label="New transaction">
      New
      <Icon name="plus" size={28} />
    </FabLink>
  );
}
