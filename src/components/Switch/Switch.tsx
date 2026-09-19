import { SwitchKnob, SwitchRoot } from "./Switch.styles";
import type { SwitchProps } from "./Switch.types";

export function Switch({ id, checked, onCheckedChange, label }: SwitchProps) {
  return (
    <SwitchRoot id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={label}>
      <SwitchKnob />
    </SwitchRoot>
  );
}
