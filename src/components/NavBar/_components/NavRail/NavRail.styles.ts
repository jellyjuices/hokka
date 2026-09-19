"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { theme, hoverFill } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const Rail = styled.nav<{ $isCollapsed: boolean }>`
  --nav-item-size: 48px;
  position: sticky;
  top: ${theme.layout.gutter};
  align-self: flex-start;
  flex: 0 0 auto;
  z-index: 20;
  display: flex;
  flex-direction: column;
  width: ${({ $isCollapsed }) =>
    $isCollapsed ? theme.layout.railWidthCollapsed : theme.layout.railWidth};
  height: calc(100dvh - ${theme.layout.gutter} * 2);
  padding: ${theme.space.xl} ${theme.space.lg};
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.surface.secondary};
  overflow: hidden;
  transition: width ${theme.motion.base} ease;

  ${mediaDown("smTablet")} {
    display: none;
  }
`;

export const RailHead = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  padding: ${theme.space.sm} 0;
`;

export const RailBrand = styled(Link, transientProps)<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  min-width: 0;
  color: ${theme.foreground.accent};
  border-radius: ${theme.borderRadius.sm};
`;

export const RailBrandMark = styled(Image)`
  flex: 0 0 auto;
`;

export const RailBrandName = styled.span<{ $isCollapsed: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["2xl"]};
  font-weight: 500;
  max-width: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "180px")};
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? "0" : theme.space.sm)};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition:
    max-width ${theme.motion.base} ease,
    margin-left ${theme.motion.base} ease,
    opacity ${theme.motion.fast} ease;
`;

export const RailItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin: ${theme.space.lg} 0 0;
  padding: 0;
  list-style: none;
`;

export const RailItem = styled(Link, transientProps)<{
  $isActive: boolean;
  $isCollapsed: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  width: ${({ $isCollapsed }) => ($isCollapsed ? "var(--nav-item-size)" : "100%")};
  height: var(--nav-item-size);
  margin: ${({ $isCollapsed }) => ($isCollapsed ? "0 auto" : "0")};
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? "0" : theme.space.md)};
  border-radius: ${theme.borderRadius.full};
  color: ${({ $isActive }) => ($isActive ? theme.foreground.accent : theme.foreground.secondary)};
  background: ${({ $isActive }) => ($isActive ? theme.surface.accentSecondary : "transparent")};
  transition:
    background ${theme.motion.fast} ease,
    width ${theme.motion.base} ease,
    padding-left ${theme.motion.base} ease;

  &:hover {
    background: ${({ $isActive }) =>
      hoverFill($isActive ? theme.surface.accentSecondary : "transparent")};
  }
`;

export const RailItemLabel = styled.span<{ $isCollapsed: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  max-width: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "180px")};
  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? "0" : theme.space.md)};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition:
    max-width ${theme.motion.base} ease,
    margin-left ${theme.motion.base} ease,
    opacity ${theme.motion.fast} ease;
`;

export const RailFoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
  margin-top: auto;
`;
