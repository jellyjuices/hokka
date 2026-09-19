"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Root = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 64px;
  padding: ${theme.space.md} ${theme.space.lg};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
`;

export const Label = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${theme.fontSize.md};
  color: ${theme.foreground.secondary};
`;

export const Glyph = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: ${theme.foreground.secondary};
`;

export const Value = styled.strong`
  flex: 0 0 auto;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.xl};
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;
