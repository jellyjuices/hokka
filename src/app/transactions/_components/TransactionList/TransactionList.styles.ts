"use client";

import styled from "@emotion/styled";
import { stackRadius, theme } from "@/src/lib/theme";

export const ListLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const ListItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  ${stackRadius("column", "& > li", "> *")}
`;

export const ListNotice = styled.p`
  margin: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;
