"use client";

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { stackRadius, theme } from "@/src/lib/theme";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const SkeletonItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  ${stackRadius("column", "& > li", "> *")}
`;

export const SkeletonRow = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  background: ${theme.surface.secondary};
  animation: ${pulse} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
