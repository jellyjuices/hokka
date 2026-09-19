"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.xl} ${theme.space.lg};
  text-align: center;
  color: ${theme.foreground.secondary};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
`;

export const Title = styled.h3`
  margin: 0;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
`;

export const Description = styled.p`
  margin: 0;
  max-width: 40ch;
  font-size: ${theme.fontSize.sm};
`;
