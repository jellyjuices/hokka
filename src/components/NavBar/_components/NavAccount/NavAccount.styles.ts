"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme, hoverFill } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/styled";

export const AccountLink = styled(Link, transientProps)<{
  $isCollapsed: boolean;
  $isSelected: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ $isCollapsed }) => ($isCollapsed ? "0" : theme.space.md)};
  align-self: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "stretch")};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  width: ${({ $isCollapsed }) => ($isCollapsed ? "48px" : "100%")};
  height: 48px;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? "0" : `0 ${theme.space.md}`)};
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${({ $isSelected }) =>
    $isSelected ? `inset 0 0 0 2px ${theme.foreground.accent}` : "none"};
  transition:
    background ${theme.motion.fast} ease,
    box-shadow ${theme.motion.fast} ease,
    width ${theme.motion.base} ease,
    padding ${theme.motion.base} ease;

  &:hover {
    background: ${hoverFill("transparent")};
  }
`;

export const AccountAvatar = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accentSecondary};
  color: ${theme.foreground.accent};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
`;

export const AccountLabel = styled.span<{ $isCollapsed: boolean }>`
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
