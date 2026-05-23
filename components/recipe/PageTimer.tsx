'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import type { PageTimer as PageTimerType } from '@/hooks/usePageTimer';

const PRESETS: { label: string; ms: number }[] = [
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 300_000 },
  { label: '10m', ms: 600_000 },
  { label: '15m', ms: 900_000 },
  { label: '30m', ms: 1_800_000 },
  { label: '1h', ms: 3_600_000 },
];

function formatRemaining(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  timer: PageTimerType;
}

/**
 * Quiet single timer for cook mode. Lives inside the sticky step card.
 *   - idle: preset row + Custom toggle
 *   - running/paused: countdown mm:ss + Pause/Resume + Reset
 *   - done: warm pulse + "Timer done, tap to dismiss"
 *
 * Starting any timer replaces the previous one (the rule is owned by the
 * hook, not this component).
 */
export default function PageTimer({ timer }: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

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

  if (timer.status === 'done') {
    return (
      <button
        type="button"
        onClick={timer.dismiss}
        className="page-timer-done w-full flex items-center justify-between gap-3 rounded-xl border border-terracotta/50 bg-terracotta/10 px-3 py-2 text-left transition-colors hover:bg-terracotta/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        aria-label="Timer done, tap to dismiss"
      >
        <span className="text-sm text-brown-dark font-medium">
          Timer done, tap to dismiss
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-terracotta">
          <X size={12} />
          Dismiss
        </span>
      </button>
    );
  }

  if (timer.status === 'running' || timer.status === 'paused') {
    const running = timer.status === 'running';
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-heading tabular-nums text-2xl font-semibold text-brown-dark">
          {formatRemaining(timer.remainingMs)}
        </span>
        <div className="flex items-center gap-1.5">
          {running ? (
            <button
              type="button"
              onClick={timer.pause}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-brown-light/25 text-sm text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <Pause size={12} /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={timer.resume}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-brown-light/25 text-sm text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <Play size={12} /> Resume
            </button>
          )}
          <button
            type="button"
            onClick={timer.reset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-brown-medium text-sm hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>
    );
  }

  // idle
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      {!customOpen && (
        <>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => timer.start(p.ms)}
              className="px-2.5 py-1 rounded-full bg-surface border border-brown-light/25 text-sm text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="px-2.5 py-1 rounded-full bg-surface border border-brown-light/25 text-sm text-brown-medium hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Custom
          </button>
        </>
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
            className="w-16 px-2 py-1 rounded-full bg-surface border border-brown-light/40 text-sm text-brown-dark placeholder-brown-medium focus:outline-none focus:border-terracotta"
          />
          <button
            type="button"
            onClick={submitCustom}
            className="px-2.5 py-1 rounded-full bg-terracotta text-white text-sm hover:bg-terracotta/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Set
          </button>
          <button
            type="button"
            onClick={cancelCustom}
            className="px-2.5 py-1 rounded-full text-brown-medium text-sm hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
