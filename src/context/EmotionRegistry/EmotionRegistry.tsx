"use client";

import { useState } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import type { EmotionRegistryProps } from "./EmotionRegistry.types";

export function EmotionRegistry({ children }: EmotionRegistryProps) {
  const [cache] = useState(() => {
    const created = createCache({ key: "hokka" });
    created.compat = true;
    return created;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(" ") }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
