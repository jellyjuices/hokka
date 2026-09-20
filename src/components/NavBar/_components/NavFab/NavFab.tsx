"use client";

import { usePathname } from "next/navigation";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { NEW_TRANSACTION_HREF } from "../../NavBar.registry";
import { FabLink } from "./NavFab.styles";

const NEW_FILING_HREF = "/filings/new";

export function NavFab() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/transactions") {
    return (
      <FabLink href={NEW_TRANSACTION_HREF} aria-label="New transaction">
        New item
        <Icon name={PlusIcon} size={28} />
      </FabLink>
    );
  }

  if (pathname === "/filings") {
    return (
      <FabLink href={NEW_FILING_HREF} aria-label="Add filing">
        Add Filing
        <Icon name={PlusIcon} size={28} />
      </FabLink>
    );
  }

  return null;
}
