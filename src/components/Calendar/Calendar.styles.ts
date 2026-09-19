"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  width: 100%;
  padding: ${theme.space.sm} ${theme.space.md};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.surface.primary};
  color: ${theme.foreground.primary};
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }
`;

export const Content = styled.div`
  background: ${theme.surface.secondary};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.md};
  z-index: 50;
`;

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  width: 16rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
`;

export const MonthLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.foreground.primary};
`;

export const NavButton = styled.button`
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
    background: ${theme.surface.primary};
    border-color: ${theme.surface.tint};
  }

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }
`;

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const Weekday = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${theme.foreground.disabled};
`;

export const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const Day = styled.button<{
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
    background: ${({ $selected }) => ($selected ? theme.surface.accent : theme.surface.primary)};
  }

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }
`;
