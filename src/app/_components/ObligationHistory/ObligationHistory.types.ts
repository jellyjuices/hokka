import type { Obligation } from "../ObligationCard";

export type ObligationHistoryProps = {
  obligations: Obligation[];
  onToggle: (id: string) => void;
};
