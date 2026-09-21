import type { Attachment } from "../../TransactionForm.types";

export type AttachmentBarProps = {
  attachments: Attachment[];
  onFilesChosen: (files: File[]) => void;
  onOpenGallery: () => void;
};
