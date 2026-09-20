"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { theme, hoverFill } from "@/src/lib/theme";
import { mediaDown, mediaUp } from "@/src/lib/breakpoints";

export const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  padding: ${theme.space.lg} 0;

  ${mediaDown("smTablet")} {
    padding: 0 0 ${theme.space.lg};
  }
`;

export const HeaderTitleBlock = styled.div``;

export const HeaderHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  min-width: 0;
  color: ${theme.foreground.primary};
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["3xl"]};
  font-weight: 500;
  line-height: 1.1;
`;

export const HeaderWideTitle = styled.span`
  ${mediaDown("smTablet")} {
    display: none;
  }
`;

export const HeaderNarrowTitle = styled.span`
  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const HeaderBack = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-left: calc(${theme.space.sm} * -1);
  flex: 0 0 auto;
  border-radius: ${theme.borderRadius.full};
  color: ${theme.foreground.primary};
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
  }
`;

export const HeaderGlyph = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;

  ${mediaDown("smTablet")} {
    display: none;
  }
`;

export const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  flex: 0 0 auto;
`;

export const HeaderDescription = styled.p`
  margin: ${theme.space.xs} 0 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;

export const ActionWrappper = styled.div`
  ${mediaDown("smTablet")} {
    display: none;
  }
`;
