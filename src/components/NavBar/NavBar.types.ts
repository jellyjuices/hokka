import type { IconName } from "@/src/components/Icon";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

export type NavBarProps = {
  brand: string;
  initials: string;
};
