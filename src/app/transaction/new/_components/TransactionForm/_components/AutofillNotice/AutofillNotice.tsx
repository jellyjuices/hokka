"use client";

import { Icon } from "@/src/components/Icon";
import type { IconName } from "@/src/components/Icon";
import { NoticeRow } from "./AutofillNotice.styles";
import type { AutofillNoticeProps } from "./AutofillNotice.types";
import type { AutofillTone } from "../../TransactionForm.types";

const GLYPHS: Record<AutofillTone, IconName> = {
  reading: "receipt",
  good: "checkCircle",
  warn: "warning",
};

export function AutofillNotice({ notice }: AutofillNoticeProps) {
  return (
    <NoticeRow $tone={notice.tone} role={notice.tone === "warn" ? "alert" : "status"}>
      <Icon name={GLYPHS[notice.tone]} size={18} />
      {notice.text}
    </NoticeRow>
  );
}
