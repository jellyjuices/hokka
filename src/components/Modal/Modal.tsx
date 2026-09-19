import * as Dialog from "@radix-ui/react-dialog";
import { Icon } from "@/src/components/Icon";
import {
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalPanel,
  ModalScrim,
  ModalTitle,
} from "./Modal.styles";
import type { ModalProps } from "./Modal.types";

export function Modal({ open, onOpenChange, title, description, footer, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <ModalScrim />
        <ModalPanel>
          <ModalHeader>
            <div>
              <ModalTitle>{title}</ModalTitle>
              {description && <ModalDescription>{description}</ModalDescription>}
            </div>
            <ModalClose aria-label="Close">
              <Icon name="close" size={18} />
            </ModalClose>
          </ModalHeader>
          {children}
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalPanel>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
