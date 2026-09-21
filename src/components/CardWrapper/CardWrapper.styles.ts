"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { mediaDown, mediaUp } from "@/src/lib/breakpoints";
import { stackRadius, theme } from "@/src/lib/theme";
import type { CardWrapperDirection } from "./CardWrapper.types";

const grouped: Record<CardWrapperDirection, ReturnType<typeof css>> = {
  row: css`
    & > * {
      flex: 1 1 0;
      min-width: 0;
    }

    ${stackRadius("row")}
  `,
  column: css`
    & > * {
      min-width: 0;
    }

    ${stackRadius("column")}
  `,
};

export const WrapperRoot = styled.div<{
  $direction: CardWrapperDirection;
  $stackOnMobile: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: ${theme.space.sm};

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
