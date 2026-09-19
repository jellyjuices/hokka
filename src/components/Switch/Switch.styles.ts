"use client";

import styled from "@emotion/styled";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { theme } from "@/src/lib/theme";

export const SwitchRoot = styled(SwitchPrimitive.Root)`
  position: relative;
  width: 60px;
  height: 32px;
  flex: 0 0 auto;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.tint};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &[data-state="checked"] {
    background: ${theme.surface.accent};
  }
`;

export const SwitchKnob = styled(SwitchPrimitive.Thumb)`
  display: block;
  width: 26px;
  height: 26px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  transform: translateX(3px);
  transition: transform ${theme.motion.fast} ease;
  will-change: transform;

  &[data-state="checked"] {
    transform: translateX(31px);
  }
`;
