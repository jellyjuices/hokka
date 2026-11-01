"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";

export const ObligationArrow = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.accent};
  transition: background ${theme.motion.fast} ease;
`;

export const ObligationLink = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: ${theme.borderRadius.lg};
  color: inherit;
  text-decoration: none;

  > * {
    flex: 1;
  }

  &:hover [data-obligation-arrow] {
    background: ${hoverFill(theme.surface.primary)};
  }
`;
