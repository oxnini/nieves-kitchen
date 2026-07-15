'use client';

import Image from 'next/image';
import { Caveat, Fraunces, Karla } from 'next/font/google';
import {
  INK_ART,
  SAMPLE_COLLECTIONS,
  SAMPLE_RECIPES,
  TURKISH_EGGS_DETAIL,
  type NavTo,
} from './content';
import { Filmstrip, NavFlash, NavText, useNavFlash } from './shared';

/**
 * Direction 1 — "Sunwashed".
 * Illustrative and warm (not sparse). Built from the user's own palette swatch,
 * the watercolor tangerine postcards, and the sun-drenched Mediterranean tables.
 * Signature: the arched "sun-window" frame + a sunburst, with two-tone ink
 * pantry art standing in for photography. Everything is scoped here.
 */

const display = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const body = Karla({ subsets: ['latin'], weight: ['400', '500', '700'] });
const hand = Caveat({ subsets: ['latin'], weight: ['400', '600'] });

const C = {
  cream: '#F0EAD8',
  creamDeep: '#E7DDC4',
  sage: '#99ABA6',
  sageDeep: '#7C8F8A',
  chamomile: '#D2BF81',
  olive: '#6F6C43',
  burgundy: '#5A0A28',
  ink: '#3B3426',
};

const LINK =
  'font-medium text-[#5A0A28] underline decoration-[#D2BF81] decoration-2 underline-offset-[3px] rounded px-[1px] transition-colors hover:bg-[#D2BF81]/40';

/* ── signature: sunburst + arched window ─────────────────────────────────── */

function Sunburst({ className = '', color = C.chamomile }: { className?: string; color?: string }) {
  const rays = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <g transform="translate(100 100)">
        {rays.map((_, i) => (
          <rect
            key={i}
            x={-1.4}
            y={-100}
            width={2.8}
            height={44}
            fill={color}
            opacity={0.55}
            transform={`rotate(${(360 / rays.length) * i})`}
          />
        ))}
      </g>
    </svg>
  );
}

function SunWindow({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 90vw, 460px',
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Sunburst className="absolute -top-8 left-1/2 h-[140%] w-[120%] -translate-x-1/2 opacity-70" />
      <div
        className="relative overflow-hidden rounded-t-full rounded-b-[26px] ring-1"
        style={{ boxShadow: '0 22px 44px -26px rgba(90,10,40,0.5)', borderColor: `${C.olive}55` }}
      >
        <div className="relative aspect-[4/5]">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[26px] ring-2 ring-inset" style={{ borderColor: 'transparent', boxShadow: `inset 0 0 0 6px ${C.cream}` }} />
      </div>
    </div>
  );
}

function Scallop({ color = C.chamomile }: { color?: string }) {
  return (
    <div
      aria-hidden
      className="h-3 w-full"
      style={{
        backgroundImage: `radial-gradient(circle at 10px 0, ${color} 8px, transparent 9px)`,
        backgroundSize: '20px 12px',
        backgroundRepeat: 'repeat-x',
      }}
    />
  );
}

/* ── shared bits ─────────────────────────────────────────────────────────── */

function Eyebrow({ children, color = C.burgundy }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`text-[12px] font-bold tracking-[0.2em] uppercase ${body.className}`} style={{ color }}>
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
      <span className={`text-[26px] leading-none ${display.className}`} style={{ color: C.burgundy }}>
        Nieves’s <span className="italic">Kitchen</span>
      </span>
      <nav className="flex items-center gap-1">
        {nav.map((n) => (
          <button
            key={n.label}
            type="button"
            onClick={() => onNavigate(n.to)}
            className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors hover:bg-[#99ABA6]/25 ${body.className}`}
            style={{ color: C.ink }}
          >
            {n.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onNavigate({ kind: 'recipes' })}
          className={`ml-2 rounded-full px-4 py-2 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5 ${body.className}`}
          style={{ backgroundColor: C.burgundy }}
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
      <section className="grid items-center gap-10 px-6 pt-4 pb-16 sm:px-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <Eyebrow>Halal home cooking · from every shore</Eyebrow>
          <h1 className={`mt-4 text-[clamp(2.6rem,6vw,4.3rem)] leading-[0.98] ${display.className}`} style={{ color: C.burgundy }}>
            Cook your way <span className="italic" style={{ color: C.olive }}>around</span> the table.
          </h1>
          <p className={`mt-5 max-w-md text-[17px] leading-relaxed ${body.className}`} style={{ color: C.ink }}>
            Recipes gathered from harbours, markets and kitchens around the world, then tested at one
            small table. Warm, honest, and always halal.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ kind: 'recipes' })}
              className={`rounded-full px-6 py-3 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5 ${body.className}`}
              style={{ backgroundColor: C.burgundy }}
            >
              Browse recipes
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ kind: 'atlas' })}
              className={`rounded-full px-6 py-3 text-[15px] font-bold transition-colors ${body.className}`}
              style={{ color: C.burgundy, boxShadow: `inset 0 0 0 2px ${C.burgundy}` }}
            >
              Open the atlas
            </button>
          </div>
          <p className={`mt-6 text-[22px] ${hand.className}`} style={{ color: C.sageDeep }}>
            — from my kitchen to yours
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <SunWindow src={SAMPLE_RECIPES[0].img} alt={SAMPLE_RECIPES[0].title} priority />
          {/* warm floating ink spots keep it populated, not sparse */}
          <div className="absolute -left-6 -bottom-4 h-24 w-24 rotate-[-8deg] rounded-full p-3" style={{ backgroundColor: C.cream, boxShadow: '0 10px 26px -14px rgba(0,0,0,0.4)' }}>
            <div className="relative h-full w-full">
              <Image src="/pantry/honey.webp" alt="Honey, ink drawing" fill sizes="96px" className="object-contain" />
            </div>
          </div>
          <div className="absolute -right-4 top-6 h-20 w-20 rotate-[10deg] rounded-full p-2.5" style={{ backgroundColor: C.chamomile }}>
            <div className="relative h-full w-full">
              <Image src="/pantry/garlic.webp" alt="Garlic, ink drawing" fill sizes="80px" className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      <Scallop />

      {/* Filmstrip */}
      <section className="px-6 py-14 sm:px-10" style={{ backgroundColor: C.creamDeep }}>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>This week at the table</Eyebrow>
            <h2 className={`mt-2 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight ${display.className}`} style={{ color: C.burgundy }}>
              Fresh out of the oven
            </h2>
          </div>
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`shrink-0 text-[14px] font-bold underline underline-offset-4 ${body.className}`} style={{ color: C.olive }}>
            See all →
          </button>
        </div>

        <Filmstrip ariaLabel="Browse recipes" arrowStyle={{ backgroundColor: C.cream, color: C.burgundy }}>
          {SAMPLE_RECIPES.map((r) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })}
              className="group w-[260px] shrink-0 snap-start text-left sm:w-[300px]"
            >
              <div className="overflow-hidden rounded-[22px] p-3 transition-transform group-hover:-translate-y-1" style={{ backgroundColor: C.cream, boxShadow: '0 16px 34px -24px rgba(90,10,40,0.6)' }}>
                <div className="relative overflow-hidden rounded-t-full rounded-b-[18px]">
                  <div className="relative aspect-[4/5]">
                    <Image src={r.img} alt={r.title} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                </div>
                <div className="px-1 pt-3 pb-1">
                  <Eyebrow color={C.olive}>{r.country} · {r.timeTotal}</Eyebrow>
                  <h3 className={`mt-1 text-[20px] leading-snug ${display.className}`} style={{ color: C.burgundy }}>
                    {r.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
          {/* end-of-shelf CTA card */}
          <button
            type="button"
            onClick={() => onNavigate({ kind: 'recipes' })}
            className="grid w-[200px] shrink-0 snap-start place-items-center rounded-[22px] text-center transition-transform hover:-translate-y-1"
            style={{ backgroundColor: C.sage, color: C.cream }}
          >
            <div className="px-6">
              <div className={`text-[40px] leading-none ${display.className}`}>↝</div>
              <p className={`mt-3 text-[16px] font-bold ${body.className}`}>Browse all recipes</p>
            </div>
          </button>
        </Filmstrip>
      </section>

      {/* Atlas + Pantry split */}
      <section className="grid gap-6 px-6 py-16 sm:px-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-[28px] p-8 sm:p-10" style={{ backgroundColor: C.sage }}>
          <Sunburst className="absolute -right-16 -top-16 h-64 w-64 opacity-40" color={C.cream} />
          <Eyebrow color={C.cream}>The atlas</Eyebrow>
          <h2 className={`mt-3 max-w-sm text-[clamp(1.7rem,3.5vw,2.4rem)] leading-tight ${display.className}`} style={{ color: '#26332F' }}>
            Every country waits to be cooked.
          </h2>
          <p className={`mt-3 max-w-sm text-[15.5px] leading-relaxed ${body.className}`} style={{ color: '#2C3A36' }}>
            Spin the map, pick a shore, and let dinner decide where you travel tonight. Cook from a
            place and it lights up on your journey.
          </p>
          <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className={`mt-6 rounded-full bg-white/90 px-5 py-2.5 text-[14px] font-bold ${body.className}`} style={{ color: C.burgundy }}>
            Open the map →
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[28px] p-8 sm:p-10" style={{ backgroundColor: C.chamomile }}>
          <Eyebrow color={C.burgundy}>The pantry</Eyebrow>
          <h2 className={`mt-3 max-w-sm text-[clamp(1.7rem,3.5vw,2.4rem)] leading-tight ${display.className}`} style={{ color: C.burgundy }}>
            Drawn in ink, kept in jars.
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {INK_ART.slice(0, 5).map((a) => (
              <button
                key={a.slug}
                type="button"
                onClick={() => onNavigate({ kind: 'pantry', slug: a.slug })}
                className="grid h-20 w-20 place-items-center rounded-2xl p-2.5 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: C.cream }}
                title={a.label}
              >
                <div className="relative h-full w-full">
                  <Image src={a.src} alt={`${a.label}, ink drawing`} fill sizes="80px" className="object-contain" />
                </div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onNavigate({ kind: 'pantry', slug: 'honey' })} className={`mt-6 text-[14px] font-bold underline underline-offset-4 ${body.className}`} style={{ color: C.burgundy }}>
            Open the pantry →
          </button>
        </div>
      </section>

      {/* Collections */}
      <section className="px-6 pb-20 sm:px-10">
        <Eyebrow>Ways in</Eyebrow>
        <h2 className={`mt-2 mb-6 text-[clamp(1.7rem,3.5vw,2.4rem)] ${display.className}`} style={{ color: C.burgundy }}>
          Pick a lens
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_COLLECTIONS.map((col, i) => (
            <button
              key={col.slug}
              type="button"
              onClick={() => onNavigate({ kind: 'collection', slug: col.slug })}
              className="rounded-[22px] p-6 text-left transition-transform hover:-translate-y-1"
              style={{ backgroundColor: [C.cream, C.creamDeep, C.cream, C.creamDeep][i], boxShadow: `inset 0 0 0 2px ${C.olive}22` }}
            >
              <p className={`text-[13px] font-bold ${body.className}`} style={{ color: C.olive }}>{col.count} recipes</p>
              <h3 className={`mt-2 text-[20px] leading-snug ${display.className}`} style={{ color: C.burgundy }}>{col.title}</h3>
              <p className={`mt-2 text-[14px] ${body.className}`} style={{ color: C.ink }}>{col.blurb}</p>
            </button>
          ))}
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
      <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`mt-2 mb-8 text-[14px] font-bold ${body.className}`} style={{ color: C.olive }}>
        ← Back to the kitchen
      </button>

      <div className="grid items-start gap-10 md:grid-cols-[1fr_0.85fr]">
        <div>
          <button type="button" onClick={() => onNavigate({ kind: 'atlas', country: d.recipe.country })} className={`${body.className}`}>
            <Eyebrow>{d.recipe.country} · {d.recipe.region}</Eyebrow>
          </button>
          <h1 className={`mt-3 text-[clamp(2.4rem,5vw,3.6rem)] leading-[1] ${display.className}`} style={{ color: C.burgundy }}>
            {d.recipe.title}
          </h1>
          <div className={`mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[14px] ${body.className}`} style={{ color: C.ink }}>
            <span><strong>Total</strong> {d.recipe.timeTotal}</span>
            <span><strong>Active</strong> {d.recipe.timeActive}</span>
            <span><strong>Serves</strong> {d.recipe.serves}</span>
          </div>
          <p className={`mt-6 text-[18px] leading-[1.7] ${body.className}`} style={{ color: C.ink }}>
            <span className={`float-left mr-3 mt-1 text-[64px] leading-[0.72] ${display.className}`} style={{ color: C.olive }}>
              {d.intro[0] && typeof d.intro[0] === 'string' ? d.intro[0].charAt(0) : 'A'}
            </span>
            <NavText content={[typeof d.intro[0] === 'string' ? d.intro[0].slice(1) : '', ...d.intro.slice(1)]} linkClassName={LINK} onNavigate={onNavigate} />
          </p>
          <p className={`mt-4 text-[19px] ${hand.className}`} style={{ color: C.sageDeep }}>
            Tap anything underlined — the writing is the map.
          </p>
        </div>

        <SunWindow src={d.gallery[0].src} alt={d.gallery[0].caption} className="mx-auto w-full max-w-[360px]" priority />
      </div>

      <Scallop />

      <div className="mt-12 grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        {/* Ingredients */}
        <div>
          <h2 className={`text-[26px] ${display.className}`} style={{ color: C.burgundy }}>Ingredients</h2>
          {d.ingredients.map((grp) => (
            <div key={grp.group} className="mt-5">
              <Eyebrow color={C.olive}>{grp.group}</Eyebrow>
              <ul className="mt-3 space-y-2.5">
                {grp.items.map((item, i) => (
                  <li key={i} className={`flex gap-3 text-[16px] leading-snug ${body.className}`} style={{ color: C.ink }}>
                    <span aria-hidden style={{ color: C.chamomile }}>◆</span>
                    <span><NavText content={item} linkClassName={LINK} onNavigate={onNavigate} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Method */}
        <div>
          <h2 className={`text-[26px] ${display.className}`} style={{ color: C.burgundy }}>Method</h2>
          <ol className="mt-5 space-y-6">
            {d.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[16px] font-bold ${display.className}`} style={{ backgroundColor: C.burgundy, color: C.cream }}>
                  {i + 1}
                </span>
                <p className={`text-[17px] leading-[1.7] ${body.className}`} style={{ color: C.ink }}>
                  <NavText content={step} linkClassName={LINK} onNavigate={onNavigate} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Related — quick discovery */}
      <div className="mt-16">
        <Eyebrow>Cook something near it</Eyebrow>
        <h2 className={`mt-2 mb-5 text-[clamp(1.6rem,3.4vw,2.2rem)] ${display.className}`} style={{ color: C.burgundy }}>
          More from the table
        </h2>
        <Filmstrip ariaLabel="Related recipes" arrowStyle={{ backgroundColor: C.cream, color: C.burgundy }}>
          {d.related.map((r) => (
            <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[220px] shrink-0 snap-start text-left">
              <div className="overflow-hidden rounded-[20px] p-2.5" style={{ backgroundColor: C.cream, boxShadow: '0 14px 30px -22px rgba(90,10,40,0.6)' }}>
                <div className="relative overflow-hidden rounded-t-full rounded-b-[16px]">
                  <div className="relative aspect-[4/5]">
                    <Image src={r.img} alt={r.title} fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                </div>
                <div className="px-1 pt-2.5 pb-1">
                  <Eyebrow color={C.olive}>{r.country}</Eyebrow>
                  <h3 className={`mt-1 text-[17px] leading-snug ${display.className}`} style={{ color: C.burgundy }}>{r.title}</h3>
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

export default function Sunwashed({ screen }: { screen: 'home' | 'recipe' }) {
  const { msg, fire } = useNavFlash();
  return (
    <div className={body.className} style={{ backgroundColor: C.cream, color: C.ink }}>
      <TopBar onNavigate={fire} />
      {screen === 'home' ? <Home onNavigate={fire} /> : <Recipe onNavigate={fire} />}
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 px-6 py-8 sm:px-10" style={{ backgroundColor: C.creamDeep }}>
        <span className={`text-[20px] ${display.className}`} style={{ color: C.burgundy }}>Nieves’s Kitchen</span>
        <span className={`text-[13px] ${body.className}`} style={{ color: C.olive }}>Cooked by the sea, seasoned by the world.</span>
      </footer>
      <NavFlash msg={msg} className={body.className} style={{ backgroundColor: C.burgundy, color: C.cream }} />
    </div>
  );
}
