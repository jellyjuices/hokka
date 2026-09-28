"use client";

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import { theme, hoverFill, transientProps } from "@/src/lib/theme";

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
`;

export const TakeoverPanel = styled(Dialog.Content)`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  background: ${theme.surface.primary};
  outline: none;
  animation: ${riseIn} ${theme.motion.base} ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const TakeoverHeader = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: ${theme.space.sm};
  padding: calc(${theme.space.sm} + env(safe-area-inset-top)) ${theme.space.md} ${theme.space.sm};
  border-bottom: 1px solid ${theme.surface.tint};
`;

export const TakeoverClose = styled(Dialog.Close)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: ${theme.foreground.secondary};
  cursor: pointer;

  &:hover {
    background: ${hoverFill("transparent")};
  }
`;

export const TakeoverTitle = styled(Dialog.Title)`
  overflow: hidden;
  margin: 0;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TakeoverBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: ${theme.space.lg};
  min-height: 0;
  padding: ${theme.space.md} ${theme.space.md} calc(${theme.space.xl} + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ChoiceRow = styled("button", transientProps)<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 56px;
  padding: 0 ${theme.space.md};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  background: ${({ $isSelected }) => ($isSelected ? theme.surface.accentSecondary : "transparent")};
  color: ${({ $isSelected }) => ($isSelected ? theme.foreground.accent : theme.foreground.primary)};
  font-size: ${theme.fontSize.md};
  text-align: left;
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${({ $isSelected }) =>
      hoverFill($isSelected ? theme.surface.accentSecondary : "transparent")};
  }
`;

export const ChoiceLabel = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`;

export const ChoiceTick = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
`;
