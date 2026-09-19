"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Root = styled.div`
  --swipe-x: 0px;
  position: relative;
  overflow: hidden;
  border-radius: ${theme.borderRadius.lg};
  touch-action: pan-y;
`;

export const Action = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  width: var(--swipe-action-width);
  padding: 0;
  border: none;
  background: ${theme.surface.accent};
  color: ${theme.foreground.inverse};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
`;

export const Surface = styled.div<{ $isDragging: boolean }>`
  position: relative;
  transform: translate3d(var(--swipe-x), 0, 0);
  will-change: transform;
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : `transform ${theme.motion.base} ease`};
`;
