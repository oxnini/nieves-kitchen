'use client';

/**
 * Scratch preview for the freshly ingested Pakistan + Bangladesh visas.
 *
 * No recipes exist for either country yet, so the production passport
 * won't render their slots. This route runs them through the real
 * `CountryStampSlot` composite on parchment so the user can judge the
 * render visually before any recipes ship.
 *
 * Navigate manually to `/dev/pakistan-bangladesh-stamps`.
 */

import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';

const SAMPLE_DATE = new Date(2026, 4, 18); // 18 MAY 26

const PAIR = ['pakistan', 'bangladesh'] as const;
const SOUTH_ASIA_REFERENCE = ['india', 'sri lanka'] as const;

export default function PakistanBangladeshStampScratchPage() {
  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      <PaperTexture />

      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">
          Pakistan + Bangladesh — visa preview
        </h1>
        <p className="opacity-80 text-sm max-w-2xl">
          Both stamps were just ingested but no recipes exist for either
          country, so the production passport doesn&apos;t render them.
          This route mirrors the real composite (mix-blend-multiply,
          paper-bleed filter, parchment behind) at booklet size so you
          can see what they&apos;ll look like once recipes land.
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
          className="grid grid-cols-2 gap-12 justify-items-center"
          style={{ ['--stamp-size' as string]: '180px' }}
        >
          {PAIR.map((c) => (
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
          Side-by-side with the South Asia family
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Same render path, same size. Look for tonal consistency
          (red-ink line work, transparent ground) and silhouette weight
          against India / Sri Lanka.
        </p>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 justify-items-center"
          style={{ ['--stamp-size' as string]: '150px' }}
        >
          {([...PAIR, ...SOUTH_ASIA_REFERENCE] as const).map((c) => (
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
          className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center"
          style={{ ['--stamp-size' as string]: '280px' }}
        >
          {PAIR.map((c) => (
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
          With a hand-faked cancellation
        </h2>
        <p className="text-sm opacity-70 mb-6">
          One fake cook each, so you can see how a navy South-Asia
          postmark sits on top of the visa. Pakistan&apos;s centre glyph
          is <code>❋</code>; Bangladesh&apos;s is <code>✺</code>.
        </p>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center"
          style={{ ['--stamp-size' as string]: '220px' }}
        >
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="pakistan"
              stamps={[]}
              onClick={() => {}}
              cancellations={[
                {
                  recipeTitle: 'Chicken Karahi',
                  cookDate: SAMPLE_DATE,
                  rotation: -7,
                  center: { x: 34, y: 30 },
                },
              ]}
            />
            <figcaption className="text-xs opacity-70 text-center">
              Pakistan · 1 cook
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="bangladesh"
              stamps={[]}
              onClick={() => {}}
              cancellations={[
                {
                  recipeTitle: 'Shorshe Ilish',
                  cookDate: SAMPLE_DATE,
                  rotation: 6,
                  center: { x: 68, y: 34 },
                },
              ]}
            />
            <figcaption className="text-xs opacity-70 text-center">
              Bangladesh · 1 cook
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
