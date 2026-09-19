"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const BottomBar = styled.nav`
  position: fixed;
  left: ${theme.space.md};
  right: ${theme.space.md};
  bottom: calc(${theme.space.sm} + env(safe-area-inset-bottom));
  z-index: 30;
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  padding: ${theme.space.xs};
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.surface.tint};
  background: ${theme.surface.primary};
  box-shadow: 0 8px 24px color-mix(in srgb, ${theme.foreground.primary} 12%, transparent);

  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const BottomBarItems = styled.ul`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: ${theme.space.xs};
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    flex: 1 1 0;
    min-width: 0;
  }
`;

export const BottomBarItem = styled(Link, transientProps)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  min-height: 44px;
  padding: ${theme.space.xs};
  border-radius: ${theme.borderRadius.full};
  color: ${({ $isActive }) => ($isActive ? theme.foreground.accent : theme.foreground.secondary)};
  background: ${({ $isActive }) => ($isActive ? theme.surface.accentSecondary : "transparent")};
  transition:
    background ${theme.motion.fast} ease,
    color ${theme.motion.fast} ease;
`;

export const BottomBarItemLabel = styled.span`
  overflow: hidden;
  max-width: 100%;
  font-size: ${theme.fontSize.xs};
  font-weight: 500;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
