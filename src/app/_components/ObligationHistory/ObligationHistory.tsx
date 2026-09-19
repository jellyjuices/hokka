"use client";

import { ObligationCard } from "../ObligationCard";
import * as styles from "./ObligationHistory.styles";
import type { ObligationHistoryProps } from "./ObligationHistory.types";

export function ObligationHistory({ obligations, onToggle }: ObligationHistoryProps) {
  if (obligations.length === 0) return null;

  return (
    <styles.Root aria-labelledby="filed-periods">
      <styles.Title id="filed-periods">Filed periods</styles.Title>
      <styles.Hint>Swipe a period left to reopen it, or use its undo button.</styles.Hint>
      {obligations.map((obligation) => (
        <ObligationCard key={obligation.id} obligation={obligation} onToggle={onToggle} />
      ))}
    </styles.Root>
  );
}
