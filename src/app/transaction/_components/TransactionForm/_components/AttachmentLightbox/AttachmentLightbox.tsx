"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import {
  LightboxBar,
  LightboxClose,
  LightboxMessage,
  LightboxPage,
  LightboxPages,
  LightboxImage,
  LightboxPanel,
  LightboxScrim,
  LightboxStage,
  LightboxTitle,
} from "./AttachmentLightbox.styles";
import type { AttachmentLightboxProps, PdfPreviewProps } from "./AttachmentLightbox.types";
import { usePdfPages } from "./usePdfPages";

function PdfPreview({ url, name }: PdfPreviewProps) {
  const { pages, failed } = usePdfPages(url);
  if (failed) return <LightboxMessage>This PDF could not be shown.</LightboxMessage>;
  if (pages.length === 0) return <LightboxMessage>Loading PDF…</LightboxMessage>;
  return (
    <LightboxPages>
      {pages.map((page, index) => (
        <LightboxPage key={page} src={page} alt={`${name}, page ${index + 1}`} />
      ))}
    </LightboxPages>
  );
}

export function AttachmentLightbox({ attachment, onClose }: AttachmentLightboxProps) {
  return (
    <Dialog.Root open={attachment !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <LightboxScrim />
        <LightboxPanel aria-describedby={undefined}>
          <LightboxBar>
            <LightboxTitle>{attachment?.name}</LightboxTitle>
            <LightboxClose aria-label="Close preview">
              <Icon name={XIcon} size={18} />
            </LightboxClose>
          </LightboxBar>
          <LightboxStage onClick={(event) => event.target === event.currentTarget && onClose()}>
            {attachment &&
              (attachment.isImage ? (
                <LightboxImage
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  fill
                  sizes="100vw"
                  unoptimized
                />
              ) : (
                <PdfPreview url={attachment.previewUrl} name={attachment.name} />
              ))}
          </LightboxStage>
        </LightboxPanel>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
