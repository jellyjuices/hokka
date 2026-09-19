"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown, mediaUp } from "@/src/lib/breakpoints";

export const Root = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  margin-bottom: ${theme.space.lg};
`;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-width: 0;
  color: ${theme.foreground.primary};
`;

export const Title = styled.h1`
  margin: 0;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["3xl"]};
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

export const WideTitle = styled.span`
  ${mediaDown("smTablet")} {
    display: none;
  }
`;

export const NarrowTitle = styled.span`
  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const Glyph = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;

  ${mediaDown("smTablet")} {
    display: none;
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  flex: 0 0 auto;
`;

export const Description = styled.p`
  margin: ${theme.space.xs} 0 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;
