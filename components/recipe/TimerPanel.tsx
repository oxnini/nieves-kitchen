'use client';

import { useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';
import { usePageTimerContextFull } from './PageTimerContext';
import PageTimer from './PageTimer';

/**
 * Cook-mode timer panel. Lives in the ingredients column (below the
 * ingredient list) so the spread balances and the step card stays focused
 * on its current-step + Done/Next role. Reads the timer off context, so
 * tappable durations in step prose still seed the same timer.
 *
 * On mount, registers its root <section> ref into the timer context so
 * MiniTimerStamp can observe when it scrolls out of view.
 */
export default function TimerPanel() {
  const ctx = usePageTimerContextFull();
  const localRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ctx) return;
    ctx.expandedPanelRef.current = localRef.current;
    return () => {
      // Clear on unmount so a stale ref doesn't outlive the panel
      // (e.g. when the user toggles out of cook mode).
      if (ctx.expandedPanelRef.current === localRef.current) {
        ctx.expandedPanelRef.current = null;
      }
    };
  }, [ctx]);

  if (!ctx) return null;

  return (
    <section
      ref={localRef}
      className="mt-6 rounded-2xl border border-brown-light/25 bg-surface/70 p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Timer size={15} className="text-terracotta" />
        <h3 className="font-heading text-[14px] uppercase tracking-[0.18em] text-brown-medium font-semibold">
          Timer
        </h3>
      </div>
      <PageTimer timer={ctx.timer} />
    </section>
  );
}
