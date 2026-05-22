'use client';

/**
 * Scratch route for the empty-passport cover treatment.
 *
 * Renders the production CoverPage twice — once with an empty summary,
 * once with a populated summary — so the empty-state changes (dimmed seal,
 * italic Literata invitation in place of the tier title) can be eyeballed
 * against the unchanged baseline.
 *
 * Not linked from anywhere; navigate to `/dev/passport-cover`.
 */

import CoverPage from '@/components/passport/CoverPage';
import type { PassportSummary } from '@/lib/passport';

const EMPTY: PassportSummary = {
  totalStamps: 0,
  mealsCooked: 0,
  uniqueCountries: new Set(),
  regionsTouched: new Set(),
  stampsPerCountry: new Map(),
  title: 'New Explorer',
  nextTier: { title: 'Curious Cook', minStamps: 1, minRegions: 1 },
};

const POPULATED: PassportSummary = {
  totalStamps: 7,
  mealsCooked: 9,
  uniqueCountries: new Set(['Italy', 'Japan', 'Morocco', 'India', 'Mexico', 'France', 'Vietnam']),
  regionsTouched: new Set(['Western Europe', 'East Asia', 'North Africa', 'South Asia', 'North America', 'Southeast Asia']),
  stampsPerCountry: new Map(),
  title: 'Wanderer',
  nextTier: { title: 'Globetrotter', minStamps: 10, minRegions: 4 },
};

/* Passport-page proportions — roughly the booklet's half-spread aspect.
   Tweak if the cover looks pinched. */
const PAGE_W = 360;
const PAGE_H = 500;

function CoverFrame({ label, summary }: { label: string; summary: PassportSummary }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="font-stamp text-xs uppercase tracking-[0.2em] text-brown-medium">
        {label}
      </div>
      <div
        className="shadow-xl rounded-lg overflow-hidden"
        style={{ width: PAGE_W, height: PAGE_H }}
      >
        <CoverPage summary={summary} />
      </div>
    </div>
  );
}

export default function PassportCoverScratch() {
  return (
    <main className="min-h-screen bg-parchment-dark px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-3xl text-brown-dark mb-1">
          CoverPage · empty-state preview
        </h1>
        <p className="font-body text-sm text-brown-medium mb-8 max-w-2xl">
          Side-by-side comparison of the production CoverPage. Left: a fresh passport
          (0 stamps) — seal at 70% opacity, italic Literata invitation. Right: a
          mid-journey passport (7 stamps, Wanderer tier) — unchanged baseline.
        </p>

        <div className="flex flex-wrap gap-10">
          <CoverFrame label="Empty · 0 stamps" summary={EMPTY} />
          <CoverFrame label="Populated · 7 stamps" summary={POPULATED} />
        </div>

        <div className="mt-12 border-t border-brown-light/30 pt-6 max-w-2xl">
          <h2 className="font-heading text-lg text-brown-dark mb-2">What to check</h2>
          <ul className="font-body text-sm text-brown-medium space-y-1.5 list-disc pl-5">
            <li>Empty seal is visibly dimmer than the populated one (should read as ~70%).</li>
            <li>Empty subtitle reads as italic Literata, not uppercase mono.</li>
            <li>Subtitle line breaks gracefully at the page width.</li>
            <li>Populated cover is byte-identical to today&apos;s production.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
