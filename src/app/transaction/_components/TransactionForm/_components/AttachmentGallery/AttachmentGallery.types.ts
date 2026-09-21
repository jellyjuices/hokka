import type { Attachment } from "../../TransactionForm.types";

export type AttachmentGalleryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachments: Attachment[];
  onFilesChosen: (files: File[]) => void;
  onRemove: (id: string) => void;
};
