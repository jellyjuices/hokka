"use client";

import { useEffect, useState } from "react";
import { eachPage, renderPage, withPdf } from "@/src/lib/pdfjs";

const RENDER_WIDTH = 1600;
const MAX_SCALE = 3;
const MAX_PAGES = 30;
// A PDF page is paper: pdf.js paints only the ink, so a transparent canvas
// would show the dark scrim through the page.
const PAPER = "#ffffff";

function canvasToUrl(canvas: HTMLCanvasElement) {
  return new Promise<string | null>((resolve) =>
    canvas.toBlob((blob) => resolve(blob && URL.createObjectURL(blob)), "image/webp", 0.9),
  );
}

export function usePdfPages(url: string | null) {
  const [pages, setPages] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState(url);

  if (loadedUrl !== url) {
    setLoadedUrl(url);
    setPages([]);
    setFailed(false);
  }

  useEffect(() => {
    if (url === null) return;
    let cancelled = false;
    const created: string[] = [];

    async function load(source: string) {
      const sameOrigin = source.startsWith("/") ? `${source}?inline` : source;
      const response = await fetch(sameOrigin);
      if (!response.ok) throw new Error(`PDF fetch failed: ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      await withPdf(bytes, (document) =>
        eachPage(document, MAX_PAGES, async (page) => {
          const render = await renderPage(page, RENDER_WIDTH, MAX_SCALE, PAPER);
          const pageUrl = render && (await canvasToUrl(render.canvas));
          if (pageUrl === null) return [];
          if (cancelled) {
            URL.revokeObjectURL(pageUrl);
            return [];
          }
          created.push(pageUrl);
          setPages((current) => [...current, pageUrl]);
          return [];
        }),
      );
    }

    load(url).catch((error: unknown) => {
      console.error("PDF preview failed", error);
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      created.forEach((pageUrl) => URL.revokeObjectURL(pageUrl));
    };
  }, [url]);

  return { pages, failed };
}
