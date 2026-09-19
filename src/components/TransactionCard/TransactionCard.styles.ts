"use client";

import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const CardShell = styled.article`
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
  color: ${({ $isIncome }) => ($isIncome ? theme.foreground.accent : theme.foreground.primary)};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

export const CardSubAmount = styled.span`
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.xs};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;
