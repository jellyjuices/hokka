"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(${theme.layout.columns}, minmax(0, 1fr));
  column-gap: ${theme.layout.gapX};
  row-gap: ${theme.layout.gapY};
  width: 100%;
  align-content: start;
`;

export const Item = styled.div`
  grid-column: span var(--span) / span var(--span);
  grid-row: span var(--row-span) / span var(--row-span);
  min-width: 0;

  ${mediaDown("lgTablet")} {
    grid-column: span var(--span-tablet) / span var(--span-tablet);
  }

  ${mediaDown("smTablet")} {
    grid-column: span var(--span-mobile) / span var(--span-mobile);
    grid-row: auto;
  }
`;
