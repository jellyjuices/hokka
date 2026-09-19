"use client";

import { Icon } from "@/src/components/Icon";
import { DASH_RADIUS, DashedOutline, DropLabel, DropPanel, DropScrim } from "./DropZone.styles";
import type { DropZoneProps } from "./DropZone.types";
import { useFileDrop } from "./useFileDrop";

export function DropZone({ onFiles, label = "Drop to create transaction" }: DropZoneProps) {
  const isOver = useFileDrop(onFiles);

  if (!isOver) return null;

  return (
    <DropScrim role="presentation">
      <DropPanel>
        <DashedOutline aria-hidden focusable="false">
          <rect x="0" y="0" width="100%" height="100%" rx={DASH_RADIUS} ry={DASH_RADIUS} />
        </DashedOutline>
        <Icon name="receipt" size={40} />
        <DropLabel>{label}</DropLabel>
      </DropPanel>
    </DropScrim>
  );
}
