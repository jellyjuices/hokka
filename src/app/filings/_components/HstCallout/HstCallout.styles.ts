"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const CalloutLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  width: 100%;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  text-decoration: none;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.secondary)};
  }

  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.space.sm};
`;
