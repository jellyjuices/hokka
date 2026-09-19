import { MetricRow } from "@/src/components/MetricRow";
import { StatTile } from "@/src/components/StatTile";
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
    <StreamStack>
      <StatTile label={label} icon={icon} value={value} caption={caption} />
      <MetricRow icon="filings" label={metricLabel} value={metricValue} />
    </StreamStack>
  );
}
