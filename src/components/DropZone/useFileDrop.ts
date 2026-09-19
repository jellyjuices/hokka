"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveSharedFiles } from "@/src/data/local";

const NEW_TRANSACTION = "/transaction/new";
const DROP_TARGET = `${NEW_TRANSACTION}?shared=1`;

function carriesFiles(transfer: DataTransfer | null) {
  return transfer !== null && Array.from(transfer.types).includes("Files");
}

function isReceiptLike(file: File) {
  return file.type === "" || file.type.startsWith("image/") || file.type === "application/pdf";
}

export function useFileDrop(onFiles?: (files: File[]) => unknown) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOver, setIsOver] = useState(false);
  const depth = useRef(0);
  const receive = useRef(onFiles);
  const isHandled = onFiles !== undefined;

  useEffect(() => {
    receive.current = onFiles;
  });

  useEffect(() => {
    if (!isHandled && pathname === NEW_TRANSACTION) return;

    function reset() {
      depth.current = 0;
      setIsOver(false);
    }

    function handleEnter(event: DragEvent) {
      if (!carriesFiles(event.dataTransfer)) return;
      event.preventDefault();
      depth.current += 1;
      setIsOver(true);
    }

    function handleOver(event: DragEvent) {
      if (!carriesFiles(event.dataTransfer)) return;
      event.preventDefault();
      if (event.dataTransfer !== null) event.dataTransfer.dropEffect = "copy";
    }

    function handleLeave(event: DragEvent) {
      if (!carriesFiles(event.dataTransfer)) return;
      depth.current -= 1;
      if (depth.current <= 0) reset();
    }

    function handleDrop(event: DragEvent) {
      if (!carriesFiles(event.dataTransfer)) return;
      event.preventDefault();
      reset();
      const files = Array.from(event.dataTransfer?.files ?? []).filter(isReceiptLike);
      if (files.length === 0) return;
      const handle = receive.current;
      if (handle !== undefined) {
        handle(files);
        return;
      }
      void saveSharedFiles(files).then(() => router.push(DROP_TARGET));
    }

    window.addEventListener("dragenter", handleEnter);
    window.addEventListener("dragover", handleOver);
    window.addEventListener("dragleave", handleLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragend", reset);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("dragenter", handleEnter);
      window.removeEventListener("dragover", handleOver);
      window.removeEventListener("dragleave", handleLeave);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragend", reset);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [isHandled, pathname, router]);

  return isOver;
}
