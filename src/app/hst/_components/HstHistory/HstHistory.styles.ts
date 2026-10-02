"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const PeriodItems = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;
