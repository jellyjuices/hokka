import type { IconName } from "@/src/components/Icon";
import type { MenuItem } from "@/src/components/Menu";
import type { CategoryColor } from "@/src/lib/theme";

export type EntryCardProps = {
  icon: IconName;
  color: CategoryColor | null;
  date: string;
  detail: string;
  title: string;
  amount: string;
  isIncome?: boolean;
  href?: string;
  menuLabel: string;
  menuItems: MenuItem[];
};
