import type { IconName } from "@/src/components/Icon";

export type MenuItem = {
  id: string;
  label: string;
  icon?: IconName;
  isDestructive?: boolean;
  onSelect: () => void;
};

export type MenuProps = {
  label: string;
  items: MenuItem[];
};
