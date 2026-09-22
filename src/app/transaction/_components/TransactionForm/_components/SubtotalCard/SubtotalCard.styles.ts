"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { InputShell } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";

const openFromEnd = keyframes`
  from { width: 50%; margin-inline-start: 50%; }
  to { width: 100%; margin-inline-start: 0; }
`;

export const SubtotalShell = styled(InputShell)`
  width: 100%;
  font-size: ${theme.fontSize.lg};
  animation: ${openFromEnd} ${theme.motion.base} ease;
`;
