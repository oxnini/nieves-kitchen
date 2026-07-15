'use client';

import Image from 'next/image';
import { Fraunces, Karla } from 'next/font/google';
import {
  INK_ART,
  SAMPLE_COLLECTIONS,
  SAMPLE_RECIPES,
  TURKISH_EGGS_DETAIL,
  type NavTo,
} from './content';
import { Filmstrip, NavFlash, NavText, useNavFlash } from './shared';

/**
 * Courtyard — the synthesis.
 *
 * Azulejo's palette (the colours the user preferred) + Sunwashed's arch (the
 * detail they loved) + Gourmet's clear poster cards (toned down). One coherent
 * "Moorish courtyard" world: horseshoe arches over glazed tilework.
 *
 * The tile is the brand primitive: destinations are glazed tiles, the atlas is
 * a tiled wall, and the journal earns tiles instead of stamps. Bold nav, a
 * dense magazine-index home, contained (never full-bleed) imagery, plain copy.
 */

const display = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
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

/* ── the tile primitive ──────────────────────────────────────────────────── */

function TileDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <pattern id="ct-tile" width="46" height="46" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={C.cream} strokeWidth="1.4" opacity="0.5">
            <path d="M0 11.5 A11.5 11.5 0 0 0 11.5 0" />
            <path d="M46 11.5 A11.5 11.5 0 0 1 34.5 0" />
            <path d="M0 34.5 A11.5 11.5 0 0 1 11.5 46" />
            <path d="M46 34.5 A11.5 11.5 0 0 0 34.5 46" />
            <ellipse cx="23" cy="13" rx="3.8" ry="7" />
            <ellipse cx="23" cy="33" rx="3.8" ry="7" />
            <ellipse cx="13" cy="23" rx="7" ry="3.8" />
            <ellipse cx="33" cy="23" rx="7" ry="3.8" />
          </g>
        </pattern>
      </defs>
    </svg>
  );
}

/** A small grid of glazed (filled) and raw (outline) tiles — the atlas/journal motif. */
function TileGrid({ cols = 4, rows = 3, glazed, className = '' }: { cols?: number; rows?: number; glazed: number[]; className?: string }) {
  const total = cols * rows;
  return (
    <div className={`grid gap-1 ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="aspect-square rounded-[3px]"
          style={
            glazed.includes(i)
              ? { backgroundColor: [C.terracotta, C.brass, C.cream, C.olive][i % 4] }
              : { boxShadow: `inset 0 0 0 1.5px ${C.cream}55` }
          }
        />
      ))}
    </div>
  );
}

/* ── the arch (signature) ────────────────────────────────────────────────── */

function Arch({
  src,
  alt,
  className = '',
  priority = false,
  ratio = 'aspect-[4/5]',
  sizes = '(max-width: 768px) 90vw, 420px',
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  ratio?: string;
  sizes?: string;
  caption?: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* keystone */}
      <span aria-hidden className="absolute left-1/2 top-[-9px] z-10 h-4 w-4 -translate-x-1/2 rotate-45" style={{ backgroundColor: C.brass, boxShadow: `0 0 0 3px ${C.cream}` }} />
      <div className="relative overflow-hidden rounded-t-full rounded-b-[20px]" style={{ boxShadow: `0 0 0 2px ${C.cobalt}, 0 0 0 7px ${C.cream}, 0 0 0 8.5px ${C.brass}, 0 24px 46px -28px rgba(22,50,79,0.6)` }}>
        <div className={`relative ${ratio}`}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
        {caption && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 py-2.5" style={{ backgroundColor: `${C.cream}F2` }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── small shared bits ───────────────────────────────────────────────────── */

function Eyebrow({ children, color = C.terracotta }: { children: React.ReactNode; color?: string }) {
  return <p className={`text-[12px] font-bold tracking-[0.22em] uppercase ${body.className}`} style={{ color }}>{children}</p>;
}

function BoldNav({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  const nav: { label: string; to: NavTo; active?: boolean }[] = [
    { label: 'Recipes', to: { kind: 'recipes' }, active: true },
    { label: 'Atlas', to: { kind: 'atlas' } },
    { label: 'Pantry', to: { kind: 'pantry', slug: 'honey' } },
    { label: 'About', to: { kind: 'about' } },
  ];
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 sm:px-10" style={{ backgroundColor: C.cobalt }}>
      <span className={`text-[26px] leading-none ${display.className}`} style={{ color: C.cream }}>
        Nieves’s <span className="italic" style={{ color: C.brass }}>Kitchen</span>
      </span>
      <nav className="flex items-center gap-1.5">
        {nav.map((n) => (
          <button
            key={n.label}
            type="button"
            onClick={() => onNavigate(n.to)}
            className={`relative rounded-md px-4 py-2 text-[15px] font-bold transition-colors hover:bg-white/10 ${body.className}`}
            style={{ color: n.active ? C.brass : C.cream }}
          >
            {n.label}
            {n.active && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full" style={{ backgroundColor: C.brass }} />}
          </button>
        ))}
        <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`ml-2 rounded-md px-5 py-2.5 text-[14px] font-bold transition-transform hover:-translate-y-0.5 ${body.className}`} style={{ backgroundColor: C.terracotta, color: C.cream }}>
          Start cooking
        </button>
      </nav>
    </header>
  );
}

/* ── destination tiles ───────────────────────────────────────────────────── */

function DestinationTiles({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Atlas */}
      <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className="group relative overflow-hidden rounded-xl p-5 text-left transition-transform hover:-translate-y-1" style={{ backgroundColor: C.cobalt }}>
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-20"><rect width="100%" height="100%" fill="url(#ct-tile)" /></svg>
        <div className="relative">
          <Eyebrow color={C.brass}>Atlas</Eyebrow>
          <h3 className={`mt-1 mb-3 text-[20px] leading-tight ${display.className}`} style={{ color: C.cream }}>Explore by place</h3>
          <TileGrid cols={5} rows={3} glazed={[1, 4, 6, 9, 12]} />
          <p className={`mt-3 text-[13px] ${body.className}`} style={{ color: `${C.cream}CC` }}>Every country is a tile.</p>
        </div>
      </button>

      {/* Pantry */}
      <button type="button" onClick={() => onNavigate({ kind: 'pantry', slug: 'honey' })} className="group relative overflow-hidden rounded-xl p-5 text-left transition-transform hover:-translate-y-1" style={{ backgroundColor: C.creamDeep, boxShadow: `inset 0 0 0 2px ${C.cobalt}22` }}>
        <Eyebrow>Pantry</Eyebrow>
        <h3 className={`mt-1 text-[20px] leading-tight ${display.className}`} style={{ color: C.cobalt }}>Every ingredient</h3>
        <div className="mt-2 flex gap-2">
          {INK_ART.slice(0, 3).map((a) => (
            <div key={a.slug} className="relative h-14 w-14 rounded-lg p-1.5" style={{ backgroundColor: C.cream }}>
              <Image src={a.src} alt={`${a.label}, ink drawing`} fill sizes="56px" className="object-contain" />
            </div>
          ))}
        </div>
        <p className={`mt-3 text-[13px] ${body.className}`} style={{ color: C.ink }}>Drawn by hand, kept in jars.</p>
      </button>

      {/* Collections */}
      <button type="button" onClick={() => onNavigate({ kind: 'collection', slug: 'travels' })} className="group relative overflow-hidden rounded-xl p-5 text-left transition-transform hover:-translate-y-1" style={{ backgroundColor: C.terracotta }}>
        <Eyebrow color={C.cream}>Collections</Eyebrow>
        <h3 className={`mt-1 mb-3 text-[20px] leading-tight ${display.className}`} style={{ color: C.cream }}>Ways in</h3>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_COLLECTIONS.map((col) => (
            <span key={col.slug} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${body.className}`} style={{ backgroundColor: `${C.cream}E6`, color: C.terracotta }}>{col.title}</span>
          ))}
        </div>
      </button>

      {/* Journal — the tile-as-passport idea */}
      <button type="button" onClick={() => onNavigate({ kind: 'about' })} className="group relative overflow-hidden rounded-xl p-5 text-left transition-transform hover:-translate-y-1" style={{ backgroundColor: C.cobaltDeep }}>
        <Eyebrow color={C.brass}>Your journal</Eyebrow>
        <h3 className={`mt-1 mb-3 text-[20px] leading-tight ${display.className}`} style={{ color: C.cream }}>8 tiles earned</h3>
        <TileGrid cols={5} rows={3} glazed={[0, 3, 5, 7, 8, 11, 13, 14]} />
        <p className={`mt-3 text-[13px] ${body.className}`} style={{ color: `${C.cream}CC` }}>Cook a country, earn its tile.</p>
      </button>
    </div>
  );
}

/* ── home (magazine index) ───────────────────────────────────────────────── */

function Home({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  const chips: { label: string; to: NavTo }[] = [
    { label: 'Türkiye', to: { kind: 'atlas', country: 'Türkiye' } },
    { label: 'Italy', to: { kind: 'atlas', country: 'Italy' } },
    { label: 'China', to: { kind: 'atlas', country: 'China' } },
    { label: 'High protein', to: { kind: 'collection', slug: 'high-protein' } },
    { label: 'Quick', to: { kind: 'collection', slug: 'sides' } },
  ];
  return (
    <>
      {/* Hero: title + chips beside an arched feature */}
      <section className="grid items-center gap-10 px-6 pt-10 pb-12 sm:px-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <Eyebrow>Halal home cooking</Eyebrow>
          <h1 className={`mt-3 text-[clamp(2.6rem,6vw,4.2rem)] leading-[1] ${display.className}`} style={{ color: C.cobalt }}>
            Cook your way <span className="italic" style={{ color: C.terracotta }}>around</span> the world.
          </h1>
          <p className={`mt-4 max-w-md text-[17px] leading-relaxed ${body.className}`} style={{ color: C.ink }}>
            Recipes collected from trips and tested at home. Pick a place, pick a dish, and start cooking.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`rounded-md px-6 py-3 text-[15px] font-bold transition-transform hover:-translate-y-0.5 ${body.className}`} style={{ backgroundColor: C.cobalt, color: C.cream }}>
              Browse recipes
            </button>
            <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className={`rounded-md px-6 py-3 text-[15px] font-bold transition-colors ${body.className}`} style={{ color: C.cobalt, boxShadow: `inset 0 0 0 2px ${C.cobalt}` }}>
              Open the atlas
            </button>
          </div>
          {/* quick jump chips — more to explore right away */}
          <div className="mt-6">
            <p className={`mb-2 text-[12px] font-bold tracking-wide uppercase ${body.className}`} style={{ color: C.olive }}>Jump in</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c.label} type="button" onClick={() => onNavigate(c.to)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${body.className}`} style={{ backgroundColor: C.creamDeep, color: C.cobalt, boxShadow: `inset 0 0 0 1.5px ${C.cobalt}22` }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Arch
          src={SAMPLE_RECIPES[0].img}
          alt={SAMPLE_RECIPES[0].title}
          priority
          className="mx-auto w-full max-w-[380px]"
          caption={
            <>
              <Eyebrow color={C.terracotta}>{SAMPLE_RECIPES[0].country}</Eyebrow>
              <span className={`text-[16px] ${display.className}`} style={{ color: C.cobalt }}>{SAMPLE_RECIPES[0].title}</span>
            </>
          }
        />
      </section>

      {/* This week filmstrip */}
      <section className="px-6 py-12 sm:px-10" style={{ backgroundColor: C.creamDeep }}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className={`text-[clamp(1.7rem,4vw,2.4rem)] ${display.className}`} style={{ color: C.cobalt }}>This week</h2>
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`shrink-0 text-[14px] font-bold underline underline-offset-4 ${body.className}`} style={{ color: C.terracotta }}>All recipes →</button>
        </div>
        <Filmstrip ariaLabel="Browse recipes" arrowStyle={{ backgroundColor: C.cobalt, color: C.cream }}>
          {SAMPLE_RECIPES.map((r) => (
            <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[260px] shrink-0 snap-start text-left sm:w-[290px]">
              <div className="overflow-hidden rounded-xl transition-transform group-hover:-translate-y-1" style={{ backgroundColor: C.cream, boxShadow: `0 0 0 1.5px ${C.cobalt}22, 0 16px 32px -24px rgba(22,50,79,0.5)` }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={r.img} alt={r.title} fill sizes="290px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-4 py-3">
                  <Eyebrow color={C.olive}>{r.country} · {r.timeTotal}</Eyebrow>
                  <h3 className={`mt-1 text-[20px] leading-snug ${display.className}`} style={{ color: C.cobalt }}>{r.title}</h3>
                  <p className={`mt-1 line-clamp-2 text-[13.5px] ${body.className}`} style={{ color: C.ink }}>{r.blurb}</p>
                </div>
              </div>
            </button>
          ))}
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className="grid w-[190px] shrink-0 snap-start place-items-center rounded-xl text-center transition-transform hover:-translate-y-1" style={{ backgroundColor: C.cobalt, color: C.cream }}>
            <div className="px-6">
              <div className={`text-[40px] leading-none ${display.className}`}>→</div>
              <p className={`mt-2 text-[15px] font-bold ${body.className}`}>All recipes</p>
            </div>
          </button>
        </Filmstrip>
      </section>

      {/* Destination tiles */}
      <section className="px-6 py-14 sm:px-10">
        <Eyebrow>Where to next</Eyebrow>
        <h2 className={`mt-2 mb-6 text-[clamp(1.7rem,4vw,2.4rem)] ${display.className}`} style={{ color: C.cobalt }}>Start anywhere</h2>
        <DestinationTiles onNavigate={onNavigate} />
      </section>
    </>
  );
}

/* ── recipe (arched cookbook page) ───────────────────────────────────────── */

function Recipe({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  const d = TURKISH_EGGS_DETAIL;
  return (
    <article className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
      <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`mt-2 mb-8 text-[14px] font-bold ${body.className}`} style={{ color: C.terracotta }}>← Back to the kitchen</button>

      <div className="grid items-start gap-10 md:grid-cols-[1fr_0.85fr]">
        <div>
          <button type="button" onClick={() => onNavigate({ kind: 'atlas', country: d.recipe.country })}><Eyebrow>{d.recipe.country} · {d.recipe.region}</Eyebrow></button>
          <h1 className={`mt-3 text-[clamp(2.4rem,5vw,3.4rem)] leading-[1.02] ${display.className}`} style={{ color: C.cobalt }}>{d.recipe.title}</h1>
          <div className={`mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[14px] ${body.className}`} style={{ color: C.ink }}>
            <span><strong>Total</strong> {d.recipe.timeTotal}</span>
            <span><strong>Active</strong> {d.recipe.timeActive}</span>
            <span><strong>Serves</strong> {d.recipe.serves}</span>
          </div>
          <p className={`mt-6 text-[18px] leading-[1.7] ${body.className}`} style={{ color: C.ink }}>
            <span className={`float-left mr-3 mt-2 text-[60px] leading-[0.7] ${display.className}`} style={{ color: C.terracotta }}>
              {typeof d.intro[0] === 'string' ? d.intro[0].charAt(0) : 'A'}
            </span>
            <NavText content={[typeof d.intro[0] === 'string' ? d.intro[0].slice(1) : '', ...d.intro.slice(1)]} linkClassName={LINK} onNavigate={onNavigate} />
          </p>
          <p className={`mt-3 text-[13px] font-bold tracking-wide uppercase ${body.className}`} style={{ color: C.olive }}>
            Underlined words open the atlas, pantry, or a collection.
          </p>
        </div>

        <Arch src={d.gallery[0].src} alt={d.gallery[0].caption} className="mx-auto w-full max-w-[340px]" priority />
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className={`text-[26px] ${display.className}`} style={{ color: C.cobalt }}>Ingredients</h2>
          {d.ingredients.map((grp) => (
            <div key={grp.group} className="mt-5">
              <Eyebrow color={C.olive}>{grp.group}</Eyebrow>
              <ul className="mt-3 space-y-2.5">
                {grp.items.map((item, i) => (
                  <li key={i} className={`flex gap-3 text-[16px] leading-snug ${body.className}`} style={{ color: C.ink }}>
                    <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rotate-45" style={{ backgroundColor: C.brass }} />
                    <span><NavText content={item} linkClassName={LINK} onNavigate={onNavigate} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h2 className={`text-[26px] ${display.className}`} style={{ color: C.cobalt }}>Method</h2>
          <ol className="mt-5 space-y-6">
            {d.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                {/* the step number is a glazed tile */}
                <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md" style={{ backgroundColor: C.cobalt }}>
                  <svg aria-hidden className="absolute inset-0 h-full w-full opacity-25"><rect width="100%" height="100%" fill="url(#ct-tile)" /></svg>
                  <span className={`relative text-[17px] ${display.className}`} style={{ color: C.cream }}>{i + 1}</span>
                </span>
                <p className={`text-[17px] leading-[1.7] ${body.className}`} style={{ color: C.ink }}><NavText content={step} linkClassName={LINK} onNavigate={onNavigate} /></p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-16">
        <Eyebrow>Cook something near it</Eyebrow>
        <h2 className={`mt-2 mb-5 text-[clamp(1.6rem,3.4vw,2.2rem)] ${display.className}`} style={{ color: C.cobalt }}>More from the table</h2>
        <Filmstrip ariaLabel="Related recipes" arrowStyle={{ backgroundColor: C.cobalt, color: C.cream }}>
          {d.related.map((r) => (
            <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[230px] shrink-0 snap-start text-left">
              <div className="overflow-hidden rounded-xl transition-transform group-hover:-translate-y-1" style={{ backgroundColor: C.cream, boxShadow: `0 0 0 1.5px ${C.cobalt}22, 0 14px 30px -24px rgba(22,50,79,0.5)` }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={r.img} alt={r.title} fill sizes="230px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-3 py-2.5">
                  <Eyebrow color={C.olive}>{r.country}</Eyebrow>
                  <h3 className={`mt-1 text-[17px] leading-snug ${display.className}`} style={{ color: C.cobalt }}>{r.title}</h3>
                </div>
              </div>
            </button>
          ))}
        </Filmstrip>
      </div>
    </article>
  );
}

/* ── entry ───────────────────────────────────────────────────────────────── */

export default function Courtyard({ screen }: { screen: 'home' | 'recipe' }) {
  const { msg, fire } = useNavFlash();
  return (
    <div className={body.className} style={{ backgroundColor: C.cream, color: C.ink }}>
      <TileDefs />
      <BoldNav onNavigate={fire} />
      {screen === 'home' ? <Home onNavigate={fire} /> : <Recipe onNavigate={fire} />}
      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-8 sm:px-10" style={{ backgroundColor: C.cobalt }}>
        <span className={`text-[20px] ${display.className}`} style={{ color: C.cream }}>Nieves’s <span className="italic" style={{ color: C.brass }}>Kitchen</span></span>
        <span className={`text-[13px] ${body.className}`} style={{ color: C.brass }}>Recipes from around the world, cooked at home.</span>
      </footer>
      <NavFlash msg={msg} className={body.className} style={{ backgroundColor: C.cobalt, color: C.cream }} />
    </div>
  );
}
