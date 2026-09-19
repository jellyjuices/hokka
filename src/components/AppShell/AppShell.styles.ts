"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const ShellLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${theme.layout.railGap};
  min-height: 100dvh;
  padding: ${theme.layout.gutter};

  ${mediaDown("smTablet")} {
    gap: 0;
    padding-bottom: calc(76px + env(safe-area-inset-bottom));
  }
`;

export const ShellMain = styled.main`
  flex: 1 1 auto;
  min-width: 0;
  max-width: ${theme.layout.contentMax};
  display: flex;
  flex-direction: column;
`;
