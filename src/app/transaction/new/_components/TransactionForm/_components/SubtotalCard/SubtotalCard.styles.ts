"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { outlineField } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";

// It takes over from the "Add subtotal" tile on the right, so it opens leftwards
// from that tile's footprint.
const openFromEnd = keyframes`
  from { width: 50%; margin-inline-start: 50%; }
  to { width: 100%; margin-inline-start: 0; }
`;

export const SubtotalField = styled.label`
  ${outlineField};
  width: 100%;
  animation: ${openFromEnd} ${theme.motion.base} ease;
  cursor: text;
`;

export const SubtotalLabel = styled.span`
  flex: 0 0 auto;
  font-size: ${theme.fontSize.md};
  white-space: nowrap;
`;

export const SubtotalValue = styled.span`
  display: inline-flex;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.space.xs};
  font-size: ${theme.fontSize.lg};
`;
