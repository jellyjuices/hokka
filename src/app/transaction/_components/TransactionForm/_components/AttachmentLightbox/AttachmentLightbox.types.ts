import type { Attachment } from "../../TransactionForm.types";

export type AttachmentLightboxProps = {
  attachment: Attachment | null;
  onClose: () => void;
};

export type PdfPreviewProps = {
  url: string;
  name: string;
};
