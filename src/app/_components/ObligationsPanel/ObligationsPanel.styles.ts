"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const History = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};

  ${mediaDown("smTablet")} {
    display: none;
  }
`;
