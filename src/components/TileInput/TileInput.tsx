"use client";

import type { MouseEvent } from "react";
import { TileBlock, TileGroup, TileHint, TileLabel, TileShell } from "./TileInput.styles";
import type { TileInputProps } from "./TileInput.types";

const CONTROLS = "button, input, select, textarea, a";
const ACTIVATABLE = "button, input:not([type='hidden']), textarea";

function activateControl(event: MouseEvent<HTMLDivElement>) {
  if (event.target instanceof Element && event.target.closest(CONTROLS) !== null) return;
  event.currentTarget.querySelector<HTMLElement>(ACTIVATABLE)?.click();
}

export function TileInput({ children, label, hint, htmlFor, onClick }: TileInputProps) {
  const slots = (
    <>
      {label === undefined ? null : <TileLabel>{label}</TileLabel>}
      {children}
    </>
  );

  return (
    <TileGroup>
      {htmlFor === undefined ? (
        <TileBlock onClick={onClick ?? activateControl}>{slots}</TileBlock>
      ) : (
        <TileShell htmlFor={htmlFor}>{slots}</TileShell>
      )}
      {hint === undefined ? null : <TileHint>{hint}</TileHint>}
    </TileGroup>
  );
}
