import { FieldGroup, FieldHint, FieldInput, FieldLabel, FieldSelect } from "./Field.styles";
import type { FieldProps, TextInputProps } from "./Field.types";

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return (
    <FieldGroup>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {hint && <FieldHint>{hint}</FieldHint>}
    </FieldGroup>
  );
}

export function TextInput({
  id,
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  autoComplete,
  autoFocus,
  onChange,
}: TextInputProps) {
  return (
    <FieldInput
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      onChange={onChange}
    />
  );
}

export const Select = FieldSelect;
