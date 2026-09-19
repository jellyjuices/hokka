"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readPendingFile } from "@/src/data/local";
import { documentFileUrl } from "@/src/data/remote";
import { newId } from "@/src/lib/id";
import type { Attachment } from "./TransactionForm.types";

export function useAttachments(documentId: string | null, onAdded: (added: Attachment[]) => void) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const objectUrls = useRef<string[]>([]);
  const offeredId = useRef<string | null>(null);
  const offer = useRef(onAdded);

  useEffect(() => {
    offer.current = onAdded;
  });

  const trackObjectUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    objectUrls.current = [...objectUrls.current, url];
    return url;
  }, []);

  useEffect(() => {
    if (documentId === null) return;
    let isActive = true;

    void readPendingFile(documentId).then((pending) => {
      if (!isActive || offeredId.current === documentId) return;
      offeredId.current = documentId;
      const contentType = pending?.contentType ?? "image/*";
      const stored: Attachment = {
        id: newId(),
        name: pending?.fileName ?? "Attachment",
        previewUrl: pending ? trackObjectUrl(pending.blob) : documentFileUrl(documentId),
        isImage: contentType.startsWith("image/"),
        file: pending ? new File([pending.blob], pending.fileName, { type: contentType }) : null,
        documentId,
      };
      setAttachments((current) =>
        current.some((attachment) => attachment.documentId === documentId)
          ? current
          : [...current, stored],
      );
      offer.current([stored]);
    });

    return () => {
      isActive = false;
    };
  }, [documentId, trackObjectUrl]);

  useEffect(() => {
    const urls = objectUrls;
    return () => {
      urls.current.forEach((url) => URL.revokeObjectURL(url));
      urls.current = [];
    };
  }, []);

  function add(files: File[]) {
    const added = files.map((file) => ({
      id: newId(),
      name: file.name,
      previewUrl: trackObjectUrl(file),
      isImage: file.type.startsWith("image/"),
      file,
      documentId: null,
    }));
    if (added.length === 0) return added;
    setAttachments((current) => [...current, ...added]);
    offer.current(added);
    return added;
  }

  function remove(id: string) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id));
  }

  return { attachments, add, remove };
}

export type AttachmentsApi = ReturnType<typeof useAttachments>;
