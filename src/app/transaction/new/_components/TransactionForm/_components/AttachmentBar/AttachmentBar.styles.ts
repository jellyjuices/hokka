"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import { Button } from "@/src/components/Button";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  flex: 0 0 auto;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const CameraButton = styled(Button)`
  ${mediaDown("smTablet")} {
    position: fixed;
    right: ${theme.layout.gutter};
    bottom: calc(76px + env(safe-area-inset-bottom));
    z-index: 25;
    min-height: 56px;
    padding: 0 ${theme.space.lg};
    border-radius: ${theme.borderRadius.full};
  }
`;

export const StackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover > span {
    transform: rotate(0deg);
  }
`;

export const StackThumb = styled.span<{ $depth: number }>`
  position: relative;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  flex: 0 0 auto;
  margin-left: ${({ $depth }) => ($depth === 0 ? "0" : `calc(${theme.space.lg} * -1)`)};
  z-index: ${({ $depth }) => 3 - $depth};
  border: 2px solid ${theme.surface.primary};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.secondary};
  overflow: hidden;
  transform: rotate(${({ $depth }) => `${$depth * 2}deg`});
  transition: transform ${theme.motion.fast} ease;
`;

export const StackImage = styled(Image)`
  object-fit: cover;
`;

export const StackCount = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, ${theme.foreground.primary} 45%, transparent);
  color: ${theme.foreground.inverse};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
`;
