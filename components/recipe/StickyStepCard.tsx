'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import type { StepGroup } from '@/lib/types';
import { usePageTimerContext } from './PageTimerContext';
import PageTimerStrip from './PageTimerStrip';

interface Props {
  groups: StepGroup[];
  isChecked: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => boolean;
  toggle: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => void;
  inModal?: boolean;
  /** Slot for the celebratory CTA (CookedButton) once every step is checked. */
  cookedSlot?: ReactNode;
  /**
   * Durations (ms) this recipe's steps call for, seeding the co-located
   * timer's chips. The timer itself is read from PageTimerContext.
   */
  timerDurations?: number[];
}

interface FlatStep {
  groupIndex: number;
  itemIndex: number;
  stepNumber: number;
  text: string;
}

/**
 * Sticky bottom step-card visible in cook mode. Three positions:
 *   - inside modal: sticky to the modal scroll bottom
 *   - standalone, <lg: fixed to the viewport bottom (with safe-area padding)
 *   - standalone, ≥lg: sticky inside the instructions column at bottom: 16px
 *
 * Tracks an internal pointer so `Next` can advance without checking the
 * current step. `Done` checks the current step. Either button moves the
 * pointer forward to the next unchecked step. When every step is checked,
 * the body morphs into the `cookedSlot` (the "I cooked this" CTA).
 *
 */
export default function StickyStepCard({
  groups,
  isChecked,
  toggle,
  inModal = false,
  cookedSlot,
  timerDurations,
}: Props) {
  const timer = usePageTimerContext();
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
  const allDone = total > 0 && flat.every((s) => isChecked('steps', s.groupIndex, s.itemIndex));

  // Pointer starts at the first unchecked step. Once mounted, the pointer is
  // owned by the user — Next/Done move it forward. Any external check (from
  // tapping a step in the list) is honoured visually because the pointer
  // skips past steps the user already ticked.
  const initialPointer = useMemo(() => {
    const idx = flat.findIndex((s) => !isChecked('steps', s.groupIndex, s.itemIndex));
    return idx === -1 ? Math.max(0, total - 1) : idx;
  }, [flat, isChecked, total]);

  const [pointer, setPointer] = useState(initialPointer);

  // Keep the pointer in bounds if the underlying groups change (recipe swap,
  // hot reload). Also clamp forward past steps the user has externally checked
  // so we always land on the most relevant uncompleted step.
  useEffect(() => {
    if (pointer >= total) {
      setPointer(Math.max(0, total - 1));
      return;
    }
    if (total === 0) return;
    if (isChecked('steps', flat[pointer].groupIndex, flat[pointer].itemIndex)) {
      const next = flat.findIndex(
        (s, i) => i >= pointer && !isChecked('steps', s.groupIndex, s.itemIndex),
      );
      if (next !== -1 && next !== pointer) setPointer(next);
    }
  }, [pointer, total, flat, isChecked]);

  function advance() {
    setPointer((p) => Math.min(total - 1, p + 1));
  }

  function onDone() {
    if (total === 0) return;
    const s = flat[pointer];
    if (!isChecked('steps', s.groupIndex, s.itemIndex)) {
      toggle('steps', s.groupIndex, s.itemIndex);
    }
    advance();
  }

  const current = total > 0 ? flat[pointer] : null;

  const positionClass = inModal
    ? 'sticky bottom-0 left-0 right-0'
    : 'fixed left-0 right-0 bottom-0 lg:sticky lg:bottom-4 lg:left-auto lg:right-auto';

  return (
    <div
      className={`${positionClass} z-30 mt-6`}
      style={inModal ? undefined : { paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-0 pb-3 lg:pb-0">
        <div className="bg-surface/95 backdrop-blur-sm border border-brown-light/25 rounded-2xl shadow-lg p-4 sm:p-5 transition-all duration-250">
          {/* Co-located timer — rides the top of the card so it never leaves
              the cook's eyeline. Reads the one page timer off context. */}
          {timer && (
            <div className="mb-3 pb-3 border-b border-brown-light/20">
              <PageTimerStrip timer={timer} durations={timerDurations} />
            </div>
          )}
          {allDone || !current ? (
            <div className="flex items-center justify-center">
              {cookedSlot ?? (
                <p className="text-sm text-brown-medium">All steps complete.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5"
                >
                  {current.stepNumber}
                </span>
                <p className="flex-1 min-w-0 text-base text-brown-dark leading-relaxed">
                  {current.text}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={advance}
                  disabled={pointer >= total - 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-brown-medium text-sm font-medium hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Advance to next step without checking"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={onDone}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  aria-label={`Mark step ${current.stepNumber} done`}
                >
                  <Check size={14} />
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
