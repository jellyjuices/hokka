"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";

export const ObligationActions = styled.div`
  display: flex;
  gap: ${theme.space.xs};
`;

const actionStyles = `
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.accent};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.primary)};
  }
`;

export const ObligationAction = styled.button`
  ${actionStyles}
`;

export const ObligationLink = styled(Link)`
  ${actionStyles}
`;
