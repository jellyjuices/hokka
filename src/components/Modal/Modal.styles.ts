"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { theme, hoverFill } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const riseIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.98); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const ModalScrim = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: color-mix(in srgb, ${theme.foreground.primary} 32%, transparent);
  animation: ${fadeIn} ${theme.motion.fast} ease;
`;

export const ModalPanel = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 61;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
  width: min(560px, calc(100vw - ${theme.space.xl}));
  max-height: min(720px, calc(100dvh - ${theme.space.xl}));
  padding: ${theme.space.xl};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.surface.primary};
  transform: translate(-50%, -50%);
  animation: ${riseIn} ${theme.motion.base} ease;
  overflow-y: auto;

  ${mediaDown("smTablet")} {
    padding: ${theme.space.lg};
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.space.md};
`;

export const ModalTitle = styled(Dialog.Title)`
  margin: 0;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.xl};
  font-weight: 500;
  letter-spacing: -0.02em;
  color: ${theme.foreground.primary};
`;

export const ModalDescription = styled(Dialog.Description)`
  margin: ${theme.space.xs} 0 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;

export const ModalClose = styled(Dialog.Close)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.secondary};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.secondary)};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.space.sm};
`;
