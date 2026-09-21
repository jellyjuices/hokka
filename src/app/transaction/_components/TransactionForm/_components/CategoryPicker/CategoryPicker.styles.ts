"use client";

import styled from "@emotion/styled";
import * as Select from "@radix-ui/react-select";
import { theme, hoverFill, categoryTint, type CategoryColor } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/theme";

type Tinted = { $color: CategoryColor | null };

function fill({ $color }: Tinted) {
  return $color ? categoryTint(theme.categoryColor[$color]) : theme.surface.secondary;
}

export const CategoryTrigger = styled(Select.Trigger, transientProps)<Tinted>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: ${theme.space.sm};
  min-height: 44px;
  padding: 0 ${theme.space.md} 0 ${theme.space.lg};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${fill};
  color: ${({ $color }) => ($color ? theme.categoryColor[$color] : theme.foreground.primary)};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  transition:
    background ${theme.motion.fast} ease,
    color ${theme.motion.fast} ease;

  &:hover {
    background: ${(props) => hoverFill(fill(props))};
  }

  &[data-pointer-focus] {
    outline: none;
  }

  &[data-placeholder] {
    color: ${theme.foreground.secondary};
  }
`;

export const TriggerIcon = styled(Select.Icon)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const CategoryMenu = styled(Select.Content)`
  z-index: 40;
  min-width: var(--radix-select-trigger-width);
  padding: ${theme.space.xs};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.primary};
`;

export const CategoryOption = styled(Select.Item, transientProps)<{ $color: CategoryColor }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 40px;
  padding: 0 ${theme.space.md};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  outline: none;

  &[data-highlighted] {
    background: ${({ $color }) => categoryTint(theme.categoryColor[$color])};
    color: ${({ $color }) => theme.categoryColor[$color]};
  }
`;

export const CategorySwatch = styled.span<{ $color: CategoryColor }>`
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $color }) => theme.categoryColor[$color]};
`;
