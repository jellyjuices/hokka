"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { PlusIcon, ReceiptIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/src/components/Button";
import { Icon } from "@/src/components/Icon";
import { FileInput } from "@/src/components/Input";
import { Modal } from "@/src/components/Modal";
import type { Attachment } from "../../TransactionForm.types";
import { AttachmentLightbox } from "../AttachmentLightbox";
import {
  GalleryAdd,
  GalleryGrid,
  GalleryImage,
  GalleryOpen,
  GalleryRemove,
  GalleryTile,
} from "./AttachmentGallery.styles";
import type { AttachmentGalleryProps } from "./AttachmentGallery.types";

const UPLOAD_TYPES = "image/*,application/pdf";

export function AttachmentGallery({
  open,
  onOpenChange,
  attachments,
  onFilesChosen,
  onRemove,
}: AttachmentGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewing, setPreviewing] = useState<Attachment | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onFilesChosen(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Attachments"
      description="Photos and PDFs stay on this device until the transaction syncs."
      footer={<Button onClick={() => onOpenChange(false)}>Done</Button>}
    >
      <GalleryGrid>
        {attachments.map((attachment) => (
          <GalleryTile key={attachment.id}>
            <GalleryOpen
              type="button"
              aria-label={`Preview ${attachment.name}`}
              onClick={() => setPreviewing(attachment)}
            />
            {attachment.isImage ? (
              <GalleryImage
                src={attachment.previewUrl}
                alt={attachment.name}
                fill
                sizes="200px"
                unoptimized
              />
            ) : (
              <Icon name={ReceiptIcon} size={32} />
            )}
            <GalleryRemove
              type="button"
              aria-label={`Remove ${attachment.name}`}
              onClick={() => onRemove(attachment.id)}
            >
              <Icon name={TrashIcon} size={16} />
            </GalleryRemove>
          </GalleryTile>
        ))}
        <FileInput
          ref={inputRef}
          type="file"
          accept={UPLOAD_TYPES}
          multiple
          onChange={handleChange}
        />
        <GalleryAdd type="button" onClick={() => inputRef.current?.click()}>
          <Icon name={PlusIcon} size={24} />
          Add more
        </GalleryAdd>
      </GalleryGrid>
      <AttachmentLightbox attachment={previewing} onClose={() => setPreviewing(null)} />
    </Modal>
  );
}
