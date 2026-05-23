'use client';

/**
 * Visual harness for Phase 3 (cook mode) and Phase 4 (page timer + tappable
 * durations).
 *
 * Renders the rich and sparse mock recipes side by side at desktop, each in
 * its own scrollable container, with a shared top-bar toggle that flips both
 * into cook mode in tandem. The Phase 4 timer is hosted inside the sticky
 * step card; use the speed switch to shrink scheduled durations so the
 * done-state is reachable in seconds instead of minutes during visual
 * iteration.
 *
 * Not linked from anywhere; navigate to `/dev/cook-mode`.
 */

import { useEffect, useState } from 'react';
import { ChefHat, BookOpen, Zap, ZapOff } from 'lucide-react';
import { MOCK_RECIPES } from '@/lib/mock-recipes';
import RecipeDetail from '@/components/RecipeDetail';

const RICH_SLUG = 'mock-rich-fatayer';
const SPARSE_SLUG = 'mock-tacos';

const SPEEDS = [1, 10, 60] as const;
type Speed = (typeof SPEEDS)[number];

export default function CookModeDevPage() {
  const [mode, setMode] = useState<'read' | 'cook'>('read');
  const [speed, setSpeed] = useState<Speed>(1);

  useEffect(() => {
    const w = window as unknown as { __nievesTimerSpeed?: number };
    w.__nievesTimerSpeed = speed;
    return () => {
      w.__nievesTimerSpeed = 1;
    };
  }, [speed]);

  const rich = MOCK_RECIPES.find((r) => r.id === RICH_SLUG);
  const sparse = MOCK_RECIPES.find((r) => r.id === SPARSE_SLUG);

  if (!rich || !sparse) {
    return (
      <div className="min-h-screen bg-parchment text-brown-dark p-10">
        Missing mock recipes ({RICH_SLUG}, {SPARSE_SLUG}). Check lib/mock-recipes.ts.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-brown-dark">
      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-sm border-b border-brown-light/20">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium">
              DEV · COOK MODE · TIMER
            </p>
            <h1 className="font-heading text-lg font-semibold">
              Rich vs sparse — A/B preview
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-brown-medium font-medium mr-1 inline-flex items-center gap-1">
                {speed === 1 ? <ZapOff size={12} /> : <Zap size={12} className="text-terracotta" />}
                Timer speed
              </span>
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    speed === s
                      ? 'bg-terracotta text-white border-terracotta'
                      : 'bg-surface border-brown-light/25 text-brown-medium hover:bg-parchment-dark'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'cook' ? 'read' : 'cook'))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-brown-light/25 text-brown-dark text-sm font-medium hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              {mode === 'cook' ? (
                <>
                  <BookOpen size={15} className="text-brown-medium" />
                  Both: read mode
                </>
              ) : (
                <>
                  <ChefHat size={15} className="text-terracotta" />
                  Both: cook mode
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Panel label="Rich recipe — every Phase 2 field populated">
            <RecipeDetail recipe={rich} initialMode={mode} key={`rich-${mode}`} />
          </Panel>
          <Panel label="Sparse recipe — only required fields">
            <RecipeDetail recipe={sparse} initialMode={mode} key={`sparse-${mode}`} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-surface-alt rounded-2xl border border-brown-light/20 overflow-hidden">
      <div className="px-4 py-2 border-b border-brown-light/20 bg-parchment-dark/50">
        <p className="font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium">
          {label}
        </p>
      </div>
      <div className="h-[80vh] overflow-y-auto scrollbar-quiet">
        {children}
      </div>
    </div>
  );
}
