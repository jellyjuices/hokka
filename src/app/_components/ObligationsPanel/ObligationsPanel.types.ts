import type { Obligation } from "../ObligationCard";

export type ObligationsPanelProps = {
  obligations: Obligation[];
  onToggle: (id: string) => void;
};
