import { DropZone } from "@/src/components/DropZone";
import { NavBar, NavTopBar } from "@/src/components/NavBar";
import { ShellLayout, ShellMain } from "./AppShell.styles";
import type { AppShellProps } from "./AppShell.types";

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellLayout>
      <NavBar brand="Hokka" initials="JJ" />
      <ShellMain>
        <NavTopBar brand="Hokka" />
        {children}
      </ShellMain>
      <DropZone />
    </ShellLayout>
  );
}
