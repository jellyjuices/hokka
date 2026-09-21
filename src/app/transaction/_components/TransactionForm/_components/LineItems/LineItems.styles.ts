"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Input, InputShell } from "@/src/components/Input";
import { theme, hoverFill } from "@/src/lib/theme";

const openFromStart = keyframes`
  from { width: 50%; }
  to { width: 100%; }
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  width: 100%;
  animation: ${openFromStart} ${theme.motion.base} ease;
`;

export const ItemLine = styled.div`
  display: flex;
  align-items: center;
`;

export const ItemSlot = styled.div<{ $open: boolean }>`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  width: ${({ $open }) => ($open ? "40px" : "0")};
  overflow: hidden;
  transition: width ${theme.motion.base} ease;
`;

export const ItemsPill = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  flex: 1 1 0;
  min-width: 0;
  min-height: 64px;
  padding: 0 ${theme.space.lg};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.md};
  text-align: left;
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.secondary)};
  }
`;

export const ItemRow = styled(InputShell)`
  flex: 1 1 auto;
  background: ${theme.surface.primary};
`;

export const ItemName = styled(Input)`
  flex: 1 1 auto;
`;

export const ItemAmount = styled(Input)`
  flex: 0 0 auto;
  width: 6rem;
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

export const ItemAdd = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accent};
  color: ${theme.foreground.inverse};
  cursor: pointer;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: scale(${({ $open }) => ($open ? 1 : 0.4)});
  transition:
    background ${theme.motion.fast} ease,
    opacity ${theme.motion.base} ease,
    transform ${theme.motion.base} ease;

  &:hover {
    background: ${hoverFill(theme.surface.accent)};
  }
`;

export const SubtotalPill = styled(ItemsPill)`
  white-space: nowrap;
`;
