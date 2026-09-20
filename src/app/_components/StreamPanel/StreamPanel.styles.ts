"use client";

import styled from "@emotion/styled";
import { CardWrapper } from "@/src/components/CardWrapper";
import { mediaDown } from "@/src/lib/breakpoints";

export const StreamStack = styled(CardWrapper)`
  ${mediaDown("smTablet")} {
    flex: 1;

    > :first-of-type {
      flex: 1;
    }
  }
`;
