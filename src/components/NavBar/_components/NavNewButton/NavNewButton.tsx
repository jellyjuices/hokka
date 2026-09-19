import { Icon } from "@/src/components/Icon";
import * as styles from "./NavNewButton.styles";
import type { NavNewButtonProps } from "./NavNewButton.types";

export function NavNewButton({ isCollapsed }: NavNewButtonProps) {
  return (
    <styles.Root href="/new" $isCollapsed={isCollapsed} aria-label="New">
      <Icon name="plus" size={24} />
      <styles.Label $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
        New
      </styles.Label>
    </styles.Root>
  );
}
