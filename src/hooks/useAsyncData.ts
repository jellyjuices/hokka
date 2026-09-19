"use client";

import { useEffect, useState } from "react";

export function useAsyncData<T>(load: () => Promise<T>, fallback: T) {
  const [data, setData] = useState(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    load().then((result) => {
      if (!isActive) return;
      setData(result);
      setIsLoading(false);
    });
    return () => {
      isActive = false;
    };
  }, [load]);

  return { data, isLoading };
}
