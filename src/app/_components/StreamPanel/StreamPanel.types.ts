import type { IconName } from "@/src/components/Icon";

export type StreamPanelProps = {
  label: string;
  icon: IconName;
  value: number;
  caption: string;
  metricLabel: string;
  metricValue: string;
};
