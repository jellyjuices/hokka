"use client";

import styled from "@emotion/styled";
import * as Popover from "@radix-ui/react-popover";
import { theme, hoverFill, numeric, transientProps } from "@/src/lib/theme";
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

export const FilterTrigger = styled(Popover.Trigger, transientProps)<{ $isActive: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $isActive }) =>
    $isActive ? theme.surface.accentSecondary : theme.surface.secondary};
  color: ${({ $isActive }) => ($isActive ? theme.foreground.accent : theme.foreground.primary)};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover,
  &[data-state="open"] {
    background: ${({ $isActive }) =>
      hoverFill($isActive ? theme.surface.accentSecondary : theme.surface.secondary)};
  }
`;

export const FilterBadge = styled.span`
  ${numeric}
  position: absolute;
  top: -2px;
  right: -2px;
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accent};
  color: ${theme.surface.primary};
  font-size: ${theme.fontSize.xs};
  font-weight: 600;
`;

export const FilterPanel = styled(Popover.Content)`
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.space.md};
  width: min(520px, calc(100vw - 32px));
  max-height: var(--radix-popover-content-available-height);
  padding: ${theme.space.md};
  overflow-y: auto;
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.primary};

  ${mediaDown("mobile")} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  min-width: 0;
`;

export const FilterGroupLabel = styled.span`
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.xs};
  font-weight: 500;
`;

export const FilterChecks = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FilterCheck = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 36px;
  padding: 0 ${theme.space.sm};

  ${mediaDown("smTablet")} {
    min-height: 48px;
    font-size: ${theme.fontSize.md};
  }
  border: none;
  border-radius: ${theme.borderRadius.sm};
  background: transparent;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
  }
`;

export const FilterCheckBox = styled("span", transientProps)<{ $isChecked: boolean }>`
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  border: 1.5px solid
    ${({ $isChecked }) => ($isChecked ? theme.surface.accent : theme.foreground.disabled)};
  border-radius: ${theme.borderRadius.xs};
  background: ${({ $isChecked }) => ($isChecked ? theme.surface.accent : "transparent")};
  color: ${theme.surface.primary};
`;
