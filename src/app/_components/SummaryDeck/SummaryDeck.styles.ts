"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const DeckTrack = styled.div`
  display: contents;

  ${mediaDown("smTablet")} {
    --slide-peek: 44px;
    display: flex;
    grid-column: 1 / -1;
    gap: ${theme.space.md};
    margin-inline: calc(${theme.layout.gutter} * -1);
    padding-inline: ${theme.layout.gutter};
    scroll-padding-inline: ${theme.layout.gutter};
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > * {
      flex: 0 0 calc(100% - var(--slide-peek));
      scroll-snap-align: start;
      scroll-snap-stop: always;
    }
  }
`;
