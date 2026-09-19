"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown, mediaUp } from "@/src/lib/breakpoints";
import type { ActivityVisibility } from "./ActivityList.types";

const visibilities: Record<ActivityVisibility, ReturnType<typeof css>> = {
  all: css``,
  wide: css`
    ${mediaDown("smTablet")} {
      display: none;
    }
  `,
  narrow: css`
    ${mediaUp("smTablet")} {
      display: none;
    }
  `,
};

export const Root = styled.section<{ $visibility: ActivityVisibility }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  ${({ $visibility }) => visibilities[$visibility]};
`;

export const Title = styled.h2`
  margin: 0 0 ${theme.space.xs};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  letter-spacing: -0.01em;
`;

export const Items = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Footer = styled.div`
  margin-top: ${theme.space.sm};
`;
