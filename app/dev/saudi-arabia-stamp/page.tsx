'use client';

/**
 * Scratch preview for the Saudi Arabia visa.
 *
 * The ingest validator flagged this render: the gold halo is baked into
 * the alpha (~798×965 bbox of a 1024 canvas), well beyond the cartouche.
 * On parchment it will sit on a soft gold card rather than the clean
 * ink-on-transparent look of the new-aesthetic family
 * (Ethiopia / Ghana / India / Jamaica).
 *
 * This route makes that call visual:
 *   1. Saudi Arabia alone at booklet size, on parchment, with the
 *      production composite (mix-blend-multiply + paper-bleed filter).
 *   2. Side-by-side row vs. the reference family the validator named.
 *   3. Saudi Arabia with one hand-faked cancellation on top, so you can
 *      see what the full production composite reads like.
 *
 * Not linked from anywhere. Navigate manually to
 * `/dev/saudi-arabia-stamp`.
 */

import CountryStampSlot from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';

const REFERENCE_FAMILY = ['ethiopia', 'ghana', 'india', 'jamaica'] as const;

const SAMPLE_DATE = new Date(2026, 4, 13); // 13 MAY 26

export default function SaudiArabiaStampScratchPage() {
  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      <PaperTexture />

      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">
          Saudi Arabia — visa preview
        </h1>
        <p className="opacity-80 text-sm max-w-2xl">
          Validator flagged a gold halo baked into the alpha of{' '}
          <code>saudi-arabia.webp</code> (bbox 798×965 of a 1024 canvas).
          On parchment, that halo multiplies into a soft gold card behind
          the cartouche. The reference family
          (Ethiopia / Ghana / India / Jamaica) renders clean
          ink-on-transparent because their alpha is tight to the design.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Booklet-size · alone on parchment (production composite)
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Rendered through <code>CountryStampSlot</code> at{' '}
          <code>--stamp-size: 180px</code> — the size it would land on a
          real passport spread.
        </p>
        <div
          className="grid place-items-center"
          style={{ ['--stamp-size' as string]: '180px' }}
        >
          <CountryStampSlot
            country="saudi arabia"
            stamps={[]}
            onClick={() => {}}
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Side-by-side vs. the new-aesthetic reference family
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Same render path, same size. Look for the rectangular gold
          rectangle behind Saudi Arabia&apos;s cartouche — none of the
          others have it.
        </p>
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-10 justify-items-center"
          style={{ ['--stamp-size' as string]: '160px' }}
        >
          {(['saudi arabia', ...REFERENCE_FAMILY] as const).map((c) => (
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
          Larger preview — judge halo intensity
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Bigger render so the halo&apos;s edge softness and tint are
          easier to see. If the gold reads as &quot;intentional cartouche
          tint&quot; here, it&apos;s probably fine; if it reads as
          &quot;rectangular card behind the stamp,&quot; re-render with
          no background glow.
        </p>
        <div
          className="grid place-items-center"
          style={{ ['--stamp-size' as string]: '280px' }}
        >
          <CountryStampSlot
            country="saudi arabia"
            stamps={[]}
            onClick={() => {}}
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          With a cancellation on top
        </h2>
        <p className="text-sm opacity-70 mb-6">
          One hand-faked cook to show how a postmark sits over the gold
          field. Saudi Arabia isn&apos;t yet registered in{' '}
          <code>lib/cancellation-traits.ts</code> — postmark falls back
          to brown ink + default asterisk glyph. (You&apos;ll likely want
          Middle East wine ink + a geometric rosette like ❀ / ✦ to match
          Turkey / Iran / Lebanon when you add it.)
        </p>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center"
          style={{ ['--stamp-size' as string]: '220px' }}
        >
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="saudi arabia"
              stamps={[]}
              onClick={() => {}}
              cancellations={[
                {
                  recipeTitle: 'Kabsa',
                  cookDate: SAMPLE_DATE,
                  rotation: -6,
                  center: { x: 32, y: 30 },
                },
              ]}
            />
            <figcaption className="text-xs opacity-70 text-center">
              Saudi Arabia · 1 cook
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-3">
            <CountryStampSlot
              country="ethiopia"
              stamps={[]}
              onClick={() => {}}
              cancellations={[
                {
                  recipeTitle: 'Doro Wat',
                  cookDate: SAMPLE_DATE,
                  rotation: 7,
                  center: { x: 68, y: 32 },
                },
              ]}
            />
            <figcaption className="text-xs opacity-70 text-center">
              Ethiopia · 1 cook (reference)
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
