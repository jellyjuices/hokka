"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { mediaDown, mediaUp } from "@/src/lib/breakpoints";
import { theme } from "@/src/lib/theme";
import type { CardWrapperDirection } from "./CardWrapper.types";

const OUTER = theme.borderRadius.lg;
const INNER = theme.borderRadius.sm;

// Every rule carries a pseudo-class so it out-ranks the radius a tile sets on
// itself: a plain `& > *` ties with the tile's own class and then loses on
// whichever order Emotion happened to inject the two.
const grouped: Record<CardWrapperDirection, ReturnType<typeof css>> = {
  row: css`
    & > * {
      flex: 1 1 0;
      min-width: 0;
    }

    & > *:first-child:not(:last-child) {
      border-radius: ${OUTER} ${INNER} ${INNER} ${OUTER};
    }

    & > *:last-child:not(:first-child) {
      border-radius: ${INNER} ${OUTER} ${OUTER} ${INNER};
    }

    & > *:not(:first-child):not(:last-child) {
      border-radius: ${INNER};
    }
  `,
  column: css`
    & > * {
      min-width: 0;
    }

    & > *:first-child:not(:last-child) {
      border-radius: ${OUTER} ${OUTER} ${INNER} ${INNER};
    }

    & > *:last-child:not(:first-child) {
      border-radius: ${INNER} ${INNER} ${OUTER} ${OUTER};
    }

    & > *:not(:first-child):not(:last-child) {
      border-radius: ${INNER};
    }
  `,
};

export const WrapperRoot = styled.div<{
  $direction: CardWrapperDirection;
  $stackOnMobile: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: ${theme.space.sm};

  & > *:only-child {
    border-radius: ${OUTER};
  }

  ${({ $direction, $stackOnMobile }) =>
    $stackOnMobile && $direction === "row"
      ? css`
          ${mediaUp("mobile")} {
            ${grouped.row}
          }

          ${mediaDown("mobile")} {
            flex-direction: column;
            ${grouped.column}
          }
        `
      : grouped[$direction]}
`;
