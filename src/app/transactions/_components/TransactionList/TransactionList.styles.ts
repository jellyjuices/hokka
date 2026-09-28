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
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  margin: 0;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.warning};
  color: ${theme.foreground.warning};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
`;

export const ListNoticeIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  color: ${theme.foreground.warning};
`;
