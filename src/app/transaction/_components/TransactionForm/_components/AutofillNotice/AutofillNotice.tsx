"use client";

import { CheckCircleIcon, ReceiptIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import type { IconName } from "@/src/components/Icon";
import { NoticeRow } from "./AutofillNotice.styles";
import type { AutofillNoticeProps } from "./AutofillNotice.types";
import type { AutofillVariant } from "../../TransactionForm.types";

const GLYPHS: Record<AutofillVariant, IconName> = {
  info: ReceiptIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
};

export function AutofillNotice({ notice }: AutofillNoticeProps) {
  return (
    <NoticeRow $variant={notice.variant} role={notice.variant === "warning" ? "alert" : "status"}>
      <Icon name={GLYPHS[notice.variant]} size={18} />
      {notice.text}
    </NoticeRow>
  );
}
