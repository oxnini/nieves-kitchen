'use client';

/**
 * Scratch gallery for the most recently ingested stamp batch — the countries
 * under "## Missing — to add" in docs/stamps/CHECKLIST.md (the running ingest
 * list). Excludes the first batches (Ethiopia/Ghana/India/Jamaica, Europe,
 * East Asia) on purpose: this page is for judging the *new* additions as a set.
 *
 * Direction is settled: flat two-tone ink-on-transparent is the one grammar
 * (see lib/passport-stamps memory / docs/stamps/SPEC.md). Somalia currently
 * shows a colour placeholder — it's queued ([~]) for a flat-ink re-render.
 *
 * Not linked from anywhere. Navigate manually to `/dev/stamps-gallery`.
 */

import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';

// The newly-added batch, grouped by region (CHECKLIST "Missing — to add").
const BATCH: { region: string; countries: string[] }[] = [
  { region: 'North Africa', countries: ['algeria', 'tunisia', 'libya', 'sudan'] },
  {
    region: 'Sub-Saharan Africa',
    countries: [
      'senegal',
      'gambia',
      'liberia',
      'nigeria',
      'togo',
      'sierra leone',
      'niger',
      'kenya',
      'somalia',
    ],
  },
  { region: 'Middle East', countries: ['saudi arabia', 'cyprus'] },
  { region: 'South America', countries: ['argentina'] },
];

export default function StampsGalleryPage() {
  const total = BATCH.reduce((n, g) => n + g.countries.length, 0);

  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      <PaperTexture />

      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">
          New stamp batch — {total} additions
        </h1>
        <p className="opacity-80 text-sm max-w-3xl">
          The most recently ingested countries (CHECKLIST &ldquo;Missing — to
          add&rdquo;). First batches (Ethiopia / Ghana / India / Jamaica,
          Europe, East Asia) are excluded. All rendered through the production{' '}
          <code>CountryStampSlot</code> composite (multiply onto parchment +
          paper-bleed filter) at the size they&apos;d land on a real spread.
          Direction is flat two-tone ink; Somalia shows a colour placeholder
          pending a flat-ink re-render.
        </p>
      </header>

      {BATCH.map(({ region, countries }) => (
        <section key={region} className="max-w-6xl mx-auto mb-16">
          <h2 className="font-heading text-xl mb-6">{region}</h2>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12 justify-items-center"
            style={{ ['--stamp-size' as string]: '150px' }}
          >
            {countries.map((c) => (
              <figure key={c} className="flex flex-col items-center gap-3">
                <CountryStampSlot country={c} stamps={[]} onClick={() => {}} />
                <figcaption className="text-xs opacity-70 capitalize">
                  {c}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
