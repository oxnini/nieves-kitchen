'use client';

import { useState, useEffect, useCallback } from 'react';

interface CookProgress {
  ingredients: number[];
  steps: number[];
}

const EMPTY: CookProgress = { ingredients: [], steps: [] };

function storageKey(slug: string) {
  return `nieves-cook-progress-${slug}`;
}

export function useCookProgress(slug: string) {
  const [progress, setProgress] = useState<CookProgress>(EMPTY);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(slug));
      if (raw) setProgress(JSON.parse(raw) as CookProgress);
    } catch {
      // ignore parse errors
    }
  }, [slug]);

  const toggle = useCallback(
    (type: 'ingredients' | 'steps', index: number) => {
      setProgress((prev) => {
        const list = prev[type];
        const next = list.includes(index)
          ? list.filter((i) => i !== index)
          : [...list, index];
        const updated = { ...prev, [type]: next };
        sessionStorage.setItem(storageKey(slug), JSON.stringify(updated));
        return updated;
      });
    },
    [slug],
  );

  const isChecked = useCallback(
    (type: 'ingredients' | 'steps', index: number) =>
      progress[type].includes(index),
    [progress],
  );

  return { progress, toggle, isChecked };
}
