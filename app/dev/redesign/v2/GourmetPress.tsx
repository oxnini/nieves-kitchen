'use client';

import Image from 'next/image';
import { Anton, Figtree } from 'next/font/google';
import {
  INK_ART,
  SAMPLE_COLLECTIONS,
  SAMPLE_RECIPES,
  TURKISH_EGGS_DETAIL,
  type NavTo,
} from './content';
import { Filmstrip, NavFlash, NavText, useNavFlash } from './shared';

/**
 * Direction 3 — "Gourmet Press".
 * Loud editorial poster. Built from the GOURMET / SALADS covers and the
 * saturated food photography in the inspo folder. Signature: type as
 * architecture (oversized and vertical) laid over full-bleed photos, hard
 * colour blocks, and a filled press seal. Bold, direct, big tap targets.
 */

const display = Anton({ subsets: ['latin'], weight: '400' });
const body = Figtree({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });

const C = {
  cream: '#F3ECDD',
  creamDeep: '#E9DEC7',
  navy: '#141B34',
  coral: '#F2685E',
  marigold: '#E8A22B',
  emerald: '#1F6B4E',
  ink: '#141B34',
};

const LINK =
  'font-bold text-[#F2685E] underline decoration-[#E8A22B] decoration-2 underline-offset-2 rounded px-[1px] transition-colors hover:bg-[#E8A22B]/25';

/* ── signature: the press seal ───────────────────────────────────────────── */

function Seal({ size = 92, className = '', ring = C.cream, ink = C.navy }: { size?: number; className?: string; ring?: string; ink?: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className={className}>
      <circle cx="60" cy="60" r="58" fill={ink} />
      <circle cx="60" cy="60" r="47" fill="none" stroke={ring} strokeWidth="1.5" />
      <path id="gp-seal" d="M60 60 m -40 0 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0" fill="none" />
      <text fill={ring} className={body.className} style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2.6 }}>
        <textPath href="#gp-seal" startOffset="0">NIEVES’S KITCHEN · HALAL ALWAYS · </textPath>
      </text>
      <text x="60" y="72" textAnchor="middle" fill={C.coral} className={display.className} style={{ fontSize: 34 }}>NK</text>
    </svg>
  );
}

function Eyebrow({ children, color = C.coral }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`text-[13px] font-extrabold tracking-[0.24em] uppercase ${body.className}`} style={{ color }}>
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
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10" style={{ backgroundColor: C.navy }}>
      <span className={`text-[24px] tracking-wide ${display.className}`} style={{ color: C.cream }}>
        NIEVES’S <span style={{ color: C.coral }}>KITCHEN</span>
      </span>
      <nav className="flex items-center gap-1">
        {nav.map((n) => (
          <button key={n.label} type="button" onClick={() => onNavigate(n.to)} className={`rounded-sm px-3.5 py-1.5 text-[14px] font-bold uppercase tracking-wide transition-colors hover:bg-white/10 ${body.className}`} style={{ color: C.cream }}>
            {n.label}
          </button>
        ))}
        <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`ml-2 rounded-sm px-4 py-2 text-[13px] font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-0.5 ${body.className}`} style={{ backgroundColor: C.coral, color: C.navy }}>
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
      <section className="grid md:grid-cols-2" style={{ backgroundColor: C.navy }}>
        <div className="flex flex-col justify-center gap-6 px-6 py-14 sm:px-10 md:py-20">
          <Eyebrow color={C.marigold}>Halal home cooking · every shore</Eyebrow>
          <h1 className={`text-[clamp(3rem,8vw,6rem)] leading-[0.86] uppercase ${display.className}`} style={{ color: C.cream }}>
            A world<br />on your<br /><span style={{ color: C.coral }}>plate.</span>
          </h1>
          <p className={`max-w-md text-[17px] leading-relaxed ${body.className}`} style={{ color: `${C.cream}CC` }}>
            Bold recipes collected from harbours and markets around the world, tested at one small
            table, and written to be dead easy to follow.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`rounded-sm px-7 py-3.5 text-[15px] font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-0.5 ${body.className}`} style={{ backgroundColor: C.coral, color: C.navy }}>
              Browse recipes
            </button>
            <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className={`rounded-sm px-7 py-3.5 text-[15px] font-extrabold uppercase tracking-wide transition-colors ${body.className}`} style={{ color: C.cream, boxShadow: `inset 0 0 0 2px ${C.cream}` }}>
              Open the atlas
            </button>
          </div>
        </div>
        <div className="relative min-h-[340px]">
          <Image src={SAMPLE_RECIPES[0].img} alt={SAMPLE_RECIPES[0].title} fill sizes="(max-width:768px) 100vw, 50vw" priority className="object-cover" />
          <div className="absolute left-0 top-8 px-4 py-2" style={{ backgroundColor: C.marigold }}>
            <span className={`text-[13px] font-extrabold uppercase tracking-[0.2em] ${body.className}`} style={{ color: C.navy }}>This week</span>
          </div>
          <Seal className="absolute -bottom-8 -left-8 hidden md:block" size={104} ink={C.navy} ring={C.cream} />
        </div>
      </section>

      {/* Filmstrip — poster cards */}
      <section className="px-6 py-14 sm:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className={`text-[clamp(2.2rem,5vw,3.4rem)] uppercase leading-[0.9] ${display.className}`} style={{ color: C.navy }}>
            Out of<br />the oven
          </h2>
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`shrink-0 text-[14px] font-extrabold uppercase tracking-wide underline underline-offset-4 ${body.className}`} style={{ color: C.coral }}>All recipes →</button>
        </div>

        <Filmstrip ariaLabel="Browse recipes" arrowStyle={{ backgroundColor: C.navy, color: C.cream }}>
          {SAMPLE_RECIPES.map((r, i) => {
            const bar = [C.coral, C.marigold, C.emerald, C.navy][i % 4];
            return (
              <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[280px] shrink-0 snap-start text-left sm:w-[320px]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={r.img} alt={r.title} fill sizes="320px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,27,52,0.85), rgba(20,27,52,0) 55%)' }} />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="mb-2 inline-block px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ backgroundColor: bar, color: C.navy }}>{r.country} · {r.timeTotal}</span>
                    <h3 className={`text-[26px] uppercase leading-[0.92] ${display.className}`} style={{ color: C.cream }}>{r.title}</h3>
                  </div>
                </div>
              </button>
            );
          })}
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className="grid w-[220px] shrink-0 snap-start place-items-center text-center transition-transform hover:-translate-y-1" style={{ backgroundColor: C.coral, color: C.navy }}>
            <div className="px-6">
              <div className={`text-[52px] uppercase leading-none ${display.className}`}>→</div>
              <p className={`mt-2 text-[15px] font-extrabold uppercase tracking-wide ${body.className}`}>All recipes</p>
            </div>
          </button>
        </Filmstrip>
      </section>

      {/* Atlas — bold band */}
      <section className="px-6 py-4 sm:px-10">
        <button type="button" onClick={() => onNavigate({ kind: 'atlas' })} className="group flex w-full flex-col items-start gap-4 rounded-sm px-8 py-12 text-left sm:flex-row sm:items-center sm:justify-between sm:px-12" style={{ backgroundColor: C.emerald }}>
          <div>
            <Eyebrow color={C.marigold}>The atlas</Eyebrow>
            <h2 className={`mt-2 text-[clamp(2.2rem,5vw,3.6rem)] uppercase leading-[0.9] ${display.className}`} style={{ color: C.cream }}>
              195 countries.<br />One table.
            </h2>
          </div>
          <span className={`rounded-sm px-6 py-3 text-[15px] font-extrabold uppercase tracking-wide transition-transform group-hover:-translate-y-0.5 ${body.className}`} style={{ backgroundColor: C.cream, color: C.emerald }}>Open the map →</span>
        </button>
      </section>

      {/* Pantry + collections */}
      <section className="grid gap-4 px-6 py-10 sm:px-10 md:grid-cols-2">
        <div className="rounded-sm p-8" style={{ backgroundColor: C.navy }}>
          <Eyebrow color={C.marigold}>The pantry</Eyebrow>
          <h2 className={`mt-2 text-[clamp(1.8rem,4vw,2.6rem)] uppercase leading-[0.92] ${display.className}`} style={{ color: C.cream }}>Drawn in ink</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {INK_ART.slice(0, 5).map((a) => (
              <button key={a.slug} type="button" onClick={() => onNavigate({ kind: 'pantry', slug: a.slug })} className="grid h-20 w-20 place-items-center rounded-sm p-2.5 transition-transform hover:-translate-y-1" style={{ backgroundColor: C.cream }} title={a.label}>
                <div className="relative h-full w-full"><Image src={a.src} alt={`${a.label}, ink drawing`} fill sizes="80px" className="object-contain" /></div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onNavigate({ kind: 'pantry', slug: 'honey' })} className={`mt-6 text-[14px] font-extrabold uppercase tracking-wide underline underline-offset-4 ${body.className}`} style={{ color: C.coral }}>Open the pantry →</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SAMPLE_COLLECTIONS.map((col, i) => {
            const bg = [C.coral, C.marigold, C.emerald, C.creamDeep][i];
            const fg = i === 3 ? C.navy : i === 1 ? C.navy : C.cream;
            return (
              <button key={col.slug} type="button" onClick={() => onNavigate({ kind: 'collection', slug: col.slug })} className="rounded-sm p-5 text-left transition-transform hover:-translate-y-1" style={{ backgroundColor: bg, color: fg }}>
                <p className={`text-[12px] font-extrabold uppercase tracking-wide ${body.className}`} style={{ opacity: 0.8 }}>{col.count} recipes</p>
                <h3 className={`mt-2 text-[19px] uppercase leading-[0.95] ${display.className}`}>{col.title}</h3>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ── recipe (cookbook page) ──────────────────────────────────────────────── */

function Recipe({ onNavigate }: { onNavigate: (to: NavTo) => void }) {
  const d = TURKISH_EGGS_DETAIL;
  return (
    <article>
      {/* full-bleed hero */}
      <div className="relative min-h-[52vh]">
        <Image src={d.gallery[0].src} alt={d.gallery[0].caption} fill sizes="100vw" priority className="object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,27,52,0.92), rgba(20,27,52,0.15) 60%)' }} />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <button type="button" onClick={() => onNavigate({ kind: 'recipes' })} className={`mb-4 text-[13px] font-extrabold uppercase tracking-wide ${body.className}`} style={{ color: C.cream }}>← Back to the kitchen</button>
          <button type="button" onClick={() => onNavigate({ kind: 'atlas', country: d.recipe.country })} className="block"><Eyebrow color={C.marigold}>{d.recipe.country} · {d.recipe.region}</Eyebrow></button>
          <h1 className={`mt-2 max-w-4xl text-[clamp(2.6rem,8vw,5.5rem)] uppercase leading-[0.86] ${display.className}`} style={{ color: C.cream }}>{d.recipe.title}</h1>
        </div>
      </div>

      {/* meta blocks */}
      <div className="grid grid-cols-3">
        {[['Total', d.recipe.timeTotal, C.coral], ['Active', d.recipe.timeActive, C.marigold], ['Serves', d.recipe.serves, C.emerald]].map(([label, val, bg]) => (
          <div key={label as string} className="px-4 py-5 text-center" style={{ backgroundColor: bg as string, color: label === 'Active' ? C.navy : C.cream }}>
            <p className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${body.className}`} style={{ opacity: 0.85 }}>{label}</p>
            <p className={`text-[22px] uppercase ${display.className}`}>{val}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <p className={`mt-10 max-w-3xl text-[19px] leading-[1.7] ${body.className}`} style={{ color: C.ink }}>
          <NavText content={d.intro} linkClassName={LINK} onNavigate={onNavigate} />
        </p>
        <p className={`mt-3 text-[13px] font-extrabold uppercase tracking-wide ${body.className}`} style={{ color: C.emerald }}>
          Coloured words are links — tap one to jump.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className={`text-[30px] uppercase ${display.className}`} style={{ color: C.navy }}>Ingredients</h2>
            {d.ingredients.map((grp) => (
              <div key={grp.group} className="mt-5">
                <Eyebrow color={C.coral}>{grp.group}</Eyebrow>
                <ul className="mt-3 space-y-2.5">
                  {grp.items.map((item, i) => (
                    <li key={i} className={`flex gap-3 text-[16px] leading-snug ${body.className}`} style={{ color: C.ink }}>
                      <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0" style={{ backgroundColor: C.marigold }} />
                      <span><NavText content={item} linkClassName={LINK} onNavigate={onNavigate} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className={`text-[30px] uppercase ${display.className}`} style={{ color: C.navy }}>Method</h2>
            <ol className="mt-5 space-y-6">
              {d.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center text-[22px] ${display.className}`} style={{ backgroundColor: [C.coral, C.marigold, C.emerald, C.navy][i % 4], color: i % 4 === 1 ? C.navy : C.cream }}>{i + 1}</span>
                  <p className={`pt-1 text-[17px] leading-[1.7] ${body.className}`} style={{ color: C.ink }}><NavText content={step} linkClassName={LINK} onNavigate={onNavigate} /></p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16">
          <h2 className={`mb-5 text-[clamp(1.8rem,4vw,2.6rem)] uppercase leading-[0.9] ${display.className}`} style={{ color: C.navy }}>More from<br />the table</h2>
          <Filmstrip ariaLabel="Related recipes" arrowStyle={{ backgroundColor: C.navy, color: C.cream }}>
            {d.related.map((r, i) => {
              const bar = [C.coral, C.marigold, C.emerald][i % 3];
              return (
                <button key={r.slug} type="button" onClick={() => onNavigate({ kind: 'recipe', slug: r.slug })} className="group w-[240px] shrink-0 snap-start text-left">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={r.img} alt={r.title} fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,27,52,0.85), rgba(20,27,52,0) 55%)' }} />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <span className="mb-1.5 inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ backgroundColor: bar, color: C.navy }}>{r.country}</span>
                      <h3 className={`text-[20px] uppercase leading-[0.92] ${display.className}`} style={{ color: C.cream }}>{r.title}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </Filmstrip>
        </div>
      </div>
    </article>
  );
}

/* ── entry ───────────────────────────────────────────────────────────────── */

export default function GourmetPress({ screen }: { screen: 'home' | 'recipe' }) {
  const { msg, fire } = useNavFlash();
  return (
    <div className={body.className} style={{ backgroundColor: C.cream, color: C.ink }}>
      <TopBar onNavigate={fire} />
      {screen === 'home' ? <Home onNavigate={fire} /> : <Recipe onNavigate={fire} />}
      <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-10 sm:px-10" style={{ backgroundColor: C.navy }}>
        <span className={`text-[28px] uppercase tracking-wide ${display.className}`} style={{ color: C.cream }}>NIEVES’S <span style={{ color: C.coral }}>KITCHEN</span></span>
        <span className={`text-[13px] font-bold uppercase tracking-wide ${body.className}`} style={{ color: C.marigold }}>Cooked by the sea, seasoned by the world.</span>
      </footer>
      <NavFlash msg={msg} className={body.className} style={{ backgroundColor: C.coral, color: C.navy }} />
    </div>
  );
}
