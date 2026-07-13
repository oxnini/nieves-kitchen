'use client';

import Image from 'next/image';
import { DM_Serif_Display, Karla } from 'next/font/google';
import {
  INK_ART,
  SAMPLE_COLLECTIONS,
  SAMPLE_RECIPES,
  TURKISH_EGGS_DETAIL,
  type NavTo,
} from './content';
import { Filmstrip, NavFlash, NavText, useNavFlash } from './shared';

/**
 * Direction 2 — "Azulejo".
 * Editorial cookbook meets a real drawn tile system. The blue-and-white
 * azulejo / Iznik motif that repeats through the inspo folder becomes
 * structure: a repeating cobalt pattern for bands and a tile frame for cards
 * and imagery — not ornament pasted on top. Terracotta and brass are the pops.
 */

const display = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'] });
const body = Karla({ subsets: ['latin'], weight: ['400', '500', '700'] });

const C = {
  cream: '#F4ECDC',
  creamDeep: '#EBE0C8',
  cobalt: '#20406B',
  cobaltDeep: '#16324F',
  terracotta: '#C4623C',
  brass: '#C69A4E',
  olive: '#6F7A47',
  ink: '#2A2A2E',
};

const LINK =
  'font-semibold text-[#20406B] underline decoration-[#C4623C] decoration-2 underline-offset-2 rounded px-[1px] transition-colors hover:bg-[#20406B]/10';

/* ── signature: the drawn azulejo tile ───────────────────────────────────── */

function AzulejoDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <pattern id="az-tile" width="48" height="48" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={C.cobalt} strokeWidth="1.5">
            <rect x="0.75" y="0.75" width="46.5" height="46.5" strokeWidth="0.8" opacity="0.5" />
            <path d="M0 12 A12 12 0 0 0 12 0" />
            <path d="M48 12 A12 12 0 0 1 36 0" />
            <path d="M0 36 A12 12 0 0 1 12 48" />
            <path d="M48 36 A12 12 0 0 0 36 48" />
            <ellipse cx="24" cy="14" rx="4" ry="7.5" />
            <ellipse cx="24" cy="34" rx="4" ry="7.5" />
            <ellipse cx="14" cy="24" rx="7.5" ry="4" />
            <ellipse cx="34" cy="24" rx="7.5" ry="4" />
          </g>
          <circle cx="24" cy="24" r="3" fill={C.terracotta} />
        </pattern>
      </defs>
    </svg>
  );
}

function TileStrip({ className = '', height = 24 }: { className?: string; height?: number }) {
  return (
    <div aria-hidden className={`w-full overflow-hidden ${className}`} style={{ height }}>
      <svg width="100%" height={height} preserveAspectRatio="xMidYMid slice">
        <rect width="100%" height={height} fill={C.cream} />
        <rect width="100%" height={height} fill="url(#az-tile)" />
      </svg>
    </div>
  );
}

/** A cobalt double-rule frame with little terracotta corner lozenges. */
function TileFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ boxShadow: `0 0 0 2px ${C.cobalt}, 0 0 0 5px ${C.cream}, 0 0 0 6.5px ${C.cobalt}55` }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden
          className="absolute z-10 h-2 w-2 rotate-45"
          style={{
            backgroundColor: C.terracotta,
            top: i < 2 ? -5 : undefined,
            bottom: i >= 2 ? -5 : undefined,
            left: i % 2 === 0 ? -5 : undefined,
            right: i % 2 === 1 ? -5 : undefined,
          }}
        />
      ))}
      {children}
    </div>
  );
}

function Eyebrow({ children, color = C.terracotta }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`text-[12px] font-bold tracking-[0.22em] uppercase ${body.className}`} style={{ color }}>
      {children}
    </p>
  );
}

function TopBar({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  const nav: { label: string; to: NavTo }[] = [
    { label: 'Recipes', to: { kind: 'recipes' } },
    { label: 'Atlas', to: { kind: 'atlas' } },
    { label: 'Pantry', to: { kind: 'pantry', slug: 'honey' } },
    { label: 'About', to: { kind: 'about' } },
  ];
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
      <span className={`text-[27px] leading-none ${display.className}`} style={{ color: C.cobalt }}>
        Nieves’s Kitchen
      </span>
      <nav className="flex items-center gap-1">
        {nav.map((n) => (
          <button
            key={n.label}
            type="button"
            onClick={() => onNavigate(n.to)}
            className={`rounded-md px-3.5 py-1.5 text-[14px] font-bold transition-colors hover:bg-[#20406B]/10 ${body.className}`}
            style={{ color: C.cobalt }}
          >
            {n.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onNavigate({ kind: 'recipes' })}
          className={`ml-2 rounded-md px-4 py-2 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 ${body.className}`}
          style={{ backgroundColor: C.terracotta }}
        >
          Start cooking
        </button>
      </nav>
    </header>
  );
}

/* ── home ────────────────────────────────────────────────────────────────── */

function Home({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  return (
    <>
      {/* Hero */}
      <section className="grid items-center gap-10 px-6 py-10 sm:px-10 md:grid-cols-2">
        <div className="max-w-xl">
          <Eyebrow>Recipes from every shore · halal always</Eyebrow>
          <h1 className={`mt-4 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] ${display.className}`} style={{ color: C.cobalt }}>
            A tiled table, set for the <span className="italic" style={{ color: C.terracotta }}>whole world.</span>
          </h1>
          <p className={`mt-5 max-w-md text-[17px] leading-relaxed ${body.className}`} style={{ color: C.ink }}>
            Bold home cooking collected from harbours, markets and kitchens abroad, then tested at one
            small table. Laid out like a cookbook, easy to walk through.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`rounded-md px-6 py-3 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5 ${body.className}`} style={{ backgroundColor: C.cobalt }}>
              Browse recipes
            </button>
            <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className={`rounded-md px-6 py-3 text-[15px] font-bold transition-colors ${body.className}`} style={{ color: C.cobalt, boxShadow: `inset 0 0 0 2px ${C.cobalt}` }}>
              Open the atlas
            </button>
          </div>
        </div>
        <TileFrame className="mx-auto w-full max-w-[440px]">
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image src={SAMPLE_RECIPES[0].img} alt={SAMPLE_RECIPES[0].title} fill sizes="(max-width:768px) 90vw, 440px" priority className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: `${C.cream}F2` }}>
              <Eyebrow color={C.terracotta}>{SAMPLE_RECIPES[0].country}</Eyebrow>
              <span className={`text-[17px] ${display.className}`} style={{ color: C.cobalt }}>{SAMPLE_RECIPES[0].title}</span>
            </div>
          </div>
        </TileFrame>
      </section>

      <TileStrip />

      {/* Filmstrip */}
      <section className="px-6 py-14 sm:px-10" style={{ backgroundColor: C.creamDeep }}>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>This week at the table</Eyebrow>
            <h2 className={`mt-2 text-[clamp(1.9rem,4vw,2.7rem)] ${display.className}`} style={{ color: C.cobalt }}>Fresh out of the oven</h2>
          </div>
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`shrink-0 text-[14px] font-bold underline underline-offset-4 ${body.className}`} style={{ color: C.terracotta }}>See all →</button>
        </div>

        <Filmstrip ariaLabel="Browse recipes" arrowStyle={{ backgroundColor: C.cobalt, color: C.cream }}>
          {SAMPLE_RECIPES.map((r) => (
            <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[270px] shrink-0 snap-start text-left sm:w-[300px]">
              <TileFrame className="bg-[#F4ECDC] transition-transform group-hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={r.img} alt={r.title} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-4 py-3">
                  <Eyebrow color={C.terracotta}>{r.country} · {r.timeTotal}</Eyebrow>
                  <h3 className={`mt-1 text-[21px] leading-snug ${display.className}`} style={{ color: C.cobalt }}>{r.title}</h3>
                </div>
              </TileFrame>
            </button>
          ))}
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className="grid w-[200px] shrink-0 snap-start place-items-center text-center transition-transform hover:-translate-y-1" style={{ backgroundColor: C.cobalt, color: C.cream }}>
            <div className="px-6">
              <div className={`text-[40px] leading-none ${display.className}`}>→</div>
              <p className={`mt-3 text-[16px] font-bold ${body.className}`}>Browse all recipes</p>
            </div>
          </button>
        </Filmstrip>
      </section>

      {/* Atlas: the wall of tiles */}
      <section className="px-6 py-16 sm:px-10">
        <div className="relative overflow-hidden rounded-sm" style={{ boxShadow: `0 0 0 2px ${C.cobalt}` }}>
          <div aria-hidden className="absolute inset-0 opacity-90">
            <svg width="100%" height="100%"><rect width="100%" height="100%" fill={C.cream} /><rect width="100%" height="100%" fill="url(#az-tile)" /></svg>
          </div>
          <div className="relative grid gap-8 p-8 sm:p-12 md:grid-cols-2">
            <div className="rounded-sm p-6 sm:p-8" style={{ backgroundColor: `${C.cobalt}F2` }}>
              <Eyebrow color={C.brass}>The atlas</Eyebrow>
              <h2 className={`mt-3 text-[clamp(1.9rem,4vw,2.8rem)] leading-tight ${display.className}`} style={{ color: C.cream }}>
                Every country is a tile.
              </h2>
              <p className={`mt-3 max-w-sm text-[15.5px] leading-relaxed ${body.className}`} style={{ color: `${C.cream}D0` }}>
                The map is the whole wall. Cook from a place and its tile takes on colour — fill the
                wall one dinner at a time.
              </p>
              <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className={`mt-6 rounded-md px-5 py-2.5 text-[14px] font-bold ${body.className}`} style={{ backgroundColor: C.brass, color: C.cobaltDeep }}>
                Open the map →
              </button>
            </div>
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* Pantry + collections */}
      <section className="grid gap-6 px-6 pb-16 sm:px-10 md:grid-cols-[1fr_1fr]">
        <div className="rounded-sm p-8" style={{ backgroundColor: C.creamDeep, boxShadow: `inset 0 0 0 2px ${C.cobalt}22` }}>
          <Eyebrow>The pantry</Eyebrow>
          <h2 className={`mt-2 text-[clamp(1.6rem,3.4vw,2.3rem)] ${display.className}`} style={{ color: C.cobalt }}>Drawn in ink, kept in jars.</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {INK_ART.slice(0, 5).map((a) => (
              <button key={a.slug} type="button" onClick={() => onNavigate({ kind: 'pantry', slug: a.slug })} className="grid h-20 w-20 place-items-center p-2.5 transition-transform hover:-translate-y-1" style={{ backgroundColor: C.cream, boxShadow: `0 0 0 1.5px ${C.cobalt}` }} title={a.label}>
                <div className="relative h-full w-full"><Image src={a.src} alt={`${a.label}, ink drawing`} fill sizes="80px" className="object-contain" /></div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onNavigate({ kind: 'pantry', slug: 'honey' })} className={`mt-6 text-[14px] font-bold underline underline-offset-4 ${body.className}`} style={{ color: C.terracotta }}>Open the pantry →</button>
        </div>

        <div className="rounded-sm p-8" style={{ backgroundColor: C.creamDeep, boxShadow: `inset 0 0 0 2px ${C.cobalt}22` }}>
          <Eyebrow>Ways in</Eyebrow>
          <h2 className={`mt-2 mb-4 text-[clamp(1.6rem,3.4vw,2.3rem)] ${display.className}`} style={{ color: C.cobalt }}>Pick a lens</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SAMPLE_COLLECTIONS.map((col) => (
              <button key={col.slug} type="button" onClick={() => onNavigate({ kind: 'collection', slug: col.slug })} className="rounded-sm p-4 text-left transition-transform hover:-translate-y-0.5" style={{ backgroundColor: C.cream, boxShadow: `0 0 0 1.5px ${C.cobalt}30` }}>
                <p className={`text-[12px] font-bold ${body.className}`} style={{ color: C.terracotta }}>{col.count} recipes</p>
                <h3 className={`mt-1 text-[17px] leading-snug ${display.className}`} style={{ color: C.cobalt }}>{col.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── recipe (cookbook page) ──────────────────────────────────────────────── */

function Recipe({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  const d = TURKISH_EGGS_DETAIL;
  return (
    <article className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
      <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`mt-2 mb-8 text-[14px] font-bold ${body.className}`} style={{ color: C.terracotta }}>← Back to the kitchen</button>

      <div className="grid items-start gap-10 md:grid-cols-[1fr_0.9fr]">
        <div>
          <button type="button" onClick={() => onNavigate({ kind: 'atlas', country: d.recipe.country })}><Eyebrow>{d.recipe.country} · {d.recipe.region}</Eyebrow></button>
          <h1 className={`mt-3 text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.04] ${display.className}`} style={{ color: C.cobalt }}>{d.recipe.title}</h1>
          <div className={`mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[14px] ${body.className}`} style={{ color: C.ink }}>
            <span><strong>Total</strong> {d.recipe.timeTotal}</span>
            <span><strong>Active</strong> {d.recipe.timeActive}</span>
            <span><strong>Serves</strong> {d.recipe.serves}</span>
          </div>
          <p className={`mt-6 text-[18px] leading-[1.75] ${body.className}`} style={{ color: C.ink }}>
            <span className={`float-left mr-3 mt-2 text-[62px] leading-[0.7] ${display.className}`} style={{ color: C.terracotta }}>
              {typeof d.intro[0] === 'string' ? d.intro[0].charAt(0) : 'A'}
            </span>
            <NavText content={[typeof d.intro[0] === 'string' ? d.intro[0].slice(1) : '', ...d.intro.slice(1)]} linkClassName={LINK} onNavigate={onNavigate} />
          </p>
          <p className={`mt-4 text-[13px] font-bold tracking-wide uppercase ${body.className}`} style={{ color: C.olive }}>
            Underlined words open the atlas, pantry, or a collection.
          </p>
        </div>

        <TileFrame className="mx-auto w-full max-w-[360px]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={d.gallery[0].src} alt={d.gallery[0].caption} fill sizes="360px" priority className="object-cover" />
          </div>
        </TileFrame>
      </div>

      <TileStrip className="my-12" />

      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className={`text-[27px] ${display.className}`} style={{ color: C.cobalt }}>Ingredients</h2>
          {d.ingredients.map((grp) => (
            <div key={grp.group} className="mt-5">
              <Eyebrow color={C.olive}>{grp.group}</Eyebrow>
              <ul className="mt-3 space-y-2.5">
                {grp.items.map((item, i) => (
                  <li key={i} className={`flex gap-3 text-[16px] leading-snug ${body.className}`} style={{ color: C.ink }}>
                    <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rotate-45" style={{ backgroundColor: C.terracotta }} />
                    <span><NavText content={item} linkClassName={LINK} onNavigate={onNavigate} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h2 className={`text-[27px] ${display.className}`} style={{ color: C.cobalt }}>Method</h2>
          <ol className="mt-5 space-y-6">
            {d.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className={`grid h-10 w-10 shrink-0 place-items-center text-[17px] ${display.className}`} style={{ backgroundColor: C.cobalt, color: C.cream, boxShadow: `0 0 0 3px ${C.cream}, 0 0 0 4.5px ${C.cobalt}55` }}>{i + 1}</span>
                <p className={`text-[17px] leading-[1.75] ${body.className}`} style={{ color: C.ink }}><NavText content={step} linkClassName={LINK} onNavigate={onNavigate} /></p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-16">
        <Eyebrow>Cook something near it</Eyebrow>
        <h2 className={`mt-2 mb-5 text-[clamp(1.6rem,3.4vw,2.3rem)] ${display.className}`} style={{ color: C.cobalt }}>More from the table</h2>
        <Filmstrip ariaLabel="Related recipes" arrowStyle={{ backgroundColor: C.cobalt, color: C.cream }}>
          {d.related.map((r) => (
            <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[230px] shrink-0 snap-start text-left">
              <TileFrame className="transition-transform group-hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={r.img} alt={r.title} fill sizes="230px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-3 py-2.5">
                  <Eyebrow color={C.terracotta}>{r.country}</Eyebrow>
                  <h3 className={`mt-1 text-[17px] leading-snug ${display.className}`} style={{ color: C.cobalt }}>{r.title}</h3>
                </div>
              </TileFrame>
            </button>
          ))}
        </Filmstrip>
      </div>
    </article>
  );
}

/* ── entry ───────────────────────────────────────────────────────────────── */

export default function Azulejo({ screen }: { screen: 'home' | 'recipe' }) {
  const { msg, fire } = useNavFlash();
  return (
    <div className={body.className} style={{ backgroundColor: C.cream, color: C.ink }}>
      <AzulejoDefs />
      <TileStrip height={20} />
      <TopBar onNavigate={fire} />
      {screen === 'home' ? <Home onNavigate={fire} /> : <Recipe onNavigate={fire} />}
      <TileStrip height={20} />
      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-8 sm:px-10" style={{ backgroundColor: C.cobalt }}>
        <span className={`text-[20px] ${display.className}`} style={{ color: C.cream }}>Nieves’s Kitchen</span>
        <span className={`text-[13px] ${body.className}`} style={{ color: C.brass }}>Cooked by the sea, seasoned by the world.</span>
      </footer>
      <NavFlash msg={msg} className={body.className} style={{ backgroundColor: C.cobalt, color: C.cream }} />
    </div>
  );
}
