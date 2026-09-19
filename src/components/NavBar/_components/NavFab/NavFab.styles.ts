"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const FabLink = styled(Link)`
  position: fixed;
  right: ${theme.layout.gutter};
  bottom: calc(76px + env(safe-area-inset-bottom));
  z-index: 25;
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 48px;
  padding: 0 ${theme.space.md};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accent};
  color: ${theme.foreground.inverse};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;

  ${mediaUp("smTablet")} {
    display: none;
  }
`;
