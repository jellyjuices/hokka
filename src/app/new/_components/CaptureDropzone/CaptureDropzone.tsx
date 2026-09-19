"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Icon } from "@/src/components/Icon";
import { useLedgerActions, useSyncState } from "@/src/context/Ledger";
import * as styles from "./CaptureDropzone.styles";

const ACCEPTED_TYPES = "image/*,application/pdf";

export function CaptureDropzone() {
  const { captureDocument } = useLedgerActions();
  const { isOnline } = useSyncState();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept(file: File | undefined) {
    if (!file || isBusy) return;
    setIsBusy(true);
    setError(null);
    try {
      const document = await captureDocument(file, "receipt");
      router.push(`/transactions/new?documentId=${document.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not store the file");
      setIsBusy(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    void accept(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    void accept(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <Card title="New document">
      <styles.Zone onDrop={handleDrop} onDragOver={handleDragOver}>
        <Icon name="camera" size={36} weight="duotone" />
        <p>Drop a photo or PDF here, or choose a file to upload.</p>
        <styles.HiddenInput
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleChange}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={isBusy}>
          {isBusy ? "Storing…" : "Choose file"}
        </Button>
        {isOnline ? null : (
          <styles.Notice>Saved on this device and uploaded when you are back online.</styles.Notice>
        )}
        {error === null ? null : <styles.Notice role="alert">{error}</styles.Notice>}
      </styles.Zone>
      <LinkButton href="/transactions/new">Enter it by hand instead</LinkButton>
    </Card>
  );
}
