'use client';

/**
 * `/journal` primitive + composition sandbox (Cook's Journal, phase 3a).
 *
 * Driven entirely by local fixtures (`./fixtures.ts`) — this route must
 * NEVER call Supabase or `useCookedStamps`. Task 2 scope is the
 * presentational primitives (`JournalDishMark`, `JournalStat`) plus this
 * scaffold; the scenario selector and A/B toggles are wired to state now so
 * later tasks can consume them without touching this file's plumbing.
 *
 * Not linked from anywhere. Navigate manually to `/dev/journal`.
 */

import { useMemo, useState } from 'react';
import PaperTexture from '@/components/passport/PaperTexture';
import JournalDishMark from '@/components/journal/JournalDishMark';
import JournalStat from '@/components/journal/JournalStat';
import JournalLog from '@/components/journal/JournalLog';
import { buildDishCount, buildJournalEntries } from '@/lib/journal';
import { EMPTY, ONE, THREE, MANY, metaBySlug } from './fixtures';
import type { Stamp } from '@/lib/passport';

type ScenarioName = 'EMPTY' | 'ONE' | 'THREE' | 'MANY';

const SCENARIOS: Record<ScenarioName, Stamp[]> = { EMPTY, ONE, THREE, MANY };

type CornersMode = 'regions' | 'countries';
type IdentityMode = 'earned' | 'ledger';

export default function JournalDevPage() {
  const [scenario, setScenario] = useState<ScenarioName>('MANY');
  const [corners, setCorners] = useState<CornersMode>('regions');
  const [identity, setIdentity] = useState<IdentityMode>('earned');

  const stamps = SCENARIOS[scenario];

  const stats = useMemo(() => {
    const meals = stamps.length;
    const dishes = buildDishCount(stamps);
    const regionsSeen = new Set<string>();
    for (const s of stamps) {
      const region = metaBySlug.get(s.recipe_slug)?.region;
      if (region) regionsSeen.add(region);
    }
    return { meals, dishes, corners: regionsSeen.size };
  }, [stamps]);

  const journalEntries = useMemo(
    () => buildJournalEntries(stamps, metaBySlug),
    [stamps],
  );

  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      <PaperTexture />

      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">Journal primitives</h1>
        <p className="opacity-80 text-sm max-w-2xl">
          <code>JournalDishMark</code> and <code>JournalStat</code>, previewed
          against fixture data only (no Supabase). Toggles below are inert
          placeholders for later tasks in the phase 3a build.
        </p>
      </header>

      {/* Controls */}
      <section className="max-w-4xl mx-auto mb-16 flex flex-wrap gap-8">
        <div>
          <p className="font-stamp text-[11px] text-brown-medium mb-2">Scenario</p>
          <div className="flex gap-2">
            {(Object.keys(SCENARIOS) as ScenarioName[]).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setScenario(name)}
                className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
                  scenario === name
                    ? 'bg-brown-dark text-parchment border-brown-dark'
                    : 'border-brown-light/40 hover:border-brown-dark'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-stamp text-[11px] text-brown-medium mb-2">Corners</p>
          <div className="flex gap-2">
            {(['regions', 'countries'] as CornersMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCorners(mode)}
                className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
                  corners === mode
                    ? 'bg-brown-dark text-parchment border-brown-dark'
                    : 'border-brown-light/40 hover:border-brown-dark'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-stamp text-[11px] text-brown-medium mb-2">Identity</p>
          <div className="flex gap-2">
            {(['earned', 'ledger'] as IdentityMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setIdentity(mode)}
                className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
                  identity === mode
                    ? 'bg-brown-dark text-parchment border-brown-dark'
                    : 'border-brown-light/40 hover:border-brown-dark'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* JournalDishMark swatches */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-6">Dish marks</h2>
        <div className="flex flex-wrap items-start gap-10">
          <figure className="flex flex-col items-center gap-2">
            <JournalDishMark country="Turkey" title="Shakshuka" />
            <figcaption className="text-xs opacity-70">Custom stamp (Turkey)</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <JournalDishMark country="Iraq" title="Masgouf" />
            <figcaption className="text-xs opacity-70">Procedural (Iraq)</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <JournalDishMark country={null} title="Talbina" />
            <figcaption className="text-xs opacity-70">Origin-less (null)</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <JournalDishMark country="Turkey" title="Baklava" size={80} />
            <figcaption className="text-xs opacity-70">Custom, size=80</figcaption>
          </figure>
        </div>
      </section>

      {/* JournalStat row */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-6">Stat row ({scenario})</h2>
        <div className="flex gap-12">
          {stats.meals > 0 && <JournalStat value={stats.meals} label="Meals" />}
          {stats.dishes > 0 && <JournalStat value={stats.dishes} label="Dishes" />}
          {stats.corners > 0 && (
            <JournalStat
              value={stats.corners}
              label={corners === 'regions' ? 'Corners' : 'Countries'}
            />
          )}
          {stats.meals === 0 && (
            <p className="text-sm opacity-60 italic">Empty scenario, nothing to count yet.</p>
          )}
        </div>
      </section>

      {/* JournalLog feed */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-6">Log ({scenario})</h2>
        {journalEntries.length === 0 ? (
          <p className="text-sm opacity-60 italic">Empty scenario, nothing logged yet.</p>
        ) : (
          <JournalLog entries={journalEntries} />
        )}
      </section>
    </main>
  );
}
