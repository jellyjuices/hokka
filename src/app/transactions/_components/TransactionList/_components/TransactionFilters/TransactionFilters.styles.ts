"use client";

import styled from "@emotion/styled";
import { theme, hoverFill, numeric } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  flex-wrap: wrap;

  ${mediaDown("smTablet")} {
    gap: ${theme.space.xs};
  }
`;

export const FilterSegments = styled.div`
  display: inline-flex;
  gap: ${theme.space.xs};
  padding: ${theme.space.xs};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.secondary};
`;

export const FilterSegment = styled.button<{ $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 ${theme.space.md};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $isSelected }) => ($isSelected ? theme.surface.accentSecondary : "transparent")};
  color: ${({ $isSelected }) =>
    $isSelected ? theme.foreground.accent : theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
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

export const FilterSpacer = styled.div`
  flex: 1 1 auto;

  ${mediaDown("smTablet")} {
    display: none;
  }
`;

export const FilterCount = styled.span`
  ${numeric}
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
  white-space: nowrap;
`;

export const FilterReset = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  min-height: 36px;
  padding: 0 ${theme.space.md};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: ${theme.foreground.accent};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
  }
`;
