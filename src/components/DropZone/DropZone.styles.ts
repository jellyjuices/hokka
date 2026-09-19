"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const DASH_RADIUS = 44;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const settleIn = keyframes`
  from { opacity: 0; transform: scale(0.985); }
  to { opacity: 1; transform: scale(1); }
`;

const breathe = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 30; }
`;

export const DropScrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: stretch;
  padding: ${theme.space.lg};
  background: color-mix(in srgb, ${theme.surface.accent} 94%, transparent);
  backdrop-filter: blur(6px);
  animation: ${fadeIn} ${theme.motion.fast} ease;

  ${mediaDown("smTablet")} {
    padding: ${theme.space.md};
  }
`;

export const DropPanel = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.md};
  color: ${theme.foreground.inverse};
  animation: ${settleIn} ${theme.motion.base} ease;
`;

export const DashedOutline = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;

  rect {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 1 14;
    opacity: 0.85;
    animation: ${breathe} 1.6s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    rect {
      animation: none;
    }
  }
`;

export const DropLabel = styled.p`
  margin: 0;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.lg};
  text-align: center;
`;
