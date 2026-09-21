"use client";

import styled from "@emotion/styled";
import { stackRadius, theme } from "@/src/lib/theme";

export const ResultLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const ResultCount = styled.p`
  margin: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;

export const ResultItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  ${stackRadius("column", "& > li", "> *")}
`;
