"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) auto;
  gap: ${theme.space.md};
  align-items: baseline;
  padding: ${theme.space.sm} 0;
  border-bottom: 1px solid ${theme.surface.tint};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Counterparty = styled.span`
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Meta = styled.span`
  color: ${theme.foreground.secondary};
  font-size: 0.85rem;
`;

export const Amount = styled.span`
  font-variant-numeric: tabular-nums;
`;
