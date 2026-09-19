"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const LockNote = styled.p`
  margin: 0;
  padding: 0 ${theme.space.lg};
  color: ${theme.foreground.disabled};
  font-size: ${theme.fontSize.xs};
  line-height: 1.4;

  &[role="alert"] {
    color: ${theme.foreground.accent};
  }
`;
