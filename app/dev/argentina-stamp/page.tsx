'use client';

/**
 * Scratch preview for the freshly ingested Argentina visa.
 *
 * No recipe exists for Argentina yet, so the production passport won't
 * render its slot. This route runs it through the real
 * `CountryStampSlot` composite on parchment so the user can judge the
 * render visually before any recipes ship.
 *
 * Navigate manually to `/dev/argentina-stamp`.
 */

import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';

const SAMPLE_DATE = new Date(2026, 4, 29); // 29 MAY 26

const SOUTH_AMERICA_FAMILY = ['mexico', 'jamaica', 'peru'] as const;

export default function ArgentinaStampScratchPage() {
  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      <PaperTexture />

      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">
          Argentina — visa preview
        </h1>
        <p className="opacity-80 text-sm max-w-2xl">
          The Argentina stamp was just ingested but no recipe exists yet,
          so the production passport doesn&apos;t render it. This route
          mirrors the real composite (mix-blend-multiply, paper-bleed
          filter, parchment behind) at booklet size so you can see what
          it&apos;ll look like once a recipe lands.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Booklet-size · alone on parchment
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Rendered through <code>CountryStampSlot</code> at{' '}
          <code>--stamp-size: 180px</code> — the size each visa lands at
          on a real passport spread.
        </p>
        <div
          className="grid grid-cols-1 gap-12 justify-items-center"
          style={{ ['--stamp-size' as string]: '180px' }}
        >
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="argentina"
              stamps={[]}
              onClick={() => {}}
            />
            <figcaption className="text-xs opacity-70">Argentina</figcaption>
          </figure>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Side-by-side with the South America family
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Same render path, same size. Look for tonal consistency
          (terracotta + indigo line work, transparent ground) and
          silhouette weight against Mexico / Jamaica / Peru.
        </p>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 justify-items-center"
          style={{ ['--stamp-size' as string]: '150px' }}
        >
          {(['argentina', ...SOUTH_AMERICA_FAMILY] as const).map((c) => (
            <figure key={c} className="flex flex-col items-center gap-3">
              <CountryStampSlot
                country={c}
                stamps={[]}
                onClick={() => {}}
              />
              <figcaption className="text-xs opacity-70 capitalize">
                {c}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Larger preview — judge line weight + cartouche balance
        </h2>
        <div
          className="grid grid-cols-1 justify-items-center"
          style={{ ['--stamp-size' as string]: '280px' }}
        >
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="argentina"
              stamps={[]}
              onClick={() => {}}
            />
            <figcaption className="text-xs opacity-70">Argentina</figcaption>
          </figure>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          With a hand-faked cancellation
        </h2>
        <p className="text-sm opacity-70 mb-6">
          One fake cook, so you can see how a navy South-America postmark
          sits on top of the visa. Argentina&apos;s centre glyph is{' '}
          <code>❉</code>.
        </p>
        <div
          className="grid grid-cols-1 justify-items-center"
          style={{ ['--stamp-size' as string]: '220px' }}
        >
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="argentina"
              stamps={[]}
              onClick={() => {}}
              cancellations={[
                {
                  recipeTitle: 'Asado con Chimichurri',
                  cookDate: SAMPLE_DATE,
                  rotation: -6,
                  center: { x: 32, y: 34 },
                },
              ]}
            />
            <figcaption className="text-xs opacity-70 text-center">
              Argentina · 1 cook
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
