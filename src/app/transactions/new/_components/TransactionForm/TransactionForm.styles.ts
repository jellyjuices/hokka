"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const Grid = styled.div`
  display: grid;
  gap: ${theme.space.md};
  grid-template-columns: 1fr;

  ${mediaUp("mobile")} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.space.sm};
  justify-content: flex-end;
`;

export const Notice = styled.p`
  margin: ${theme.space.md} 0 0;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.tint};
  color: ${theme.foreground.accent};
  font-size: ${theme.fontSize.sm};
`;
