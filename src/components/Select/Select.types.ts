export type SelectVariant = "primary" | "outlined" | "secondary" | "ghost";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  label: string;
  options: SelectOption[];
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  variant?: SelectVariant;
  onChange?: (value: string) => void;
};
