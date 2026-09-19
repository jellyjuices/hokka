"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Action = styled.button`
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
`;
