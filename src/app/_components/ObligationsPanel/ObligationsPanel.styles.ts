"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const ObligationsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const ObligationsFiledGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};

  ${mediaDown("smTablet")} {
    display: none;
  }
`;
