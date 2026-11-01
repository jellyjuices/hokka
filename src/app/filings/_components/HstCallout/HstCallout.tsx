"use client";

import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { CalloutLink } from "./HstCallout.styles";

export function HstCallout() {
  return (
    <CalloutLink href="/hst">
      HST owed and ITCs by period
      <Icon name={ArrowRightIcon} size={18} />
    </CalloutLink>
  );
}
