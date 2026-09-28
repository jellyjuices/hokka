export type ConfirmDeleteProps = {
  open: boolean;
  title: string;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};
