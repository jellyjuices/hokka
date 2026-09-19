"use client";

import styled from "@emotion/styled";
import { mediaDown, mediaUp } from "@/src/lib/breakpoints";

export const DashboardPagination = styled.div`
  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const DashboardAction = styled.div`
  ${mediaDown("smTablet")} {
    display: none;
  }
`;
