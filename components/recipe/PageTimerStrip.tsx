'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, X, Plus } from 'lucide-react';
import { useIsSepia } from '@/hooks/useTheme';
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

/** Pill / sub-label duration: "45 sec", "3 min", "1 hr", "1 hr 30". */
function pillLabel(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)} sec`;
  const totalMin = Math.round(ms / 60_000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m}`;
}

/**
 * Track weight + ink, per theme. Sepia is a dark cobalt panel, so the light
 * theme's hairline disappears against it; it needs both a heavier stroke and
 * a more opaque ink to read at all.
 */
function useTrack() {
  const sepia = useIsSepia();
  return sepia
    ? { width: 2.5, className: 'text-brown-medium/45', arcWidth: 5 }
    : { width: 1.75, className: 'text-brown-light/45', arcWidth: 4.5 };
}

interface Props {
  timer: PageTimerType;
  /**
   * Durations (ms) actually called for by this recipe's steps, sorted. The
   * pills mirror the real timers the cook needs; a "+" opens a custom entry.
   * Falls back to a generic ladder when a recipe has no detectable timings.
   */
  durations?: number[];
}

/**
 * On-brand cook-mode timer, built to sit at the top edge of the sticky step
 * card so it is always co-located with the step the cook is on. That card is
 * permanently docked to the bottom of the viewport, which is the whole reason
 * this is a 60px inline ring and not a dial: a large gauge plus the step text
 * would eat about half a laptop viewport of fixed chrome.
 *
 *   - idle: "Set a timer", the recipe's own durations as pills, "+" for custom
 *   - running/paused: a small halo ring + mm:ss, transport pushed to the right
 *   - done: one settle beat on a terracotta ground, tap to dismiss
 *
 * Starting any timer replaces the previous one (rule owned by the hook).
 */
export default function PageTimerStrip({ timer, durations }: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const track = useTrack();

  const pills = durations && durations.length > 0 ? durations : FALLBACK_MS;

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
    const r = 24;
    const circ = 2 * Math.PI * r;
    // The halo fills as time elapses, so it reads as "how far in am I".
    const frac =
      timer.totalMs > 0
        ? Math.min(1, Math.max(0, (timer.totalMs - timer.remainingMs) / timer.totalMs))
        : 0;

    const transportBtn =
      'min-h-[36px] min-w-[36px] grid place-items-center rounded-full border border-brown-light/50 text-brown-dark hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta';

    return (
      <div className="w-full flex items-center gap-4">
        <div className="shrink-0">
          <svg
            viewBox="0 0 60 60"
            className="w-[60px] h-[60px]"
            role="img"
            aria-label={`${formatRemaining(timer.remainingMs)} remaining of ${pillLabel(timer.totalMs)}`}
          >
            <circle
              cx={30}
              cy={30}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={track.width}
              className={track.className}
            />
            <circle
              cx={30}
              cy={30}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={track.arcWidth}
              strokeLinecap="round"
              className={running ? 'text-terracotta' : 'text-brown-medium'}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - frac)}
              transform="rotate(-90 30 30)"
              style={{ transition: 'stroke-dashoffset 250ms linear' }}
            />
          </svg>
        </div>

        <div className="min-w-0">
          <div className="font-heading tabular-nums leading-none text-[30px] text-brown-dark">
            {formatRemaining(timer.remainingMs)}
          </div>
          <div className="mt-1 font-stamp text-[10px] uppercase tracking-[0.2em] text-brown-medium">
            {running ? `of ${pillLabel(timer.totalMs)}` : 'Paused'}
          </div>
        </div>

        <div className="ml-auto shrink-0 flex items-center gap-2">
          {running ? (
            <button type="button" onClick={timer.pause} aria-label="Pause timer" className={transportBtn}>
              <Pause size={15} />
            </button>
          ) : (
            <button type="button" onClick={timer.resume} aria-label="Resume timer" className={transportBtn}>
              <Play size={15} />
            </button>
          )}
          <button type="button" onClick={timer.reset} aria-label="Reset timer" className={transportBtn}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ── Idle ──────────────────────────────────────────────────────────────
  // No ring here. An empty circle is decoration, and it is what pushed the
  // pills into an awkward corner.
  const pillClass = [
    'min-h-[36px] px-3',
    'rounded-full font-stamp text-[13px] tracking-[0.06em] uppercase',
    'border border-brown-light/50 text-brown-dark bg-surface',
    'hover:border-terracotta hover:text-terracotta transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
  ].join(' ');

  return (
    <div className="w-full">
      <div className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium mb-2.5">
        Set a timer
      </div>

      {customOpen ? (
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
              if (e.key === 'Escape') cancelCustom();
            }}
            placeholder="min"
            aria-label="Custom duration in minutes"
            autoFocus
            className={[
              'min-h-[36px] px-3 w-[92px] rounded-full text-center',
              // Strip the native number spinners; they read as browser chrome.
              '[appearance:textfield]',
              '[&::-webkit-outer-spin-button]:appearance-none',
              '[&::-webkit-inner-spin-button]:appearance-none',
              // >=16px or iOS Safari zooms the viewport on focus.
              'text-base sm:text-sm font-stamp',
              'bg-surface border border-terracotta text-brown-dark placeholder-brown-medium',
              'focus:outline-none',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={submitCustom}
            className={`${pillClass} !border-terracotta !text-terracotta`}
          >
            Set
          </button>
          <button
            type="button"
            onClick={cancelCustom}
            aria-label="Cancel custom duration"
            className={pillClass}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {pills.map((ms) => (
            <button key={ms} type="button" onClick={() => startPreset(ms)} className={pillClass}>
              {pillLabel(ms)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            aria-label="Set a custom duration"
            className={pillClass}
          >
            <Plus size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
