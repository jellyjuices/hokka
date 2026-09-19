"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";
import type { DateTone } from "./Calendar.types";

const tones: Record<DateTone, ReturnType<typeof css>> = {
  outline: css`
    gap: ${theme.space.sm};
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
    justify-content: space-between;
    gap: ${theme.space.md};
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
    gap: ${theme.space.md};
    padding: 0;
    border: none;
    background: transparent;
    font-size: ${theme.fontSize.md};
  `,
};

export const CalendarTrigger = styled.button<{ $tone: DateTone }>`
  display: inline-flex;
  align-items: center;
  width: 100%;
  color: ${theme.foreground.primary};
  text-align: left;
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;
  ${({ $tone }) => tones[$tone]};

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }

  &[data-pointer-focus] {
    outline: none;
  }
`;

export const CalendarPopover = styled.div`
  background: ${theme.surface.primary};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.md};
  z-index: 50;
`;

export const CalendarPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  width: 16rem;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
`;

export const CalendarMonthLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.foreground.primary};
`;

export const CalendarNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid transparent;
  border-radius: ${theme.borderRadius.sm};
  background: transparent;
  color: ${theme.foreground.secondary};
  cursor: pointer;

  &:hover {
    background: ${hoverFill("transparent")};
    border-color: ${theme.surface.tint};
  }

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }
`;

export const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const CalendarWeekday = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${theme.foreground.disabled};
`;

export const CalendarDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const CalendarDay = styled.button<{
  $muted: boolean;
  $selected: boolean;
  $today: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid ${({ $today }) => ($today ? theme.foreground.accent : "transparent")};
  border-radius: ${theme.borderRadius.sm};
  background: ${({ $selected }) => ($selected ? theme.surface.accent : "transparent")};
  color: ${({ $selected, $muted }) => {
    if ($selected) return theme.foreground.inverse;
    if ($muted) return theme.foreground.disabled;
    return theme.foreground.primary;
  }};
  font-size: 0.82rem;
  cursor: pointer;

  &:hover {
    background: ${({ $selected }) => hoverFill($selected ? theme.surface.accent : "transparent")};
  }

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }
`;
