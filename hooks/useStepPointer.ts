'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StepGroup } from '@/lib/types';

type IsChecked = (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => boolean;
type Toggle = (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => void;

export interface FlatStep {
  groupIndex: number;
  itemIndex: number;
  /** 1-based, continuous across groups (what the cook sees). */
  stepNumber: number;
  text: string;
}

export interface StepPointer {
  flat: FlatStep[];
  total: number;
  /** Index into `flat` of the step the cook is on. */
  index: number;
  current: FlatStep | null;
  doneCount: number;
  allDone: boolean;
  /** Tick the current step and move to the next unticked one. */
  done: () => void;
  /** Undo: untick the step before (or this one, once everything is done). */
  back: () => void;
  canGoBack: boolean;
  /** Make a step current (tapping its number in the list). Unticks it. */
  goTo: (index: number) => void;
}

/**
 * The cook's place in the method, shared by the step card and the Method list
 * so they always agree on which step is current (audit C3). Lives above both
 * in RecipeDetail. `onMove` fires after Done or Back so the page can bring the
 * new current step into view.
 */
export function useStepPointer(
  groups: StepGroup[],
  isChecked: IsChecked,
  toggle: Toggle,
  onMove?: (index: number) => void,
): StepPointer {
  const flat = useMemo<FlatStep[]>(() => {
    const out: FlatStep[] = [];
    let n = 0;
    groups.forEach((group, g) => {
      group.items.forEach((text, i) => {
        n += 1;
        out.push({ groupIndex: g, itemIndex: i, stepNumber: n, text });
      });
    });
    return out;
  }, [groups]);

  const total = flat.length;
  const checkedAt = useCallback(
    (i: number) => isChecked('steps', flat[i].groupIndex, flat[i].itemIndex),
    [flat, isChecked],
  );
  const doneCount = flat.reduce((n, _s, i) => n + (checkedAt(i) ? 1 : 0), 0);
  const allDone = total > 0 && doneCount === total;

  const [index, setIndex] = useState(0);

  /** First unticked step after `from`, wrapping to the start; -1 if none. */
  const nextUnchecked = useCallback(
    (from: number, skip?: number) => {
      for (let i = from + 1; i < total; i++) if (i !== skip && !checkedAt(i)) return i;
      for (let i = 0; i <= from && i < total; i++) if (i !== skip && !checkedAt(i)) return i;
      return -1;
    },
    [total, checkedAt],
  );

  // Keep the pointer in bounds, and step past a step that was ticked from the
  // list (or restored from storage on mount) so the card always shows the
  // most relevant unfinished step.
  useEffect(() => {
    if (total === 0) return;
    if (index >= total) {
      setIndex(total - 1);
      return;
    }
    if (checkedAt(index)) {
      const next = nextUnchecked(index);
      if (next !== -1) setIndex(next);
    }
  }, [index, total, checkedAt, nextUnchecked]);

  const done = useCallback(() => {
    if (total === 0) return;
    const s = flat[index];
    if (!checkedAt(index)) toggle('steps', s.groupIndex, s.itemIndex);
    const next = nextUnchecked(index, index);
    const target = next === -1 ? index : next;
    setIndex(target);
    onMove?.(target);
  }, [total, flat, index, checkedAt, toggle, nextUnchecked, onMove]);

  const back = useCallback(() => {
    if (total === 0) return;
    // Everything ticked: the pointer sits on the last step finished, so Back
    // simply unticks it and the card returns to that step.
    if (checkedAt(index)) {
      const s = flat[index];
      toggle('steps', s.groupIndex, s.itemIndex);
      onMove?.(index);
      return;
    }
    if (index === 0) return;
    const prev = index - 1;
    const s = flat[prev];
    if (checkedAt(prev)) toggle('steps', s.groupIndex, s.itemIndex);
    setIndex(prev);
    onMove?.(prev);
  }, [total, flat, index, checkedAt, toggle, onMove]);

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= total) return;
      const s = flat[i];
      if (checkedAt(i)) toggle('steps', s.groupIndex, s.itemIndex);
      setIndex(i);
    },
    [total, flat, checkedAt, toggle],
  );

  return {
    flat,
    total,
    index,
    current: total > 0 ? flat[Math.min(index, total - 1)] : null,
    doneCount,
    allDone,
    done,
    back,
    canGoBack: total > 0 && (index > 0 || checkedAt(Math.min(index, total - 1))),
    goTo,
  };
}
