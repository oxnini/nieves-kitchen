'use client';

import { useState, useEffect, useCallback } from 'react';

interface CookProgress {
  // Keys are "groupIndex-itemIndex" strings, e.g. "0-3".
  ingredients: string[];
  steps: string[];
}

const EMPTY: CookProgress = { ingredients: [], steps: [] };

function storageKey(slug: string) {
  // v2: keyed per (groupIndex, itemIndex). v1 keys (flat numbers) are abandoned.
  return `nieves-cook-progress-v2-${slug}`;
}

function keyFor(groupIndex: number, itemIndex: number) {
  return `${groupIndex}-${itemIndex}`;
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
    (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => {
      setProgress((prev) => {
        const k = keyFor(groupIndex, itemIndex);
        const list = prev[type];
        const next = list.includes(k)
          ? list.filter((x) => x !== k)
          : [...list, k];
        const updated = { ...prev, [type]: next };
        sessionStorage.setItem(storageKey(slug), JSON.stringify(updated));
        return updated;
      });
    },
    [slug],
  );

  const isChecked = useCallback(
    (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) =>
      progress[type].includes(keyFor(groupIndex, itemIndex)),
    [progress],
  );

  return { progress, toggle, isChecked };
}
