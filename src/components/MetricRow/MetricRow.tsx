import { Icon } from "@/src/components/Icon";
import * as styles from "./MetricRow.styles";
import type { MetricRowProps } from "./MetricRow.types";

export function MetricRow({ label, value, icon }: MetricRowProps) {
  return (
    <styles.Root>
      {icon && (
        <styles.Glyph>
          <Icon name={icon} size={20} />
        </styles.Glyph>
      )}
      <styles.Label>{label}</styles.Label>
      <styles.Value>{value}</styles.Value>
    </styles.Root>
  );
}
