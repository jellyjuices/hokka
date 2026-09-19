import type { IconName } from "@/src/components/Icon";

export type ObligationState = "collecting" | "claimable" | "collected";

export type Obligation = {
  id: string;
  label: string;
  value: string;
  caption: string;
  icon: IconName;
  state: ObligationState;
};

export type ObligationCardProps = {
  obligation: Obligation;
  onToggle: (id: string) => void;
};
