import * as styles from "./Field.styles";
import type { FieldProps, TextInputProps } from "./Field.types";

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <styles.Root>
      <styles.Label htmlFor={htmlFor}>{label}</styles.Label>
      {children}
      {hint && <styles.Hint>{hint}</styles.Hint>}
    </styles.Root>
  );
}

export function TextInput({ id, name, type = "text", placeholder, defaultValue }: TextInputProps) {
  return (
    <styles.Input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
}

export const Select = styles.Select;
