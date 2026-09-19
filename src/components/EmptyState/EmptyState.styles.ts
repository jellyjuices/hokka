"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const EmptyStateLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.xl} ${theme.space.lg};
  text-align: center;
  color: ${theme.foreground.secondary};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.secondary};
`;

export const EmptyStateTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSize.md};
  font-weight: 500;
`;

export const EmptyStateDescription = styled.p`
  margin: 0;
  max-width: 40ch;
  font-size: ${theme.fontSize.sm};
`;
