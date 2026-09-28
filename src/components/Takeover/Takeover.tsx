"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/src/components/Button";
import { Icon } from "@/src/components/Icon";
import {
  ChoiceLabel,
  ChoiceList,
  ChoiceRow,
  ChoiceTick,
  TakeoverBody,
  TakeoverClose,
  TakeoverHeader,
  TakeoverPanel,
  TakeoverTitle,
} from "./Takeover.styles";
import type { ChoiceTakeoverProps, TakeoverProps } from "./Takeover.types";

export function Takeover({
  open,
  onOpenChange,
  title,
  confirmLabel = "Done",
  onConfirm,
  children,
}: TakeoverProps) {
  function confirm() {
    onConfirm();
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <TakeoverPanel aria-describedby={undefined}>
          <TakeoverHeader>
            <TakeoverClose aria-label="Cancel">
              <Icon name={XIcon} size={20} />
            </TakeoverClose>
            <TakeoverTitle>{title}</TakeoverTitle>
            <Button size="sm" onClick={confirm}>
              {confirmLabel}
            </Button>
          </TakeoverHeader>
          <TakeoverBody>{children}</TakeoverBody>
        </TakeoverPanel>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ChoiceTakeover({
  open,
  onOpenChange,
  title,
  value,
  options,
  onConfirm,
}: ChoiceTakeoverProps) {
  const [draft, setDraft] = useState(value);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(value);
  }

  return (
    <Takeover
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onConfirm={() => onConfirm(draft)}
    >
      <ChoiceList role="radiogroup" aria-label={title}>
        {options.map((option) => {
          const isSelected = option.value === draft;
          return (
            <ChoiceRow
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              $isSelected={isSelected}
              onClick={() => setDraft(option.value)}
            >
              {option.leading}
              <ChoiceLabel>{option.label}</ChoiceLabel>
              {isSelected && (
                <ChoiceTick>
                  <Icon name={CheckIcon} size={18} weight="bold" />
                </ChoiceTick>
              )}
            </ChoiceRow>
          );
        })}
      </ChoiceList>
    </Takeover>
  );
}
