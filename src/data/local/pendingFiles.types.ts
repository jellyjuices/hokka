export type PendingFile = {
  documentId: string;
  fileKey: string;
  fileName: string;
  contentType: string;
  size: number;
  blob: Blob;
};
