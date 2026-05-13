'use client';

/**
 * Scratch route for verifying `CancellationMark` in isolation.
 *
 * Hand-faked props only — no Supabase, no real cooks. Renders the mark
 * across a few rotations, inks, glyphs, and edge-case titles; stacks it
 * on real visa WebPs at the SPEC §3 size (~40% of the visa's longest
 * edge) with SPEC §7 compositing (NO mix-blend-multiply on the
 * cancellation, ~88% opacity, paper-bleed filter applied to the
 * composite). Includes a "with grain filter" preview column.
 *
 * Not linked from anywhere; navigate manually to `/dev/cancellation`.
 */

import Image from 'next/image';
import CancellationMark from '@/components/passport/CancellationMark';
import CountryStampSlot, {
  type CancellationInput,
} from '@/components/passport/CountryStampSlot';
import PaperTexture from '@/components/passport/PaperTexture';

const SAMPLE_DATE = new Date(2026, 4, 13); // 13 MAY 26

interface Cell {
  label: string;
  title: string;
  ink: string;
  glyph: string;
  rotation: number;
  date?: Date;
}

const cells: Cell[] = [
  { label: 'Terracotta · asterisk · 0°', title: 'Bouillabaisse', ink: '--stamp-ink-terracotta', glyph: '✱', rotation: 0 },
  { label: 'Navy · fleuron · −8°', title: 'Aloo Gobi', ink: '--stamp-ink-navy', glyph: '❦', rotation: -8 },
  { label: 'Wine · crossbar · 11°', title: 'Mapo Tofu', ink: '--stamp-ink-wine', glyph: '✜', rotation: 11 },
  { label: 'Brown · sun · −4°', title: 'Pad See Ew', ink: '--stamp-ink-brown', glyph: '✺', rotation: -4 },
  {
    label: 'Long title (truncates) · 5°',
    title: 'Slow-Cooked Lamb Tagine with Apricots and Preserved Lemon',
    ink: '--stamp-ink-terracotta',
    glyph: '✱',
    rotation: 5,
  },
  { label: 'Exact 16 chars · 0°', title: 'Carbonara Romana', ink: '--stamp-ink-terracotta', glyph: '✱', rotation: 0 },
  { label: 'Short · −12°', title: 'Pho', ink: '--stamp-ink-brown', glyph: '✸', rotation: -12 },
  {
    label: 'Single-digit day · 9°',
    title: 'Tonkotsu Ramen',
    ink: '--stamp-ink-wine',
    glyph: '❋',
    rotation: 9,
    date: new Date(2026, 0, 3), // 03 JAN 26
  },
];

// Step 3: exercise CountryStampSlot itself with hand-faked cancellations.
// Country picks span the cancellation-ink palette and a few visa aspect
// ratios (China is portrait, Hong Kong landscape, Italy square-ish).
const slotSamples: {
  country: string;
  note: string;
  cancellations: CancellationInput[];
}[] = [
  {
    country: 'italy',
    note: 'square visa · terracotta ink · 3 cooks',
    cancellations: [
      { recipeTitle: 'Carbonara Romana', cookDate: new Date(2026, 4, 13), rotation: -7 },
      { recipeTitle: 'Osso Buco', cookDate: new Date(2026, 3, 22), rotation: 9 },
      { recipeTitle: 'Tagliatelle al Ragù', cookDate: new Date(2026, 2, 4), rotation: -3 },
    ],
  },
  {
    country: 'china',
    note: 'portrait visa · wine ink · 2 cooks (was the dark-visa failure case)',
    cancellations: [
      { recipeTitle: 'Mapo Tofu', cookDate: new Date(2026, 4, 9), rotation: -6 },
      { recipeTitle: 'Xiao Long Bao', cookDate: new Date(2026, 1, 18), rotation: 11 },
    ],
  },
  {
    country: 'india',
    note: 'square visa · navy ink · 1 cook',
    cancellations: [
      { recipeTitle: 'Aloo Gobi', cookDate: new Date(2026, 4, 11), rotation: 5 },
    ],
  },
  {
    country: 'japan',
    note: 'square visa · wine ink · 5 cooks (max rotation slots)',
    cancellations: [
      { recipeTitle: 'Tonkotsu Ramen', cookDate: new Date(2026, 4, 12), rotation: -8 },
      { recipeTitle: 'Onigiri', cookDate: new Date(2026, 3, 30), rotation: 4 },
      { recipeTitle: 'Katsu Curry', cookDate: new Date(2026, 2, 16), rotation: -2 },
      { recipeTitle: 'Tamagoyaki', cookDate: new Date(2026, 1, 8), rotation: 10 },
      { recipeTitle: 'Miso Glazed Cod', cookDate: new Date(2025, 11, 27), rotation: -11 },
    ],
  },
  {
    country: 'hong kong',
    note: 'landscape visa · wine ink · 2 cooks',
    cancellations: [
      { recipeTitle: 'Wonton Noodles', cookDate: new Date(2026, 4, 6), rotation: 7 },
      { recipeTitle: 'Char Siu', cookDate: new Date(2026, 3, 14), rotation: -9 },
    ],
  },
  {
    country: 'morocco',
    note: 'square visa · navy ink · 1 long-title cook (truncation check)',
    cancellations: [
      {
        recipeTitle: 'Slow-Cooked Lamb Tagine with Apricots and Preserved Lemon',
        cookDate: new Date(2026, 4, 1),
        rotation: -4,
      },
    ],
  },
];

const visaSamples = [
  { country: 'Italy', file: 'italy.webp', ink: '--stamp-ink-terracotta', glyph: '✱', note: 'light visa' },
  { country: 'France', file: 'france.webp', ink: '--stamp-ink-terracotta', glyph: '❦', note: 'light visa' },
  { country: 'India', file: 'india.webp', ink: '--stamp-ink-navy', glyph: '✜', note: 'saturated / mid-tone' },
  { country: 'China', file: 'china.webp', ink: '--stamp-ink-wine', glyph: '✱', note: 'dark visa — was the failure case' },
];

export default function CancellationScratchPage() {
  return (
    <main className="min-h-screen bg-parchment text-brown-dark p-10 font-body">
      {/* Mount the SVG filter defs used by the production composite. */}
      <PaperTexture />

      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="font-heading text-3xl mb-2">CancellationMark — scratch</h1>
        <p className="opacity-80 text-sm max-w-2xl">
          Visual verification of <code>components/passport/CancellationMark.tsx</code>{' '}
          after the §3 size bump (28% → 40% → 46%), the inner-ring
          narrowing (70% → 55% of outer diameter), the bolder Courier
          Prime cancellation font, and the §7 compositing rewrite
          (cancellation no longer inside <code>mix-blend-multiply</code>,
          renders at ~88% opacity on top of the visa). All props hand-faked.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">Standalone — large preview on parchment</h2>
        <p className="text-sm opacity-70 mb-6">
          Rendered larger than the booklet size so the postmark&apos;s
          ring imperfection, off-register ghost, and text legibility can be
          judged without squinting.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {cells.map((c) => (
            <figure key={c.label} className="flex flex-col items-center gap-3">
              <div className="w-44 h-44 grid place-items-center bg-parchment-dark/30 rounded-sm">
                <CancellationMark
                  recipeTitle={c.title}
                  cookDate={c.date ?? SAMPLE_DATE}
                  inkVar={c.ink}
                  centerGlyph={c.glyph}
                  rotation={c.rotation}
                  className="w-40 h-40"
                />
              </div>
              <figcaption className="text-xs text-center opacity-70">{c.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">Naked vs. paper-bleed filter</h2>
        <p className="text-sm opacity-70 mb-6">
          Left column: the bare SVG. Right column: the same mark with{' '}
          <code>[filter:url(#stamp-ink)]</code> applied — the
          paper-bleed/grain filter from <code>PaperTexture.tsx</code>{' '}
          that wraps the whole stamp composite in production. This is the
          closer-to-real preview of what the cancellation will look like
          when it ships inside <code>CountryStampSlot</code>.
        </p>
        <div className="grid grid-cols-2 gap-10">
          <figure className="flex flex-col items-center gap-3">
            <div className="w-44 h-44 grid place-items-center bg-parchment-dark/30 rounded-sm">
              <CancellationMark
                recipeTitle="Carbonara Romana"
                cookDate={SAMPLE_DATE}
                inkVar="--stamp-ink-terracotta"
                centerGlyph="✱"
                rotation={-3}
                className="w-40 h-40"
              />
            </div>
            <figcaption className="text-xs opacity-70">Naked SVG</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-3">
            <div className="w-44 h-44 grid place-items-center bg-parchment-dark/30 rounded-sm">
              <CancellationMark
                recipeTitle="Carbonara Romana"
                cookDate={SAMPLE_DATE}
                inkVar="--stamp-ink-terracotta"
                centerGlyph="✱"
                rotation={-3}
                className="w-40 h-40 [filter:url(#stamp-ink)]"
              />
            </div>
            <figcaption className="text-xs opacity-70">
              With <code>[filter:url(#stamp-ink)]</code> — production look
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Stacked on real visas — §3 + §7 composite preview
        </h2>
        <p className="text-sm opacity-70 mb-6">
          Cancellation at 40% of the visa&apos;s longest edge, opacity ~88%,
          no <code>mix-blend-multiply</code> on the cancellation layer
          (the visa itself still multiplies onto parchment, per §7). The
          whole composite wears the paper-bleed filter. Includes
          <code> china.webp</code> — previously the worst-case dark visa
          where the cancellation disappeared under multiply.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {visaSamples.map((v) => (
            <figure key={v.country} className="flex flex-col items-center gap-3">
              {/* Composite: parchment background, visa multiplied onto it,
                  cancellations sit on top with normal blending. */}
              <div className="relative w-80 h-80 grid place-items-center bg-parchment rounded-sm [filter:url(#stamp-ink)]">
                <div className="relative w-full h-full grid place-items-center mix-blend-multiply">
                  <Image
                    src={`/stamps/${v.file}`}
                    alt={v.country}
                    width={400}
                    height={400}
                    className="w-[88%] h-[88%] object-contain"
                    unoptimized
                  />
                </div>
                <CancellationMark
                  recipeTitle="Saffron Risotto"
                  cookDate={SAMPLE_DATE}
                  inkVar={v.ink}
                  centerGlyph={v.glyph}
                  rotation={-7}
                  className="absolute w-[46%] h-[46%] top-[6%] right-[6%] opacity-[0.88]"
                />
                <CancellationMark
                  recipeTitle="Osso Buco"
                  cookDate={new Date(2026, 3, 22)}
                  inkVar={v.ink}
                  centerGlyph={v.glyph}
                  rotation={9}
                  className="absolute w-[46%] h-[46%] bottom-[8%] left-[8%] opacity-[0.88]"
                />
              </div>
              <figcaption className="text-xs opacity-70 text-center">
                {v.country} · {v.ink}
                <br />
                <span className="opacity-60">{v.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">Old multiply approach (for contrast)</h2>
        <p className="text-sm opacity-70 mb-6">
          Same china.webp, but with the cancellation forced back inside{' '}
          <code>mix-blend-multiply</code> as the old SPEC mandated. This
          is what we&apos;re moving away from — the cancellation drowns
          in the dark visa.
        </p>
        <div className="grid grid-cols-2 gap-10">
          <figure className="flex flex-col items-center gap-3">
            <div className="relative w-72 h-72 grid place-items-center bg-parchment rounded-sm [filter:url(#stamp-ink)] mix-blend-multiply">
              <Image
                src="/stamps/china.webp"
                alt="China"
                width={400}
                height={400}
                className="w-[88%] h-[88%] object-contain"
                unoptimized
              />
              <CancellationMark
                recipeTitle="Mapo Tofu"
                cookDate={SAMPLE_DATE}
                inkVar="--stamp-ink-wine"
                centerGlyph="✜"
                rotation={-7}
                className="absolute w-[46%] h-[46%] top-[8%] right-[8%]"
              />
            </div>
            <figcaption className="text-xs opacity-70">
              OLD: cancellation inside mix-blend-multiply
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-3">
            <div className="relative w-72 h-72 grid place-items-center bg-parchment rounded-sm [filter:url(#stamp-ink)]">
              <div className="relative w-full h-full grid place-items-center mix-blend-multiply">
                <Image
                  src="/stamps/china.webp"
                  alt="China"
                  width={400}
                  height={400}
                  className="w-[88%] h-[88%] object-contain"
                  unoptimized
                />
              </div>
              <CancellationMark
                recipeTitle="Mapo Tofu"
                cookDate={SAMPLE_DATE}
                inkVar="--stamp-ink-wine"
                centerGlyph="✜"
                rotation={-7}
                className="absolute w-[46%] h-[46%] top-[8%] right-[8%] opacity-[0.88]"
              />
            </div>
            <figcaption className="text-xs opacity-70">
              NEW: cancellation on top at ~88% opacity
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-heading text-xl mb-4">
          Step 3 composite — inside <code>CountryStampSlot</code>
        </h2>
        <p className="text-sm opacity-70 mb-6">
          The real slot component receiving a hand-faked{' '}
          <code>cancellations</code> prop. Glyph + ink colour come from{' '}
          <code>getCenterGlyph</code> / <code>getCancellationInkVar</code>{' '}
          (region rules in SPEC §6). Cancellation size is{' '}
          {Math.round(0.46 * 100)}% of the visa&apos;s longest edge;
          positions cycle through five fixed rotation slots (SPEC §4).
          Step 4 will replace the hand-faked prop with real{' '}
          <code>passport_stamps</code> rows.
        </p>
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-12 justify-items-center"
          style={{ ['--stamp-size' as string]: '180px' }}
        >
          {slotSamples.map((sample) => (
            <figure
              key={sample.country}
              className="flex flex-col items-center gap-3"
            >
              <CountryStampSlot
                country={sample.country}
                stamps={[]}
                onClick={() => {}}
                cancellations={sample.cancellations}
              />
              <figcaption className="text-xs opacity-70 text-center">
                {sample.country} · {sample.cancellations.length} cook
                {sample.cancellations.length === 1 ? '' : 's'}
                <br />
                <span className="opacity-60">{sample.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <h2 className="font-heading text-xl mb-4">Rotation jitter sweep (±12°)</h2>
        <div className="grid grid-cols-5 md:grid-cols-9 gap-4">
          {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((deg) => (
            <figure key={deg} className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 grid place-items-center bg-parchment-dark/20">
                <CancellationMark
                  recipeTitle="Tagliatelle"
                  cookDate={SAMPLE_DATE}
                  inkVar="--stamp-ink-terracotta"
                  centerGlyph="✱"
                  rotation={deg}
                  className="w-20 h-20"
                />
              </div>
              <figcaption className="text-[10px] opacity-70">{deg}°</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
