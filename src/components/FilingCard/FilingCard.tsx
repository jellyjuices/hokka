"use client";

import { CopyIcon, InvoiceIcon } from "@phosphor-icons/react/dist/ssr";
import { EntryCard } from "@/src/components/EntryCard";
import type { MenuItem } from "@/src/components/Menu";
import type { Filing, FilingType } from "@/src/data/domain.types";
import { formatCurrency } from "@/src/lib/money";
import { formatDate } from "@/src/lib/dates";
import type { FilingCardProps } from "./FilingCard.types";

const FILING_LABEL: Record<FilingType, string> = {
  hst: "HST remittance",
  income_tax: "Income tax instalment",
};

// A filing is never edited or removed, so its menu only ever reads from the row.
function itemsFor(filing: Filing): MenuItem[] {
  if (filing.referenceNumber === "") return [];
  return [
    {
      id: "copy-reference",
      label: "Copy reference number",
      icon: CopyIcon,
      onSelect: () => void navigator.clipboard.writeText(filing.referenceNumber),
    },
  ];
}

export function FilingCard({ filing }: FilingCardProps) {
  return (
    <EntryCard
      icon={InvoiceIcon}
      color={null}
      date={formatDate(filing.filedDate)}
      detail={filing.taxPeriodId}
      title={FILING_LABEL[filing.filingType]}
      amount={formatCurrency(filing.amountFiled)}
      menuLabel="Filing options"
      menuItems={itemsFor(filing)}
    />
  );
}
