"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const StreamStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};

  ${mediaDown("smTablet")} {
    flex: 1;

    > :first-of-type {
      flex: 1;
    }
  }
`;
