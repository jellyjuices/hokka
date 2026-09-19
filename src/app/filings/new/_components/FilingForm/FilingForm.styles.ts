"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Actions = styled.div`
  display: flex;
  gap: ${theme.space.sm};
  justify-content: flex-end;
  margin-top: ${theme.space.md};
`;

export const Notice = styled.p`
  margin: ${theme.space.md} 0 0;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.tint};
  color: ${theme.foreground.accent};
  font-size: ${theme.fontSize.sm};
`;
