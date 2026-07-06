'use client';

import { useMemo, useState } from 'react';
import type { JournalEntry } from '@/lib/journal';
import type { PassportSummary, ExplorerTitle, Stamp as StampRow } from '@/lib/passport';
import type { Recipe, CulinaryRegion } from '@/lib/types';
import type { CancellationInput } from '@/components/passport/CountryStampSlot';
import StampedRecipesModal from '@/components/passport/StampedRecipesModal';
import JournalMasthead from './JournalMasthead';
import JournalLog from './JournalLog';
import JournalStamps from './JournalStamps';
import TravelIdentity from './TravelIdentity';

export interface JournalScrollViewProps {
  stats: { meals: number; dishes: number; countries: number };
  entries: JournalEntry[];
  summary: PassportSummary;
  cancellationsByCountry: Map<string, CancellationInput[]>;
  /** Country -> region, the hook's `countryToRegion` (or its fixture equivalent). */
  regionOfCountry: Map<string, CulinaryRegion>;
  /** The cook's current earned explorer title (`summary.title`), passed
   *  separately so the "Stamps collected" section's `TravelIdentity` doesn't
   *  need the full `summary` shape threaded through it. */
  title: ExplorerTitle;
  /** Country -> every recipe from that country (cooked and uncooked), for
   *  `StampedRecipesModal`. The dev route may pass an empty map — the modal
   *  degrades gracefully to "no recipes from here yet". */
  recipesByCountry: Map<string, Recipe[]>;
  isLoading: boolean;
}

/**
 * The presentational body of `/journal`: masthead, empty/nascent line, the
 * Log, and the Stamps-collected section, plus the `StampedRecipesModal`
 * wiring. Pure props — no data fetching — so both `JournalScroll` (real,
 * self-fetching via `useCookedStamps`/`useRecipes`) and `/dev/journal`
 * (fixture-fed) render the exact same component.
 */
export default function JournalScrollView({
  stats,
  entries,
  summary,
  cancellationsByCountry,
  regionOfCountry,
  title,
  recipesByCountry,
  isLoading,
}: JournalScrollViewProps) {
  const [modalCountry, setModalCountry] = useState<string | null>(null);

  const modalRecipes: Recipe[] = useMemo(() => {
    if (!modalCountry) return [];
    return recipesByCountry.get(modalCountry) ?? [];
  }, [modalCountry, recipesByCountry]);

  const modalStampsByRecipe = useMemo(() => {
    const m = new Map<string, StampRow[]>();
    if (!modalCountry) return m;
    const stamps = summary.stampsPerCountry.get(modalCountry) ?? [];
    for (const s of stamps) {
      const a = m.get(s.recipe_slug) ?? [];
      a.push(s);
      m.set(s.recipe_slug, a);
    }
    return m;
  }, [modalCountry, summary.stampsPerCountry]);

  if (isLoading) {
    return <JournalSkeleton />;
  }

  // Empty / nascent state (design brief §4.6): masthead + one warm line,
  // nothing else. `JournalMasthead` already hides its stats row when every
  // stat is zero, so reusing it here (rather than a bespoke title) keeps
  // the empty state and the populated masthead a single source of truth.
  if (stats.meals === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <JournalMasthead stats={stats} />
        <p className="mt-8 font-body text-brown-medium text-base sm:text-lg leading-relaxed">
          Your journal is blank. It fills one dish at a time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16">
      <JournalMasthead stats={stats} keptSince={keptSince(entries)} />

      {entries.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">
            The Log
          </h2>
          <JournalLog entries={entries} />
        </section>
      )}

      {summary.totalStamps > 0 && (
        <section className="flex flex-col gap-10">
          <h2 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">
            Stamps collected
          </h2>
          <TravelIdentity title={title} />
          <JournalStamps
            summary={summary}
            cancellationsByCountry={cancellationsByCountry}
            regionOfCountry={regionOfCountry}
            onStampClick={setModalCountry}
          />
        </section>
      )}

      {modalCountry && (
        <StampedRecipesModal
          country={modalCountry}
          recipes={modalRecipes}
          stampsByRecipe={modalStampsByRecipe}
          onClose={() => setModalCountry(null)}
        />
      )}
    </div>
  );
}

/**
 * "February 2026" for the masthead's "Kept since" line — the month of the
 * earliest cook. `entries` arrive newest-first, so the earliest is the last;
 * returns undefined for an empty log so the masthead hides the line.
 */
function keptSince(entries: JournalEntry[]): string | undefined {
  const first = entries[entries.length - 1];
  if (!first) return undefined;
  return new Date(first.cookedAt).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

/** Calm parchment skeleton: masthead shape + a few ledger rows. */
function JournalSkeleton() {
  return (
    <div
      aria-busy="true"
      role="status"
      aria-label="Loading your journal"
      className="max-w-4xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16"
    >
      <div>
        <div className="h-3 w-28 bg-parchment-dark rounded animate-pulse" />
        <div className="mt-3 h-10 w-3/4 bg-parchment-dark rounded animate-pulse" />
        <div className="mt-8 flex items-center gap-8 sm:gap-12">
          <div className="h-12 w-14 bg-parchment-dark rounded animate-pulse" />
          <div className="h-12 w-14 bg-parchment-dark rounded animate-pulse" />
          <div className="h-12 w-14 bg-parchment-dark rounded animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="h-3 w-32 bg-parchment-dark rounded animate-pulse" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-3 w-16 shrink-0 bg-parchment-dark rounded animate-pulse" />
            <div className="h-3 flex-1 bg-parchment-dark rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
