export type AutofillPromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAutofill: () => void;
  onReference: () => void;
};
