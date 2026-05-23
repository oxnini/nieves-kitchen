'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTimerContextFull } from './PageTimerContext';
import { useModalScrollRef } from './ModalScrollContext';
import { useElementInViewport } from '@/hooks/useElementInViewport';
import { usePassportOverlay } from '@/components/passport/PassportOverlay';

function formatMiniTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ariaLabelFor(status: 'running' | 'paused' | 'done', remainingMs: number): string {
  if (status === 'done') return 'Timer finished. Activate to view full timer.';
  const total = Math.max(0, Math.ceil(remainingMs / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  const timePhrase =
    m > 0
      ? `${m} minute${m === 1 ? '' : 's'}${s > 0 ? ` ${s} second${s === 1 ? '' : 's'}` : ''}`
      : `${s} second${s === 1 ? '' : 's'}`;
  return status === 'running'
    ? `Timer running, ${timePhrase} remaining. Activate to view full timer.`
    : `Timer paused at ${timePhrase}. Activate to view full timer.`;
}

/**
 * Floating mini stamp that mirrors the active timer when the expanded
 * TimerPanel is out of view. Always non-destructive: tap = smooth-scroll
 * back to the expanded panel, in every state. Dismiss lives on the
 * expanded panel only.
 *
 * Renders inside a modal scroll container when one is provided (absolute
 * positioning anchored to the modal's relative dialog div), otherwise
 * fixed to the viewport.
 */
export default function MiniTimerStamp() {
  const ctx = usePageTimerContextFull();
  const modalScrollRef = useModalScrollRef();
  const passport = usePassportOverlay();

  const expandedInView = useElementInViewport(
    ctx?.expandedPanelRef ?? { current: null },
    { root: modalScrollRef?.current ?? null },
  );

  const onTap = useCallback(() => {
    const el = ctx?.expandedPanelRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [ctx]);

  if (!ctx) return null;
  if (passport?.isOpen) return null;

  const { status, remainingMs } = ctx.timer;
  if (status !== 'running' && status !== 'paused' && status !== 'done') return null;
  if (expandedInView) return null;

  // Done state lands in Task 8.
  if (status === 'done') return null;

  const inModal = modalScrollRef !== null;
  const positionClasses = inModal
    ? 'absolute top-[52px] right-4 z-10'
    : 'fixed top-[96px] right-4 z-30';

  const glyph = status === 'running' ? '◷' : '⏸';

  return (
    <AnimatePresence>
      <motion.button
        key="mini-timer-stamp"
        type="button"
        onClick={onTap}
        aria-label={ariaLabelFor(status, remainingMs)}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={[
          positionClasses,
          'h-11 sm:h-11 min-h-[44px] w-[84px] sm:w-[84px]',
          'rounded-[10px]',
          'bg-parchment border-[1.5px] border-terracotta/40',
          'shadow-[0_2px_8px_rgba(120,60,30,0.12)]',
          'flex items-center justify-center gap-1.5',
          'font-stamp text-[16px] text-terracotta tabular-nums',
          'tracking-[0.04em]',
          'focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none',
          'transition-colors',
          'mini-timer-stamp',
        ].join(' ')}
      >
        <span aria-hidden="true" className="text-[14px] leading-none translate-y-[1px]">
          {glyph}
        </span>
        <span aria-hidden="true">{formatMiniTime(remainingMs)}</span>
      </motion.button>
    </AnimatePresence>
  );
}
