"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const CardSurface = styled.section`
  background: ${theme.surface.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  color: ${theme.foreground.primary};
`;
