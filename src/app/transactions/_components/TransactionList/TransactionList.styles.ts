"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${theme.space.md};
  padding: ${theme.space.md} 0;
  border-bottom: 1px solid ${theme.surface.tint};
  font-variant-numeric: tabular-nums;
`;
