"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const FilingItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;
