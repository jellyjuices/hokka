"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const PinScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: ${theme.space.lg};
  background: ${theme.surface.secondary};
`;

export const PinPanel = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
  width: 100%;
  max-width: 360px;
  padding: ${theme.space.xl};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.surface.primary};
`;

export const PinIdentity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.space.md};
`;

export const PinMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.accentSecondary};
  color: ${theme.foreground.accent};
`;

export const PinHeading = styled.h1`
  margin: 0;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["2xl"]};
  font-weight: 500;
  color: ${theme.foreground.primary};
`;

export const PinIntro = styled.p`
  margin: ${theme.space.xs} 0 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.foreground.secondary};
`;

export const PinError = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.foreground.accent};
`;
