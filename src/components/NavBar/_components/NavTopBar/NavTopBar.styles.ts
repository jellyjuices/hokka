"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { mediaUp } from "@/src/lib/breakpoints";

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  padding-bottom: ${theme.space.lg};

  ${mediaUp("smTablet")} {
    display: none;
  }
`;

export const TopBarBrand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  color: ${theme.foreground.accent};
  border-radius: ${theme.borderRadius.sm};
`;

export const TopBarBrandMark = styled(Image)`
  flex: 0 0 auto;
`;

export const TopBarBrandName = styled.span`
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["2xl"]};
  font-weight: 500;
  letter-spacing: -0.02em;
`;
