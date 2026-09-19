export type SelectTone = "chip" | "outline" | "plain";

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
  tone?: SelectTone;
  onChange?: (value: string) => void;
};
