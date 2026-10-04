export type TaxPanelProps = {
  hstRate: number;
  isTaxed: boolean;
  hstAmount: string;
  hstAtRate: number;
  tips: string;
  claimablePct: string;
  onTaxedChange: (isTaxed: boolean) => void;
  onHstAmountChange: (hstAmount: string) => void;
  onTipsChange: (tips: string) => void;
  onClaimableChange: (claimablePct: string) => void;
};
