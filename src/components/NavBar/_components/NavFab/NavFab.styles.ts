"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const Root = styled(Link)`
  position: fixed;
  right: ${theme.layout.gutter};
  bottom: calc(88px + env(safe-area-inset-bottom));
  z-index: 25;
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-height: 56px;
  padding: 0 ${theme.space.lg};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accent};
  color: ${theme.foreground.inverse};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;

  ${mediaUp("smTablet")} {
    display: none;
  }
`;
