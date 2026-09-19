"use client";

import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";

export const ObligationAction = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.accent};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.primary)};
  }
`;
