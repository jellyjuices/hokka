"use client";

import { CardWrapper } from "@/src/components/CardWrapper";
import { ObligationCard } from "../ObligationCard";
import { ObligationsFiledGroup, ObligationsStack } from "./ObligationsPanel.styles";
import type { ObligationsPanelProps } from "./ObligationsPanel.types";

export function ObligationsPanel({ obligations }: ObligationsPanelProps) {
  const open = obligations.filter((obligation) => obligation.state !== "collected");
  const collected = obligations.filter((obligation) => obligation.state === "collected");

  return (
    <ObligationsStack>
      {open.length > 0 && (
        <CardWrapper direction="column">
          {open.map((obligation) => (
            <ObligationCard key={obligation.id} obligation={obligation} />
          ))}
        </CardWrapper>
      )}
      {collected.length > 0 && (
        <ObligationsFiledGroup direction="column">
          {collected.map((obligation) => (
            <ObligationCard key={obligation.id} obligation={obligation} />
          ))}
        </ObligationsFiledGroup>
      )}
    </ObligationsStack>
  );
}
