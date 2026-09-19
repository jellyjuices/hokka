import { Icon } from "@/src/components/Icon";
import { MetricGlyph, MetricLabel, MetricLayout, MetricValue } from "./MetricRow.styles";
import type { MetricRowProps } from "./MetricRow.types";

export function MetricRow({ label, value, icon }: MetricRowProps) {
  return (
    <MetricLayout>
      {icon && (
        <MetricGlyph>
          <Icon name={icon} size={20} />
        </MetricGlyph>
      )}
      <MetricLabel>{label}</MetricLabel>
      <MetricValue>{value}</MetricValue>
    </MetricLayout>
  );
}
