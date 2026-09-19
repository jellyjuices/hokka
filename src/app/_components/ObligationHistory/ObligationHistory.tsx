"use client";

import { ObligationCard } from "../ObligationCard";
import { HistoryHint, HistorySection, HistoryTitle } from "./ObligationHistory.styles";
import type { ObligationHistoryProps } from "./ObligationHistory.types";

export function ObligationHistory({ obligations, onToggle }: ObligationHistoryProps) {
  if (obligations.length === 0) return null;

  return (
    <HistorySection aria-labelledby="filed-periods">
      <HistoryTitle id="filed-periods">Filed periods</HistoryTitle>
      <HistoryHint>Swipe a period left to reopen it, or use its undo button.</HistoryHint>
      {obligations.map((obligation) => (
        <ObligationCard key={obligation.id} obligation={obligation} onToggle={onToggle} />
      ))}
    </HistorySection>
  );
}
