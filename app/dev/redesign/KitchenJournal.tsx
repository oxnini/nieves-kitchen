'use client';

import Image from 'next/image';
import { Karla, Newsreader } from 'next/font/google';
import { SAMPLE_COLLECTIONS, SAMPLE_RECIPES } from './data';

/**
 * Direction F — "The Kitchen Journal".
 *
 * The collage-led editorial take: a magazine issue assembled by hand.
 * A strict column grid used asymmetrically (offsets, overlaps, uneven
 * wells), oversized Newsreader display type, and the pantry's hand-drawn
 * ink food spilling across column edges and photos. The tile concept
 * survives as exactly one element: the book's spine, a single zellige
 * strip down the left edge. Everything else is paper, ink and tape.
 * Built from the Hoppers spine, the tangerine postcard, the La Dolce
 * Vita illustration sheet and the cabagges.world layout.
 *
 * All styling is scoped here; nothing touches global tokens.
 */

const news = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'] });
const karla = Karla({ subsets: ['latin'] });

const C = {
  paper: '#F8F2E2',
  ink: '#22343C',
  ember: '#B85327',
  saffron: '#E3A63A',
  teal: '#2A616C',
  porcelain: '#A9C4CB',
  shadow: 'rgba(34,52,60,0.22)',
};

/** The one surviving tile element: a vertical zellige spine strip. */
function Spine() {
  return (
    <svg className="h-full w-full" aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id="nk-f-spine" width="44" height="88" patternUnits="userSpaceOnUse">
          <rect width="44" height="88" fill={C.teal} />
          <g transform="translate(22,22)">
            <rect x="-11" y="-11" width="22" height="22" fill={C.paper} opacity="0.92" />
            <rect x="-11" y="-11" width="22" height="22" fill={C.paper} opacity="0.92" transform="rotate(45)" />
            <circle r="4" fill={C.ember} />
          </g>
          <circle cx="22" cy="66" r="5" fill={C.saffron} />
          <rect x="0" y="0" width="2" height="88" fill={C.ink} opacity="0.35" />
          <rect x="42" y="0" width="2" height="88" fill={C.ink} opacity="0.35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#nk-f-spine)" />
    </svg>
  );
}

/** A strip of translucent tape, for the collage. */
function Tape({ className = '', color = C.saffron }: { className?: string; color?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-6 w-24 ${className}`}
      style={{ backgroundColor: color, opacity: 0.62, boxShadow: `0 1px 3px ${C.shadow}` }}
    />
  );
}

function Stamp({ children, className = '', color = C.ember }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <span
      className={`font-stamp text-[10px] uppercase tracking-[0.24em] ${className}`}
      style={{ color }}
    >
      {children}
    </span>
  );
}

export default function KitchenJournal() {
  return (
    <div className={karla.className} style={{ backgroundColor: C.paper, color: C.ink }}>
      <div className="flex">
        {/* ── The spine ────────────────────────────────── */}
        <div className="sticky top-0 hidden h-screen w-11 shrink-0 md:block">
          <Spine />
        </div>

        <div className="min-w-0 flex-1">
          {/* mobile spine, horizontal */}
          <div className="h-8 md:hidden">
            <Spine />
          </div>

          {/* ── Masthead ─────────────────────────────────── */}
          <header className="relative mx-auto max-w-6xl px-6 pt-10 pb-6 md:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <Stamp>Vol. II · Summer 2026</Stamp>
              <Stamp color={C.teal}>Halal, always</Stamp>
            </div>
            <div className="relative mt-3">
              <h1
                className={`text-[15vw] leading-[0.92] tracking-[-0.01em] md:text-[6.6rem] ${news.className}`}
                style={{ color: C.ink }}
              >
                Nieves <em style={{ color: C.ember }}>Kitchen</em>
              </h1>
              {/* garlic ink drawing collaged over the wordmark */}
              <div className="pointer-events-none absolute -top-1 right-2 h-24 w-24 rotate-[8deg] md:-top-2 md:right-16 md:h-32 md:w-32">
                <Image src="/pantry/garlic.webp" alt="Garlic, ink drawing" fill sizes="128px" className="object-contain" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 pt-3" style={{ borderColor: C.ink }}>
              <p className={`text-[15px] italic ${news.className}`}>A journal of recipes from every shore, tested at one small table.</p>
              <nav className="flex gap-6">
                {['Atlas', 'Recipes', 'Pantry'].map((l) => (
                  <span key={l} className="cursor-pointer font-stamp text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60" style={{ color: C.teal }}>
                    {l}
                  </span>
                ))}
              </nav>
            </div>
          </header>

          {/* ── Hero spread: asymmetric wells ────────────── */}
          <section className="mx-auto max-w-6xl px-6 pt-4 pb-16 md:px-12">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="relative md:col-span-7">
                {/* sun disc slipping out from behind the photo */}
                <div
                  aria-hidden
                  className="absolute -top-8 -left-8 h-40 w-40 rounded-full md:-top-12 md:-left-12 md:h-56 md:w-56"
                  style={{ backgroundColor: C.saffron }}
                />
                <div className="relative rotate-[-1deg] p-3 pb-10" style={{ backgroundColor: '#FDFAF1', boxShadow: `0 18px 40px ${C.shadow}` }}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/recipes/classic-lasagna-hero.webp"
                      alt="Classic lasagna al forno, out of the oven"
                      fill
                      sizes="(max-width: 768px) 94vw, 620px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex items-baseline justify-between px-1 pt-3 pr-20 md:pr-24">
                    <Stamp>Italy · Southern Europe</Stamp>
                    <span className={`text-base italic ${news.className}`}>Lasagna al forno, Sunday cooking</span>
                  </div>
                  <Tape className="-top-2.5 left-10 rotate-[-4deg]" />
                  <Tape className="-right-6 bottom-16 rotate-[86deg]" color={C.porcelain} />
                </div>
                {/* olive oil ink drawing breaking the photo's edge */}
                <div className="pointer-events-none absolute -right-5 -bottom-14 h-28 w-28 rotate-[-5deg] md:-right-14 md:-bottom-16 md:h-36 md:w-36">
                  <Image src="/pantry/olive-oil.webp" alt="Olive oil, ink drawing" fill sizes="144px" className="object-contain" />
                </div>
              </div>
              {/* text well, deliberately dropped lower than the photo */}
              <div className="space-y-6 md:col-span-5 md:pt-20">
                <h2 className={`text-4xl leading-[1.06] md:text-[3rem] ${news.className}`}>
                  Cook your way <em style={{ color: C.ember }}>around the world</em> without leaving the table.
                </h2>
                <p
                  className="max-w-md text-[15.5px] leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-[3.1rem] first-letter:leading-[0.85]"
                  style={{ color: C.ink }}
                >
                  Every dish in this journal was carried home from somewhere: a harbour breakfast,
                  a market stall, a friend&apos;s mother&apos;s kitchen. We write them down, cook them until
                  they behave, and stamp the country into your passport when you do the same.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <span
                    className="cursor-pointer px-6 py-3 font-stamp text-[11px] uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: C.ink, color: C.paper, boxShadow: `4px 4px 0 ${C.saffron}` }}
                  >
                    Start cooking
                  </span>
                  <span className="cursor-pointer font-stamp text-[11px] uppercase tracking-[0.18em] underline underline-offset-4" style={{ color: C.ember }}>
                    Browse the atlas
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── In this issue: contents ledger ───────────── */}
          <section className="mx-auto max-w-6xl px-6 pb-16 md:px-12">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <Stamp>In this issue</Stamp>
                <h2 className={`mt-2 text-3xl italic ${news.className}`}>Four ways in</h2>
                <p className="mt-3 max-w-xs text-[14px] leading-relaxed" style={{ color: `${C.ink}B3` }}>
                  Collections are lenses, not folders. Pick the one that matches tonight&apos;s mood and
                  the kitchen does the rest.
                </p>
                {/* honey ink in the margin */}
                <div className="relative mt-6 h-28 w-28 rotate-[4deg]">
                  <Image src="/pantry/honey.webp" alt="Honey, ink drawing" fill sizes="112px" className="object-contain" />
                </div>
              </div>
              <div className="md:col-span-8 md:pt-10">
                {SAMPLE_COLLECTIONS.map((col, i) => (
                  <div
                    key={col.slug}
                    className="group flex cursor-pointer items-baseline gap-3 border-b py-4 transition-colors"
                    style={{ borderColor: `${C.ink}33` }}
                  >
                    <span className={`shrink-0 text-2xl leading-none md:text-[1.9rem] ${news.className} group-hover:italic`} style={{ color: i === 3 ? C.ember : C.ink }}>
                      {col.title}
                    </span>
                    <span aria-hidden className="min-w-8 flex-1 border-b border-dotted" style={{ borderColor: `${C.ink}66` }} />
                    <Stamp color={C.teal}>{col.count} recipes</Stamp>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Clippings: this week's recipes ────────────── */}
          <section className="relative overflow-hidden py-16" style={{ backgroundColor: '#EFE5CC' }}>
            <div
              aria-hidden
              className="absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full"
              style={{ backgroundColor: C.ember, opacity: 0.9 }}
            />
            <div className="relative mx-auto max-w-6xl px-6 md:px-12">
              <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <Stamp>Clipped this week</Stamp>
                  <h2 className={`mt-1 text-4xl ${news.className}`}>New on the table</h2>
                </div>
                <span className="cursor-pointer font-stamp text-[11px] uppercase tracking-[0.2em] underline underline-offset-4" style={{ color: C.ember }}>
                  All recipes →
                </span>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {SAMPLE_RECIPES.map((r, i) => (
                  <div
                    key={r.slug}
                    className="group relative cursor-pointer p-3 pb-5 transition-transform hover:-translate-y-1.5 md:even:mt-10"
                    style={{
                      backgroundColor: '#FDFAF1',
                      rotate: `${[-1.6, 1.2, -0.8][i]}deg`,
                      boxShadow: `0 16px 36px ${C.shadow}`,
                    }}
                  >
                    <Tape className={`-top-3 ${['left-8 rotate-[-5deg]', 'right-8 rotate-[4deg]', 'left-1/2 -ml-12 rotate-[2deg]'][i]}`} color={[C.saffron, C.porcelain, C.saffron][i]} />
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={r.slug === 'classic-lasagna' ? '/recipes/classic-lasagna-baked.webp' : r.img}
                        alt={r.title}
                        fill
                        sizes="(max-width: 768px) 90vw, 360px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="space-y-1.5 px-1 pt-4">
                      <Stamp>From: {r.country}</Stamp>
                      <h3 className={`text-[1.45rem] leading-tight ${news.className}`}>{r.title}</h3>
                      <p className="pt-1 font-stamp text-[10px] uppercase tracking-[0.18em]" style={{ color: C.teal }}>
                        {r.timeTotal} · serves {r.serves}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Atlas postscript ─────────────────────────── */}
          <section style={{ backgroundColor: C.ink }}>
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-12 md:px-12">
              <div className="space-y-4 md:col-span-7">
                <Stamp color={C.saffron}>The atlas</Stamp>
                <h2 className={`max-w-lg text-3xl leading-[1.12] md:text-4xl ${news.className}`} style={{ color: C.paper }}>
                  Ten regions, one table. <em style={{ color: C.porcelain }}>Where does dinner go next?</em>
                </h2>
                <p className="max-w-md text-[14px] leading-relaxed" style={{ color: `${C.paper}B3` }}>
                  The world map keeps score quietly. Countries you have cooked glow warm; the rest
                  wait their turn.
                </p>
                <span className="inline-block cursor-pointer pt-1 font-stamp text-[11px] uppercase tracking-[0.2em] underline underline-offset-8" style={{ color: C.saffron }}>
                  Open the map →
                </span>
              </div>
              {/* a dotted route between three meals */}
              <div className="relative md:col-span-5">
                <svg viewBox="0 0 320 190" className="w-full" aria-hidden>
                  <path
                    d="M 30,150 C 90,60 150,170 200,90 S 290,40 295,45"
                    fill="none"
                    stroke={C.saffron}
                    strokeWidth="2"
                    strokeDasharray="1 8"
                    strokeLinecap="round"
                  />
                  {[
                    [30, 150, 'Istanbul'],
                    [200, 90, 'Bologna'],
                    [295, 45, 'Kashgar'],
                  ].map(([x, y, label]) => (
                    <g key={label as string}>
                      <circle cx={x as number} cy={y as number} r="5" fill={C.ember} stroke={C.paper} strokeWidth="1.5" />
                      <text
                        x={(x as number) - 6}
                        y={(y as number) + 22}
                        fontSize="11"
                        fill={C.porcelain}
                        className={news.className}
                        fontStyle="italic"
                      >
                        {label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </section>

          {/* ── Footer ───────────────────────────────────── */}
          <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-12">
            <span className={`text-xl italic ${news.className}`}>Nieves Kitchen</span>
            <Stamp color={C.teal}>Printed nowhere · cooked everywhere</Stamp>
          </footer>
        </div>
      </div>
    </div>
  );
}
