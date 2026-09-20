"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { categoryTint, hoverFill, theme, transientProps } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";
import type { ToastTone } from "./Toast.types";

const TONE_HUE: Record<ToastTone, string> = {
  success: theme.categoryColor.moss,
  error: theme.categoryColor.rose,
  info: theme.categoryColor.slate,
};

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

export const ToastViewport = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(76px + ${theme.space.md} + env(safe-area-inset-bottom));
  z-index: 70;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${theme.space.sm};
  width: min(420px, calc(100vw - 2 * ${theme.space.md}));
  transform: translateX(-50%);
  pointer-events: none;

  ${mediaDown("smTablet")} {
    bottom: calc(76px + ${theme.space.sm} + env(safe-area-inset-bottom));
  }
`;

export const ToastCard = styled("div", transientProps)<{ $tone: ToastTone; $isDragging: boolean }>`
  --toast-x: 0px;
  --toast-fade: 1;
  display: flex;
  align-items: flex-start;
  gap: ${theme.space.sm};
  padding: ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${({ $tone }) => categoryTint(TONE_HUE[$tone])};
  box-shadow: 0 12px 32px color-mix(in srgb, ${theme.foreground.primary} 18%, transparent);
  color: ${theme.foreground.primary};
  pointer-events: auto;
  touch-action: pan-y;
  opacity: var(--toast-fade);
  transform: translate3d(var(--toast-x), 0, 0);
  animation: ${riseIn} ${theme.motion.base} ease;
  will-change: transform;
  transition: ${({ $isDragging }) =>
    $isDragging
      ? "none"
      : `transform ${theme.motion.base} ease, opacity ${theme.motion.base} ease`};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ToastGlyph = styled("span", transientProps)<{ $tone: ToastTone }>`
  display: flex;
  flex-shrink: 0;
  padding-top: 1px;
  color: ${({ $tone }) => TONE_HUE[$tone]};
`;

export const ToastBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${theme.space.xs};
  min-width: 0;
`;

export const ToastMessage = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
`;

export const ToastDetail = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.foreground.secondary};
  overflow-wrap: anywhere;
`;

export const ToastClose = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: ${theme.foreground.secondary};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
  }
`;
