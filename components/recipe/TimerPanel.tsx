'use client';

import { Timer } from 'lucide-react';
import { usePageTimerContext } from './PageTimerContext';
import PageTimer from './PageTimer';

/**
 * Cook-mode timer panel. Lives in the ingredients column (below the
 * ingredient list) so the spread balances and the step card stays focused
 * on its current-step + Done/Next role. Reads the timer off context, so
 * tappable durations in step prose still seed the same timer.
 */
export default function TimerPanel() {
  const timer = usePageTimerContext();
  if (!timer) return null;

  return (
    <section className="mt-6 rounded-2xl border border-brown-light/25 bg-surface/70 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Timer size={15} className="text-terracotta" />
        <h3 className="font-heading text-[14px] uppercase tracking-[0.18em] text-brown-medium font-semibold">
          Timer
        </h3>
      </div>
      <PageTimer timer={timer} />
    </section>
  );
}
