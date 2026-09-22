"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Amount = styled.div`
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: ${theme.space.xs};
  min-width: 0;
  color: ${theme.foreground.primary};
`;

export const Affix = styled.span`
  flex: 0 0 auto;
`;

export const Editable = styled.span`
  display: inline-block;
  min-width: 1ch;
  max-width: 100%;
  color: ${theme.foreground.primary};
  font: inherit;
  white-space: pre;
  outline: none;

  &:empty::before {
    content: attr(data-placeholder);
    color: ${theme.foreground.disabled};
  }
`;
