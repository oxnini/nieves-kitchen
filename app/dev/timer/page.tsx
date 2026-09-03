'use client';

/**
 * THROWAWAY visual harness for the cook-mode timer dial.
 * Delete `app/dev/timer/` once a direction is signed off.
 *
 * Four minimalist variants side by side, each driven by its OWN real
 * `usePageTimer` instance so they genuinely run. A speed switch shrinks
 * scheduled durations so a 30-minute timer finishes in seconds.
 *
 * Not linked from anywhere; navigate to `/dev/timer`.
 */

import { useEffect, useMemo, useState } from 'react';
import { usePageTimer } from '@/hooks/usePageTimer';
import { detectDurations } from '@/lib/recipes/duration-detect';
import { setTheme, useTheme } from '@/hooks/useTheme';
import type { RecipeInput } from '@/data/recipes/_types';
import lasagna from '@/data/recipes/classic-lasagna';
import chicken from '@/data/recipes/gochujang-fried-chicken';
import eggs from '@/data/recipes/turkish-eggs';
import dumplings from '@/data/recipes/xinjiang-lamb-dumplings';
import { OpenGauge, HalfGauge, InlineRing, Digital, faceScaleMs, pillLabel } from './variants';

const RECIPES: { slug: string; recipe: RecipeInput }[] = [
  { slug: 'classic-lasagna', recipe: lasagna },
  { slug: 'gochujang-fried-chicken', recipe: chicken },
  { slug: 'turkish-eggs', recipe: eggs },
  { slug: 'xinjiang-lamb-dumplings', recipe: dumplings },
];

const SPEEDS = [1, 10, 60] as const;
type Speed = (typeof SPEEDS)[number];

/** Same derivation RecipeDetail uses, so the pills mirror production. */
function durationsFor(recipe: RecipeInput): number[] {
  const set = new Set<number>();
  recipe.steps.forEach((g) =>
    g.items.forEach((step) => detectDurations(step).forEach((m) => set.add(m.lowerBoundMs))),
  );
  return Array.from(set).sort((a, b) => a - b).slice(0, 6);
}

const VARIANTS = [
  {
    key: 'C',
    name: 'Open Gauge',
    tag: 'round-1 favourite',
    height: '~290px tall',
    note: 'The one you liked. 270° sweep with the readout in the gap. Full circle, so it is the tallest of the four.',
    Component: OpenGauge,
  },
  {
    key: 'D',
    name: 'Half Gauge',
    tag: 'compact',
    height: '~200px tall',
    note: 'Same gauge language folded to 180°. Roughly half the height, readout tucked under the arc. Keeps the sweep legible.',
    Component: HalfGauge,
  },
  {
    key: 'E',
    name: 'Inline Ring',
    tag: 'most compact',
    height: '~90px tall',
    note: 'One row. Small ring keeps the arc, readout beside it, pills on the same line. Closest footprint to the preset strip it replaces.',
    Component: InlineRing,
  },
  {
    key: 'G',
    name: 'Digital',
    tag: 'no arc',
    height: '~140px tall',
    note: 'Cutive Mono digits over a hairline rule that inks terracotta as time elapses. The only variant with no ring: it trades the halo arc for a linear fill.',
    Component: Digital,
  },
] as const;

export default function TimerDevPage() {
  const [speed, setSpeed] = useState<Speed>(10);
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const theme = useTheme();

  // One independent timer per variant so they can be compared side by side.
  // Hooks cannot be called in a loop, so these are declared flat; the count
  // MUST match VARIANTS.length.
  const timer0 = usePageTimer();
  const timer1 = usePageTimer();
  const timer2 = usePageTimer();
  const timer3 = usePageTimer();
  const timers = [timer0, timer1, timer2, timer3];

  useEffect(() => {
    const w = window as unknown as { __nievesTimerSpeed?: number };
    w.__nievesTimerSpeed = speed;
    return () => {
      w.__nievesTimerSpeed = 1;
    };
  }, [speed]);

  const active = RECIPES[recipeIdx];
  const durations = useMemo(() => durationsFor(active.recipe), [active]);
  const scale = faceScaleMs(durations);

  return (
    <div className="min-h-screen bg-parchment text-brown-dark">
      {/* ── Controls ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-sm border-b border-brown-light/25">
        <div className="max-w-[1500px] mx-auto px-6 py-3 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium">
              DEV · COOK-MODE TIMER · C/D/E/G
            </p>
            <h1 className="font-heading text-lg font-semibold">Minimalist dial variants · round 3</h1>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <Control label="Recipe">
              <select
                value={recipeIdx}
                onChange={(e) => setRecipeIdx(Number(e.target.value))}
                className="text-base sm:text-sm bg-surface border border-brown-light/40 rounded-md px-2 py-1.5 text-brown-dark"
              >
                {RECIPES.map((r, i) => (
                  <option key={r.slug} value={i}>
                    {r.recipe.title}
                  </option>
                ))}
              </select>
            </Control>

            <Control label="Speed">
              <div className="flex gap-1">
                {SPEEDS.map((s) => (
                  <Toggle key={s} on={speed === s} onClick={() => setSpeed(s)}>
                    {s}×
                  </Toggle>
                ))}
              </div>
            </Control>

            <Control label="Theme">
              <div className="flex gap-1">
                <Toggle on={theme === 'parchment'} onClick={() => setTheme('parchment')}>
                  Parchment
                </Toggle>
                <Toggle on={theme === 'sepia'} onClick={() => setTheme('sepia')}>
                  Sepia
                </Toggle>
              </div>
            </Control>

            <Control label="Width">
              <Toggle on={narrow} onClick={() => setNarrow((v) => !v)}>
                {narrow ? 'Narrow 360px' : 'Full'}
              </Toggle>
            </Control>
          </div>
        </div>
      </header>

      {/* ── Recipe read-out ──────────────────────────────────────────── */}
      <div className="max-w-[1500px] mx-auto px-6 pt-6">
        <div className="rounded-lg border border-brown-light/30 bg-surface/60 px-4 py-3">
          <p className="font-stamp text-[10px] uppercase tracking-[0.2em] text-brown-medium">
            Durations detected in this recipe&apos;s steps
          </p>
          <p className="mt-1.5 font-heading text-[15px]">
            {durations.length > 0 ? (
              <>
                {durations.map(pillLabel).join(' · ')}
                <span className="text-brown-medium">
                  {'  →  '}face scale {pillLabel(scale)}
                </span>
              </>
            ) : (
              <span className="text-brown-medium">
                None detected. Variants fall back to the generic ladder in production.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── The four variants ───────────────────────────────────────── */}
      <main className="max-w-[1500px] mx-auto px-6 py-10">
        <div
          className={
            narrow
              ? 'flex flex-col items-center gap-14'
              : 'grid gap-8 md:grid-cols-2 xl:grid-cols-4'
          }
        >
          {VARIANTS.map((v, i) => {
            const Component = v.Component;
            return (
              <section
                key={v.key}
                className={[
                  'rounded-xl border border-brown-light/30 bg-surface/50',
                  'px-5 py-8 flex flex-col items-center gap-6',
                  narrow ? 'w-[360px]' : '',
                ].join(' ')}
              >
                <div className="text-center">
                  <p className="font-stamp text-[10px] uppercase tracking-[0.24em] text-terracotta">
                    Variant {v.key} · {v.tag}
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">{v.name}</h2>
                  <p className="mt-1 font-stamp text-[10px] uppercase tracking-[0.16em] text-brown-medium">
                    {v.height}
                  </p>
                </div>

                <Component
                  timer={timers[i]}
                  durations={durations.length > 0 ? durations : [300_000, 600_000, 900_000, 1_800_000]}
                />

                <p className="text-[13px] leading-relaxed text-brown-medium text-center max-w-[34ch]">
                  {v.note}
                </p>
              </section>
            );
          })}
        </div>

        <p className="mt-12 text-center text-[12px] text-brown-medium/80 font-stamp uppercase tracking-[0.18em]">
          Throwaway harness · delete app/dev/timer after sign-off
        </p>
      </main>
    </div>
  );
}

// ── Small control primitives (local to the harness) ─────────────────────

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-stamp text-[9px] uppercase tracking-[0.2em] text-brown-medium">
        {label}
      </span>
      {children}
    </div>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-2.5 py-1.5 rounded-md text-[12px] font-stamp uppercase tracking-[0.08em]',
        'border transition-colors',
        on
          ? 'bg-terracotta text-parchment border-terracotta'
          : 'bg-surface text-brown-medium border-brown-light/40 hover:border-terracotta',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
