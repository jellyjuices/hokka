import { CardsThreeIcon, InvoiceIcon, SquaresFourIcon } from "@phosphor-icons/react/dist/ssr";
import type { NavItem } from "./NavBar.types";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: SquaresFourIcon },
  { href: "/transactions", label: "Transactions", icon: CardsThreeIcon },
  { href: "/filings", label: "Filings", icon: InvoiceIcon },
];

export const NEW_TRANSACTION_HREF = "/transaction/new";
