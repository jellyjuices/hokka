"use client";

import { useRef, type ChangeEvent } from "react";
import { Button } from "@/src/components/Button";
import { Icon } from "@/src/components/Icon";
import {
  BarRow,
  CameraButton,
  HiddenFileInput,
  StackButton,
  StackCount,
  StackImage,
  StackThumb,
} from "./AttachmentBar.styles";
import type { AttachmentBarProps } from "./AttachmentBar.types";

const VISIBLE_LIMIT = 3;
const UPLOAD_TYPES = "image/*,application/pdf";

export function AttachmentBar({ attachments, onFilesChosen, onOpenGallery }: AttachmentBarProps) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onFilesChosen(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  if (attachments.length > 0) {
    const visible = attachments.slice(0, VISIBLE_LIMIT);
    return (
      <StackButton
        type="button"
        onClick={onOpenGallery}
        aria-label={`${attachments.length} attached, open gallery`}
      >
        {visible.map((attachment, depth) => (
          <StackThumb key={attachment.id} $depth={depth}>
            {attachment.isImage ? (
              <StackImage src={attachment.previewUrl} alt="" fill sizes="72px" unoptimized />
            ) : (
              <Icon name="receipt" size={26} />
            )}
            {depth === 0 && <StackCount>{attachments.length}</StackCount>}
          </StackThumb>
        ))}
      </StackButton>
    );
  }

  return (
    <BarRow>
      <HiddenFileInput
        ref={uploadRef}
        type="file"
        accept={UPLOAD_TYPES}
        multiple
        onChange={handleChange}
      />
      <HiddenFileInput
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
      <Button tone="quiet" trailingIcon="upload" onClick={() => uploadRef.current?.click()}>
        Upload
      </Button>
      <CameraButton tone="accent" trailingIcon="camera" onClick={() => cameraRef.current?.click()}>
        Snap a pic
      </CameraButton>
    </BarRow>
  );
}
