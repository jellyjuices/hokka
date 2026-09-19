"use client";

import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";

export const DotsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  padding: ${theme.space.md} 0;
`;

export const PageDot = styled.button<{ $isActive: boolean }>`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: none;
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
  }

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: ${theme.borderRadius.full};
    background: ${({ $isActive }) =>
      $isActive ? theme.foreground.primary : theme.surface.secondary};
    transition: background ${theme.motion.fast} ease;
  }
`;
