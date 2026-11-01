"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { theme, hoverFill } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const PeriodItems = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  ${mediaDown("smTablet")} {
    grid-template-columns: minmax(0, 1fr);
  }

  > li {
    display: flex;
    flex-direction: column;

    > * {
      flex: 1;
    }
  }
`;

export const PeriodFileLink = styled(Link)`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.accent};
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.primary)};
  }
`;
