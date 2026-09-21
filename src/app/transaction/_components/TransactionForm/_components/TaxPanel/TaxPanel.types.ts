export type TaxPanelProps = {
  hstRate: number;
  isTaxed: boolean;
  tips: string;
  claimablePct: string;
  onTaxedChange: (isTaxed: boolean) => void;
  onTipsChange: (tips: string) => void;
  onClaimableChange: (claimablePct: string) => void;
};
