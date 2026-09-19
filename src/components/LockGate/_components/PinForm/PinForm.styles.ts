"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import { TileValue } from "@/src/components/TileInput";
import { theme, hoverFill } from "@/src/lib/theme";

export const PinScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: ${theme.space.lg};
  background: ${theme.surface.primary};
`;

export const PinPanel = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
  width: 100%;
  max-width: 360px;
  padding: ${theme.space.xl};
`;

export const PinMark = styled(Image)`
  flex: 0 0 auto;
  align-self: center;
  margin-bottom: ${theme.space.sm};
`;

export const PinError = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.foreground.accent};
`;

export const PinChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const PinReveal = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  margin-right: calc(-1 * ${theme.space.xs});
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: none;
  color: ${theme.foreground.secondary};
  cursor: pointer;
  transition:
    background ${theme.motion.fast} ease,
    color ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
    color: ${theme.foreground.primary};
  }
`;

export const PinValue = styled(TileValue)`
  text-align: left;
`;
