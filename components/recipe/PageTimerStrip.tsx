'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import type { PageTimer as PageTimerType } from '@/hooks/usePageTimer';

// Generic fallback durations, used only when a recipe's steps have no
// detectable timings of their own.
const FALLBACK_MS = [300_000, 600_000, 900_000, 1_800_000];

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** Compact chip label for a preset duration: "45s", "3 min", "1 hr", "1 hr 30". */
function chipLabel(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const totalMin = Math.round(ms / 60_000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m}`;
}

interface Props {
  timer: PageTimerType;
  /**
   * Durations (ms) actually called for by this recipe's steps, sorted. The
   * chips mirror the real timers the cook needs; a "＋" opens a custom entry.
   * Falls back to a generic ladder when a recipe has no detectable timings.
   */
  durations?: number[];
}

/**
 * On-brand cook-mode timer, built to sit at the top edge of the sticky step
 * card so it is always co-located with the step the cook is on. Speaks the
 * same visual language as the (retired) floating MiniTimerStamp: parchment
 * ground, terracotta hairline, font-stamp digits, ◷ glyph.
 *
 *   - idle: the recipe's own durations as chips + a "＋" custom entry
 *   - running/paused: ◷ mm:ss + a depleting rule + Pause/Resume + Reset
 *   - done: one settle beat on a terracotta ground, tap to dismiss
 *
 * Starting any timer replaces the previous one (rule owned by the hook).
 */
export default function PageTimerStrip({ timer, durations }: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const chips = durations && durations.length > 0 ? durations : FALLBACK_MS;

  function startPreset(ms: number) {
    setCustomOpen(false);
    setCustomValue('');
    timer.start(ms);
  }

  function submitCustom() {
    const n = parseInt(customValue, 10);
    setCustomOpen(false);
    setCustomValue('');
    if (!Number.isFinite(n) || n <= 0 || n > 999) return;
    timer.start(n * 60_000);
  }

  function cancelCustom() {
    setCustomOpen(false);
    setCustomValue('');
  }

  // ── Done ──────────────────────────────────────────────────────────────
  if (timer.status === 'done') {
    return (
      <motion.button
        type="button"
        onClick={timer.dismiss}
        aria-label="Timer done, tap to dismiss"
        initial={{ scale: 0.96 }}
        animate={{ scale: [0.96, 1.02, 1] }}
        transition={{ duration: 0.42, times: [0, 0.55, 1], ease: 'easeOut' }}
        className={[
          'w-full flex items-center justify-between gap-3',
          'rounded-[10px] px-3.5 py-2.5 text-left',
          'bg-terracotta text-parchment',
          'shadow-[0_3px_12px_rgba(180,80,40,0.28)]',
          'font-stamp tracking-[0.04em]',
          'transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
          'motion-reduce:!transform-none',
        ].join(' ')}
      >
        <span className="inline-flex items-center gap-2 text-[15px]">
          <span aria-hidden="true" className="text-[15px] leading-none translate-y-[1px]">✓</span>
          Timer done
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-parchment/85">
          <X size={12} />
          Dismiss
        </span>
      </motion.button>
    );
  }

  // ── Running / paused ──────────────────────────────────────────────────
  if (timer.status === 'running' || timer.status === 'paused') {
    const running = timer.status === 'running';
    const pct =
      timer.totalMs > 0
        ? Math.max(0, Math.min(1, timer.remainingMs / timer.totalMs))
        : 0;
    return (
      <div
        className={[
          'w-full rounded-[10px] px-3 py-2',
          'bg-parchment border-[1.5px]',
          running ? 'border-terracotta/40' : 'border-brown-light/35',
          'shadow-[0_2px_8px_rgba(120,60,30,0.10)]',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          <span
            className={[
              'inline-flex items-center gap-1.5 font-stamp font-semibold tabular-nums tracking-[0.04em]',
              running ? 'text-terracotta' : 'text-brown-medium',
            ].join(' ')}
          >
            <span aria-hidden="true" className="text-[17px] leading-none translate-y-[1px]">
              {running ? '◷' : '⏸'}
            </span>
            <span className="text-[23px]">{formatRemaining(timer.remainingMs)}</span>
          </span>

          <span className="flex-1 min-w-0" />

          <div className="flex items-center gap-1">
            {running ? (
              <button
                type="button"
                onClick={timer.pause}
                aria-label="Pause timer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-brown-medium hover:bg-parchment-dark hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <Pause size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.resume}
                aria-label="Resume timer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-terracotta hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <Play size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={timer.reset}
              aria-label="Reset timer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-brown-medium hover:bg-parchment-dark hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Depleting rule — a ledger line thick enough to read at a glance,
            but still calmer than a full progress bar. */}
        <div className="mt-2 h-[5px] rounded-full bg-terracotta/15 overflow-hidden">
          <div
            className={[
              'h-full rounded-full transition-[width] duration-250 ease-linear',
              running ? 'bg-terracotta/85' : 'bg-brown-light/60',
            ].join(' ')}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ── Idle ──────────────────────────────────────────────────────────────
  const chipClass =
    'font-stamp text-[13px] tracking-[0.04em] px-2.5 py-1 rounded-full bg-parchment border border-brown-light/30 text-brown-dark hover:border-terracotta/50 hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta whitespace-nowrap';

  return (
    <div className="w-full flex items-center gap-2 flex-wrap">
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-1.5 font-stamp text-[11px] uppercase tracking-[0.18em] text-brown-medium shrink-0"
      >
        <span className="text-[14px] leading-none translate-y-[1px] text-terracotta">◷</span>
        Timer
      </span>

      {!customOpen && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {chips.map((ms) => (
            <button key={ms} type="button" onClick={() => startPreset(ms)} className={chipClass}>
              {chipLabel(ms)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            aria-label="Set a custom timer"
            className={`${chipClass} text-brown-medium`}
          >
            ＋
          </button>
        </div>
      )}

      {customOpen && (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            max={999}
            inputMode="numeric"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitCustom();
              if (e.key === 'Escape') cancelCustom();
            }}
            placeholder="min"
            autoFocus
            className="w-16 px-2 py-1 rounded-full bg-parchment border border-brown-light/40 font-stamp text-base sm:text-[13px] text-brown-dark placeholder-brown-medium focus:outline-none focus:border-terracotta"
          />
          <button
            type="button"
            onClick={submitCustom}
            className="font-stamp text-[13px] tracking-[0.04em] px-2.5 py-1 rounded-full bg-terracotta text-parchment hover:bg-terracotta/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Set
          </button>
          <button
            type="button"
            onClick={cancelCustom}
            className="font-stamp text-[13px] tracking-[0.04em] px-2 py-1 rounded-full text-brown-medium hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
