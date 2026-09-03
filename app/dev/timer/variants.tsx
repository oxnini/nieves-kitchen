'use client';

/**
 * THROWAWAY. Minimalist timer variants for visual sign-off.
 * Delete the whole `app/dev/timer/` folder once a direction is picked.
 *
 * Round 3:
 *   - Simple Analog dropped (round-2 note)
 *   - C / D / E survive; the working theory is E on mobile and C or D on
 *     desktop, i.e. ONE responsive component with two shapes rather than
 *     two components
 *   - Digital added, the only variant with no arc: it trades the ring for a
 *     linear fill, so it is the one direction that departs from the
 *     "halo arc" rule in the original spec. Deliberate, flagged, your call.
 *
 * Track strokes are theme-aware throughout: sepia's brown-light (#43596F)
 * on a #1C3B5E panel was near-invisible at 35%.
 */

import { useState } from 'react';
import { Pause, Play, RotateCcw, X, Plus } from 'lucide-react';
import { useIsSepia } from '@/hooks/useTheme';
import type { PageTimer } from '@/hooks/usePageTimer';

// ── Shared ───────────────────────────────────────────────────────────────

/**
 * Track weight + ink, per theme. Sepia is a dark cobalt panel, so the light
 * theme's hairline disappears; it needs both a heavier stroke and a warmer,
 * more opaque ink.
 */
function useTrack() {
  const sepia = useIsSepia();
  return sepia
    ? { width: 2.5, className: 'text-brown-medium/45', arcWidth: 5 }
    : { width: 1.75, className: 'text-brown-light/45', arcWidth: 4.5 };
}

function elapsedFrac(timer: PageTimer): number {
  if (timer.totalMs <= 0) return 0;
  return Math.min(1, Math.max(0, (timer.totalMs - timer.remainingMs) / timer.totalMs));
}

export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function pillLabel(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)} sec`;
  const totalMin = Math.round(ms / 60_000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m}`;
}

export function faceScaleMs(durations: number[]): number {
  const longest = durations.length > 0 ? Math.max(...durations) : 0;
  const ladder = [30, 60, 90, 120].map((m) => m * 60_000);
  const wanted = Math.max(longest, 60 * 60_000);
  return ladder.find((v) => v >= wanted) ?? wanted;
}

function Pills({
  durations,
  onPick,
  size = 'lg',
  align = 'center',
}: {
  durations: number[];
  onPick: (ms: number) => void;
  size?: 'lg' | 'sm';
  align?: 'center' | 'start';
}) {
  // Custom entry, mirroring the production strip (`submitCustom`, capped at
  // 999 minutes). The presets are a shortcut, never the only way in.
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');

  const pad = size === 'lg' ? 'min-h-[44px] px-4' : 'min-h-[36px] px-3';
  const base = [
    pad,
    'rounded-full font-stamp text-[13px] tracking-[0.06em] uppercase',
    'border border-brown-light/50 text-brown-dark bg-surface',
    'hover:border-terracotta hover:text-terracotta transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
  ].join(' ');

  function close() {
    setOpen(false);
    setVal('');
  }

  function submit() {
    const n = parseInt(val, 10);
    close();
    if (!Number.isFinite(n) || n <= 0 || n > 999) return;
    onPick(n * 60_000);
  }

  if (open) {
    return (
      <div className={`flex items-center gap-2 ${align === 'start' ? '' : 'justify-center'}`}>
        <input
          type="number"
          inputMode="numeric"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') close();
          }}
          placeholder="min"
          aria-label="Custom duration in minutes"
          className={[
            pad,
            'w-[92px] rounded-full text-center',
            // Strip the native number spinners; they read as browser chrome.
            '[appearance:textfield]',
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            // >=16px or iOS Safari zooms the viewport on focus.
            'text-base sm:text-sm font-stamp',
            'bg-surface border border-terracotta text-brown-dark',
            'focus:outline-none',
          ].join(' ')}
        />
        <button type="button" onClick={submit} className={`${base} !border-terracotta !text-terracotta`}>
          Set
        </button>
        <button type="button" onClick={close} aria-label="Cancel custom duration" className={base}>
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${align === 'start' ? '' : 'justify-center'}`}>
      {durations.map((ms) => (
        <button key={ms} type="button" onClick={() => onPick(ms)} className={base}>
          {pillLabel(ms)}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Set a custom duration"
        className={`${base} !px-3`}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function Transport({ timer, size = 'lg' }: { timer: PageTimer; size?: 'lg' | 'sm' }) {
  if (timer.status === 'idle') return null;
  const dim = size === 'lg' ? 'min-h-[44px] min-w-[44px]' : 'min-h-[36px] min-w-[36px]';
  const btn = `${dim} grid place-items-center rounded-full border border-brown-light/50 text-brown-dark hover:border-terracotta hover:text-terracotta transition-colors`;
  return (
    <div className="flex items-center justify-center gap-2">
      {timer.status === 'running' && (
        <button type="button" onClick={timer.pause} aria-label="Pause timer" className={btn}>
          <Pause size={15} />
        </button>
      )}
      {timer.status === 'paused' && (
        <button type="button" onClick={timer.resume} aria-label="Resume timer" className={btn}>
          <Play size={15} />
        </button>
      )}
      <button
        type="button"
        onClick={timer.status === 'done' ? timer.dismiss : timer.reset}
        aria-label={timer.status === 'done' ? 'Dismiss timer' : 'Reset timer'}
        className={btn}
      >
        {timer.status === 'done' ? <X size={15} /> : <RotateCcw size={15} />}
      </button>
    </div>
  );
}

// ── C — Open Gauge (kept: the round-1 favourite) ─────────────────────────
// 270° sweep, readout in the gap. Full circle footprint.

const SWEEP = 0.75;
const GAP_ROT = 135;

export function OpenGauge({ timer, durations }: { timer: PageTimer; durations: number[] }) {
  const r = 84;
  const circ = 2 * Math.PI * r;
  const arcLen = circ * SWEEP;
  const frac = elapsedFrac(timer);
  const active = timer.status !== 'idle';
  const done = timer.status === 'done';
  const t = useTrack();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-[200px] h-[200px]" role="img"
          aria-label={active ? `${formatRemaining(timer.remainingMs)} remaining` : 'Timer idle'}>
          <circle cx={100} cy={100} r={r} fill="none" stroke="currentColor"
            strokeWidth={t.width} className={t.className} strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circ - arcLen}`}
            transform={`rotate(${GAP_ROT} 100 100)`} />
          {active && (
            <circle cx={100} cy={100} r={r} fill="none" stroke="currentColor"
              strokeWidth={t.arcWidth} strokeLinecap="round" className="text-terracotta"
              strokeDasharray={`${arcLen * frac} ${circ - arcLen * frac}`}
              transform={`rotate(${GAP_ROT} 100 100)`}
              style={{ transition: 'stroke-dasharray 250ms linear' }} />
          )}
        </svg>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center translate-y-[4px]">
            {active ? (
              <>
                <div className={`font-heading tabular-nums leading-none text-[38px] ${done ? 'text-terracotta' : 'text-brown-dark'}`}>
                  {done ? 'Done' : formatRemaining(timer.remainingMs)}
                </div>
                {!done && (
                  <div className="mt-2 font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium">
                    {timer.status === 'paused' ? 'Paused' : `of ${pillLabel(timer.totalMs)}`}
                  </div>
                )}
              </>
            ) : (
              <div className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium">
                Set a timer
              </div>
            )}
          </div>
        </div>
      </div>
      {active ? <Transport timer={timer} /> : <Pills durations={durations} onPick={timer.start} />}
    </div>
  );
}

// ── D — Half Gauge (compact) ─────────────────────────────────────────────
// The same gauge language, folded to 180°. Roughly half the height.

export function HalfGauge({ timer, durations }: { timer: PageTimer; durations: number[] }) {
  const r = 84;
  const circ = 2 * Math.PI * r;
  const arcLen = circ / 2;
  const frac = elapsedFrac(timer);
  const active = timer.status !== 'idle';
  const done = timer.status === 'done';
  const t = useTrack();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* viewBox crops below the centre line, so the box is half the height. */}
      <div className="relative w-[200px]">
        <svg viewBox="0 0 200 108" className="w-[200px]" role="img"
          aria-label={active ? `${formatRemaining(timer.remainingMs)} remaining` : 'Timer idle'}>
          <circle cx={100} cy={100} r={r} fill="none" stroke="currentColor"
            strokeWidth={t.width} className={t.className} strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circ - arcLen}`}
            transform="rotate(180 100 100)" />
          {active && (
            <circle cx={100} cy={100} r={r} fill="none" stroke="currentColor"
              strokeWidth={t.arcWidth} strokeLinecap="round" className="text-terracotta"
              strokeDasharray={`${arcLen * frac} ${circ - arcLen * frac}`}
              transform="rotate(180 100 100)"
              style={{ transition: 'stroke-dasharray 250ms linear' }} />
          )}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center pointer-events-none">
          {active ? (
            <>
              <div className={`font-heading tabular-nums leading-none text-[34px] ${done ? 'text-terracotta' : 'text-brown-dark'}`}>
                {done ? 'Done' : formatRemaining(timer.remainingMs)}
              </div>
              {!done && (
                <div className="mt-1.5 font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium">
                  {timer.status === 'paused' ? 'Paused' : `of ${pillLabel(timer.totalMs)}`}
                </div>
              )}
            </>
          ) : (
            <div className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium pb-1">
              Set a timer
            </div>
          )}
        </div>
      </div>
      {active ? <Transport timer={timer} /> : <Pills durations={durations} onPick={timer.start} />}
    </div>
  );
}

// ── E — Inline Ring (most compact) ───────────────────────────────────────
// One row. A small ring keeps the arc, the readout sits beside it, and the
// pills share the same line. Closest in footprint to today's preset strip.

export function InlineRing({ timer, durations }: { timer: PageTimer; durations: number[] }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const frac = elapsedFrac(timer);
  const active = timer.status !== 'idle';
  const done = timer.status === 'done';
  const t = useTrack();

  // Idle shows no ring at all. An empty circle is decoration, and it was
  // what pushed the pills into an awkward corner.
  if (!active) {
    return (
      <div className="w-full">
        <div className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium mb-2.5">
          Set a timer
        </div>
        <Pills durations={durations} onPick={timer.start} size="sm" align="start" />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-4">
      <div className="relative shrink-0">
        <svg viewBox="0 0 60 60" className="w-[60px] h-[60px]" role="img"
          aria-label={`${formatRemaining(timer.remainingMs)} remaining`}>
          <circle cx={30} cy={30} r={r} fill="none" stroke="currentColor"
            strokeWidth={t.width} className={t.className} />
          <circle cx={30} cy={30} r={r} fill="none" stroke="currentColor"
            strokeWidth={t.arcWidth} strokeLinecap="round" className="text-terracotta"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)}
            transform="rotate(-90 30 30)"
            style={{ transition: 'stroke-dashoffset 250ms linear' }} />
        </svg>
        {done && (
          <span className="absolute inset-0 grid place-items-center text-terracotta text-[18px] leading-none">
            ✓
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className={`font-heading tabular-nums leading-none text-[30px] ${done ? 'text-terracotta' : 'text-brown-dark'}`}>
          {done ? 'Done' : formatRemaining(timer.remainingMs)}
        </div>
        <div className="mt-1 font-stamp text-[10px] uppercase tracking-[0.2em] text-brown-medium">
          {done ? 'Tap to dismiss' : timer.status === 'paused' ? 'Paused' : `of ${pillLabel(timer.totalMs)}`}
        </div>
      </div>

      <div className="ml-auto shrink-0">
        <Transport timer={timer} size="sm" />
      </div>
    </div>
  );
}

// ── G — Digital ──────────────────────────────────────────────────────────
// No ring. Cutive Mono digits (the postal/stamp face) over a hairline rule
// that inks terracotta as time elapses. The linear fill stands in for the
// halo arc, so this is the one variant that breaks the spec's arc rule.

export function Digital({ timer, durations }: { timer: PageTimer; durations: number[] }) {
  const frac = elapsedFrac(timer);
  const active = timer.status !== 'idle';
  const done = timer.status === 'done';
  const t = useTrack();

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div
        className={[
          'w-full max-w-[280px] rounded-lg px-4 py-3.5',
          'border bg-surface/70',
          done ? 'border-terracotta' : 'border-brown-light/45',
          'transition-colors',
        ].join(' ')}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium">
            {done
              ? 'Done'
              : active
                ? timer.status === 'paused'
                  ? 'Paused'
                  : 'Remaining'
                : 'Set a timer'}
          </span>
          {active && !done && (
            <span className="font-stamp text-[10px] uppercase tracking-[0.18em] text-brown-medium/80">
              of {pillLabel(timer.totalMs)}
            </span>
          )}
        </div>

        <div
          className={[
            'mt-2 font-stamp tabular-nums leading-none tracking-[0.06em]',
            'text-[44px]',
            done ? 'text-terracotta' : active ? 'text-brown-dark' : 'text-brown-light/60',
          ].join(' ')}
        >
          {active ? formatRemaining(timer.remainingMs) : '--:--'}
        </div>

        {/* Linear fill: the arc, unrolled. Track and fill are stacked in one
            relative box so there is no negative-margin alignment to drift. */}
        <div
          className="mt-3.5 relative w-full rounded-full overflow-hidden"
          style={{ height: t.arcWidth }}
        >
          <div className={`absolute inset-0 rounded-full ${t.className}`}
            style={{ background: 'currentColor', opacity: 0.45 }} />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-terracotta"
            style={{
              width: `${(active ? frac : 0) * 100}%`,
              transition: 'width 250ms linear',
            }}
          />
        </div>
      </div>

      {active ? <Transport timer={timer} /> : <Pills durations={durations} onPick={timer.start} />}
    </div>
  );
}
