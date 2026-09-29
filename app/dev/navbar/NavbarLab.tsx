'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Heart, Menu, Moon, Search, Sun } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';
import { initTheme, setTheme, useIsSepia } from '@/hooks/useTheme';
import { Choice, Group, Slider } from '../hero-viewport/controls';
import { Ribbon, SearchLoupe } from '@/components/NavIcons';
import { HalfDisc, HeartAlmond, MoonFine, SearchEngraved, SunFine } from './icons';

/**
 * A replica of components/Navbar.tsx with its right-hand cluster and band
 * height opened up as knobs. The real navbar is hidden on this page (it is
 * mounted in the root layout) and --nav-h is overridden to the lab height so
 * the hero and <main> padding follow it, exactly as they would in production.
 * Search and favourites don't navigate here; the theme control is real.
 * Settings persist in localStorage for this viewer only.
 */

const STORE = 'nieves-lab-navbar-v2';

type Cluster = 'icons' | 'words' | 'field' | 'capsule';
type Count = 'super' | 'inline' | 'badge' | 'dot' | 'none';
type ThemeCtl = 'icon' | 'switch' | 'word';
type Marker = 'edge' | 'text' | 'dot' | 'none';
type Direction = 'mine' | 'current' | 'A' | 'B' | 'C' | 'D';
type LinkFont = 'body' | 'serif' | 'serif-italic' | 'caps';
type SearchIcon = 'lucide' | 'loupe' | 'engraved';
type FavIcon = 'heart' | 'almond' | 'ribbon';
type ThemeIcon = 'sunmoon' | 'fine' | 'half';

type Settings = {
  direction: Direction;
  backdrop: 'home' | 'page';
  active: string;
  height: number;
  wordmark: number;
  linkSize: number;
  linkGap: number;
  linkWeight: number;
  marker: Marker;
  cluster: Cluster;
  iconSize: number;
  stroke: number;
  iconInk: 'dark' | 'medium';
  iconGap: number;
  hover: 'fill' | 'ink';
  count: Count;
  theme: ThemeCtl;
  divider: 'on' | 'off';
  fakeCount: number;
  linkFont: LinkFont;
  tracking: number;
  activeColour: 'terracotta' | 'teal' | 'ink';
  activeWeight: number;
  searchIcon: SearchIcon;
  favIcon: FavIcon;
  themeIcon: ThemeIcon;
};

const CURRENT: Omit<Settings, 'direction' | 'backdrop' | 'active' | 'fakeCount'> = {
  height: 88, wordmark: 32, linkSize: 16, linkGap: 28, linkWeight: 450, marker: 'edge',
  cluster: 'icons', iconSize: 22, stroke: 2.4, iconInk: 'dark', iconGap: 0, hover: 'fill',
  count: 'super', theme: 'icon', divider: 'off',
  linkFont: 'body', tracking: 0, activeColour: 'ink', activeWeight: 450,
  searchIcon: 'lucide', favIcon: 'heart', themeIcon: 'sunmoon',
};

/* Pasted back by the user 2026-09-29, plus colour-and-weight for the active page. */
const MINE: Partial<Settings> = {
  height: 82, wordmark: 29, linkSize: 15.5, linkGap: 36, linkWeight: 500, marker: 'none',
  cluster: 'field', iconSize: 19, stroke: 1.9, iconInk: 'dark', iconGap: 4, hover: 'ink',
  count: 'badge', theme: 'icon', divider: 'off',
  linkFont: 'body', tracking: 0, activeColour: 'terracotta', activeWeight: 650,
  searchIcon: 'lucide', favIcon: 'heart', themeIcon: 'sunmoon',
};

/* The directions. Each is a starting point; every knob stays live. */
const DIRECTIONS: Record<Direction, { name: string; blurb: string; s: Partial<Settings> }> = {
  mine: { name: 'Yours', blurb: 'Your picked settings (search field, badge count), with the active page in terracotta and a step bolder.', s: MINE },
  current: { name: 'Today', blurb: 'What ships now, for comparison.', s: CURRENT },
  A: {
    name: 'A · Quiet ink',
    blurb: 'Same three icons, drawn like the type: thinner, smaller, a step lighter, darkening on hover. The count becomes a plain numeral. A hairline separates pages from tools.',
    s: {
      height: 72, wordmark: 28, linkSize: 15.5, linkGap: 28, linkWeight: 450, marker: 'edge',
      cluster: 'icons', iconSize: 19, stroke: 1.6, iconInk: 'medium', iconGap: 6, hover: 'ink',
      count: 'inline', theme: 'icon', divider: 'on',
    },
  },
  B: {
    name: 'B · Words, not icons',
    blurb: 'The tools set as small type, like a book’s running head: “Search”, “Saved 3”, “Night”. Nothing on the right looks like an app button.',
    s: {
      height: 72, wordmark: 28, linkSize: 15.5, linkGap: 28, linkWeight: 450, marker: 'text',
      cluster: 'words', iconSize: 15, stroke: 1.75, iconInk: 'medium', iconGap: 20, hover: 'ink',
      count: 'inline', theme: 'word', divider: 'on',
    },
  },
  C: {
    name: 'C · Search field',
    blurb: 'Search becomes a quiet rounded field, the same pill as the recipes search bar and filters. Heart and theme stay as two thin icons beside it.',
    s: {
      height: 72, wordmark: 28, linkSize: 15.5, linkGap: 28, linkWeight: 450, marker: 'edge',
      cluster: 'field', iconSize: 18, stroke: 1.6, iconInk: 'medium', iconGap: 4, hover: 'ink',
      count: 'badge', theme: 'icon', divider: 'off',
    },
  },
  D: {
    name: 'D · Capsule',
    blurb: 'The three tools gathered in one hairline capsule with ruled separators, so they read as a single instrument rather than three loose glyphs. Theme is a small sun/moon switch.',
    s: {
      height: 68, wordmark: 27, linkSize: 15, linkGap: 26, linkWeight: 450, marker: 'dot',
      cluster: 'capsule', iconSize: 17, stroke: 1.6, iconInk: 'medium', iconGap: 2, hover: 'ink',
      count: 'inline', theme: 'switch', divider: 'off',
    },
  },
};

const DEFAULTS: Settings = {
  direction: 'mine', backdrop: 'page', active: '/journal', fakeCount: 7,
  ...CURRENT, ...MINE,
} as Settings;

/* Nav link type. Newsreader sets smaller than Hanken at the same px, so the
   serif options get a size lift to match the x-height. */
const LINK_FONTS: Record<LinkFont, { cls: string; scale: number; label: string }> = {
  body:           { cls: 'font-body',                                  scale: 1,    label: 'Hanken (today)' },
  serif:          { cls: 'font-heading',                               scale: 1.12, label: 'Newsreader' },
  'serif-italic': { cls: 'font-heading italic',                        scale: 1.12, label: 'Newsreader italic' },
  caps:           { cls: 'font-body uppercase',                        scale: 0.8,  label: 'Hanken caps' },
};

const ACTIVE_INK: Record<Settings['activeColour'], string> = {
  terracotta: 'text-terracotta', teal: 'text-teal', ink: 'text-brown-dark',
};

const LINKS = [
  { href: '/recipes', label: 'Recipes' },
  { href: '/atlas',   label: 'Atlas'   },
  { href: '/pantry',  label: 'Pantry'  },
  { href: '/journal', label: 'Journal' },
  { href: '/about',   label: 'About'   },
] as const;

/* ---------- the navbar replica ---------- */

function LabNavbar({ s, clear }: { s: Settings; clear: boolean }) {
  const [favorites] = useFavorites();
  const count = s.fakeCount >= 0 ? s.fakeCount : favorites.size;
  const sepia = useIsSepia();

  const ink = s.iconInk === 'dark' ? 'text-brown-dark' : 'text-brown-medium';
  const hover = s.hover === 'fill' ? 'hover:bg-brown-light/15' : 'hover:text-brown-dark';
  const btn = `relative inline-flex items-center justify-center min-w-9 h-9 rounded-full ${ink} ${hover} transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal`;
  const icon = { size: s.iconSize, strokeWidth: s.stroke, 'aria-hidden': true } as const;
  const inert = (e: React.MouseEvent) => e.preventDefault();
  const toggleTheme = () => setTheme(sepia ? 'parchment' : 'sepia');
  const font = LINK_FONTS[s.linkFont];
  const linkPx = s.linkSize * font.scale;
  const wordSize = Math.max(13, linkPx - 1.5);
  const wordCls = `${ink} hover:text-brown-dark ${font.cls} transition-colors`;

  const searchGlyph = (size = s.iconSize) => {
    const p = { size, strokeWidth: s.stroke };
    if (s.searchIcon === 'loupe') return <SearchLoupe {...p} />;
    if (s.searchIcon === 'engraved') return <SearchEngraved {...p} />;
    return <Search {...p} aria-hidden />;
  };
  const favGlyph = () => {
    const p = { size: s.iconSize, strokeWidth: s.stroke };
    if (s.favIcon === 'almond') return <HeartAlmond {...p} />;
    if (s.favIcon === 'ribbon') return <Ribbon {...p} />;
    return <Heart {...p} aria-hidden />;
  };
  const themeGlyph = (size = s.iconSize) => {
    const p = { size, strokeWidth: s.stroke };
    if (s.themeIcon === 'half') return <HalfDisc {...p} night={sepia} />;
    if (s.themeIcon === 'fine') return sepia ? <MoonFine {...p} /> : <SunFine {...p} />;
    return sepia ? <Moon {...p} aria-hidden /> : <Sun {...p} aria-hidden />;
  };

  const countEl = (inWords = false): ReactNode => {
    if (count <= 0 || s.count === 'none') return null;
    const n = count > 99 ? '99+' : String(count);
    if (inWords || s.count === 'inline')
      return <span aria-hidden className="ml-1 font-body text-[13px] tabular-nums text-brown-medium">{n}</span>;
    if (s.count === 'super')
      return <span aria-hidden className="font-stamp font-bold text-xs text-terracotta nums-tabular tracking-[0.04em] ml-0.5">{n}</span>;
    if (s.count === 'badge')
      return (
        <span aria-hidden className="absolute right-0 top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-terracotta px-1 font-body text-[10px] font-semibold leading-none text-cream tabular-nums">
          {n}
        </span>
      );
    return <span aria-hidden className="absolute right-1.5 top-1.5 h-[6px] w-[6px] rounded-full bg-terracotta" />;
  };

  const themeEl = (() => {
    if (s.theme === 'word')
      return (
        <button type="button" onClick={toggleTheme} className={wordCls} style={{ fontSize: wordSize }}>
          {sepia ? 'Day' : 'Night'}
        </button>
      );
    if (s.theme === 'switch') {
      const knob = Math.max(16, s.iconSize + 2);
      return (
        <button
          type="button" onClick={toggleTheme} aria-label="Toggle theme"
          className="relative mx-1 inline-flex items-center rounded-full ring-1 ring-line transition-colors hover:ring-brown-light"
          style={{ width: knob * 2 + 6, height: knob + 6, padding: 3 }}
        >
          <span
            className={`flex items-center justify-center rounded-full bg-parchment-dark ${ink} transition-transform duration-200`}
            style={{ width: knob, height: knob, transform: sepia ? `translateX(${knob}px)` : undefined }}
          >
            {themeGlyph(knob - 6)}
          </span>
        </button>
      );
    }
    return (
      <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className={btn}>
        {themeGlyph()}
      </button>
    );
  })();

  const heart = (
    <a href="/favorites" onClick={inert} aria-label="Favorites" className={`${btn} ${s.count === 'super' || s.count === 'inline' ? 'px-1' : ''}`}>
      {favGlyph()}
      {countEl()}
    </a>
  );

  let cluster: ReactNode;
  if (s.cluster === 'words') {
    cluster = (
      <div className="flex items-center" style={{ gap: s.iconGap }}>
        <a href="#" onClick={inert} className={`${wordCls} inline-flex items-center gap-1.5`} style={{ fontSize: wordSize }}>
          {searchGlyph()} Search
        </a>
        <a href="#" onClick={inert} className={`${wordCls} inline-flex items-baseline`} style={{ fontSize: wordSize }}>
          Saved{count > 0 && s.count !== 'none' ? <span className="ml-1 tabular-nums text-terracotta">{count > 99 ? '99+' : count}</span> : null}
        </a>
        {themeEl}
      </div>
    );
  } else if (s.cluster === 'field') {
    cluster = (
      <div className="flex items-center" style={{ gap: s.iconGap }}>
        <a
          href="#" onClick={inert}
          className={`mr-2 hidden h-9 w-[210px] items-center gap-2 rounded-full bg-surface/60 px-3.5 text-brown-medium ring-1 ring-line transition-colors hover:ring-brown-light sm:inline-flex ${s.linkFont === 'caps' ? 'font-body' : font.cls}`}
          style={{ fontSize: s.linkFont === 'body' || s.linkFont === 'caps' ? 14 : 15.5 }}
        >
          {searchGlyph(Math.min(s.iconSize, 17))}
          Search recipes
        </a>
        <a href="#" onClick={inert} aria-label="Search" className={`${btn} sm:hidden`}>{searchGlyph()}</a>
        {heart}
        {themeEl}
      </div>
    );
  } else if (s.cluster === 'capsule') {
    const rule = <span aria-hidden className="h-4 w-px bg-line" />;
    cluster = (
      <div className="flex items-center rounded-full bg-surface/50 px-1 ring-1 ring-line" style={{ gap: s.iconGap }}>
        <a href="#" onClick={inert} aria-label="Search" className={btn}>{searchGlyph()}</a>
        {rule}
        {heart}
        {rule}
        {themeEl}
      </div>
    );
  } else {
    cluster = (
      <div className="flex items-center" style={{ gap: s.iconGap }}>
        <a href="#" onClick={inert} aria-label="Search" className={btn}>{searchGlyph()}</a>
        {heart}
        {themeEl}
      </div>
    );
  }

  return (
    <nav
      aria-label="Primary (lab)"
      data-clear={clear ? 'true' : undefined}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ease-out ${
        clear ? 'bg-transparent' : 'bg-surface/95 backdrop-blur shadow-[0_1px_0_var(--color-line)]'
      }`}
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-10 flex items-center gap-3.5 lg:gap-9" style={{ minHeight: s.height }}>
        <a href="#" onClick={inert} className="min-w-0 rounded-sm">
          <span className="nav-wordmark block truncate font-heading font-[450] text-brown-dark leading-none tracking-[0.005em]" style={{ fontSize: s.wordmark }}>
            Nieves&#39;s <span className="italic">Kitchen</span>
          </span>
        </a>

        <ul className="hidden lg:flex self-stretch items-stretch" style={{ gap: s.linkGap }}>
          {LINKS.map(({ href, label }) => {
            const active = s.active === href;
            // The bold weight is reserved by an invisible copy stacked in the
            // same grid cell, so the active word never nudges its neighbours.
            return (
              <li key={href} className="flex">
                <a
                  href="#" onClick={inert}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center transition-colors ${font.cls} ${
                    active ? ACTIVE_INK[s.activeColour] : 'text-brown-dark'
                  }`}
                  style={{ fontSize: linkPx, letterSpacing: `${s.tracking / 100}em` }}
                >
                  <span className="inline-grid">
                    <span style={{ gridArea: '1 / 1', fontWeight: active ? s.activeWeight : s.linkWeight }}>{label}</span>
                    <span aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden', fontWeight: Math.max(s.activeWeight, s.linkWeight) }}>{label}</span>
                  </span>
                  {active && s.marker === 'edge' && (
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-terracotta" />
                  )}
                  {active && s.marker === 'text' && (
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 h-px bg-terracotta" style={{ top: `calc(50% + ${linkPx * 0.75}px)` }} />
                  )}
                  {active && s.marker === 'dot' && (
                    <span aria-hidden className="pointer-events-none absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-terracotta" style={{ top: `calc(50% + ${linkPx * 0.85}px)` }} />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center">
          {s.divider === 'on' && <span aria-hidden className="mr-5 hidden h-5 w-px bg-line lg:block" />}
          {cluster}
        </div>

        <button type="button" aria-label="Menu" className={`lg:hidden -ml-3 ${btn}`}>
          <Menu {...icon} />
        </button>
      </div>
    </nav>
  );
}

/* ---------- backdrops ---------- */

function InteriorPage() {
  return (
    <div className="mx-auto max-w-[1160px] px-5 sm:px-10 pt-10 pb-24">
      <p className="font-body text-[13px] uppercase tracking-[0.14em] text-brown-medium">The collection</p>
      <h1 className="mt-2 font-heading text-[44px] leading-[1.05] text-brown-dark sm:text-[56px]">All recipes</h1>
      <p className="mt-4 max-w-[60ch] font-body text-[17px] leading-relaxed text-brown-medium">
        A stand-in interior page so the band can be judged against real type: a heading at page scale,
        body copy, and the card grid below. Scroll to see the band over content.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-[6px] bg-surface ring-1 ring-line">
            <div className="aspect-[4/3] bg-parchment-dark" />
            <div className="p-4">
              <div className="font-heading text-[21px] text-brown-dark">Recipe title {i + 1}</div>
              <div className="mt-1 font-body text-[14px] text-brown-medium">Country · 45 min</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function useOverHero(active: boolean, navH: number) {
  const [over, setOver] = useState(active);
  useEffect(() => {
    if (!active) { setOver(false); return; }
    const update = () => {
      const hero = document.querySelector('[data-hero]');
      setOver(!!hero && hero.getBoundingClientRect().bottom > navH + 1);
    };
    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [active, navH]);
  return over;
}

/* ---------- panel + page ---------- */

export default function NavbarLab({ hero }: { hero: ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const sepia = useIsSepia();

  useEffect(() => {
    initTheme();
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) setS({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));
  const num = (k: keyof Settings) => (v: number) => set(k, v as never);
  const pick = (d: Direction) => setS((p) => ({ ...p, ...DIRECTIONS[d].s, direction: d }));

  const font = LINK_FONTS[s.linkFont];
  const home = s.backdrop === 'home';
  const clear = useOverHero(home, s.height) && home;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(s, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked */ }
  };

  const pill = 'rounded-full px-3 py-1.5 font-body text-[13.5px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]';
  const labCss = `
    nav[aria-label="Primary"] { display: none !important; }
    :root { --nav-h: ${s.height}px !important; }
  `;

  return (
    <>
      <style>{labCss}</style>
      <LabNavbar s={s} clear={clear} />

      {home ? (
        <>
          {hero}
          <div className="mx-auto max-w-[1160px] px-5 sm:px-10 py-24">
            <h2 className="font-heading text-[40px] text-brown-dark">Cook something new</h2>
            <div className="mt-6 h-[80vh] rounded-[6px] bg-surface ring-1 ring-line" />
          </div>
        </>
      ) : (
        <InteriorPage />
      )}

      {!open && (
        <button
          type="button" onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[80] rounded-full bg-surface px-4 py-2 font-body text-[14px] text-brown-dark ring-1 ring-line shadow-lg"
        >
          Lab controls
        </button>
      )}

      {open && (
        <aside
          aria-label="Lab controls"
          className="fixed inset-x-2 bottom-2 z-[80] max-h-[55svh] overflow-y-auto rounded-[6px] bg-surface p-5 ring-1 ring-line shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] lg:inset-x-auto lg:right-4 lg:bottom-4 lg:max-h-none lg:w-[330px]"
          style={{ top: undefined }}
        >
          <style>{`@media (min-width: 64rem) { aside[aria-label="Lab controls"] { top: ${s.height + 16}px; } }`}</style>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[22px] text-brown-dark">Navbar lab</h2>
            <button type="button" onClick={() => setOpen(false)} className={pill}>Hide</button>
          </div>

          <div className="mt-4 flex flex-col gap-5">
            <Group title="Direction">
              <Choice
                label="Start from"
                value={s.direction}
                options={(Object.keys(DIRECTIONS) as Direction[]).map((d) => [d, d === 'current' ? 'Today' : d === 'mine' ? 'Yours' : d])}
                onChange={pick}
              />
              <p className="-mt-1 font-body text-[13.5px] leading-snug text-brown-medium">
                <span className="text-brown-dark">{DIRECTIONS[s.direction].name}.</span> {DIRECTIONS[s.direction].blurb}
              </p>
            </Group>

            <Group title="Scene">
              <Choice label="Backdrop" value={s.backdrop} options={[['page', 'Interior page'], ['home', 'Home hero']]} onChange={(v) => set('backdrop', v)} hint={home ? 'Clear over the hero; scroll down for the band.' : undefined} />
              <Choice label="Theme" value={sepia ? 'sepia' : 'parchment'} options={[['parchment', 'Day'], ['sepia', 'Night']]} onChange={(v) => setTheme(v)} />
              <Choice label="Active page" value={s.active} options={[['', 'None'], ['/recipes', 'Recipes'], ['/journal', 'Journal']]} onChange={(v) => set('active', v)} />
              <Slider label="Favourites count" value={s.fakeCount} min={-1} max={120} onChange={num('fakeCount')} hint={s.fakeCount < 0 ? 'Using your real count.' : undefined} />
            </Group>

            <Group title="Band">
              <Slider label="Height" value={s.height} min={52} max={96} unit="px" onChange={num('height')} hint="Today: 88. Phones stay at 64 in production." />
              <Slider label="Wordmark" value={s.wordmark} min={20} max={34} unit="px" onChange={num('wordmark')} />
              <Slider label="Link gap" value={s.linkGap} min={16} max={44} unit="px" onChange={num('linkGap')} />
            </Group>

            <Group title="Link type">
              <Choice
                label="Font" value={s.linkFont}
                options={(Object.keys(LINK_FONTS) as LinkFont[]).map((k) => [k, LINK_FONTS[k].label])}
                onChange={(v) => setS((p) => ({ ...p, linkFont: v, tracking: v === 'caps' ? 8 : 0 }))}
                hint="The wordmark is Newsreader; links today are Hanken Grotesk, the body face. Serif options are sized up 12% so their x-height matches."
              />
              <Slider label="Size" value={s.linkSize} min={13} max={17} step={0.5} unit="px" onChange={num('linkSize')} hint={font.scale !== 1 ? `Renders at ${(s.linkSize * font.scale).toFixed(1)}px.` : undefined} />
              <Slider label="Weight" value={s.linkWeight} min={350} max={600} step={25} onChange={num('linkWeight')} />
              <Slider label="Letter spacing" value={s.tracking} min={-2} max={14} unit="/100 em" onChange={num('tracking')} />
            </Group>

            <Group title="Active page">
              <Choice label="Colour" value={s.activeColour} options={[['terracotta', 'Terracotta'], ['teal', 'Teal'], ['ink', 'Same as links']]} onChange={(v) => set('activeColour', v)} />
              <Slider label="Weight" value={s.activeWeight} min={350} max={750} step={25} onChange={num('activeWeight')} hint={`Links are ${s.linkWeight}. Reserved width, so nothing shifts.`} />
              <Choice label="Mark" value={s.marker} options={[['none', 'None'], ['edge', 'Band edge'], ['text', 'Under word'], ['dot', 'Dot']]} onChange={(v) => set('marker', v)} />
            </Group>

            <Group title="Icon drawings">
              <Choice label="Search" value={s.searchIcon} options={[['lucide', 'Lucide'], ['loupe', 'Loupe'], ['engraved', 'Engraved']]} onChange={(v) => set('searchIcon', v)} />
              <Choice label="Favourites" value={s.favIcon} options={[['heart', 'Lucide heart'], ['almond', 'Almond heart'], ['ribbon', 'Ribbon']]} onChange={(v) => set('favIcon', v)} />
              <Choice label="Theme" value={s.themeIcon} options={[['sunmoon', 'Lucide sun/moon'], ['fine', 'Fine sun/moon'], ['half', 'Half disc']]} onChange={(v) => set('themeIcon', v)} />
            </Group>

            <Group title="Right-hand tools">
              <Choice label="Arrangement" value={s.cluster} options={[['icons', 'Icons'], ['words', 'Words'], ['field', 'Search field'], ['capsule', 'Capsule']]} onChange={(v) => set('cluster', v)} />
              <Slider label="Icon size" value={s.iconSize} min={14} max={24} unit="px" onChange={num('iconSize')} />
              <Slider label="Stroke" value={s.stroke} min={1.1} max={2.5} step={0.1} onChange={num('stroke')} />
              <Slider label="Spacing" value={s.iconGap} min={0} max={28} unit="px" onChange={num('iconGap')} />
              <Choice label="Ink" value={s.iconInk} options={[['dark', 'Full ink'], ['medium', 'Lighter']]} onChange={(v) => set('iconInk', v)} />
              <Choice label="Hover" value={s.hover} options={[['fill', 'Round fill'], ['ink', 'Darken only']]} onChange={(v) => set('hover', v)} />
              <Choice label="Favourites count" value={s.count} options={[['super', 'Mono (today)'], ['inline', 'Numeral'], ['badge', 'Badge'], ['dot', 'Dot'], ['none', 'Hidden']]} onChange={(v) => set('count', v)} />
              <Choice label="Theme control" value={s.theme} options={[['icon', 'Icon'], ['switch', 'Switch'], ['word', 'Word']]} onChange={(v) => set('theme', v)} />
              <Choice label="Hairline before tools" value={s.divider} options={[['off', 'Off'], ['on', 'On']]} onChange={(v) => set('divider', v)} />
            </Group>

            <div className="flex gap-2 border-t border-line pt-4">
              <button type="button" onClick={copy} className={pill}>{copied ? 'Copied' : 'Copy settings'}</button>
              <button type="button" onClick={() => pick(s.direction)} className={pill}>Reset to {DIRECTIONS[s.direction].name.split(' ')[0]}</button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
