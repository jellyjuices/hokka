"use client";

import styled from "@emotion/styled";
import { CardWrapper } from "@/src/components/CardWrapper";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const ObligationsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};

  ${mediaDown("smTablet")} {
    flex: 1;
  }
`;

export const ObligationsFiledGroup = styled(CardWrapper)`
  ${mediaDown("smTablet")} {
    display: none;
  }
`;
