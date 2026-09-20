import type { IconName } from "@/src/components/Icon";

export type ObligationState = "collecting" | "claimable" | "collected";

export type Obligation = {
  id: string;
  label: string;
  amount: number;
  caption: string;
  icon: IconName;
  state: ObligationState;
  filingHref: string | null;
};

export type ObligationCardProps = {
  obligation: Obligation;
};
