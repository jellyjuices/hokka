import { NavBar, NavTopBar } from "@/src/components/NavBar";
import * as styles from "./AppShell.styles";
import type { AppShellProps } from "./AppShell.types";

export function AppShell({ children }: AppShellProps) {
  return (
    <styles.Root>
      <NavBar brand="Hokka" initials="JJ" />
      <styles.Main>
        <NavTopBar brand="Hokka" />
        {children}
      </styles.Main>
    </styles.Root>
  );
}
