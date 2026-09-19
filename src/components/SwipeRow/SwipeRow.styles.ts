"use client";

import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";

export const SWIPE_ACTION_WIDTH = 88;

export const SwipeFrame = styled.div`
  --swipe-x: 0px;
  position: relative;
  overflow: hidden;
  border-radius: ${theme.borderRadius.lg};
  touch-action: pan-y;
`;

export const SwipeAction = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  width: ${SWIPE_ACTION_WIDTH}px;
  padding: 0;
  border: none;
  background: ${theme.surface.accent};
  color: ${theme.foreground.inverse};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.accent)};
  }
`;

export const SwipeSurface = styled.div<{ $isDragging: boolean }>`
  position: relative;
  transform: translate3d(var(--swipe-x), 0, 0);
  will-change: transform;
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : `transform ${theme.motion.base} ease`};
`;
