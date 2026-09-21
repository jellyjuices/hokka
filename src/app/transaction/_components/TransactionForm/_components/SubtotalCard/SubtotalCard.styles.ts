"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Input } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";

const openFromEnd = keyframes`
  from { width: 50%; margin-inline-start: 50%; }
  to { width: 100%; margin-inline-start: 0; }
`;

export const SubtotalField = styled(Input)`
  width: 100%;
  animation: ${openFromEnd} ${theme.motion.base} ease;
`;
