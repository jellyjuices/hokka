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
  padding: ${theme.space.md};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.surface.secondary};
  transition: background ${theme.motion.fast} ease;
  -webkit-touch-callout: none;
  user-select: none;

  &:hover {
    background: ${hoverFill(theme.surface.secondary)};
  }

  html:not([data-input-modality="mouse"]) &:has(a:focus-visible) {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }

  ${mediaDown("mobile")} {
    gap: ${theme.space.sm};
  }
`;

export const CardGlyph = styled("span", transientProps)<{ $color: CategoryColor | null }>`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $color }) =>
    $color === null ? theme.surface.accentSecondary : categoryTint(theme.categoryColor[$color])};
  color: ${({ $color }) =>
    $color === null ? theme.foreground.accent : theme.categoryColor[$color]};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  flex: 1 1 auto;
  min-width: 0;
`;

export const CardRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.space.sm};
  min-width: 0;
`;

export const CardDetail = styled.span`
  ${numeric}
  overflow: hidden;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.xs};
  text-overflow: ellipsis;
  white-space: nowrap;
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

export const CardLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  outline: none;
  -webkit-touch-callout: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    cursor: pointer;
  }
`;

export const CardAmount = styled("strong", transientProps)<{ $isIncome: boolean }>`
  ${numeric}
  flex: 0 0 auto;
  color: ${({ $isIncome }) => ($isIncome ? theme.foreground.accent : theme.foreground.primary)};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  white-space: nowrap;
`;

// On mobile the trigger stays in the DOM, reachable by a screen reader and anchored to the card's right edge, so the
// long-press menu has somewhere to open from.
export const CardAction = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;

  ${mediaDown("mobile")} {
    position: absolute;
    top: 100%;
    right: ${theme.space.md};
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
`;
