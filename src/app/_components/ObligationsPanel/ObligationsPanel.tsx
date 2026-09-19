"use client";

import { ObligationCard } from "../ObligationCard";
import * as styles from "./ObligationsPanel.styles";
import type { ObligationsPanelProps } from "./ObligationsPanel.types";

export function ObligationsPanel({ obligations, onToggle }: ObligationsPanelProps) {
  const open = obligations.filter((obligation) => obligation.state !== "collected");
  const collected = obligations.filter((obligation) => obligation.state === "collected");

  return (
    <styles.Root>
      {open.map((obligation) => (
        <ObligationCard key={obligation.id} obligation={obligation} onToggle={onToggle} />
      ))}
      <styles.History>
        {collected.map((obligation) => (
          <ObligationCard key={obligation.id} obligation={obligation} onToggle={onToggle} />
        ))}
      </styles.History>
    </styles.Root>
  );
}
