"use client";

import { useRef, type ChangeEvent } from "react";
import { Button } from "@/src/components/Button";
import { Icon } from "@/src/components/Icon";
import { FileInput } from "@/src/components/Input";
import { Modal } from "@/src/components/Modal";
import {
  GalleryAdd,
  GalleryGrid,
  GalleryImage,
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
            {attachment.isImage ? (
              <GalleryImage
                src={attachment.previewUrl}
                alt={attachment.name}
                fill
                sizes="200px"
                unoptimized
              />
            ) : (
              <Icon name="receipt" size={32} />
            )}
            <GalleryRemove
              type="button"
              aria-label={`Remove ${attachment.name}`}
              onClick={() => onRemove(attachment.id)}
            >
              <Icon name="trash" size={16} />
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
          <Icon name="plus" size={24} />
          Add more
        </GalleryAdd>
      </GalleryGrid>
    </Modal>
  );
}
