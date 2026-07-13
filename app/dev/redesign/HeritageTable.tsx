'use client';

import Image from 'next/image';
import { INK_ART, SAMPLE_COLLECTIONS, SAMPLE_RECIPES } from './data';

/**
 * Direction A — "The Heritage Table".
 *
 * Zellige/azulejo tile ornament as structure, two-tone ink illustration,
 * peacock + teal + terracotta + brass on cream. Literata stays as the
 * display face; Cutive Mono carries ledger/postal accents.
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
  brass: '#A9812E',
  ink: '#2A2118',
};

/** Repeating zellige strip: 8-point stars alternating with crosses. */
function TileBand({ height = 26 }: { height?: number }) {
  return (
    <svg width="100%" height={height} aria-hidden className="block" preserveAspectRatio="none">
      <defs>
        <pattern id="nk-zellige" width="56" height="26" patternUnits="userSpaceOnUse">
          <rect width="56" height="26" fill={C.cream} />
          <g transform="translate(14,13)">
            <rect x="-7" y="-7" width="14" height="14" fill={C.teal} />
            <rect x="-7" y="-7" width="14" height="14" fill={C.teal} transform="rotate(45)" />
            <rect x="-2.4" y="-2.4" width="4.8" height="4.8" fill={C.cream} transform="rotate(45)" />
          </g>
          <g transform="translate(42,13)" fill={C.terracotta}>
            <rect x="-2.2" y="-8.5" width="4.4" height="17" />
            <rect x="-8.5" y="-2.2" width="17" height="4.4" />
            <rect x="-2" y="-2" width="4" height="4" fill={C.brass} />
          </g>
          <rect width="56" height="1.4" y="0" fill={C.peacock} opacity="0.5" />
          <rect width="56" height="1.4" y="24.6" fill={C.peacock} opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#nk-zellige)" />
    </svg>
  );
}

/** Hoppers-style corner medallion for tile-framed cards. */
function CornerStar({ pos }: { pos: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className={`absolute ${pos}`}>
      <g transform="translate(9,9)">
        <rect x="-5.5" y="-5.5" width="11" height="11" fill={C.brass} />
        <rect x="-5.5" y="-5.5" width="11" height="11" fill={C.brass} transform="rotate(45)" />
        <circle r="2.4" fill={C.cream} />
      </g>
    </svg>
  );
}

/** Cream mat + hairline frame + brass corner medallions. */
function TileFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-2.5 ${className}`} style={{ backgroundColor: C.cream }}>
      <div className="pointer-events-none absolute inset-1" style={{ border: `1px solid ${C.peacock}` }} />
      <div className="pointer-events-none absolute inset-2" style={{ border: `1px solid ${C.teal}`, opacity: 0.5 }} />
      <CornerStar pos="-top-1.5 -left-1.5" />
      <CornerStar pos="-top-1.5 -right-1.5" />
      <CornerStar pos="-bottom-1.5 -left-1.5" />
      <CornerStar pos="-bottom-1.5 -right-1.5" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Eyebrow({ children, color = C.brass }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-stamp text-[11px] uppercase tracking-[0.28em]" style={{ color }}>
      {children}
    </p>
  );
}

export default function HeritageTable() {
  return (
    <div style={{ backgroundColor: C.cream, color: C.ink }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header>
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6 py-5">
          <span className="font-heading text-2xl font-semibold" style={{ color: C.peacock }}>
            Nieves Kitchen
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

      {/* ── Hero: azulejo-framed photo on a peacock field ──── */}
      <section style={{ backgroundColor: C.peacock }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div className="space-y-6">
            <Eyebrow>A cookbook of places</Eyebrow>
            <h1
              className="font-heading text-4xl leading-[1.08] font-semibold md:text-[3.4rem]"
              style={{ color: C.cream }}
            >
              Recipes that remember where they come from.
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed" style={{ color: C.coral }}>
              Every dish here is tied to the table it was first served at. Follow the tiles from
              Istanbul to Kashgar, and bring a stamp home when you cook.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <span
                className="cursor-pointer px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: C.terracotta, color: C.cream }}
              >
                Open the atlas
              </span>
              <span
                className="cursor-pointer font-stamp text-[12px] uppercase tracking-[0.2em] underline underline-offset-4"
                style={{ color: C.brass }}
              >
                This week&apos;s table
              </span>
            </div>
          </div>
          <TileFrame className="mx-auto w-full max-w-md shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/recipes/turkish-eggs-hero.webp"
                alt="Çılbır, Turkish eggs on garlicky yoghurt"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
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
          </TileFrame>
        </div>
      </section>

      <TileBand />

      {/* ── Collections as glazed tiles ────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-baseline justify-between">
          <div className="space-y-2">
            <Eyebrow>Four shelves</Eyebrow>
            <h2 className="font-heading text-3xl font-semibold" style={{ color: C.peacock }}>
              Collections
            </h2>
          </div>
          <span className="font-stamp text-[11px] uppercase tracking-[0.2em]" style={{ color: C.teal }}>
            View all
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_COLLECTIONS.map((col, i) => {
            const accents = [C.teal, C.terracotta, C.peacock, C.brass];
            const a = accents[i % accents.length];
            return (
              <div
                key={col.slug}
                className="group cursor-pointer p-5 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: C.creamDeep, borderTop: `4px solid ${a}` }}
              >
                <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden className="mb-4">
                  <g transform="translate(13,13)">
                    <rect x="-8" y="-8" width="16" height="16" fill={a} />
                    <rect x="-8" y="-8" width="16" height="16" fill={a} transform="rotate(45)" />
                    <circle r="3.4" fill={C.creamDeep} />
                  </g>
                </svg>
                <h3 className="font-heading text-lg leading-snug font-semibold" style={{ color: C.ink }}>
                  {col.title}
                </h3>
                <p className="mt-3 font-stamp text-[11px] uppercase tracking-[0.2em]" style={{ color: a }}>
                  {col.count} recipes
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Ink strip: the pantry speaks stamp language ────── */}
      <section style={{ borderTop: `1px solid ${C.peacock}22`, borderBottom: `1px solid ${C.peacock}22` }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-16 gap-y-8 px-6 py-12">
          <div className="max-w-[180px] space-y-2">
            <Eyebrow color={C.terracotta}>The pantry</Eyebrow>
            <p className="font-heading text-xl leading-snug font-semibold" style={{ color: C.peacock }}>
              Drawn in ink, like the stamps.
            </p>
          </div>
          {INK_ART.map((art) => (
            <figure key={art.label} className="text-center">
              <div className="relative mx-auto h-24 w-24">
                <Image src={art.src} alt={`${art.label}, ink drawing`} fill sizes="96px" className="object-contain" />
              </div>
              <figcaption
                className="mt-2 font-stamp text-[11px] uppercase tracking-[0.24em]"
                style={{ color: C.brass }}
              >
                {art.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Recipe cards as glazed tiles ───────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 space-y-2">
          <Eyebrow>Latest from the kitchen</Eyebrow>
          <h2 className="font-heading text-3xl font-semibold" style={{ color: C.peacock }}>
            New on the table
          </h2>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {SAMPLE_RECIPES.map((r) => (
            <TileFrame key={r.slug} className="cursor-pointer transition-transform hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
                <Image
                  src={r.img}
                  alt={r.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1.5 px-1 pt-3 pb-1">
                <p className="font-stamp text-[10px] uppercase tracking-[0.22em]" style={{ color: C.terracotta }}>
                  {r.country} · {r.region}
                </p>
                <h3 className="font-heading text-xl leading-snug font-semibold" style={{ color: C.peacock }}>
                  {r.title}
                </h3>
                <p className="font-stamp text-[11px] tracking-[0.12em]" style={{ color: C.brass }}>
                  {r.timeTotal} · serves {r.serves}
                </p>
              </div>
            </TileFrame>
          ))}
        </div>
      </section>

      <TileBand />

      {/* ── Recipe page header snippet ─────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <Eyebrow>Türkiye · Middle East</Eyebrow>
        <h2
          className="mx-auto mt-4 max-w-xl font-heading text-4xl leading-[1.1] font-semibold md:text-5xl"
          style={{ color: C.peacock }}
        >
          Çılbır, Turkish Eggs
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: C.ink }}>
          {SAMPLE_RECIPES[0].blurb}
        </p>
        <div
          className="mx-auto mt-8 flex max-w-md items-stretch justify-center divide-x"
          style={{ borderTop: `1px solid ${C.brass}`, borderBottom: `1px solid ${C.brass}` }}
        >
          {[
            ['Active', SAMPLE_RECIPES[0].timeActive],
            ['Total', SAMPLE_RECIPES[0].timeTotal],
            ['Serves', SAMPLE_RECIPES[0].serves],
          ].map(([k, v]) => (
            <div key={k} className="flex-1 px-4 py-3" style={{ borderColor: `${C.brass}66` }}>
              <p className="font-stamp text-[10px] uppercase tracking-[0.24em]" style={{ color: C.terracotta }}>
                {k}
              </p>
              <p className="font-heading text-lg font-semibold" style={{ color: C.peacock }}>
                {v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer strip ───────────────────────────────────── */}
      <footer style={{ backgroundColor: C.peacock }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-heading text-sm italic" style={{ color: C.cream }}>
            Nieves Kitchen
          </span>
          <span className="font-stamp text-[10px] uppercase tracking-[0.24em]" style={{ color: C.brass }}>
            Cooked with love, stamped with pride
          </span>
        </div>
      </footer>
    </div>
  );
}
