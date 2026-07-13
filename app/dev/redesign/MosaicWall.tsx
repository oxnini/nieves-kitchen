'use client';

import Image from 'next/image';
import { Karla, Space_Mono, Young_Serif } from 'next/font/google';
import { SAMPLE_RECIPES } from './data';

/**
 * Direction E — "The Mosaic Wall".
 *
 * The tile concept from C/D, re-executed: instead of azulejo pattern strips
 * decorating conventional sections, the PAGE ITSELF is the tiled wall.
 * One continuous asymmetric grid with visible cream grout; every piece of
 * content (wordmark, nav, photos, headlines, ink drawings, the atlas) is a
 * glazed tile with its own span. Pattern tiles are rare filler, not chrome.
 * Collage elements (stickers, a postmark) sit ON the wall, crossing grout
 * lines. Built from the Cairo ceramics poster + the folder's zellige photos.
 *
 * All styling is scoped here; nothing touches global tokens.
 */

const young = Young_Serif({ weight: '400', subsets: ['latin'] });
const karla = Karla({ subsets: ['latin'] });
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'] });

const C = {
  grout: '#E9DCC2', // the wall behind the tiles
  paper: '#F7F0DD', // unglazed tile face
  peacock: '#0C3F49',
  teal: '#2F6F78',
  ember: '#BC5127',
  saffron: '#E5A430',
  coral: '#E7A87A',
  olive: '#75714B',
  ink: '#28211A',
};

/** Glazed ceramic depth: a soft inner bevel at the bottom edge. */
const glaze = { boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.25)' };

function MonoTag({ children, color = C.ember, className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${mono.className} ${className}`} style={{ color }}>
      {children}
    </p>
  );
}

/** Small checkerboard filler tile. */
function CheckerTile({ a = C.peacock, b = C.paper, className = '' }: { a?: string; b?: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ ...glaze, background: `repeating-conic-gradient(${a} 0% 25%, ${b} 0% 50%) 0 0 / 34px 34px` }}
    />
  );
}

/** Eight-point star filler tile. */
function StarTile({ glazeColor = C.teal, star = C.paper, className = '' }: { glazeColor?: string; star?: string; className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center ${className}`} style={{ backgroundColor: glazeColor, ...glaze }}>
      <svg width="46" height="46" viewBox="0 0 46 46">
        <g transform="translate(23,23)">
          <rect x="-14" y="-14" width="28" height="28" fill={star} />
          <rect x="-14" y="-14" width="28" height="28" fill={star} transform="rotate(45)" />
          <circle r="5.5" fill={glazeColor} />
        </g>
      </svg>
    </div>
  );
}

/** Ink drawing on a glazed tile. */
function InkTile({
  src,
  label,
  glazeColor = C.paper,
  labelColor = C.ember,
  className = '',
}: {
  src: string;
  label: string;
  glazeColor?: string;
  labelColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden p-3 transition-transform hover:-translate-y-0.5 ${className}`}
      style={{ backgroundColor: glazeColor, ...glaze }}
    >
      <div className="relative min-h-0 w-full flex-1 transition-transform group-hover:scale-[1.04]">
        <Image src={src} alt={`${label}, ink drawing`} fill sizes="180px" className="object-contain" />
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-[0.24em] ${mono.className}`} style={{ color: labelColor }}>
        {label}
      </span>
    </div>
  );
}

/** Postmark collage element, laid over the wall. */
function Postmark({ className = '' }: { className?: string }) {
  return (
    <svg width="104" height="104" viewBox="0 0 120 120" aria-hidden className={className}>
      <circle cx="60" cy="60" r="55" fill={C.paper} opacity="0.94" />
      <circle cx="60" cy="60" r="54" fill="none" stroke={C.peacock} strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="60" cy="60" r="37" fill="none" stroke={C.peacock} strokeWidth="1.5" />
      <path id="nk-e-pm" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
      <text fontSize="10.5" letterSpacing="3" fill={C.peacock} className={mono.className}>
        <textPath href="#nk-e-pm">NIEVES KITCHEN · TABLE POST · HALAL ALWAYS ·</textPath>
      </text>
      <text x="60" y="57" textAnchor="middle" fontSize="11" fill={C.ember} className={mono.className}>
        13 JUL
      </text>
      <text x="60" y="71" textAnchor="middle" fontSize="11" fill={C.ember} className={mono.className}>
        2026
      </text>
    </svg>
  );
}

/** The atlas as a small irregular mosaic: glazed = cooked, empty = waiting. */
function AtlasMosaic() {
  const cells: { span?: string; fill?: string }[] = [
    { span: 'col-span-2 row-span-2', fill: C.saffron },
    { fill: C.teal },
    {},
    { fill: C.ember },
    {},
    {},
    { span: 'col-span-2', fill: C.coral },
    {},
    { fill: C.teal },
    { span: 'row-span-2', fill: C.olive },
    {},
    {},
    { fill: C.saffron },
    { span: 'col-span-2' },
    { fill: C.ember },
    {},
  ];
  return (
    <div className="grid h-full grid-cols-5 gap-1.5" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={cell.span ?? ''}
          style={
            cell.fill
              ? { backgroundColor: cell.fill, ...glaze }
              : { border: `1.5px dashed ${C.paper}66` }
          }
        />
      ))}
    </div>
  );
}

export default function MosaicWall() {
  return (
    <div className={karla.className} style={{ backgroundColor: C.grout, color: C.ink }}>
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-5 sm:py-5">
        {/* the whole page is one tiled wall */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-6 md:auto-rows-[96px]">
          {/* ── Masthead row ─────────────────────────────── */}
          <div
            className="col-span-2 flex flex-col justify-center px-5 py-4 md:col-span-3"
            style={{ backgroundColor: C.paper, ...glaze }}
          >
            <h1 className={`text-[1.7rem] leading-none ${young.className}`} style={{ color: C.peacock }}>
              Nieves Kitchen
            </h1>
            <MonoTag className="mt-1.5">Recipes from every shore</MonoTag>
          </div>
          {['Atlas', 'Recipes', 'Pantry'].map((l, i) => (
            <div
              key={l}
              className="flex cursor-pointer items-center justify-center py-4 transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: [C.teal, C.ember, C.saffron][i], ...glaze }}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.2em] ${mono.className}`}
                style={{ color: i === 2 ? C.ink : C.paper }}
              >
                {l}
              </span>
            </div>
          ))}

          {/* ── Hero band ────────────────────────────────── */}
          <div className="relative col-span-2 aspect-[4/3] md:col-span-3 md:row-span-3 md:aspect-auto">
            <Image
              src="/recipes/xinjiang-lamb-dumplings-pan-fried.webp"
              alt="Xinjiang lamb dumplings, pan-crisped"
              fill
              sizes="(max-width: 768px) 94vw, 560px"
              className="object-cover"
              priority
            />
            <div
              className="absolute right-0 bottom-0 left-0 flex items-baseline justify-between px-4 py-2.5"
              style={{ backgroundColor: `${C.paper}F0` }}
            >
              <MonoTag>China · East Asia</MonoTag>
              <span className={`text-sm ${young.className}`} style={{ color: C.peacock }}>
                Lamb dumplings
              </span>
            </div>
            <Postmark className="absolute -top-5 -right-3 z-10 rotate-[10deg]" />
          </div>
          <div
            className="relative col-span-2 flex flex-col justify-center gap-4 px-5 py-8 md:col-span-3 md:row-span-2 md:px-8"
            style={{ backgroundColor: C.paper, ...glaze }}
          >
            <h2 className={`text-[2rem] leading-[1.04] md:text-[2.6rem] ${young.className}`} style={{ color: C.peacock }}>
              Set the table with{' '}
              <em className="not-italic" style={{ color: C.ember }}>
                somewhere new.
              </em>
            </h2>
            <p className="max-w-md text-[14.5px] leading-relaxed">
              Bold, halal home cooking collected from harbours, markets and kitchens around the
              world, then tested at one small table.
            </p>
            {/* sticker crossing the grout */}
            <span
              className={`absolute -top-3 right-6 rotate-[5deg] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] shadow-md ${mono.className}`}
              style={{ backgroundColor: C.saffron, color: C.ink }}
            >
              Halal, always
            </span>
          </div>
          {/* sun-disc tile with honey ink laid over it, Hoppers-style */}
          <div className="relative col-span-1 flex items-center justify-center overflow-hidden md:row-span-1" style={{ backgroundColor: C.paper, ...glaze }}>
            <div aria-hidden className="absolute h-[72%] w-[72%] rounded-full" style={{ backgroundColor: C.saffron }} />
            <div className="relative h-[86%] w-[86%]">
              <Image src="/pantry/honey.webp" alt="Honey, ink drawing" fill sizes="160px" className="object-contain" />
            </div>
          </div>
          <div
            className="col-span-1 flex cursor-pointer items-center justify-center px-3 text-center transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: C.peacock, ...glaze }}
          >
            <span className={`text-[10.5px] font-bold uppercase tracking-[0.18em] ${mono.className}`} style={{ color: C.saffron }}>
              Start cooking →
            </span>
          </div>
          <CheckerTile className="hidden md:block" />
          <StarTile className="hidden md:flex" glazeColor={C.ember} />
          <InkTile src="/pantry/garlic.webp" label="Garlic" glazeColor={C.paper} className="hidden md:flex" />

          {/* ── Atlas band ───────────────────────────────── */}
          <div
            className="col-span-2 flex flex-col justify-center gap-3 px-5 py-8 md:col-span-4 md:row-span-2 md:px-8"
            style={{ backgroundColor: C.peacock, ...glaze }}
          >
            <MonoTag color={C.saffron}>The atlas</MonoTag>
            <h2 className={`max-w-lg text-[1.6rem] leading-[1.12] md:text-[2rem] ${young.className}`} style={{ color: C.paper }}>
              Every country is a tile. Cooking glazes it.
            </h2>
            <p className="max-w-md text-[13.5px] leading-relaxed" style={{ color: `${C.paper}CC` }}>
              Each country starts as raw clay and takes on its colour the first time you cook from
              it. Fill the wall one dinner at a time.
            </p>
            <span
              className={`cursor-pointer text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-4 ${mono.className}`}
              style={{ color: C.coral }}
            >
              Open the map →
            </span>
          </div>
          <div className="col-span-2 flex flex-col gap-2 p-3 md:row-span-2" style={{ backgroundColor: `${C.peacock}E6`, ...glaze }}>
            <div className="min-h-0 flex-1">
              <AtlasMosaic />
            </div>
            <p className={`shrink-0 text-center text-[9px] font-bold uppercase tracking-[0.2em] ${mono.className}`} style={{ color: C.coral }}>
              8 of 195 glazed
            </p>
          </div>

          {/* ── Recipes band, staggered ──────────────────── */}
          <div
            className="col-span-2 flex flex-col justify-center gap-2 px-5 py-6 md:col-span-2 md:row-span-1"
            style={{ backgroundColor: C.paper, ...glaze }}
          >
            <MonoTag>Out of the oven</MonoTag>
            <h2 className={`text-[1.35rem] leading-tight ${young.className}`} style={{ color: C.peacock }}>
              This week at the table
            </h2>
          </div>
          <StarTile className="hidden md:flex" glazeColor={C.saffron} star={C.peacock} />
          <InkTile src="/pantry/eggs.webp" label="Eggs" glazeColor={C.coral} labelColor={C.ink} className="hidden md:flex" />
          <CheckerTile className="hidden md:block" a={C.ember} b={C.paper} />
          <div
            className="col-span-1 hidden cursor-pointer items-center justify-center md:flex"
            style={{ backgroundColor: C.teal, ...glaze }}
          >
            <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${mono.className}`} style={{ color: C.paper }}>
              All recipes →
            </span>
          </div>

          {SAMPLE_RECIPES.map((r, i) => (
            <div
              key={r.slug}
              className={`group relative col-span-2 cursor-pointer md:col-span-2 ${['md:row-span-3', 'md:row-span-2', 'md:row-span-3'][i]}`}
            >
              <div className="relative h-full w-full overflow-hidden" style={glaze}>
                <div className="relative aspect-[4/3] h-full w-full md:aspect-auto">
                  <Image
                    src={r.img}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 94vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute right-0 bottom-0 left-0 space-y-0.5 px-4 py-3" style={{ backgroundColor: `${C.paper}F2` }}>
                  <MonoTag>{r.country} · {r.timeTotal}</MonoTag>
                  <h3 className={`text-[1.05rem] leading-snug ${young.className}`} style={{ color: C.peacock }}>
                    {r.title}
                  </h3>
                </div>
              </div>
              {i === 0 && (
                <span
                  className={`absolute -top-2.5 -left-2 z-10 rotate-[-6deg] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] shadow-md ${mono.className}`}
                  style={{ backgroundColor: C.ember, color: C.paper }}
                >
                  New this week
                </span>
              )}
            </div>
          ))}
          {/* filler under the short middle recipe keeps the wall flush */}
          <InkTile src="/pantry/dates.webp" label="Dates" glazeColor={C.saffron} labelColor={C.ink} className="hidden md:col-start-3 md:flex" />
          <StarTile className="hidden md:flex" glazeColor={C.olive} />

          {/* ── Pantry band ──────────────────────────────── */}
          <div
            className="col-span-2 flex flex-col justify-center gap-2.5 px-5 py-7 md:col-span-2 md:row-span-2"
            style={{ backgroundColor: C.ember, ...glaze }}
          >
            <MonoTag color={C.coral}>The pantry</MonoTag>
            <h2 className={`text-[1.5rem] leading-[1.1] ${young.className}`} style={{ color: C.paper }}>
              Drawn in ink, kept in jars.
            </h2>
            <p className="max-w-xs text-[13px] leading-relaxed" style={{ color: `${C.paper}D9` }}>
              Every ingredient on the shelf is drawn by hand, two tones of ink on cream, and earned
              by use.
            </p>
            <span
              className={`cursor-pointer text-[10.5px] font-bold uppercase tracking-[0.18em] underline underline-offset-4 ${mono.className}`}
              style={{ color: C.saffron }}
            >
              Open the pantry →
            </span>
          </div>
          <InkTile src="/pantry/olive-oil.webp" label="Olive oil" glazeColor={C.paper} className="md:row-span-2" />
          <InkTile src="/pantry/yoghurt.webp" label="Yoghurt" glazeColor={C.teal} labelColor={C.paper} />
          <InkTile src="/pantry/lamb.webp" label="Lamb" glazeColor={C.paper} />
          <InkTile src="/pantry/butter.webp" label="Butter" glazeColor={C.coral} labelColor={C.ink} />
          <InkTile src="/pantry/barley.webp" label="Barley" glazeColor={C.olive} labelColor={C.paper} className="hidden md:flex" />
          <StarTile className="hidden md:flex" glazeColor={C.coral} star={C.ember} />

          {/* ── Footer row ───────────────────────────────── */}
          <CheckerTile className="hidden md:block" />
          <div
            className="col-span-2 flex items-center justify-between px-5 py-4 md:col-span-4"
            style={{ backgroundColor: C.peacock, ...glaze }}
          >
            <span className={`text-sm ${young.className}`} style={{ color: C.paper }}>
              Nieves Kitchen
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-[0.22em] ${mono.className}`} style={{ color: C.saffron }}>
              Cooked by the sea, seasoned by the world
            </span>
          </div>
          <StarTile className="hidden md:flex" glazeColor={C.teal} />
          <CheckerTile className="hidden md:block" a={C.ember} />
        </div>
      </div>
    </div>
  );
}
