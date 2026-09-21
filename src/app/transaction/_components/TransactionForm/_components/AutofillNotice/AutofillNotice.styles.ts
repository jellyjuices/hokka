"use client";

import styled from "@emotion/styled";
import { theme, transientProps } from "@/src/lib/theme";
import type { AutofillVariant } from "../../TransactionForm.types";

const VARIANTS = {
  info: { background: theme.surface.secondary, color: theme.foreground.secondary },
  success: { background: theme.surface.secondary, color: theme.foreground.primary },
  warning: { background: theme.surface.accentSecondary, color: theme.foreground.accent },
} as const;

export const NoticeRow = styled("p", transientProps)<{ $variant: AutofillVariant }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  margin: 0;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${({ $variant }) => VARIANTS[$variant].background};
  color: ${({ $variant }) => VARIANTS[$variant].color};
  font-size: ${theme.fontSize.sm};

  svg {
    flex: 0 0 auto;
  }
`;
