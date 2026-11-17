'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronUp, Timer as TimerIcon } from 'lucide-react';
import type { StepGroup } from '@/lib/types';
import { useStepPointer, type StepPointer } from '@/hooks/useStepPointer';
import { detectDurations } from '@/lib/recipes/duration-detect';
import { durationLabel, formatRemaining } from '@/lib/recipes/timer-format';
import { usePageTimerContext } from './PageTimerContext';
import { TimerLine, TimerPicker, TimerRing } from './PageTimerStrip';

interface Props {
  groups: StepGroup[];
  isChecked: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => boolean;
  toggle: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => void;
  /**
   * The shared step pointer (RecipeDetail owns it so the Method list can mark
   * the current step). Optional: without it the card keeps its own, which is
   * what the /dev labs rely on.
   */
  pointer?: StepPointer;
  inModal?: boolean;
  /** Slot for the celebratory CTA (CookedButton) once every step is checked. */
  cookedSlot?: ReactNode;
  /** Durations (ms) this recipe's steps call for, offered by the timer picker. */
  timerDurations?: number[];
  /** The card's rendered height, so the page can leave room for it on phones. */
  onHeightChange?: (px: number) => void;
}

const COLLAPSED_KEY = 'nieves-cook-card-collapsed';

function readCollapsed(): boolean {
  try {
    return sessionStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeCollapsed(v: boolean) {
  try {
    sessionStorage.setItem(COLLAPSED_KEY, v ? '1' : '0');
  } catch {
    // Best-effort; the card still collapses for this view.
  }
}

/**
 * The cook-mode step card (audit C1 to C4, C8, C9). One card per page:
 *   - in the modal: sticky to the bottom of the sheet's scroll
 *   - full page, below lg: fixed to the bottom of the viewport
 *   - full page, lg up: docked in the Ingredients column (RecipeDetail mounts
 *     it there), sticky both top and bottom so it stays in view without ever
 *     covering the Method it describes
 *
 * It folds down to a 56px bar (chevron, or a swipe down on phones), and the
 * choice holds for the session. The timer is not shown until it is wanted: a
 * step with its own time offers one "Start" button, any other step a clock
 * that opens the picker, and a running timer is one labelled line.
 */
export default function StickyStepCard({
  groups,
  isChecked,
  toggle,
  pointer,
  inModal = false,
  cookedSlot,
  timerDurations,
  onHeightChange,
}: Props) {
  const timer = usePageTimerContext();
  const own = useStepPointer(groups, isChecked, toggle);
  const p = pointer ?? own;
  const { current, total, allDone } = p;

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => setCollapsed(readCollapsed()), []);
  function setFold(v: boolean) {
    setCollapsed(v);
    writeCollapsed(v);
  }

  const [pickerOpen, setPickerOpen] = useState(false);
  useEffect(() => setPickerOpen(false), [p.index, collapsed]);

  // Report height so the full page can pad its foot on phones (C8).
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !onHeightChange) return;
    const ro = new ResizeObserver(() => onHeightChange(el.offsetHeight));
    ro.observe(el);
    return () => {
      ro.disconnect();
      onHeightChange(0);
    };
  }, [onHeightChange]);

  // Swipe down folds the card, swipe up on the bar opens it.
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - start.y;
    const dx = Math.abs(t.clientX - start.x);
    if (dx > Math.abs(dy)) return;
    if (!collapsed && dy > 48) setFold(true);
    else if (collapsed && dy < -32) setFold(false);
  }

  const timerActive =
    !!timer && (timer.status === 'running' || timer.status === 'paused' || timer.status === 'done');
  const stepLabel = current ? `Step ${current.stepNumber}` : null;
  const stepMs = current ? detectDurations(current.text)[0]?.lowerBoundMs : undefined;
  const timingThisStep = timerActive && timer?.label === stepLabel;
  const pct = total > 0 ? (p.doneCount / total) * 100 : 0;

  const positionClass = inModal
    ? 'sticky bottom-0 inset-x-0 mt-6'
    : 'fixed inset-x-0 bottom-0 lg:sticky lg:inset-x-auto lg:top-[calc(var(--nav-h)+4rem)] lg:bottom-6 lg:mt-10';

  const roundBtn =
    'w-11 h-11 shrink-0 grid place-items-center rounded-full border border-line text-brown-dark hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-brown-dark';

  return (
    <div
      ref={rootRef}
      className={`${positionClass} z-30`}
      style={inModal ? undefined : { paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className={inModal ? 'px-4 sm:px-6 pb-3' : 'mx-auto max-w-3xl px-4 sm:px-6 lg:px-0 pb-3 lg:pb-0'}>
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden bg-surface border border-line rounded-2xl shadow-[0_10px_30px_-14px_rgba(0,0,0,0.4)]"
        >
          {/* Progress along the top edge: steps ticked of steps total. */}
          <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[3px] bg-line">
            <div className="h-full bg-teal transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>

          {collapsed ? (
            <button
              type="button"
              onClick={() => setFold(false)}
              aria-expanded={false}
              aria-label={
                allDone || !current
                  ? 'Show step card, all steps done'
                  : `Show step card, step ${current.stepNumber} of ${total}`
              }
              className="w-full h-14 flex items-center gap-3 px-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta"
            >
              {allDone || !current ? (
                <span className="flex-1 min-w-0 truncate text-[15px] text-brown-dark">All steps done</span>
              ) : (
                <>
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-7 h-7 rounded-full bg-terracotta text-white text-[13px] font-bold grid place-items-center"
                  >
                    {current.stepNumber}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-[15px] text-brown-dark">{current.text}</span>
                </>
              )}
              {timer && (timer.status === 'running' || timer.status === 'paused') && (
                <span className="shrink-0 inline-flex items-center gap-1.5 text-[15px] tabular-nums text-brown-dark">
                  <TimerRing timer={timer} size={20} />
                  {formatRemaining(timer.remainingMs)}
                </span>
              )}
              {timer?.status === 'done' && (
                <span className="shrink-0 text-[14px] text-terracotta font-medium">Time&apos;s up</span>
              )}
              <ChevronUp size={20} aria-hidden="true" className="shrink-0 text-brown-medium" />
            </button>
          ) : (
            <div className="px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-brown-medium">
                  {allDone || !current ? `All ${total} steps done` : `Step ${current.stepNumber} of ${total}`}
                </p>
                <button
                  type="button"
                  onClick={() => setFold(true)}
                  aria-expanded={true}
                  aria-label="Minimise step card"
                  className="-mr-2 w-11 h-11 grid place-items-center rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {timer && timerActive && (
                <div className="mb-3 pb-3 border-b border-line">
                  <TimerLine timer={timer} />
                </div>
              )}

              {allDone || !current ? (
                <div className="flex flex-col items-center gap-3">
                  {cookedSlot ?? <p className="text-sm text-brown-medium">All steps complete.</p>}
                  {p.canGoBack && current && (
                    <button
                      type="button"
                      onClick={p.back}
                      className="inline-flex items-center gap-1 min-h-11 px-2 text-[14px] text-brown-medium hover:text-brown-dark transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      <ChevronLeft size={16} aria-hidden="true" />
                      Back to step {current.stepNumber}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5"
                    >
                      {current.stepNumber}
                    </span>
                    <p
                      aria-live="polite"
                      aria-atomic="true"
                      className="flex-1 min-w-0 text-base text-brown-dark leading-relaxed"
                    >
                      <span className="sr-only">Step {current.stepNumber} of {total}. </span>
                      {current.text}
                    </p>
                  </div>

                  {timer && pickerOpen && (
                    <div className="mt-3">
                      <TimerPicker
                        timer={timer}
                        durations={timerDurations}
                        label={stepLabel}
                        onClose={() => setPickerOpen(false)}
                      />
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={p.back}
                      disabled={!p.canGoBack}
                      aria-label="Back to the previous step"
                      className={roundBtn}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {timer && !timingThisStep && (
                      stepMs ? (
                        <button
                          type="button"
                          onClick={() => timer.start(stepMs, stepLabel)}
                          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full border border-line text-[15px] text-brown-dark hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                        >
                          <TimerIcon size={16} aria-hidden="true" />
                          Start {durationLabel(stepMs)}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPickerOpen((o) => !o)}
                          aria-expanded={pickerOpen}
                          aria-label="Set a timer"
                          className={`${roundBtn} ${pickerOpen ? '!border-terracotta !text-terracotta' : ''}`}
                        >
                          <TimerIcon size={18} />
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={p.done}
                      className="ml-auto inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-terracotta text-white text-[15px] font-medium hover:bg-terracotta/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                      aria-label={`Step ${current.stepNumber} done`}
                    >
                      <Check size={16} aria-hidden="true" />
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
