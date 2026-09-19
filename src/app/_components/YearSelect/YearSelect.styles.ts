"use client";

import styled from "@emotion/styled";
import * as Select from "@radix-ui/react-select";
import { theme, hoverFill, numeric } from "@/src/lib/theme";

export const YearTrigger = styled(Select.Trigger)`
  ${numeric}
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 44px;
  padding: 0 ${theme.space.md} 0 ${theme.space.lg};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.secondary)};
  }
`;

export const YearMenu = styled(Select.Content)`
  z-index: 40;
  min-width: var(--radix-select-trigger-width);
  padding: ${theme.space.xs};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.primary};
`;

export const YearOption = styled(Select.Item)`
  ${numeric}
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 ${theme.space.md};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  outline: none;

  &[data-highlighted] {
    background: ${hoverFill("transparent")};
  }
`;

export const YearIcon = styled(Select.Icon)`
  display: flex;
  align-items: center;
`;
