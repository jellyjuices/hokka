"use client";

import styled from "@emotion/styled";
import { CardWrapper } from "@/src/components/CardWrapper";

export const StreamStack = styled(CardWrapper)`
  flex: 1;

  > :first-child {
    flex: 1;
  }
`;
