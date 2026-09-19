"use client";

import styled from "@emotion/styled";
import { theme, hoverFill, numeric } from "@/src/lib/theme";

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 64px;
  padding: 0 ${theme.space.lg};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};

  &:has(:focus-visible) {
    border-color: ${theme.foreground.accent};
  }
`;

export const ItemName = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  background: transparent;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};

  &::placeholder {
    color: ${theme.foreground.secondary};
  }

  &:focus-visible {
    outline: none;
  }
`;

export const ItemCurrency = styled.span`
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.lg};
`;

export const ItemAmount = styled.input`
  ${numeric}
  width: 6rem;
  border: none;
  background: transparent;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.lg};
  text-align: right;

  &::placeholder {
    color: ${theme.foreground.disabled};
  }

  &:focus-visible {
    outline: none;
  }
`;

export const ItemRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: ${theme.foreground.secondary};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
    color: ${theme.foreground.accent};
  }
`;
