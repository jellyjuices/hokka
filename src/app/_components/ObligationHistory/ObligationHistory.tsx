"use client";

import { ObligationCard } from "../ObligationCard";
import { HistoryHint, HistorySection, HistoryTitle } from "./ObligationHistory.styles";
import type { ObligationHistoryProps } from "./ObligationHistory.types";

export function ObligationHistory({ obligations }: ObligationHistoryProps) {
  if (obligations.length === 0) return null;

  return (
    <HistorySection aria-labelledby="filed-periods">
      <HistoryTitle id="filed-periods">Filed periods</HistoryTitle>
      <HistoryHint>Logged in the filing history. A remittance is added, never undone.</HistoryHint>
      {obligations.map((obligation) => (
        <ObligationCard key={obligation.id} obligation={obligation} />
      ))}
    </HistorySection>
  );
}
