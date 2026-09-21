"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme, hoverFill, numeric, categoryTint, transientProps } from "@/src/lib/theme";
import type { CategoryColor } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const CardShell = styled.article`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
  padding: ${theme.space.md} ${theme.space.md} ${theme.space.md} ${theme.space.lg};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.surface.secondary};
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.secondary)};
  }

  html:not([data-input-modality="mouse"]) &:has(a:focus-visible) {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }

  ${mediaDown("mobile")} {
    padding: ${theme.space.md};
    gap: ${theme.space.sm};
  }
`;

export const CardGlyph = styled.span<{ $isIncome: boolean }>`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $isIncome }) =>
    $isIncome ? theme.surface.accentSecondary : theme.surface.primary};
  color: ${({ $isIncome }) => ($isIncome ? theme.foreground.accent : theme.foreground.secondary)};

  ${mediaDown("mobile")} {
    display: none;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  flex: 1 1 auto;
  min-width: 0;
`;

export const CardLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  outline: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    cursor: pointer;
  }
`;

export const CardAction = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
`;

export const CardTitle = styled.h3`
  overflow: hidden;
  margin: 0;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-width: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.xs};
`;

export const CardMetaText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardCategoryPill = styled("span", transientProps)<{ $color: CategoryColor }>`
  overflow: hidden;
  padding: 2px ${theme.space.sm};
  border-radius: ${theme.borderRadius.full};
  background: ${({ $color }) => categoryTint(theme.categoryColor[$color])};
  color: ${({ $color }) => theme.categoryColor[$color]};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMetaDot = styled.span`
  width: 3px;
  height: 3px;
  flex: 0 0 auto;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.foreground.disabled};
`;

export const CardMetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  flex: 0 0 auto;
`;

export const CardAmounts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.space.xs};
  flex: 0 0 auto;
`;

export const CardTotal = styled.strong<{ $isIncome: boolean }>`
  ${numeric}
  color: ${({ $isIncome }) => ($isIncome ? theme.foreground.accent : theme.foreground.primary)};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  white-space: nowrap;
`;

export const CardSubAmount = styled.span`
  ${numeric}
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.xs};
  white-space: nowrap;
`;
