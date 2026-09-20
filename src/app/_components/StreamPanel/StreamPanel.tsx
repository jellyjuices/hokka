import { AnimatedNumber } from "@/src/components/AnimatedNumber";
import { MetricRow } from "@/src/components/MetricRow";
import { StatTile } from "@/src/components/StatTile";
import { formatCurrency } from "@/src/lib/money";
import { StreamStack } from "./StreamPanel.styles";
import type { StreamPanelProps } from "./StreamPanel.types";

export function StreamPanel({
  label,
  icon,
  value,
  caption,
  metricLabel,
  metricValue,
}: StreamPanelProps) {
  return (
    <StreamStack direction="column">
      <StatTile
        label={label}
        icon={icon}
        value={<AnimatedNumber value={value} format={formatCurrency} />}
        caption={caption}
      />
      <MetricRow icon="filings" label={metricLabel} value={metricValue} />
    </StreamStack>
  );
}
