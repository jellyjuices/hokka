"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const HistorySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};

  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const HistoryTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
`;

export const HistoryHint = styled.p`
  margin: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;
