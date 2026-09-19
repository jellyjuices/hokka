"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Root = styled.section`
  background: ${theme.surface.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${theme.foreground.primary};
`;
