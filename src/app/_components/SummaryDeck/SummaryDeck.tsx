"use client";

import { DeckTrack } from "./SummaryDeck.styles";
import type { SummaryDeckProps } from "./SummaryDeck.types";

export function SummaryDeck({ label, trackRef, children }: SummaryDeckProps) {
  return (
    <DeckTrack ref={trackRef} role="group" aria-label={label}>
      {children}
    </DeckTrack>
  );
}
