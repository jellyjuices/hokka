import type { IconName } from "@/src/components/Icon";

export type StreamPanelProps = {
  label: string;
  icon: IconName;
  value: string;
  caption: string;
  metricLabel: string;
  metricValue: string;
};
