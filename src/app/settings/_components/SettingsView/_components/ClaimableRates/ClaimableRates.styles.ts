"use client";

import styled from "@emotion/styled";
import { theme, categoryTint, transientProps } from "@/src/lib/theme";
import type { CategoryColor } from "@/src/lib/theme";

export const RateLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const RateGlyph = styled("span", transientProps)<{ $color: CategoryColor }>`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $color }) => categoryTint(theme.categoryColor[$color])};
  color: ${({ $color }) => theme.categoryColor[$color]};
`;
