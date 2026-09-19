"use client";

import * as styles from "./SummaryDeck.styles";
import type { SummaryDeckProps } from "./SummaryDeck.types";

export function SummaryDeck({ label, trackRef, children }: SummaryDeckProps) {
  return (
    <styles.Root ref={trackRef} role="group" aria-label={label}>
      {children}
    </styles.Root>
  );
}
