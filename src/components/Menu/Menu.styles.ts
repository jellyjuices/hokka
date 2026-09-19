"use client";

import styled from "@emotion/styled";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { theme, hoverFill } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/theme";

export const MenuTrigger = styled(DropdownMenu.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: ${theme.foreground.secondary};
  cursor: pointer;
  transition:
    background ${theme.motion.fast} ease,
    color ${theme.motion.fast} ease;

  &:hover,
  &[data-state="open"] {
    background: ${hoverFill("transparent")};
    color: ${theme.foreground.primary};
  }
`;

export const MenuPanel = styled(DropdownMenu.Content)`
  z-index: 40;
  min-width: 200px;
  padding: ${theme.space.xs};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.primary};
`;

export const MenuOption = styled(DropdownMenu.Item, transientProps)<{ $isDestructive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 40px;
  padding: 0 ${theme.space.md};
  border-radius: ${theme.borderRadius.sm};
  color: ${({ $isDestructive }) =>
    $isDestructive ? theme.foreground.accent : theme.foreground.primary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  outline: none;

  &[data-highlighted] {
    background: ${hoverFill("transparent")};
  }
`;
