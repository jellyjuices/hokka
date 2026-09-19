"use client";

import styled from "@emotion/styled";
import { theme, transientProps } from "@/src/lib/theme";
import type { AutofillTone } from "../../TransactionForm.types";

const TONES = {
  reading: { background: theme.surface.secondary, color: theme.foreground.secondary },
  good: { background: theme.surface.secondary, color: theme.foreground.primary },
  warn: { background: theme.surface.accentSecondary, color: theme.foreground.accent },
} as const;

export const NoticeRow = styled("p", transientProps)<{ $tone: AutofillTone }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  margin: 0;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${({ $tone }) => TONES[$tone].background};
  color: ${({ $tone }) => TONES[$tone].color};
  font-size: ${theme.fontSize.sm};

  svg {
    flex: 0 0 auto;
  }
`;
