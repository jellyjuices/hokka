"use client";

import { ObligationCard } from "../ObligationCard";
import { ObligationsFiledGroup, ObligationsStack } from "./ObligationsPanel.styles";
import type { ObligationsPanelProps } from "./ObligationsPanel.types";

export function ObligationsPanel({ obligations, onToggle }: ObligationsPanelProps) {
  const open = obligations.filter((obligation) => obligation.state !== "collected");
  const collected = obligations.filter((obligation) => obligation.state === "collected");

  return (
    <ObligationsStack>
      {open.map((obligation) => (
        <ObligationCard key={obligation.id} obligation={obligation} onToggle={onToggle} />
      ))}
      <ObligationsFiledGroup>
        {collected.map((obligation) => (
          <ObligationCard key={obligation.id} obligation={obligation} onToggle={onToggle} />
        ))}
      </ObligationsFiledGroup>
    </ObligationsStack>
  );
}
