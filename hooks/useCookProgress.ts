'use client';

import { useState, useEffect, useCallback } from 'react';

export type CookProgressMode = 'read' | 'cook';

interface CookProgress {
  // Keys are "groupIndex-itemIndex" strings, e.g. "0-3".

  // Ingredients are shared across both modes on purpose. "Have I got this /
  // have I added this" is a question that spans the whole session, so ticking
  // one off while reading should carry into cooking.
  ingredients: string[];

  // Steps are kept per mode. "Where am I in this cook" belongs to the cook:
  // hitting Done on the step card must not leave the step struck through in
  // read mode once you close cook mode. Both sides persist, which matters
  // because the first Escape press exits cook mode — an accidental exit, or a
  // reload with wet hands, should not cost you your place.
  steps: Record<CookProgressMode, string[]>;
}

const EMPTY: CookProgress = { ingredients: [], steps: { read: [], cook: [] } };

function storageKey(slug: string) {
  // v3: steps split per mode. v2 (a single shared steps array) and v1 (flat
  // numeric keys) are abandoned rather than migrated — this is a tab-scoped
  // checklist, not a record worth carrying forward.
  return `nieves-cook-progress-v3-${slug}`;
}

function keyFor(groupIndex: number, itemIndex: number) {
  return `${groupIndex}-${itemIndex}`;
}

/** Tolerate anything in storage: a v2 blob, a partial write, hand-edited junk. */
function parse(raw: string): CookProgress {
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object') return EMPTY;
  const { ingredients, steps } = data as Partial<CookProgress>;
  return {
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    steps: {
      read: Array.isArray(steps?.read) ? steps.read : [],
      cook: Array.isArray(steps?.cook) ? steps.cook : [],
    },
  };
}

export function useCookProgress(slug: string, mode: CookProgressMode) {
  const [progress, setProgress] = useState<CookProgress>(EMPTY);

  // The whole blob is held in state and the mode only selects which slice is
  // read or written, so switching modes needs no re-read.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(slug));
      setProgress(raw ? parse(raw) : EMPTY);
    } catch {
      setProgress(EMPTY);
    }
  }, [slug]);

  const toggle = useCallback(
    (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => {
      setProgress((prev) => {
        const k = keyFor(groupIndex, itemIndex);
        const list = type === 'ingredients' ? prev.ingredients : prev.steps[mode];
        const next = list.includes(k)
          ? list.filter((x) => x !== k)
          : [...list, k];
        const updated: CookProgress =
          type === 'ingredients'
            ? { ...prev, ingredients: next }
            : { ...prev, steps: { ...prev.steps, [mode]: next } };
        try {
          sessionStorage.setItem(storageKey(slug), JSON.stringify(updated));
        } catch {
          // Storage can throw (private mode, quota). The tick still stands
          // in memory; only its persistence is lost.
        }
        return updated;
      });
    },
    [slug, mode],
  );

  const isChecked = useCallback(
    (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) =>
      (type === 'ingredients' ? progress.ingredients : progress.steps[mode]).includes(
        keyFor(groupIndex, itemIndex),
      ),
    [progress, mode],
  );

  return { progress, toggle, isChecked };
}
