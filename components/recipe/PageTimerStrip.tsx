'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, X, Plus } from 'lucide-react';
import { useIsSepia } from '@/hooks/useTheme';
import type { PageTimer } from '@/hooks/usePageTimer';
import { durationLabel, formatRemaining } from '@/lib/recipes/timer-format';

// Generic fallback durations, used only when a recipe's steps have no
// detectable timings of their own.
const FALLBACK_MS = [300_000, 600_000, 900_000, 1_800_000];

/**
 * The cook-mode timer, in two pieces that live inside the step card
 * (audit C2). Nothing shows until a timer is wanted:
 *
 *   - TimerLine: a running, paused or finished timer as one line, labelled
 *     with the step it is timing ("Step 6 · 1:29:40").
 *   - TimerPicker: the recipe's own durations as pills plus "+" for a custom
 *     one. Opened from the card's clock button on steps with no time of
 *     their own.
 *
 * Starting any timer replaces the previous one (rule owned by the hook).
 */

const transportBtn =
  'w-11 h-11 shrink-0 grid place-items-center rounded-full border border-line text-brown-dark hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta';

/** Small halo ring that fills as time elapses. */
export function TimerRing({ timer, size = 28 }: { timer: PageTimer; size?: number }) {
  const sepia = useIsSepia();
  const r = 11;
  const circ = 2 * Math.PI * r;
  const frac =
    timer.totalMs > 0
      ? Math.min(1, Math.max(0, (timer.totalMs - timer.remainingMs) / timer.totalMs))
      : 0;
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="shrink-0">
      <circle
        cx={14}
        cy={14}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sepia ? 2.5 : 2}
        className={sepia ? 'text-brown-medium/45' : 'text-brown-light/45'}
      />
      <circle
        cx={14}
        cy={14}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        className={timer.status === 'running' ? 'text-terracotta' : 'text-brown-medium'}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - frac)}
        transform="rotate(-90 14 14)"
        style={{ transition: 'stroke-dashoffset 250ms linear' }}
      />
    </svg>
  );
}

export function TimerLine({ timer }: { timer: PageTimer }) {
  if (timer.status === 'done') {
    return (
      <motion.button
        type="button"
        onClick={timer.dismiss}
        aria-label={`${timer.label ? `${timer.label} timer` : 'Timer'} done, tap to dismiss`}
        initial={{ scale: 0.96 }}
        animate={{ scale: [0.96, 1.02, 1] }}
        transition={{ duration: 0.42, times: [0, 0.55, 1], ease: 'easeOut' }}
        className="w-full min-h-11 flex items-center justify-between gap-3 rounded-[10px] px-3.5 py-2 text-left bg-terracotta text-parchment font-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:!transform-none"
      >
        <span className="inline-flex items-center gap-2 text-[15px]">
          <span aria-hidden="true" className="leading-none translate-y-[1px]">✓</span>
          {timer.label ? `${timer.label} · time's up` : "Time's up"}
        </span>
        <span className="inline-flex items-center gap-1 text-[14px]">
          <X size={16} aria-hidden="true" />
          Dismiss
        </span>
      </motion.button>
    );
  }

  if (timer.status !== 'running' && timer.status !== 'paused') return null;
  const running = timer.status === 'running';

  return (
    <div className="w-full flex items-center gap-3">
      <TimerRing timer={timer} />
      <p className="min-w-0 flex-1 text-[15px] text-brown-dark">
        {timer.label && <span className="text-brown-medium">{timer.label} · </span>}
        <span className="font-heading text-[20px] tabular-nums leading-none">
          {formatRemaining(timer.remainingMs)}
        </span>
        {!running && <span className="ml-2 text-[13px] text-brown-medium">Paused</span>}
      </p>
      {running ? (
        <button type="button" onClick={timer.pause} aria-label="Pause timer" className={transportBtn}>
          <Pause size={16} />
        </button>
      ) : (
        <button type="button" onClick={timer.resume} aria-label="Resume timer" className={transportBtn}>
          <Play size={16} />
        </button>
      )}
      <button type="button" onClick={timer.reset} aria-label="Clear timer" className={transportBtn}>
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

interface PickerProps {
  timer: PageTimer;
  /** Durations (ms) this recipe's steps call for. Falls back to a generic ladder. */
  durations?: number[];
  /** Label for the timer this picker starts, e.g. "Step 4". */
  label: string | null;
  onClose: () => void;
}

export function TimerPicker({ timer, durations, label, onClose }: PickerProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const pills = durations && durations.length > 0 ? durations : FALLBACK_MS;

  const pillClass =
    'shrink-0 min-h-11 min-w-11 px-2.5 rounded-full text-[14px] whitespace-nowrap border border-line text-brown-dark bg-surface hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta';

  function startPreset(ms: number) {
    timer.start(ms, label);
    onClose();
  }

  function submitCustom() {
    const n = parseInt(customValue, 10);
    if (Number.isFinite(n) && n > 0 && n <= 999) {
      timer.start(n * 60_000, label);
      onClose();
      return;
    }
    setCustomOpen(false);
    setCustomValue('');
  }

  if (customOpen) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={999}
          inputMode="numeric"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value.replace(/\D/g, '').slice(0, 3))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitCustom();
            if (e.key === 'Escape') {
              e.stopPropagation();
              setCustomOpen(false);
            }
          }}
          placeholder="min"
          aria-label="Custom duration in minutes"
          autoFocus
          className={[
            'min-h-11 px-3 w-[92px] rounded-full text-center',
            '[appearance:textfield]',
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            // >=16px or iOS Safari zooms the viewport on focus.
            'text-base sm:text-sm',
            'bg-surface border border-terracotta text-brown-dark placeholder-brown-medium',
            'focus:outline-none',
          ].join(' ')}
        />
        <button type="button" onClick={submitCustom} className={`${pillClass} !border-terracotta !text-terracotta`}>
          Start
        </button>
        <button
          type="button"
          onClick={() => setCustomOpen(false)}
          aria-label="Cancel custom duration"
          className={pillClass}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] text-brown-medium mb-2">Set a timer</p>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-quiet -m-1 p-1">
        {pills.map((ms) => (
          <button key={ms} type="button" onClick={() => startPreset(ms)} className={pillClass}>
            {durationLabel(ms)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCustomOpen(true)}
          aria-label="Set a custom duration"
          className={pillClass}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
