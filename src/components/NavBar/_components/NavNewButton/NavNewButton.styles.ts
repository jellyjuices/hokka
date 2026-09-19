"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/styled";

export const Root = styled(Link, transientProps)<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  align-self: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "stretch")};
  width: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "auto")};
  height: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "56px")};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accent};
  color: ${theme.foreground.inverse};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  transition:
    height ${theme.motion.base} ease,
    filter ${theme.motion.fast} ease;

  &:hover {
    filter: brightness(1.06);
  }
`;

export const Label = styled.span<{ $isCollapsed: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  max-width: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "120px")};
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? "0" : theme.space.sm)};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition:
    max-width ${theme.motion.base} ease,
    margin-left ${theme.motion.base} ease,
    opacity ${theme.motion.fast} ease;
`;
