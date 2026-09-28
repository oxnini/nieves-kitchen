'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject, type UIEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button, RuleDiamond } from '@/components/courtyard';
import CookSomethingNew from '@/components/home/CookSomethingNew';
import WaysIn from '@/components/home/WaysIn';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetail from '@/components/RecipeDetail';
import IngredientGroupList from '@/components/recipe/IngredientGroupList';
import InstructionGroupList from '@/components/recipe/InstructionGroupList';
import PaperTexture from '@/components/passport/PaperTexture';
import JournalScrollView from '@/components/journal/JournalScrollView';
import JournalLog from '@/components/journal/JournalLog';
import { useRecipes } from '@/hooks/useRecipes';
import { setTheme, useIsSepia } from '@/hooks/useTheme';
import { buildDishCount, buildJournalEntries } from '@/lib/journal';
import { summarizeStamps } from '@/lib/passport';
import { recommendNextRecipes } from '@/lib/passport-recommend';
import { formatAmount } from '@/lib/units';
import { MOCK_RECIPES } from '@/lib/mock-recipes';
import type { Recipe } from '@/lib/types';
import { MANY, metaBySlug, countryToRegion, buildFixtureCancellations, FIXTURE_RECIPES } from '../journal/fixtures';
import { Choice, Group, Slider } from './controls';

/**
 * /dev/hero-viewport: topic 1 of the 2026-09-27 exploration, round 2.
 *  a. The home hero fills the screen. With the clear navbar it runs up
 *     behind the nav too (the nav goes transparent over a soft mist and
 *     turns back into the paper band once you scroll).
 *  b. A faint frosted copy of the painting behind the whole site. Shipped
 *     (components/SiteGround.tsx): the lab now reads the same two baked
 *     WebPs in public/home/frost/, whose colour and brightness are already
 *     in the file, so Colour and Brightness here start at 100 and act on
 *     top of the bake. Extra blur and grain remain lab-only filters.
 *  c. The hero-to-page fade (plain, per theme) and navbar legibility over
 *     the painting (link/wordmark/icon size and weight, ink, halo).
 * Background, cards, panels, fade and mist have separate day and night
 * values (round 1 feedback: the same numbers read very differently in each
 * theme); the panel edits whichever theme is showing.
 * Real content sits on the ground so readability is judged on the real
 * thing. Settings persist in localStorage for this viewer only.
 */

const DAY = '/home/hero-courtyard.webp';
const DUSK = '/home/hero-courtyard-dusk.webp';
const ALT =
  'A painted tiled courtyard: an arch onto cypress trees and the sea, and a bowl of citrus and pomegranates';
const PHONE_H = 844;
const STORE = 'nieves-lab-hero-viewport-v3';

type Look = {
  mode: 'still' | 'scroll' | 'top'; detail: 48 | 96 | 192;
  blur: number; strength: number; tint: number; sat: number; bright: number; grain: number;
  cards: 'bare' | 'paper'; panels: 'solid' | 'see'; panelOpacity: number; glassBlur: number;
  fadeStyle: 'mask' | 'none'; fadeLen: number;
  mist: number; mistH: number;
};

type Settings = {
  view: 'laptop' | 'phone';
  heroH: number; hint: 'none' | 'arrow' | 'label'; lift: number;
  dayStrength: number; dayReach: number; dayY: number;
  nightStrength: number; nightReach: number; nightY: number; glowX: number;
  frost: 'on' | 'off'; topLen: number; nightSrc: 'dusk' | 'day';
  nav: 'clear' | 'band'; navSolid: 'hero' | 'soon';
  navApply: 'always' | 'clear'; navInk: 'full' | 'muted'; navSize: number; navWeight: number;
  markSize: number; markWeight: number; iconSize: number; iconStroke: number; navHalo: number;
  day: Look; night: Look;
};

/* Defaults are the user's round 2 settings (pasted 2026-09-27): plain fade
   (the soft-focus fade was tried and rejected), clear navbar, day and night
   looks. The nav legibility knobs are round 3 starting values; today's nav is
   links 15px / 400 in muted ink, wordmark 30px, icons 19px at 1.6 stroke. */
const DEFAULTS: Settings = {
  view: 'laptop',
  heroH: 100, hint: 'none', lift: 40,
  dayStrength: 85, dayReach: 66, dayY: 11,
  nightStrength: 81, nightReach: 88, nightY: 4, glowX: -15,
  frost: 'on', topLen: 50, nightSrc: 'dusk',
  nav: 'clear', navSolid: 'hero',
  navApply: 'always', navInk: 'full', navSize: 16, navWeight: 500,
  markSize: 30, markWeight: 450, iconSize: 21, iconStroke: 20, navHalo: 40,
  day: {
    mode: 'scroll', detail: 96, blur: 0, strength: 22, tint: 80, sat: 100, bright: 100, grain: 0,
    cards: 'bare', panels: 'solid', panelOpacity: 70, glassBlur: 12,
    fadeStyle: 'mask', fadeLen: 90, mist: 100, mistH: 210,
  },
  night: {
    mode: 'still', detail: 96, blur: 0, strength: 40, tint: 65, sat: 100, bright: 100, grain: 0,
    cards: 'bare', panels: 'see', panelOpacity: 70, glassBlur: 12,
    fadeStyle: 'mask', fadeLen: 340, mist: 60, mistH: 170,
  },
};

/* One-tap starting points across the range; every knob stays adjustable. */
const PRESETS: [string, string, Partial<Look>][] = [
  ['whisper', 'Whisper', { strength: 25, tint: 65, sat: 90, blur: 0 }],
  ['soft', 'Soft', { strength: 40, tint: 55, sat: 100, blur: 0 }],
  ['visible', 'Visible', { strength: 75, tint: 25, sat: 110, blur: 0 }],
];

const LAB_CSS = `
.lab-root { --nav: calc(4.5rem + env(safe-area-inset-top)); --vh: 100svh; }
@media (min-width: 40rem) { .lab-root { --nav: 5.5rem; } }
.lab-root.in-phone { --nav: 4.5rem; --vh: ${PHONE_H}px; }
.glow-night { display: none; }
[data-theme="sepia"] .glow-night { display: block; }
[data-theme="sepia"] .glow-day { display: none; }
/* RecipeDetail paints its own page colour; clear it so the ground shows. */
.frost-on .min-h-screen.bg-parchment { background-color: transparent; }
.see-through .bg-surface { backdrop-filter: blur(var(--glass)); -webkit-backdrop-filter: blur(var(--glass)); }
.cards-paper a.group.block { background: var(--color-surface); box-shadow: 0 0 0 1px var(--color-line); padding-bottom: 16px; }
.cards-paper a.group.block > div.min-w-0 { padding-inline: 16px; }
/* The real navbar, cleared while it sits over the painting. */
nav[aria-label="Primary"] { transition: transform 300ms ease-out, background-color 350ms ease, box-shadow 350ms ease, backdrop-filter 350ms ease; }
html.lab-nav-clear nav[aria-label="Primary"] { background-color: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
`;

/** Nav legibility overrides on the real navbar. Scoped to the clear state
 *  or applied always (a size jump when the band returns can feel jumpy). */
function navCss(s: Settings) {
  const n = s.navApply === 'clear' ? 'html.lab-nav-clear nav[aria-label="Primary"]' : 'nav[aria-label="Primary"]';
  const halo = s.navHalo / 100;
  const glowText = halo > 0 ? `text-shadow: 0 0 ${Math.round(4 + 10 * halo)}px color-mix(in srgb, var(--color-parchment) ${Math.round(halo * 100)}%, transparent);` : '';
  const glowIcon = halo > 0 ? `filter: drop-shadow(0 0 ${Math.round(2 + 5 * halo)}px color-mix(in srgb, var(--color-parchment) ${Math.round(halo * 100)}%, transparent));` : '';
  return `
${n} ul a { font-size: ${s.navSize}px; font-weight: ${s.navWeight}; ${s.navInk === 'full' ? 'color: var(--color-brown-dark);' : ''} ${glowText} }
${n} a[href="/"] > span { font-weight: ${s.markWeight}; ${glowText} }
@media (min-width: 40rem) { ${n} a[href="/"] > span { font-size: ${s.markSize}px; } }
${n} a[href="/"] > span > span { ${s.navInk === 'full' ? 'color: var(--color-brown-dark);' : ''} }
${n} svg { width: ${s.iconSize}px; height: ${s.iconSize}px; stroke-width: ${s.iconStroke / 10}; ${glowIcon} }
`;
}

const rs = (phone: boolean, base: string, wide: string) => (phone ? base : `${base} ${wide}`);

function glow(rgb: string, strength: number, reach: number, x: number, y: number, sc: number) {
  const k = strength / 100;
  const a = (n: number) => (n * k).toFixed(3);
  const px = (n: number) => `${Math.round(n * sc)}px`;
  return `radial-gradient(ellipse ${px(reach * 8)} ${px(reach * 6)} at calc(50% + ${px(x * 8)}) calc(50% + ${px(y * 6)}), rgb(${rgb} / ${a(0.95)}) 0%, rgb(${rgb} / ${a(0.8)}) 40%, rgb(${rgb} / ${a(0.36)}) 70%, rgb(${rgb} / 0) 100%)`;
}

/* The mist eases out on a smoothstep curve so it shows no line where it ends. */
const smooth = (t: number) => t * t * (3 - 2 * t);
const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => i / 8);

/** Page-colour mist from the top edge, eased out over `h` px. */
function mistGradient(strength: number, h: number) {
  const stops = STEPS.map((t) => `color-mix(in srgb, var(--color-parchment) ${((1 - smooth(t)) * strength).toFixed(1)}%, transparent) ${Math.round(h * t)}px`);
  return `linear-gradient(to bottom, ${stops.join(', ')})`;
}

const maskStyle = (m?: string): CSSProperties => (m ? { maskImage: m, WebkitMaskImage: m } : {});

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

/* ---------- tokens + contrast ---------- */

type RGB = [number, number, number];
const TOKENS = ['parchment', 'surface', 'line', 'brown-dark', 'brown-medium', 'teal'] as const;
type Tokens = Record<(typeof TOKENS)[number], RGB>;

function hex(h: string): RGB {
  const s = h.trim().replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as RGB;
}

function useTokens(sepia: boolean): Tokens | null {
  const [t, setT] = useState<Tokens | null>(null);
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const t = Object.fromEntries(TOKENS.map((k) => [k, hex(cs.getPropertyValue(`--color-${k}`))])) as Tokens;
    // Link text is not the teal token at night (.text-teal is lifted for
    // legibility), so measure what a real link renders as.
    const probe = document.createElement('span');
    probe.className = 'text-teal';
    document.body.appendChild(probe);
    const m = getComputedStyle(probe).color.match(/[\d.]+/g);
    probe.remove();
    if (m) t.teal = [Number(m[0]), Number(m[1]), Number(m[2])];
    setT(t);
  }, [sepia]);
  return t;
}

const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]: RGB) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/** Worst-case contrast of each ink over every pixel of the ground, using the
 *  same stack the page paints: paper, painting (saturate, brightness,
 *  opacity), then the page-colour tint. Extra blur only evens things out, so
 *  ignoring it keeps the number conservative. */
function useContrast(src: string, frost: boolean, l: Look, t: Tokens | null) {
  const [pixels, setPixels] = useState<Uint8ClampedArray | null>(null);
  useEffect(() => {
    let live = true;
    const img = new window.Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (!ctx || !live) return;
      ctx.drawImage(img, 0, 0);
      setPixels(ctx.getImageData(0, 0, c.width, c.height).data);
    };
    img.src = src;
    return () => { live = false; };
  }, [src]);

  return useMemo(() => {
    if (!t) return null;
    const inks = { body: t['brown-dark'], small: t['brown-medium'], link: t.teal };
    const worst = { body: Infinity, small: Infinity, link: Infinity };
    const paper = t.parchment;
    const test = (px: RGB) => {
      for (const k of Object.keys(inks) as (keyof typeof inks)[]) worst[k] = Math.min(worst[k], ratio(inks[k], px));
    };
    if (!frost || !pixels) { test(paper); return worst; }
    const sv = l.sat / 100, br = l.bright / 100, o = l.strength / 100, tn = l.tint / 100;
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
      const sr = (0.213 + 0.787 * sv) * r + (0.715 - 0.715 * sv) * g + (0.072 - 0.072 * sv) * b;
      const sg = (0.213 - 0.213 * sv) * r + (0.715 + 0.285 * sv) * g + (0.072 - 0.072 * sv) * b;
      const sb = (0.213 - 0.213 * sv) * r + (0.715 - 0.715 * sv) * g + (0.072 + 0.928 * sv) * b;
      const px = [sr, sg, sb].map((c, j) => {
        const p = Math.min(255, Math.max(0, c * br));
        const base = paper[j] * (1 - o) + p * o;
        return paper[j] * tn + base * (1 - tn);
      }) as RGB;
      test(px);
    }
    return worst;
  }, [pixels, frost, l.sat, l.bright, l.strength, l.tint, t]);
}

/* ---------- geometry ---------- */

/** Hero height. With the clear nav the hero starts at the very top of the
 *  screen (pulled up under the nav), so it is a share of the whole screen. */
const heroHeight = (s: Settings) =>
  s.nav === 'clear' ? `calc(var(--vh) * ${s.heroH / 100})` : `calc((var(--vh) - var(--nav)) * ${s.heroH / 100})`;

/** Where the hero ends, measured from the top of the lab content. */
const heroBottom = (s: Settings) =>
  s.nav === 'clear' ? `calc(var(--vh) * ${s.heroH / 100} - var(--nav))` : heroHeight(s);

const fadeLen = (l: Look) => (l.fadeStyle === 'none' ? 0 : l.fadeLen);

/* ---------- the frosted ground ---------- */

function GroundLayers({ l, src }: { l: Look; src: string }) {
  const pad = l.blur * 2 + 2;
  return (
    <>
      <div
        className="absolute"
        style={{
          inset: -pad,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `blur(${l.blur}px) saturate(${l.sat}%) brightness(${l.bright}%)`,
          opacity: l.strength / 100,
        }}
      />
      <div className="absolute inset-0 bg-parchment" style={{ opacity: l.tint / 100 }} />
      {l.grain > 0 && (
        <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: GRAIN, opacity: l.grain / 100 }} />
      )}
    </>
  );
}

function Ground({ s, l, src }: { s: Settings; l: Look; src: string }) {
  if (s.frost === 'off') return null;
  if (l.mode === 'still') {
    // Sticky inside an overflow-clip box: stays put while the page scrolls,
    // and never paints past the lab (clip does not make a scroll container).
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip">
        <div className="sticky top-0 h-[var(--vh)] overflow-hidden">
          <GroundLayers l={l} src={src} />
        </div>
      </div>
    );
  }
  if (l.mode === 'scroll') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GroundLayers l={l} src={src} />
      </div>
    );
  }
  const fade = 'linear-gradient(to bottom, #000 45%, transparent)';
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 overflow-hidden"
      style={{
        top: `calc(${heroBottom(s)} - ${fadeLen(l)}px)`,
        height: `calc(var(--vh) * ${s.topLen / 100} + ${fadeLen(l)}px)`,
        ...maskStyle(fade),
      }}
    >
      <GroundLayers l={l} src={src} />
    </div>
  );
}

/* ---------- the hero ---------- */

function Hero({
  s, l, phone, heroRef,
}: {
  s: Settings; l: Look; phone: boolean; heroRef?: RefObject<HTMLElement | null>;
}) {
  const inset = phone ? '-inset-x-[600px] -inset-y-[500px]' : '-inset-x-[600px] -inset-y-[500px] sm:-inset-x-[1000px] sm:-inset-y-[800px]';
  const sc = phone ? 0.6 : 1;
  const pos = rs(phone, 'object-cover object-[12%_center]', 'lg:object-center');
  const clear = s.nav === 'clear';

  const L = fadeLen(l);
  const sharpMask = l.fadeStyle === 'mask' ? `linear-gradient(to bottom, #000 calc(100% - ${L}px), transparent)` : undefined;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      aria-labelledby="lab-hero-heading"
      style={{ height: heroHeight(s), marginTop: clear ? 'calc(-1 * var(--nav))' : undefined }}
    >
      <div className="absolute inset-0" style={maskStyle(sharpMask)}>
        <div className="hero-day absolute inset-0">
          <Image src={DAY} alt={ALT} fill priority sizes="100vw" className={pos} />
        </div>
        <div className="hero-dusk absolute inset-0">
          <Image src={DUSK} alt={`${ALT}, at dusk`} fill sizes="100vw" className={pos} />
        </div>
      </div>
      {clear && l.mist > 0 && (
        <div aria-hidden="true" className="absolute inset-x-0 top-0" style={{ height: l.mistH, background: mistGradient(l.mist, l.mistH) }} />
      )}
      <div
        className={rs(phone, 'absolute inset-0 mx-auto flex max-w-[1160px] flex-col justify-center px-4 pb-10', 'sm:px-10 lg:pb-0')}
        style={{ transform: `translateY(${-s.lift}px)`, paddingTop: clear ? 'var(--nav)' : undefined }}
      >
        <div className="relative max-w-[520px]">
          <div aria-hidden="true" className={`glow-day absolute ${inset}`} style={{ background: glow('244 247 246', s.dayStrength, s.dayReach, s.glowX, s.dayY, sc) }} />
          <div aria-hidden="true" className={`glow-night absolute ${inset}`} style={{ background: glow('18 47 49', s.nightStrength, s.nightReach, s.glowX, s.nightY, sc) }} />
          <div className="relative">
            <p className="font-body text-[13.5px] text-brown-dark/90">
              <Link href="/promise" className="inline-flex items-center gap-2.5 underline-offset-4 decoration-1 hover:underline">
                <span aria-hidden="true" className="size-[7px] rotate-45 bg-current" />
                Every recipe is halal
              </Link>
            </p>
            <h1
              id="lab-hero-heading"
              className={`mt-5 font-heading font-normal ${rs(phone, 'text-[2.6rem]', 'sm:text-[clamp(2.6rem,4.6vw,4rem)]')} leading-[1.02] tracking-[-0.022em] text-brown-dark text-balance`}
            >
              Recipes from around the world, cooked at home.
            </h1>
            <p className="mt-6 max-w-[34ch] font-body text-[16.5px] leading-relaxed text-brown-dark">
              Dishes I&apos;ve eaten on the road and learned to make in my own kitchen. Pick a place,
              pick a dish, and start cooking tonight.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="primary" href="/recipes">Browse recipes</Button>
              <Button variant="secondary" href="/atlas">Open the atlas</Button>
            </div>
          </div>
        </div>
      </div>
      {s.hint !== 'none' && (
        <a
          href="#lab-below"
          aria-label="Scroll to recipes"
          className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-body text-[14px] text-brown-dark"
          style={{ bottom: Math.max(24, L * 0.35) }}
        >
          {s.hint === 'label' && (
            <span className="rounded-full bg-surface px-3 py-1 ring-1 ring-line">Scroll for recipes</span>
          )}
          <span className="flex size-11 items-center justify-center rounded-full bg-surface ring-1 ring-line">
            <ChevronDown size={20} aria-hidden="true" />
          </span>
        </a>
      )}
    </section>
  );
}

/* ---------- content on the ground ---------- */

function LabTag({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1160px] px-4 pt-10 sm:px-10">
      <span className="inline-block rounded-full bg-teal px-3 py-1 font-body text-[13px] text-cream">{children}</span>
    </div>
  );
}

function useJournal() {
  return useMemo(() => {
    const stamps = MANY;
    const countries = new Set(stamps.map((x) => x.recipe_country).filter(Boolean));
    const summary = summarizeStamps(stamps, countryToRegion);
    return {
      stats: { meals: stamps.length, dishes: buildDishCount(stamps), countries: countries.size },
      entries: buildJournalEntries(stamps, metaBySlug),
      summary,
      recommendation: recommendNextRecipes(FIXTURE_RECIPES, summary, 1)[0] ?? null,
      cancellations: buildFixtureCancellations(stamps),
    };
  }, []);
}

const noChecks = () => false;
const noop = () => {};
const amount = (i: { amount: number; unit: string }) => (i.amount ? `${formatAmount(i.amount)} ${i.unit}`.trim() : '');

function LaptopContent({ recipe }: { recipe: Recipe }) {
  const j = useJournal();
  const byCountry = useMemo(() => new Map<string, Recipe[]>(), []);
  return (
    <>
      <div id="lab-below">
        <CookSomethingNew />
        <div className="mx-auto max-w-[1160px] px-4 sm:px-10"><RuleDiamond /></div>
        <WaysIn />
      </div>
      <LabTag>Lab: a recipe page on the same ground</LabTag>
      <RecipeDetail recipe={recipe} />
      <LabTag>Lab: the journal on the same ground</LabTag>
      <div className="pb-16">
        <JournalScrollView
          stats={j.stats}
          entries={j.entries}
          recommendation={j.recommendation}
          summary={j.summary}
          cancellationsByCountry={j.cancellations}
          regionOfCountry={countryToRegion}
          recipesByCountry={byCountry}
          isLoading={false}
        />
      </div>
    </>
  );
}

function PhoneContent({ recipes, recipe }: { recipes: Recipe[]; recipe: Recipe }) {
  const j = useJournal();
  return (
    <div id="lab-below" className="pb-12">
      <section className="px-4 pt-12">
        <h2 className="font-heading text-[2rem] font-normal leading-tight text-brown-dark">Cook something new</h2>
        <p className="mt-2 font-body text-[16px] text-brown-medium">The newest recipes, as on the home page.</p>
        <div className="mt-8 grid gap-10">
          {recipes.slice(0, 3).map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>
      <LabTag>Lab: a recipe page on the same ground</LabTag>
      <section className="px-4 pt-6">
        <div className="rounded-[3px] bg-surface px-5 py-6 ring-1 ring-line">
          <h2 className="border-b border-brown-dark pb-2.5 mb-1 font-heading text-[25px] font-normal text-brown-dark">Ingredients</h2>
          <IngredientGroupList groups={recipe.ingredients} displayAmount={amount} isChecked={noChecks} toggle={noop} />
          <h2 className="mt-8 border-b border-brown-dark pb-2.5 mb-1 font-heading text-[25px] font-normal text-brown-dark">Method</h2>
          <InstructionGroupList groups={recipe.instructions.slice(0, 1)} isChecked={noChecks} toggle={noop} />
        </div>
      </section>
      <LabTag>Lab: the journal on the same ground</LabTag>
      <section className="px-4 pt-6">
        <JournalLog entries={j.entries} />
      </section>
    </div>
  );
}

/* ---------- the panel ---------- */

function ratioText(n: number) {
  const pass = n >= 4.5;
  return (
    <span className={`tabular-nums ${pass ? 'text-brown-dark' : 'text-terracotta font-semibold'}`}>
      {n.toFixed(1)}:1 {pass ? 'passes' : 'too low'}
    </span>
  );
}

function Panel({
  s, set, setLook, reset, sepia, contrast, onHide,
}: {
  s: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  setLook: (v: Partial<Look>) => void; reset: () => void; sepia: boolean;
  contrast: { body: number; small: number; link: number } | null; onHide: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(s, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked; the numbers are on screen */ }
  };
  const l = sepia ? s.night : s.day;
  const which = sepia ? 'night' : 'day';
  const slide = (k: keyof Settings) => (v: number) => set(k, v as never);
  const lslide = (k: keyof Look) => (v: number) => setLook({ [k]: v } as Partial<Look>);

  return (
    <aside
      aria-label="Lab controls"
      className="fixed inset-x-2 bottom-2 z-40 max-h-[55svh] overflow-y-auto rounded-[6px] bg-surface p-5 ring-1 ring-line shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] lg:inset-x-auto lg:right-4 lg:top-[6.5rem] lg:bottom-4 lg:max-h-none lg:w-[330px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-[22px] leading-tight text-brown-dark">Hero and background</p>
          <p className="mt-1 font-body text-[13px] text-brown-medium">
            Every knob is live. Sections marked ({which}) only change {which} mode; switch the theme to tune the other.
          </p>
        </div>
        <button type="button" onClick={onHide} className="shrink-0 rounded-full px-3 py-1.5 font-body text-[13.5px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]">
          Hide
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Group title="View">
          <Choice label="Theme" value={which} options={[['day', 'Day'], ['night', 'Night']]} onChange={(v) => setTheme(v === 'night' ? 'sepia' : 'parchment')} />
          <Choice label="Show as" value={s.view} options={[['laptop', 'Laptop'], ['phone', 'Phone']]} onChange={(v) => set('view', v)}
            hint="Phone shows a 390px frame. On a real phone, Laptop view already shows the true phone layout." />
        </Group>

        <Group title="Navbar">
          <Choice label="Navbar" value={s.nav} options={[['clear', 'Part of the painting'], ['band', 'Separate band (today)']]} onChange={(v) => set('nav', v)} />
          {s.nav === 'clear' && (
            <Choice label="Turns back into the band" value={s.navSolid} options={[['hero', 'Once past the painting'], ['soon', 'As soon as you scroll']]} onChange={(v) => set('navSolid', v)} />
          )}
        </Group>

        <Group title="Navbar text and icons">
          <Choice label="Apply" value={s.navApply} options={[['always', 'Always'], ['clear', 'Only over the painting']]} onChange={(v) => set('navApply', v)}
            hint="Always keeps the navbar the same size when the band comes back" />
          <Choice label="Link colour" value={s.navInk} options={[['full', 'Full ink'], ['muted', 'Muted (today)']]} onChange={(v) => set('navInk', v)} />
          <Slider label="Link size" value={s.navSize} min={14} max={19} step={0.5} unit="px" onChange={slide('navSize')} hint="Today 15" />
          <Slider label="Link weight" value={s.navWeight} min={400} max={700} step={50} onChange={slide('navWeight')} hint="Today 400. 500 is medium, 600 semibold" />
          <Slider label="Wordmark size" value={s.markSize} min={26} max={38} unit="px" onChange={slide('markSize')} hint="Today 30 (laptop; phones keep 20)" />
          <Slider label="Wordmark weight" value={s.markWeight} min={400} max={600} step={25} onChange={slide('markWeight')} hint="Today 400" />
          <Slider label="Icon size" value={s.iconSize} min={18} max={26} unit="px" onChange={slide('iconSize')} hint="Today 19" />
          <Slider label="Icon line thickness" value={s.iconStroke} min={14} max={28} onChange={slide('iconStroke')} hint="Today 16 (1.6)" />
          <Slider label="Soft halo behind" value={s.navHalo} min={0} max={100} unit="%" onChange={slide('navHalo')} hint="A faint page-colour glow around each word and icon. 0 is none" />
        </Group>

        {s.nav === 'clear' && (
          <Group title={`Mist behind the navbar (${which})`}>
            <Slider label="Mist strength" value={l.mist} min={0} max={100} unit="%" onChange={lslide('mist')} hint="A soft wash of page colour at the top so the links read. 0 is none" />
            <Slider label="Mist depth" value={l.mistH} min={60} max={360} unit="px" onChange={lslide('mistH')} />
          </Group>
        )}

        <Group title="Hero">
          <Slider label="Height" value={s.heroH} min={60} max={100} unit="% of screen" onChange={slide('heroH')}
            hint="100 fills the screen. Lower lets the next section peek in." />
          <Choice label="Height presets" value={s.heroH} options={[[100, 'Full'], [92, 'Peek'], [80, 'Shorter']]} onChange={(v) => set('heroH', v)} />
          <Choice label="Hint that there is more below" value={s.hint} options={[['none', 'Nothing'], ['arrow', 'Arrow'], ['label', 'Arrow and words']]} onChange={(v) => set('hint', v)} />
          <Slider label="Words up / down" value={s.lift} min={-120} max={160} unit="px" onChange={slide('lift')} hint="Positive moves the words up" />
        </Group>

        <Group title={`Fade into the page (${which})`}>
          <Choice label="Style" value={l.fadeStyle} options={[['mask', 'Plain fade'], ['none', 'Clean edge']]} onChange={(v) => setLook({ fadeStyle: v })} />
          {l.fadeStyle !== 'none' && (
            <Slider label="Fade length" value={l.fadeLen} min={20} max={600} step={10} unit="px" onChange={lslide('fadeLen')} />
          )}
        </Group>

        <Group title="Hero glow">
          <Slider label="Day: strength" value={s.dayStrength} min={0} max={100} onChange={slide('dayStrength')} />
          <Slider label="Day: reach" value={s.dayReach} min={20} max={110} onChange={slide('dayReach')} />
          <Slider label="Day: up / down" value={s.dayY} min={-30} max={30} onChange={slide('dayY')} />
          <Slider label="Night: strength" value={s.nightStrength} min={0} max={100} onChange={slide('nightStrength')} />
          <Slider label="Night: reach" value={s.nightReach} min={20} max={110} onChange={slide('nightReach')} />
          <Slider label="Night: up / down" value={s.nightY} min={-30} max={30} onChange={slide('nightY')} />
          <Slider label="Left / right (both)" value={s.glowX} min={-30} max={30} onChange={slide('glowX')} />
        </Group>

        <Group title={`Frosted background (${which})`}>
          <div>
            <span className="block font-body text-[14px] text-brown-dark">Start from</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {PRESETS.map(([id, label, v]) => (
                <button key={id} type="button" onClick={() => { set('frost', 'on'); setLook(v); }}
                  className="rounded-full px-3 py-1.5 font-body text-[13.5px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Choice label="Background (both themes)" value={s.frost} options={[['on', 'Frosted painting'], ['off', 'Plain page (today)']]} onChange={(v) => set('frost', v)} />
          <Choice label="When you scroll" value={l.mode} options={[['still', 'Stays still'], ['scroll', 'Scrolls with page'], ['top', 'Only near the top']]} onChange={(v) => setLook({ mode: v })}
            hint="Stays still: content slides over it. Scrolls: one painting stretched down the whole page. Near the top: fades to plain page further down." />
          {l.mode === 'top' && (
            <Slider label="How far down it reaches (both)" value={s.topLen} min={50} max={400} step={10} unit="% of screen" onChange={slide('topLen')} />
          )}
          {sepia && (
            <Choice label="Frost from" value={s.nightSrc} options={[['dusk', 'Dusk painting'], ['day', 'Day painting']]} onChange={(v) => set('nightSrc', v)} />
          )}
          <Slider label="Extra blur" value={l.blur} min={0} max={80} unit="px" onChange={lslide('blur')} hint="On top of the pre-blurred image. Gets baked into the file later." />
          <Slider label="Painting strength" value={l.strength} min={0} max={100} unit="%" onChange={lslide('strength')} hint="How much of the painting shows. 0 is plain page" />
          <Slider label="Page-colour tint over it" value={l.tint} min={0} max={100} unit="%" onChange={lslide('tint')} hint="Washes the painting toward the page colour. Higher is calmer" />
          <Slider label="Colour" value={l.sat} min={0} max={160} unit="%" onChange={lslide('sat')} hint="0 is grey, 100 is the painting's own colour" />
          <Slider label="Brightness" value={l.bright} min={50} max={150} unit="%" onChange={lslide('bright')} />
          <Slider label="Paper grain" value={l.grain} min={0} max={60} unit="%" onChange={lslide('grain')} hint="A fine paper texture over the frost" />
        </Group>

        <Group title={`Cards and panels (${which})`}>
          <Choice label="Recipe cards" value={l.cards} options={[['bare', 'Text on the background (today)'], ['paper', 'On a paper plate']]} onChange={(v) => setLook({ cards: v })}
            hint="Today's cards have no paper: the title and details sit straight on the page." />
          <Choice label="Paper panels (recipe sheet, etc.)" value={l.panels} options={[['solid', 'Solid paper'], ['see', 'See-through']]} onChange={(v) => setLook({ panels: v })}
            hint="See-through is where it starts to look like glass (the spec says paper, never glass)." />
          {l.panels === 'see' && (
            <>
              <Slider label="Panel solidity" value={l.panelOpacity} min={20} max={100} unit="%" onChange={lslide('panelOpacity')} />
              <Slider label="Blur behind panels" value={l.glassBlur} min={0} max={30} unit="px" onChange={lslide('glassBlur')} />
            </>
          )}
        </Group>

        <Group title={`Readability check (${which})`}>
          {contrast ? (
            <div className="flex flex-col gap-1.5 font-body text-[14px] text-brown-dark">
              <p className="flex justify-between gap-3"><span>Body text</span>{ratioText(contrast.body)}</p>
              <p className="flex justify-between gap-3"><span>Small grey text</span>{ratioText(contrast.small)}</p>
              <p className="flex justify-between gap-3"><span>Teal links</span>{ratioText(contrast.link)}</p>
              <p className="font-body text-[13px] leading-snug text-brown-medium">
                Worst spot anywhere on the background, text sitting straight on it. 4.5:1 is the
                accessibility minimum for normal text.
              </p>
            </div>
          ) : (
            <p className="font-body text-[13px] text-brown-medium">Measuring…</p>
          )}
        </Group>

        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <button type="button" onClick={copy} className="rounded-full bg-teal px-4 py-2 font-body text-[14px] text-cream">
            {copied ? 'Copied' : 'Copy my settings'}
          </button>
          <button type="button" onClick={reset} className="rounded-full px-4 py-2 font-body text-[14px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]">
            Reset all
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- navbar state ---------- */

/** Clears the real navbar while it sits over the painting (laptop view). */
function useClearNav(active: boolean, solidWhen: Settings['navSolid'], heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement;
    if (!active) { root.classList.remove('lab-nav-clear'); return; }
    const nav = document.querySelector<HTMLElement>('nav[aria-label="Primary"]');
    const update = () => {
      const navH = nav?.offsetHeight ?? 88;
      const clear = solidWhen === 'soon'
        ? window.scrollY < 8
        : (heroRef.current?.getBoundingClientRect().bottom ?? 0) > navH + 1;
      root.classList.toggle('lab-nav-clear', clear);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      root.classList.remove('lab-nav-clear');
    };
  }, [active, solidWhen, heroRef]);
}

/* ---------- lab ---------- */

export default function FrostLab() {
  const sepia = useIsSepia();
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(true);
  const [frameClear, setFrameClear] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const frameHeroRef = useRef<HTMLElement>(null);
  const { data: live = [] } = useRecipes();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) {
        const p = JSON.parse(saved) as Partial<Settings>;
        setS({ ...DEFAULTS, ...p, day: { ...DEFAULTS.day, ...p.day }, night: { ...DEFAULTS.night, ...p.night } });
      }
    } catch { /* storage blocked: defaults */ }
    const q = new URLSearchParams(window.location.search);
    setOpen(q.get('panel') !== 'closed' && window.innerWidth >= 1024);
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s]);

  const phone = s.view === 'phone';
  useClearNav(!phone && s.nav === 'clear', s.navSolid, heroRef);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));
  const setLook = (v: Partial<Look>) => setS((p) => (sepia ? { ...p, night: { ...p.night, ...v } } : { ...p, day: { ...p.day, ...v } }));
  const l = sepia ? s.night : s.day;
  const tokens = useTokens(sepia);
  const src = `/home/frost/frost-${sepia && s.nightSrc === 'dusk' ? 'dusk' : 'day'}.webp`;
  const contrast = useContrast(src, s.frost === 'on', l, tokens);

  const recipes = live.length ? live : MOCK_RECIPES;
  const recipe = useMemo(
    () => [...recipes].sort((a, b) => b.ingredients.flatMap((g) => g.items).length - a.ingredients.flatMap((g) => g.items).length)[0],
    [recipes],
  );

  const surfaceVar: CSSProperties | undefined =
    l.panels === 'see' && tokens
      ? ({ '--color-surface': `rgb(${tokens.surface.join(' ')} / ${l.panelOpacity / 100})`, '--glass': `${l.glassBlur}px` } as CSSProperties)
      : undefined;
  const flags = `${s.frost === 'on' ? 'frost-on' : ''} ${l.panels === 'see' ? 'see-through' : ''} ${l.cards === 'paper' ? 'cards-paper' : ''}`;

  const onFrameScroll = (e: UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    const heroB = frameHeroRef.current ? frameHeroRef.current.getBoundingClientRect().bottom - e.currentTarget.getBoundingClientRect().top : 0;
    setFrameClear(s.navSolid === 'soon' ? top < 8 : heroB > 65);
  };
  const bandClear = s.nav === 'clear' && frameClear;

  return (
    <>
      <style>{LAB_CSS}</style>
      {!phone && <style>{navCss(s)}</style>}
      <PaperTexture />
      {phone ? (
        <div className="flex justify-center px-4 py-10 lg:pr-[360px]">
          <div
            onScroll={onFrameScroll}
            className={`lab-root in-phone ${flags} relative w-[390px] max-w-full overflow-y-auto overflow-x-hidden rounded-[28px] bg-parchment ring-1 ring-line`}
            style={{ height: PHONE_H, ...surfaceVar }}
          >
            {/* The phone's nav band, so the hero height reads true. */}
            <div
              className={`sticky top-0 z-20 flex h-16 items-center px-4 font-heading text-[19px] text-brown-dark transition-[background-color,box-shadow] duration-300 ${
                bandClear ? 'bg-transparent' : 'bg-surface shadow-[0_1px_0_var(--color-line)]'
              }`}
            >
              Nieves&apos;s <span className="ml-1 italic text-brown-medium">Kitchen</span>
            </div>
            <div className="h-2" />
            <div className="relative">
              <Ground s={s} l={l} src={src} />
              <div className="relative">
                <Hero s={s} l={l} phone heroRef={frameHeroRef} />
                <PhoneContent recipes={recipes} recipe={recipe} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`lab-root ${flags} relative`} style={surfaceVar}>
          <Ground s={s} l={l} src={src} />
          <div className="relative">
            <Hero s={s} l={l} phone={false} heroRef={heroRef} />
            <LaptopContent recipe={recipe} />
          </div>
        </div>
      )}
      {open ? (
        <Panel s={s} set={set} setLook={setLook} reset={() => setS(DEFAULTS)} sepia={sepia} contrast={contrast} onHide={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full bg-teal px-4 py-2.5 font-body text-[14px] text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        >
          Show controls
        </button>
      )}
    </>
  );
}
