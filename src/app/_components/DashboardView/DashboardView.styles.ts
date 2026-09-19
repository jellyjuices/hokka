"use client";

import styled from "@emotion/styled";
import { mediaUp } from "@/src/lib/breakpoints";

export const DashboardPagination = styled.div`
  ${mediaUp("smTablet")} {
    display: none;
  }
`;
