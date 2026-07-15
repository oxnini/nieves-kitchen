'use client';

import Image from 'next/image';
import { INK_ART, SAMPLE_COLLECTIONS, SAMPLE_RECIPES } from './data';

/**
 * Direction C — "The Gilded Table".
 *
 * Direction A's language (zellige ornament, two-tone ink, peacock +
 * terracotta + cream, Literata) with the folder's louder heritage energy
 * folded in: the golden zellige kitchen's saffron, the Hoppers cover's sun
 * disc and patterned frame, the Cairo poster's modular grid and
 * checkerboards, and postal ephemera (postmarks) pulled from the passport
 * out onto the page. Colour-block section paging borrowed from B, recast
 * in heritage colours.
 *
 * All styling is scoped here; nothing touches global tokens.
 */

const C = {
  peacock: '#053845',
  teal: '#317786',
  terracotta: '#B94F30',
  coral: '#EFA27E',
  cream: '#F3E9D1',
  creamDeep: '#EADDC0',
  saffron: '#E3A92B',
  brass: '#A9812E',
  ink: '#2A2118',
};

/** Zellige strip, gilded colourway: teal stars, terracotta crosses, saffron studs. */
function TileBand({ height = 26 }: { height?: number }) {
  return (
    <svg width="100%" height={height} aria-hidden className="block" preserveAspectRatio="none">
      <defs>
        <pattern id="nk-zellige-c" width="56" height="26" patternUnits="userSpaceOnUse">
          <rect width="56" height="26" fill={C.cream} />
          <g transform="translate(14,13)">
            <rect x="-7" y="-7" width="14" height="14" fill={C.teal} />
            <rect x="-7" y="-7" width="14" height="14" fill={C.teal} transform="rotate(45)" />
            <rect x="-2.4" y="-2.4" width="4.8" height="4.8" fill={C.saffron} transform="rotate(45)" />
          </g>
          <g transform="translate(42,13)" fill={C.terracotta}>
            <rect x="-2.2" y="-8.5" width="4.4" height="17" />
            <rect x="-8.5" y="-2.2" width="17" height="4.4" />
            <rect x="-2" y="-2" width="4" height="4" fill={C.saffron} />
          </g>
          <rect width="56" height="1.4" y="0" fill={C.peacock} opacity="0.5" />
          <rect width="56" height="1.4" y="24.6" fill={C.peacock} opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#nk-zellige-c)" />
    </svg>
  );
}

/** Thin checkerboard divider in heritage colours (Cairo poster move). */
function Checker({ height = 16, color = C.peacock, paper = C.cream }: { height?: number; color?: string; paper?: string }) {
  return (
    <div
      aria-hidden
      style={{
        height,
        background: `repeating-conic-gradient(${color} 0% 25%, ${paper} 0% 50%) 0 0 / ${height * 2}px ${height * 2}px`,
      }}
    />
  );
}

/** Eight-point star medallion. */
function Star({ size = 26, color = C.brass, paper = C.cream }: { size?: number; color?: string; paper?: string }) {
  const h = size / 2;
  const s = size * 0.31;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <g transform={`translate(${h},${h})`}>
        <rect x={-s} y={-s} width={s * 2} height={s * 2} fill={color} />
        <rect x={-s} y={-s} width={s * 2} height={s * 2} fill={color} transform="rotate(45)" />
        <circle r={size * 0.13} fill={paper} />
      </g>
    </svg>
  );
}

/** Corner medallion for tile frames. */
function CornerStar({ pos }: { pos: string }) {
  return (
    <span className={`absolute ${pos}`}>
      <Star size={18} color={C.brass} />
    </span>
  );
}

/** Rubber postmark, the passport's language loose on the page. */
function Postmark({
  id,
  size = 112,
  className = '',
  color = C.peacock,
  date = '12 JUL',
}: {
  id: string;
  size?: number;
  className?: string;
  color?: string;
  date?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden className={className}>
      <circle cx="60" cy="60" r="55" fill={C.cream} opacity="0.92" />
      <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="60" cy="60" r="38" fill="none" stroke={color} strokeWidth="1.5" />
      <path id={`pm-${id}`} d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" fill="none" />
      <text fontSize="10.5" letterSpacing="3" fill={color} style={{ fontFamily: 'var(--font-stamp)' }}>
        <textPath href={`#pm-${id}`}>NIEVES KITCHEN · TABLE POST · NIEVES KITCHEN ·</textPath>
      </text>
      <text
        x="60"
        y="57"
        textAnchor="middle"
        fontSize="12"
        fill={C.terracotta}
        style={{ fontFamily: 'var(--font-stamp)' }}
      >
        {date}
      </text>
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontSize="12"
        fill={C.terracotta}
        style={{ fontFamily: 'var(--font-stamp)' }}
      >
        2026
      </text>
    </svg>
  );
}

function Eyebrow({ children, color = C.brass }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-stamp text-[11px] uppercase tracking-[0.28em]" style={{ color }}>
      {children}
    </p>
  );
}

export default function GildedTable() {
  return (
    <div style={{ backgroundColor: C.cream, color: C.ink }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="flex items-center gap-2.5">
            <Star size={22} color={C.terracotta} />
            <span className="font-heading text-2xl font-semibold" style={{ color: C.peacock }}>
              Nieves Kitchen
            </span>
          </span>
          <nav className="hidden gap-8 sm:flex">
            {['Table', 'Atlas', 'Recipes', 'Pantry'].map((l) => (
              <span
                key={l}
                className="cursor-pointer text-[13px] font-medium uppercase tracking-[0.18em] transition-colors hover:opacity-70"
                style={{ color: l === 'Table' ? C.terracotta : C.peacock }}
              >
                {l}
              </span>
            ))}
          </nav>
        </div>
        <TileBand height={22} />
      </header>

      {/* ── Hero: an illuminated cookbook cover ────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="relative p-2" style={{ border: `2px solid ${C.peacock}` }}>
          <div className="relative overflow-hidden px-6 py-14 md:px-14 md:py-18" style={{ border: `1px solid ${C.brass}` }}>
            {/* saffron sun disc, Hoppers-style */}
            <div
              aria-hidden
              className="absolute top-1/2 right-[-8%] h-[520px] w-[520px] -translate-y-1/2 rounded-full md:right-[4%]"
              style={{ backgroundColor: C.saffron, opacity: 0.95 }}
            />
            <div className="relative grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
              <div className="space-y-6">
                <Eyebrow color={C.terracotta}>A cookbook of places · est. at home</Eyebrow>
                <h1
                  className="font-heading text-4xl leading-[1.05] font-semibold md:text-[3.8rem]"
                  style={{ color: C.peacock }}
                >
                  Set the table with{' '}
                  <em className="italic" style={{ color: C.terracotta }}>
                    somewhere new
                  </em>
                  .
                </h1>
                <p className="max-w-md text-[15px] leading-relaxed" style={{ color: C.ink }}>
                  Recipes that remember where they come from, cooked in one kitchen. Follow the
                  tiles from Istanbul to Kashgar, and bring a stamp home for every dish you make.
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <span
                    className="cursor-pointer px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: C.peacock, color: C.cream, boxShadow: `4px 4px 0 ${C.saffron}` }}
                  >
                    Open the atlas
                  </span>
                  <span
                    className="cursor-pointer font-stamp text-[12px] uppercase tracking-[0.2em] underline underline-offset-4"
                    style={{ color: C.terracotta }}
                  >
                    This week&apos;s table
                  </span>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-sm">
                {/* arch photo in a cream tile mat */}
                <div className="relative p-2.5 shadow-[0_18px_40px_rgba(5,56,69,0.25)]" style={{ backgroundColor: C.cream }}>
                  <div className="pointer-events-none absolute inset-1" style={{ border: `1px solid ${C.peacock}` }} />
                  <CornerStar pos="-top-1.5 -left-1.5" />
                  <CornerStar pos="-top-1.5 -right-1.5" />
                  <CornerStar pos="-bottom-1.5 -left-1.5" />
                  <CornerStar pos="-bottom-1.5 -right-1.5" />
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
                    <Image
                      src="/recipes/turkish-eggs-hero.webp"
                      alt="Çılbır, Turkish eggs on garlicky yoghurt"
                      fill
                      sizes="(max-width: 768px) 90vw, 384px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex items-baseline justify-between pt-2.5 pb-0.5">
                    <span className="font-stamp text-[11px] uppercase tracking-[0.22em]" style={{ color: C.terracotta }}>
                      Türkiye · Middle East
                    </span>
                    <span className="font-heading text-sm italic" style={{ color: C.peacock }}>
                      Çılbır
                    </span>
                  </div>
                </div>
                <Postmark id="hero" className="absolute -top-7 -left-7 rotate-[-14deg]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Checker />

      {/* ── Collections: Cairo-poster modular grid on terracotta ── */}
      <section style={{ backgroundColor: C.terracotta }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-8 flex items-baseline justify-between">
            <div className="space-y-2">
              <Eyebrow color={C.coral}>Four shelves</Eyebrow>
              <h2 className="font-heading text-3xl font-semibold" style={{ color: C.cream }}>
                Collections
              </h2>
            </div>
            <span className="font-stamp text-[11px] uppercase tracking-[0.2em]" style={{ color: C.cream }}>
              View all →
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_COLLECTIONS.map((col, i) => {
              const papers = [C.cream, C.peacock, C.saffron, C.creamDeep];
              const inks = [C.peacock, C.cream, C.peacock, C.terracotta];
              const stars = [C.terracotta, C.saffron, C.peacock, C.teal];
              return (
                <div
                  key={col.slug}
                  className="group cursor-pointer p-5 transition-transform hover:rotate-[-1deg] hover:-translate-y-1"
                  style={{ backgroundColor: papers[i], color: inks[i], border: `1px solid ${C.peacock}` }}
                >
                  <div className="flex items-start justify-between">
                    <Star size={26} color={stars[i]} paper={papers[i]} />
                    <span className="font-stamp text-[10px] uppercase tracking-[0.2em] opacity-70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-7 font-heading text-lg leading-snug font-semibold">{col.title}</h3>
                  <p className="mt-3 font-stamp text-[11px] uppercase tracking-[0.2em] opacity-80">
                    {col.count} recipes
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Checker color={C.terracotta} />

      {/* ── Ink editorial: big art, drop cap, margin note ──── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.3fr]">
          <div className="relative mx-auto">
            <div className="relative h-56 w-56 md:h-72 md:w-72">
              <Image src={INK_ART[0].src} alt="Honey, ink drawing" fill sizes="288px" className="object-contain" />
            </div>
            <Postmark id="pantry" size={90} className="absolute -right-4 bottom-0 rotate-[10deg]" color={C.terracotta} date="THE" />
          </div>
          <div className="max-w-xl space-y-5">
            <Eyebrow color={C.terracotta}>The pantry</Eyebrow>
            <h2 className="font-heading text-3xl leading-tight font-semibold" style={{ color: C.peacock }}>
              Drawn in ink, kept in jars.
            </h2>
            <p
              className="text-[15px] leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-heading first-letter:text-[3.2rem] first-letter:leading-[0.85] first-letter:font-semibold"
              style={{ color: C.ink }}
            >
              Every ingredient on the shelf gets the same treatment as the stamps in your passport:
              two tones of ink on cream, drawn by hand, earned by use. Honey, garlic, olive oil.
              The pantry is where the kitchen keeps its memory, and the drawings are how it signs
              its name.
            </p>
            <div className="flex items-center gap-8 pt-1">
              {INK_ART.slice(1).map((art) => (
                <figure key={art.label} className="text-center">
                  <div className="relative mx-auto h-16 w-16">
                    <Image src={art.src} alt={`${art.label}, ink drawing`} fill sizes="64px" className="object-contain" />
                  </div>
                  <figcaption className="mt-1.5 font-stamp text-[10px] uppercase tracking-[0.22em]" style={{ color: C.brass }}>
                    {art.label}
                  </figcaption>
                </figure>
              ))}
              <span className="font-stamp text-[11px] uppercase tracking-[0.2em] underline underline-offset-4" style={{ color: C.terracotta }}>
                Open the pantry
              </span>
            </div>
          </div>
        </div>
      </section>

      <TileBand />

      {/* ── Recipe cards: tile postcards on a peacock page ──── */}
      <section style={{ backgroundColor: C.peacock }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-9 flex items-baseline justify-between">
            <div className="space-y-2">
              <Eyebrow color={C.saffron}>Latest from the kitchen</Eyebrow>
              <h2 className="font-heading text-3xl font-semibold" style={{ color: C.cream }}>
                New on the table
              </h2>
            </div>
            <span className="font-stamp text-[11px] uppercase tracking-[0.2em]" style={{ color: C.coral }}>
              All recipes →
            </span>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {SAMPLE_RECIPES.map((r, i) => (
              <div
                key={r.slug}
                className="relative cursor-pointer shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1.5"
                style={{ backgroundColor: C.cream, rotate: `${[-1.1, 0.7, -0.5][i]}deg` }}
              >
                <TileBand height={16} />
                <div className="p-4">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={r.img}
                      alt={r.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <p className="font-stamp text-[10px] uppercase tracking-[0.22em]" style={{ color: C.terracotta }}>
                      From: {r.country} · {r.region}
                    </p>
                    <h3 className="font-heading text-xl leading-snug font-semibold" style={{ color: C.peacock }}>
                      {r.title}
                    </h3>
                  </div>
                  <div className="mt-3 border-t border-dashed pt-2.5" style={{ borderColor: `${C.peacock}55` }}>
                    <p className="font-stamp text-[11px] tracking-[0.14em]" style={{ color: C.brass }}>
                      {r.timeTotal} · serves {r.serves}
                    </p>
                  </div>
                </div>
                <Postmark id={`card-${i}`} size={78} className="absolute -top-4 -right-4 rotate-[12deg]" color={C.teal} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Checker />

      {/* ── Recipe page header snippet ─────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <Eyebrow color={C.terracotta}>Türkiye · Middle East</Eyebrow>
        <h2
          className="mx-auto mt-4 max-w-xl font-heading text-4xl leading-[1.1] font-semibold md:text-5xl"
          style={{ color: C.peacock }}
        >
          Çılbır, Turkish Eggs
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: C.ink }}>
          {SAMPLE_RECIPES[0].blurb}
        </p>
        <div className="mx-auto mt-8 flex max-w-md items-stretch justify-center gap-3">
          {[
            ['Active', SAMPLE_RECIPES[0].timeActive, C.saffron, C.peacock],
            ['Total', SAMPLE_RECIPES[0].timeTotal, C.peacock, C.cream],
            ['Serves', SAMPLE_RECIPES[0].serves, C.terracotta, C.cream],
          ].map(([k, v, bg, fg]) => (
            <div key={k as string} className="flex-1 px-4 py-3.5" style={{ backgroundColor: bg as string, color: fg as string }}>
              <p className="font-stamp text-[10px] uppercase tracking-[0.24em] opacity-80">{k}</p>
              <p className="font-heading text-lg font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <TileBand height={22} />
      <footer style={{ backgroundColor: C.peacock }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="flex items-center gap-2">
            <Star size={16} color={C.saffron} paper={C.peacock} />
            <span className="font-heading text-sm italic" style={{ color: C.cream }}>
              Nieves Kitchen
            </span>
          </span>
          <span className="font-stamp text-[10px] uppercase tracking-[0.24em]" style={{ color: C.saffron }}>
            Cooked with love, stamped with pride
          </span>
        </div>
      </footer>
    </div>
  );
}
