import { SwitchKnob, SwitchRoot } from "./Switch.styles";
import type { SwitchProps } from "./Switch.types";

export function Switch({ id, checked, onCheckedChange, label, disabled }: SwitchProps) {
  return (
    <SwitchRoot
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
    >
      <SwitchKnob />
    </SwitchRoot>
  );
}
