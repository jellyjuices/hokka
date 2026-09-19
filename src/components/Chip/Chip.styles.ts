"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const Root = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${theme.space.xs} ${theme.space.sm};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accentSecondary};
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.xs};
  line-height: 1.2;
  white-space: nowrap;
`;
