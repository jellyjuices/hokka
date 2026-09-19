"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/styled";
import { mediaUp } from "@/src/lib/breakpoints";

export const Root = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  padding-bottom: calc(${theme.space.sm} + env(safe-area-inset-bottom));
  border-top: 1px solid ${theme.surface.tint};
  background: ${theme.surface.primary};

  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const Items = styled.ul`
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

export const Item = styled(Link, transientProps)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  min-height: 56px;
  padding: ${theme.space.sm} ${theme.space.xs};
  border-radius: ${theme.borderRadius.full};
  color: ${({ $isActive }) => ($isActive ? theme.foreground.accent : theme.foreground.secondary)};
  background: ${({ $isActive }) => ($isActive ? theme.surface.accentSecondary : "transparent")};
  transition:
    background ${theme.motion.fast} ease,
    color ${theme.motion.fast} ease;
`;

export const ItemLabel = styled.span`
  overflow: hidden;
  max-width: 100%;
  font-size: ${theme.fontSize.xs};
  font-weight: 500;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
