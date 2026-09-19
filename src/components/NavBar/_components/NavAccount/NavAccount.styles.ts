"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/styled";

export const Root = styled(Link, transientProps)<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isCollapsed }) => ($isCollapsed ? "0" : theme.space.md)};
  align-self: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  border-radius: ${theme.borderRadius.full};
  transition: opacity ${theme.motion.fast} ease;

  &:hover {
    opacity: 0.82;
  }
`;

export const Avatar = styled.span<{ $isCollapsed: boolean }>`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "32px")};
  height: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "32px")};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accentSecondary};
  color: ${theme.foreground.accent};
  font-size: ${({ $isCollapsed }) => ($isCollapsed ? theme.fontSize.md : theme.fontSize.sm)};
  font-weight: 500;
  transition:
    width ${theme.motion.base} ease,
    height ${theme.motion.base} ease;
`;

export const Label = styled.span<{ $isCollapsed: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  font-size: ${theme.fontSize.md};
  color: ${theme.foreground.primary};
  max-width: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "120px")};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition:
    max-width ${theme.motion.base} ease,
    opacity ${theme.motion.fast} ease;
`;
