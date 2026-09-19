import type { IconName } from "@/src/components/Icon";

export type ObligationState = "collecting" | "claimable" | "collected";

export type Obligation = {
  id: string;
  label: string;
  value: string;
  caption: string;
  icon: IconName;
  state: ObligationState;
  // Where filing this one starts. Null once it is filed: a remittance is added, never
  // undone, so a collected card has nothing left to do.
  filingHref: string | null;
};

export type ObligationCardProps = {
  obligation: Obligation;
};
