"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as RadixSelect from "@radix-ui/react-select";
import { theme, hoverFill } from "@/src/lib/theme";
import type { SelectTone } from "./Select.types";

const tones: Record<SelectTone, ReturnType<typeof css>> = {
  chip: css`
    width: auto;
    min-height: 44px;
    padding: 0 ${theme.space.md} 0 ${theme.space.lg};
    border: none;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.surface.secondary};
    font-size: ${theme.fontSize.sm};

    &:hover {
      background: ${hoverFill(theme.surface.secondary)};
    }
  `,
  outline: css`
    width: 100%;
    min-height: 44px;
    padding: ${theme.space.sm} ${theme.space.md};
    border: 1px solid ${theme.surface.tint};
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.surface.primary};
    font-size: 0.9rem;

    &:hover {
      background: ${hoverFill(theme.surface.primary)};
    }
  `,
  soft: css`
    width: 100%;
    min-height: 64px;
    padding: 0 ${theme.space.lg};
    border: none;
    border-radius: ${theme.borderRadius.md};
    background: ${theme.surface.secondary};
    font-size: ${theme.fontSize.md};

    &:hover {
      background: ${hoverFill(theme.surface.secondary)};
    }
  `,
  plain: css`
    width: auto;
    justify-content: flex-end;
    padding: 0;
    border: none;
    background: transparent;
    font-size: ${theme.fontSize.md};
  `,
};

export const SelectTrigger = styled(RadixSelect.Trigger)<{ $tone: SelectTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  color: ${theme.foreground.primary};
  text-align: left;
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;
  ${({ $tone }) => tones[$tone]};

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }

  &[data-pointer-focus] {
    outline: none;
  }

  &[data-placeholder] {
    color: ${theme.foreground.secondary};
  }
`;

export const SelectMenu = styled(RadixSelect.Content)`
  z-index: 40;
  min-width: var(--radix-select-trigger-width);
  padding: ${theme.space.xs};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.primary};
`;

export const SelectOptionRow = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  min-height: 40px;
  padding: 0 ${theme.space.md};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  outline: none;

  &[data-highlighted] {
    background: ${hoverFill("transparent")};
    color: ${theme.foreground.accent};
  }
`;

export const SelectTick = styled(RadixSelect.ItemIndicator)`
  display: inline-flex;
  color: ${theme.foreground.accent};
`;
