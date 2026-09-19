import * as styles from "./NavAccount.styles";
import type { NavAccountProps } from "./NavAccount.types";

export function NavAccount({ initials, isCollapsed = false }: NavAccountProps) {
  return (
    <styles.Root href="/settings" $isCollapsed={isCollapsed} aria-label="Settings">
      <styles.Avatar $isCollapsed={isCollapsed}>{initials.slice(0, 1)}</styles.Avatar>
      <styles.Label $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
        {initials}
      </styles.Label>
    </styles.Root>
  );
}
