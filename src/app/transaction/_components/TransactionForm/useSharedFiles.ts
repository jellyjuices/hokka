"use client";

import { useEffect, useRef } from "react";
import { takeSharedFiles } from "@/src/data/local";

export function useSharedFiles(isShared: boolean, onFiles: (files: File[]) => unknown) {
  const isDrained = useRef(false);
  const receive = useRef(onFiles);

  useEffect(() => {
    receive.current = onFiles;
  });

  useEffect(() => {
    if (!isShared || isDrained.current) return;
    isDrained.current = true;
    void takeSharedFiles().then((files) => {
      if (files.length > 0) receive.current(files);
    });
  }, [isShared]);
}
