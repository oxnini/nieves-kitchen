'use client';

/**
 * Full stamp gallery — every country registered in `CUSTOM_STAMPS`
 * (`lib/passport-stamps.ts`), rendered through the production
 * `CountryStampSlot` composite (multiply onto parchment + paper-bleed filter)
 * at the size it lands on a real passport spread.
 *
 * Unlike the real passport, this shows stamps for countries you have no recipe
 * for — the passport only draws a country once it's been cooked, so this is the
 * only place to eyeball the whole set.
 *
 * The list is derived directly from `CUSTOM_STAMPS` so it can never drift: every
 * registered stamp shows up. `REGION_OF` only controls grouping/order; any key
 * not mapped lands in an "Unsorted" bucket so a newly-added stamp is loud, not
 * silently dropped.
 *
 * Not linked from anywhere. Navigate manually to `/dev/stamps-all`.
 */

import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';
import { CUSTOM_STAMPS } from '@/lib/passport-stamps';
import { CULINARY_REGION_ORDER, type CulinaryRegion } from '@/lib/types';

/** Region each registered stamp belongs to (grouping/order only). */
const REGION_OF: Record<string, CulinaryRegion> = {
  // Western Europe
  belgium: 'Western Europe', france: 'Western Europe', greece: 'Western Europe',
  italy: 'Western Europe', portugal: 'Western Europe', spain: 'Western Europe',
  // Eastern Europe
  croatia: 'Eastern Europe', hungary: 'Eastern Europe', poland: 'Eastern Europe',
  slovakia: 'Eastern Europe',
  // East Asia
  china: 'East Asia', 'hong kong': 'East Asia', japan: 'East Asia',
  'south korea': 'East Asia', taiwan: 'East Asia',
  // Southeast Asia
  indonesia: 'Southeast Asia', malaysia: 'Southeast Asia',
  philippines: 'Southeast Asia', singapore: 'Southeast Asia',
  thailand: 'Southeast Asia', vietnam: 'Southeast Asia',
  // South Asia
  bangladesh: 'South Asia', bhutan: 'South Asia', india: 'South Asia',
  nepal: 'South Asia', pakistan: 'South Asia', 'sri lanka': 'South Asia',
  afghanistan: 'South Asia',
  // Central Asia is not a CulinaryRegion — Central Asian countries fold into
  // South Asia / Middle East groupings here for display only.
  kazakhstan: 'South Asia', turkmenistan: 'South Asia', uzbekistan: 'South Asia',
  // Middle East
  cyprus: 'Middle East', iran: 'Middle East', lebanon: 'Middle East',
  'saudi arabia': 'Middle East', turkey: 'Middle East',
  // North Africa
  algeria: 'North Africa', egypt: 'North Africa', libya: 'North Africa',
  morocco: 'North Africa', sudan: 'North Africa', tunisia: 'North Africa',
  // Sub-Saharan Africa
  ethiopia: 'Sub-Saharan Africa', gambia: 'Sub-Saharan Africa',
  ghana: 'Sub-Saharan Africa', kenya: 'Sub-Saharan Africa',
  liberia: 'Sub-Saharan Africa', niger: 'Sub-Saharan Africa',
  nigeria: 'Sub-Saharan Africa', senegal: 'Sub-Saharan Africa',
  'sierra leone': 'Sub-Saharan Africa', somalia: 'Sub-Saharan Africa',
  'south africa': 'Sub-Saharan Africa', togo: 'Sub-Saharan Africa',
  // North America
  mexico: 'North America', 'united states': 'North America',
  jamaica: 'North America',
  // South America
  argentina: 'South America', peru: 'South America',
};

/**
 * Stamps flagged as pre-redesign / placeholder quality (CHECKLIST `[~]` plus
 * the Somalia colour placeholder). Shown as a caption tag so they're easy to
 * pick out from the finished ink-pressed set.
 */
const QUEUED: Record<string, string> = {
  turkey: 'queued re-render',
  mexico: 'queued re-render',
  peru: 'queued re-render',
  'united states': 'queued re-render',
  bhutan: 'queued re-render',
  nepal: 'queued re-render',
  singapore: 'queued re-render',
  afghanistan: 'queued re-render',
  kazakhstan: 'queued re-render',
  turkmenistan: 'queued re-render',
  uzbekistan: 'queued re-render',
  somalia: 'colour placeholder',
};

const ALL_COUNTRIES = Object.keys(CUSTOM_STAMPS);

// Bucket every registered stamp by region; anything unmapped goes to "Unsorted".
const UNSORTED = 'Unsorted (add to REGION_OF)';
const GROUPS: { region: string; countries: string[] }[] = (() => {
  const byRegion = new Map<string, string[]>();
  for (const c of ALL_COUNTRIES) {
    const region = REGION_OF[c] ?? UNSORTED;
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(c);
  }
  const ordered: { region: string; countries: string[] }[] = [];
  for (const region of CULINARY_REGION_ORDER) {
    const countries = byRegion.get(region);
    if (countries) ordered.push({ region, countries: countries.sort() });
  }
  const unsorted = byRegion.get(UNSORTED);
  if (unsorted) ordered.push({ region: UNSORTED, countries: unsorted.sort() });
  return ordered;
})();

export default function StampsAllGalleryPage() {
  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      <PaperTexture />

      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">
          All stamps — {ALL_COUNTRIES.length} registered
        </h1>
        <p className="opacity-80 text-sm max-w-3xl">
          Every country in <code>CUSTOM_STAMPS</code>, rendered through the
          production <code>CountryStampSlot</code> composite at real spread size.
          This includes countries with no recipe yet (the live passport only
          draws a country once it&apos;s cooked, so they&apos;re invisible
          there). A <span className="text-paprika">queued re-render</span> /{' '}
          <span className="text-paprika">colour placeholder</span> tag marks
          stamps that still need replacing.
        </p>
      </header>

      {GROUPS.map(({ region, countries }) => (
        <section key={region} className="max-w-6xl mx-auto mb-16">
          <h2 className="font-heading text-xl mb-6">
            {region}{' '}
            <span className="text-sm opacity-50 font-body">
              ({countries.length})
            </span>
          </h2>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12 justify-items-center"
            style={{ ['--stamp-size' as string]: '150px' }}
          >
            {countries.map((c) => (
              <figure key={c} className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center min-h-[210px]">
                  <CountryStampSlot country={c} stamps={[]} onClick={() => {}} />
                </div>
                <figcaption className="text-xs opacity-70 capitalize text-center">
                  {c}
                </figcaption>
                {QUEUED[c] && (
                  <span className="text-[10px] uppercase tracking-wide text-paprika">
                    {QUEUED[c]}
                  </span>
                )}
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
