"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Zone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.md};
  padding: ${theme.space.xl};
  border: 1px dashed ${theme.surface.accentSecondary};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.surface.accentSecondary};
  text-align: center;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Notice = styled.p`
  margin: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;
