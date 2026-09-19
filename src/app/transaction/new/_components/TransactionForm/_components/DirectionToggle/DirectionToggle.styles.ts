"use client";

import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";

export const ToggleTrack = styled.div`
  display: inline-flex;
  align-self: flex-start;
  gap: ${theme.space.xs};
  padding: ${theme.space.xs};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.secondary};
  margin-bottom: ${theme.space.sm};
`;

export const ToggleOption = styled.button<{ $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 48px;
  padding: 0 ${theme.space.lg};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $isSelected }) => ($isSelected ? theme.surface.accentSecondary : "transparent")};
  color: ${({ $isSelected }) =>
    $isSelected ? theme.foreground.accent : theme.foreground.secondary};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  cursor: pointer;
  transition:
    background ${theme.motion.fast} ease,
    color ${theme.motion.fast} ease;

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? theme.surface.accentSecondary : hoverFill("transparent")};
  }
`;
