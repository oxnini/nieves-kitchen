'use client';

import Image from 'next/image';
import { Karla, Prata, Space_Mono } from 'next/font/google';
import { SAMPLE_COLLECTIONS, SAMPLE_RECIPES } from './data';

/**
 * Direction D (v2) — "The Tiled Terrace".
 *
 * Built literally from the inspo folder, none of NK's current language:
 * Portuguese azulejo tilework (the pastéis photo, the Lisbon invitation),
 * checked and striped tablecloths (the Uzbek spread, the painted
 * Mediterranean table), ceramic plates as UI, and the folder's own palette
 * cards recreated as a design object. Tile geometry stays; no religious
 * iconography, no Arabic type.
 *
 * Fonts are a full break from the current site: Prata display (the palette
 * cards' elegant high-contrast serif), Karla body, Space Mono for labels
 * and hex-code accents.
 *
 * All styling is scoped here; nothing touches global tokens.
 */

const prata = Prata({ weight: '400', subsets: ['latin'] });
const karla = Karla({ subsets: ['latin'] });
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'] });

const C = {
  sea: '#0F4E77',
  porcelain: '#9CC3D5',
  terracotta: '#B85C38',
  lemon: '#E9B44C',
  olive: '#7A7A52',
  ivory: '#FAF4E8',
  white: '#FDFBF3',
  ink: '#1E2A32',
};

/** Classic blue-on-white azulejo tile, drawn as a repeating pattern. */
function AzulejoPattern({ id, muted = false }: { id: string; muted?: boolean }) {
  const blue = muted ? C.porcelain : C.sea;
  return (
    <pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">
      <rect width="64" height="64" fill={C.white} />
      <rect width="64" height="64" fill="none" stroke={C.porcelain} strokeWidth="1" />
      {/* corner quarter-fans */}
      {[
        [0, 0],
        [64, 0],
        [0, 64],
        [64, 64],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill={blue} opacity={muted ? 0.55 : 0.9} />
      ))}
      {/* central rosette */}
      <circle cx="32" cy="32" r="13" fill="none" stroke={blue} strokeWidth="2" />
      <circle cx="32" cy="32" r="4.5" fill={C.terracotta} opacity={muted ? 0.5 : 0.85} />
      {/* four petals */}
      <ellipse cx="32" cy="11" rx="4.5" ry="7.5" fill={blue} opacity="0.75" />
      <ellipse cx="32" cy="53" rx="4.5" ry="7.5" fill={blue} opacity="0.75" />
      <ellipse cx="11" cy="32" rx="7.5" ry="4.5" fill={blue} opacity="0.75" />
      <ellipse cx="53" cy="32" rx="7.5" ry="4.5" fill={blue} opacity="0.75" />
    </pattern>
  );
}

/** Thin azulejo border strip. */
function TileStrip({ height = 30 }: { height?: number }) {
  return (
    <svg width="100%" height={height} aria-hidden className="block" preserveAspectRatio="none">
      <defs>
        <AzulejoPattern id="nk-az-strip" />
      </defs>
      <rect width="100%" height={height} fill="url(#nk-az-strip)" />
      <rect width="100%" height="1.5" y="0" fill={C.sea} opacity="0.6" />
      <rect width="100%" height="1.5" y={height - 1.5} fill={C.sea} opacity="0.6" />
    </svg>
  );
}

/** Lemon-striped tablecloth band, from the painted Mediterranean table. */
function StripeBand({ height = 18 }: { height?: number }) {
  return (
    <div
      aria-hidden
      style={{
        height,
        background: `repeating-linear-gradient(90deg, ${C.lemon} 0 26px, ${C.ivory} 26px 52px)`,
        borderTop: `1px solid ${C.terracotta}44`,
        borderBottom: `1px solid ${C.terracotta}44`,
      }}
    />
  );
}

/** Fine blue-checked cloth, from the Uzbek table spread. */
const checkedCloth: React.CSSProperties = {
  backgroundColor: C.ivory,
  backgroundImage: `repeating-linear-gradient(0deg, transparent 0 34px, ${C.porcelain}55 34px 36px), repeating-linear-gradient(90deg, transparent 0 34px, ${C.porcelain}55 34px 36px)`,
};

/** Circular photo styled as a ceramic plate. */
function Plate({
  src,
  alt,
  size = 'h-64 w-64',
  sizes,
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  size?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative rounded-full p-3 shadow-[0_22px_45px_rgba(30,42,50,0.28)] ${size} ${className}`}
      style={{ backgroundColor: C.white, border: `1px solid ${C.porcelain}` }}
    >
      <div className="absolute inset-1.5 rounded-full border border-dashed" style={{ borderColor: C.sea, opacity: 0.5 }} />
      <div className="relative h-full w-full overflow-hidden rounded-full">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
      </div>
    </div>
  );
}

/** A folder-style palette card chip. */
function PaletteChip({ name, hex, color, light = false }: { name: string; hex: string; color: string; light?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: color, color: light ? C.ink : C.white }}>
      <span className={`text-[13px] tracking-[0.14em] uppercase ${prata.className}`}>{name}</span>
      <span className={`text-[10px] opacity-80 ${mono.className}`}>{hex}</span>
    </div>
  );
}

function MonoLabel({ children, color = C.terracotta }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.24em] ${mono.className}`} style={{ color }}>
      {children}
    </p>
  );
}

export default function TiledTerrace() {
  return (
    <div className={karla.className} style={{ backgroundColor: C.ivory, color: C.ink }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header style={{ backgroundColor: C.white }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className={`text-[1.5rem] ${prata.className}`} style={{ color: C.sea }}>
            Nieves Kitchen
          </span>
          <nav className="hidden gap-7 sm:flex">
            {['Kitchen', 'Atlas', 'Recipes', 'Pantry'].map((l) => (
              <span
                key={l}
                className={`cursor-pointer text-[12px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-70 ${mono.className}`}
                style={{ color: l === 'Kitchen' ? C.terracotta : C.sea }}
              >
                {l}
              </span>
            ))}
          </nav>
        </div>
        <TileStrip height={26} />
      </header>

      {/* ── Hero: plate on a tiled wall ────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-18">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <MonoLabel>Recipes from every shore</MonoLabel>
            <h1 className={`text-5xl leading-[1.08] md:text-[3.9rem] ${prata.className}`} style={{ color: C.sea }}>
              Set the table.
              <br />
              <span style={{ color: C.terracotta }}>See the world.</span>
            </h1>
            <p className="max-w-md text-[16px] leading-relaxed" style={{ color: C.ink }}>
              Bold, halal home cooking collected from harbours, markets, and kitchens around the
              world, then tested at one small table. Pull up a chair.
            </p>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <span
                className={`cursor-pointer px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5 ${mono.className}`}
                style={{ backgroundColor: C.terracotta, color: C.white, boxShadow: `4px 4px 0 ${C.lemon}` }}
              >
                Start cooking
              </span>
              <span
                className={`cursor-pointer text-[12px] font-bold uppercase tracking-[0.18em] underline underline-offset-4 ${mono.className}`}
                style={{ color: C.sea }}
              >
                Browse the atlas
              </span>
            </div>
            {/* the folder's palette cards, recreated */}
            <div className="max-w-[290px] pt-6 shadow-[0_12px_28px_rgba(30,42,50,0.14)]">
              <PaletteChip name="Sea Blue" hex="#0F4E77" color={C.sea} />
              <PaletteChip name="Terracotta" hex="#B85C38" color={C.terracotta} />
              <PaletteChip name="Miel Doré" hex="#E9B44C" color={C.lemon} light />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            {/* azulejo wall */}
            <svg className="h-[430px] w-full" aria-hidden>
              <defs>
                <AzulejoPattern id="nk-az-wall" />
              </defs>
              <rect width="100%" height="100%" fill="url(#nk-az-wall)" />
              <rect width="100%" height="100%" fill="none" stroke={C.sea} strokeWidth="3" />
            </svg>
            <Plate
              src="/recipes/turkish-eggs-hero.webp"
              alt="Çılbır, Turkish eggs on garlicky yoghurt"
              size="h-64 w-64 md:h-72 md:w-72"
              sizes="(max-width: 768px) 256px, 288px"
              className="absolute -bottom-10 -left-6 md:-left-12"
              priority
            />
            <span
              className={`absolute -right-3 top-6 rotate-[6deg] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] shadow-md ${mono.className}`}
              style={{ backgroundColor: C.lemon, color: C.ink }}
            >
              Halal, always
            </span>
          </div>
        </div>
      </section>

      <StripeBand />

      {/* ── Atlas: every country is a tile ─────────────────── */}
      <section style={{ backgroundColor: C.sea }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div className="space-y-5">
            <MonoLabel color={C.lemon}>The atlas</MonoLabel>
            <h2 className={`max-w-md text-4xl leading-[1.1] ${prata.className}`} style={{ color: C.white }}>
              Every country is a tile. Cooking glazes it.
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed" style={{ color: `${C.white}CC` }}>
              The world map works like a tiled wall: each country starts as raw clay and takes on
              its colour the first time you cook from it. Fill the wall one dinner at a time.
            </p>
            <p className={`text-[12px] font-bold uppercase tracking-[0.18em] underline underline-offset-8 ${mono.className}`} style={{ color: C.lemon }}>
              Open the map →
            </p>
          </div>
          <div>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 32 }).map((_, i) => {
                const glazed: Record<number, string> = { 2: C.lemon, 5: C.terracotta, 9: C.porcelain, 12: C.lemon, 17: C.terracotta, 20: C.porcelain, 26: C.lemon, 29: C.terracotta };
                const fill = glazed[i];
                return (
                  <div
                    key={i}
                    className="aspect-square transition-transform hover:scale-105"
                    style={
                      fill
                        ? { backgroundColor: fill, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)' }
                        : { border: `1.5px dashed ${C.porcelain}88` }
                    }
                  />
                );
              })}
            </div>
            <p className={`mt-4 text-[11px] font-bold uppercase tracking-[0.2em] ${mono.className}`} style={{ color: C.porcelain }}>
              Glazed so far: 8 of 195
            </p>
          </div>
        </div>
      </section>

      <TileStrip height={26} />

      {/* ── Collections: plates on a checked cloth ─────────── */}
      <section style={checkedCloth}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <MonoLabel>Four courses</MonoLabel>
            <h2 className={`mt-2 text-4xl ${prata.className}`} style={{ color: C.sea }}>
              Pick a plate
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_COLLECTIONS.map((col, i) => {
              const glazes = [C.sea, C.terracotta, C.olive, C.lemon];
              const inks = [C.white, C.white, C.white, C.ink];
              return (
                <div key={col.slug} className="group flex cursor-pointer flex-col items-center text-center">
                  <div
                    className="relative flex aspect-square w-full max-w-[220px] items-center justify-center rounded-full p-6 shadow-[0_16px_32px_rgba(30,42,50,0.2)] transition-transform group-hover:-translate-y-1.5"
                    style={{ backgroundColor: glazes[i], color: inks[i] }}
                  >
                    <div className="absolute inset-2 rounded-full border border-dashed opacity-50" style={{ borderColor: inks[i] }} />
                    <h3 className={`relative px-3 text-[1.3rem] leading-snug ${prata.className}`}>{col.title}</h3>
                  </div>
                  <p className={`mt-4 text-[11px] font-bold uppercase tracking-[0.2em] ${mono.className}`} style={{ color: C.terracotta }}>
                    {col.count} recipes
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <StripeBand />

      {/* ── Recipe cards: ceramic panels ───────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <MonoLabel>Out of the oven</MonoLabel>
            <h2 className={`mt-2 text-4xl ${prata.className}`} style={{ color: C.sea }}>
              This week at the table
            </h2>
          </div>
          <span className={`text-[12px] font-bold uppercase tracking-[0.18em] underline underline-offset-8 ${mono.className}`} style={{ color: C.terracotta }}>
            All recipes →
          </span>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {SAMPLE_RECIPES.map((r) => (
            <div
              key={r.slug}
              className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(15,78,119,0.22)]"
              style={{ backgroundColor: C.white, border: `1.5px solid ${C.sea}` }}
            >
              <TileStrip height={18} />
              <div className="relative aspect-[4/3]">
                <Image src={r.img} alt={r.title} fill sizes="(max-width: 768px) 90vw, 360px" className="object-cover" />
              </div>
              <div className="p-5">
                <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${mono.className}`} style={{ color: C.terracotta }}>
                  {r.country} · {r.region}
                </p>
                <h3 className={`mt-2 text-[1.45rem] leading-tight ${prata.className}`} style={{ color: C.sea }}>
                  {r.title}
                </h3>
                <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: `${C.porcelain}88` }}>
                  <span className={`text-[11px] font-bold tracking-[0.14em] ${mono.className}`} style={{ color: C.olive }}>
                    {r.timeTotal} // SERVES {r.serves}
                  </span>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: C.lemon }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recipe page header: the menu card ──────────────── */}
      <section style={{ background: `repeating-linear-gradient(90deg, ${C.lemon}55 0 26px, ${C.ivory} 26px 52px)` }}>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div
            className="px-6 py-12 text-center shadow-[0_24px_50px_rgba(30,42,50,0.18)] md:px-14"
            style={{ backgroundColor: C.white, border: `2px solid ${C.sea}` }}
          >
            <MonoLabel>Türkiye · Middle East</MonoLabel>
            <h2 className={`mx-auto mt-4 max-w-xl text-4xl leading-[1.1] md:text-5xl ${prata.className}`} style={{ color: C.sea }}>
              Çılbır, Turkish Eggs
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: C.ink }}>
              {SAMPLE_RECIPES[0].blurb}
            </p>
            <div className="mx-auto mt-9 flex max-w-md items-stretch justify-center gap-3">
              {[
                ['Active', SAMPLE_RECIPES[0].timeActive, C.porcelain, C.ink],
                ['Total', SAMPLE_RECIPES[0].timeTotal, C.sea, C.white],
                ['Serves', SAMPLE_RECIPES[0].serves, C.terracotta, C.white],
              ].map(([k, v, bg, fg]) => (
                <div key={k as string} className="flex-1 px-4 py-3.5" style={{ backgroundColor: bg as string, color: fg as string, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)' }}>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 ${mono.className}`}>{k}</p>
                  <p className={`text-lg ${prata.className}`}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <TileStrip height={26} />
      <footer style={{ backgroundColor: C.sea }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <span className={`text-base ${prata.className}`} style={{ color: C.white }}>
            Nieves Kitchen
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.22em] ${mono.className}`} style={{ color: C.lemon }}>
            Cooked by the sea, seasoned by the world
          </span>
        </div>
      </footer>
    </div>
  );
}
