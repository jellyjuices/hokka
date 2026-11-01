"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { theme, hoverFill } from "@/src/lib/theme";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const LightboxScrim = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 70;
  background: color-mix(in srgb, ${theme.foreground.primary} 88%, transparent);
  animation: ${fadeIn} ${theme.motion.fast} ease;
`;

export const LightboxPanel = styled(Dialog.Content)`
  position: fixed;
  inset: 0;
  z-index: 71;
  display: flex;
  flex-direction: column;
  padding: ${theme.space.lg};
  gap: ${theme.space.md};
  animation: ${fadeIn} ${theme.motion.base} ease;

  &:focus {
    outline: none;
  }
`;

export const LightboxBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
`;

export const LightboxTitle = styled(Dialog.Title)`
  margin: 0;
  overflow: hidden;
  color: ${theme.surface.primary};
  font-size: ${theme.fontSize.sm};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const LightboxClose = styled(Dialog.Close)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.primary};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.primary)};
  }
`;

export const LightboxStage = styled.div`
  position: relative;
  display: grid;
  flex: 1;
  min-height: 0;
  place-items: center;
`;

export const LightboxImage = styled(Image)`
  object-fit: contain;
`;

export const LightboxPages = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.md};
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export const LightboxPage = styled.img`
  display: block;
  width: min(900px, 100%);
  height: auto;
  border-radius: ${theme.borderRadius.md};
`;

export const LightboxMessage = styled.p`
  margin: 0;
  color: ${theme.surface.primary};
  font-size: ${theme.fontSize.sm};
`;
