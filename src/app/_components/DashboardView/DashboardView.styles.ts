"use client";

import styled from "@emotion/styled";
import { mediaUp } from "@/src/lib/breakpoints";

export const Pagination = styled.div`
  ${mediaUp("smTablet")} {
    display: none;
  }
`;
