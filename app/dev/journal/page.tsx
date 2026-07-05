'use client';

/**
 * `/journal` primitive + composition sandbox (Cook's Journal, phase 3a).
 *
 * Driven entirely by local fixtures (`./fixtures.ts`) — this route must
 * NEVER call Supabase or `useCookedStamps`. Task 2 scope was the
 * presentational primitives (`JournalDishMark`, `JournalStat`) plus this
 * scaffold; the scenario selector and A/B toggles were wired to state then
 * so later tasks could consume them without touching this file's plumbing.
 *
 * Task 5 adds the "Full scroll assembly" section at the bottom, which
 * mounts the real `JournalScrollView` (the presentational body shared with
 * the self-fetching `JournalScroll`) against this route's fixtures — the
 * end-to-end EMPTY/ONE/THREE/MANY check for the composed page, still with
 * zero Supabase calls.
 *
 * Not linked from anywhere. Navigate manually to `/dev/journal`.
 */

import { useMemo, useState } from 'react';
import PaperTexture from '@/components/passport/PaperTexture';
import JournalDishMark from '@/components/journal/JournalDishMark';
import JournalStat from '@/components/journal/JournalStat';
import JournalLog from '@/components/journal/JournalLog';
import JournalStamps from '@/components/journal/JournalStamps';
import TravelIdentity from '@/components/journal/TravelIdentity';
import JournalScrollView from '@/components/journal/JournalScrollView';
import TierLedger from '@/components/passport/TierLedger';
import { buildDishCount, buildJournalEntries } from '@/lib/journal';
import { summarizeStamps } from '@/lib/passport';
import { EMPTY, ONE, THREE, MANY, metaBySlug, countryToRegion, buildFixtureCancellations } from './fixtures';
import type { Stamp } from '@/lib/passport';
import type { Recipe } from '@/lib/types';

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

  const summary = useMemo(
    () => summarizeStamps(stamps, countryToRegion),
    [stamps],
  );

  const cancellationsByCountry = useMemo(
    () => buildFixtureCancellations(stamps),
    [stamps],
  );

  // `JournalScrollView`'s `StampedRecipesModal` wiring needs a
  // country -> recipes map; an empty one is fine here per the task 5 brief
  // ("the modal is not the focus here") — clicking a stamp still opens the
  // modal, which degrades to "no recipes from here yet" rather than crashing.
  const recipesByCountry = useMemo(() => new Map<string, Recipe[]>(), []);

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

      {/* Travel identity (earned) vs TierLedger (reference, unmodified) */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-6">Identity ({identity})</h2>
        {identity === 'earned' ? (
          <TravelIdentity title={summary.title} />
        ) : (
          <div className="flex flex-col min-h-0 max-w-md">
            <TierLedger currentTitle={summary.title} totalStamps={summary.totalStamps} />
          </div>
        )}
      </section>

      {/* Stamps collected gallery */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-6">Stamps collected ({scenario})</h2>
        {summary.totalStamps === 0 ? (
          <p className="text-sm opacity-60 italic">Empty scenario, no stamps yet.</p>
        ) : (
          <JournalStamps
            summary={summary}
            cancellationsByCountry={cancellationsByCountry}
            regionOfCountry={countryToRegion}
            onStampClick={(country) => console.log('[dev/journal] stamp clicked:', country)}
          />
        )}
      </section>

      {/*
        Full scroll assembly (task 5): mounts the exact `JournalScrollView`
        that `/journal` will render, fed entirely from this route's
        fixtures. This is the end-to-end check for EMPTY/ONE/THREE/MANY —
        confirms the masthead, empty/nascent line, Log, and Stamps section
        compose correctly and that each section is independently
        conditional (1-3 cooks should read as intentional, not sparse).
      */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-6">Full scroll assembly ({scenario})</h2>
        <div className="border border-brown-light/30 rounded-2xl overflow-hidden bg-parchment">
          <JournalScrollView
            stats={stats}
            entries={journalEntries}
            summary={summary}
            cancellationsByCountry={cancellationsByCountry}
            regionOfCountry={countryToRegion}
            title={summary.title}
            recipesByCountry={recipesByCountry}
            isLoading={false}
          />
        </div>
      </section>
    </main>
  );
}
