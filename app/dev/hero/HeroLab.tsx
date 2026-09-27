'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '@/components/courtyard';

/**
 * /dev/hero round 3: live sliders for the fade (A, B) and the watercolour
 * wash (C), a laptop/phone switch, and a night painting switch (the dusk
 * render vs keeping the day painting at night). Sandbox only.
 *
 * Night handling lives in LAB_CSS: under the sepia theme with `dusk-on`, the
 * dusk painting replaces the day one, fades and washes take the night paper
 * colour, and text on the painting follows the theme (light ink). With dusk
 * off, text on the painting is locked to day ink (the painting stays light).
 */

const DAY = '/home/hero-courtyard.webp';
const DUSK = '/home/hero-courtyard-dusk.webp';
const ALT =
  'A painted tiled courtyard: an arch onto cypress trees and the sea, and a bowl of citrus and pomegranates';

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/* Laptop/phone breakpoints fire on the viewport, not the 390px frame, so in
   phone view `rs` drops the wide classes. */
const rs = (phone: boolean, base: string, wide: string) => (phone ? base : `${base} ${wide}`);

function bleedSvg({
  x0 = -1, x1 = -1, y0 = 2000, y1 = 2000, scale = 140, seed = 7, octaves = 4, freq = '0.011 0.017',
}: { x0?: number; x1?: number; y0?: number; y1?: number; scale?: number; seed?: number; octaves?: number; freq?: string }) {
  return svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' preserveAspectRatio='none'>
<defs>
<linearGradient id='h' gradientUnits='userSpaceOnUse' x1='${x0}' y1='0' x2='${x1}' y2='0'><stop offset='0' stop-color='white' stop-opacity='0'/><stop offset='1' stop-color='white'/></linearGradient>
<linearGradient id='v' gradientUnits='userSpaceOnUse' x1='0' y1='${y0}' x2='0' y2='${y1}'><stop offset='0' stop-color='white'/><stop offset='1' stop-color='white' stop-opacity='0'/></linearGradient>
<mask id='m' maskUnits='userSpaceOnUse' x='-300' y='-300' width='1600' height='1600'><rect x='-300' y='-300' width='1600' height='1600' fill='url(#v)'/></mask>
<filter id='f' x='-30%' y='-30%' width='160%' height='160%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' seed='${seed}'/><feDisplacementMap in='SourceGraphic' scale='${scale}' xChannelSelector='R' yChannelSelector='G'/></filter>
</defs>
<g filter='url(#f)'><rect x='-300' y='-300' width='1600' height='1600' fill='url(#h)' mask='url(#m)'/></g>
</svg>`);
}

function washSvg({ blur, wobble, seed = 3 }: { blur: number; wobble: number; seed?: number }) {
  return svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' preserveAspectRatio='none'>
<defs><filter id='f' x='-25%' y='-25%' width='150%' height='150%'>
<feGaussianBlur in='SourceGraphic' stdDeviation='${blur}' result='b'/>
<feTurbulence type='fractalNoise' baseFrequency='0.010 0.016' numOctaves='3' seed='${seed}' result='n'/>
<feDisplacementMap in='b' in2='n' scale='${wobble}' xChannelSelector='R' yChannelSelector='G' result='d'/>
<feTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='3' seed='${seed + 5}' result='g'/>
<feColorMatrix in='g' type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.5 1.55' result='ga'/>
<feComposite in='d' in2='ga' operator='arithmetic' k1='1' k2='0' k3='0' k4='0'/>
</filter></defs>
<rect x='130' y='130' width='740' height='740' rx='120' fill='white' filter='url(#f)'/>
</svg>`);
}

const maskFill = (url: string) =>
  ({ maskImage: url, WebkitMaskImage: url, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }) as const;

/* Day mask + night mask on one element (see LAB_CSS). */
const bleedVars = (day: string, night: string) => ({ '--m-day': day, '--m-night': night }) as CSSProperties;

const LAB_CSS = `
.bleed { mask-image: var(--m-day); -webkit-mask-image: var(--m-day); mask-size: 100% 100%; -webkit-mask-size: 100% 100%; mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat; }
[data-theme="sepia"] .bleed { mask-image: var(--m-night); -webkit-mask-image: var(--m-night); }
[data-theme="sepia"] .dusk-on .bleed { mask-image: var(--m-day); -webkit-mask-image: var(--m-day); }

.pic-dusk { display: none; }
[data-theme="sepia"] .dusk-on .pic-dusk { display: block; }
[data-theme="sepia"] .dusk-on .pic-day { display: none; }

.glow-night { display: none; }
[data-theme="sepia"] .dusk-on .glow-night { display: block; }
[data-theme="sepia"] .dusk-on .glow-day { display: none; }

[data-theme="sepia"] .dusk-off .on-paint {
  --color-parchment: #F4F7F6;
  --color-teal: #337677;
  --color-brown-dark: #1A2B2D;
  --color-brown-medium: #4E6366;
  --color-surface: #FAFCFB;
  --color-line: #CAD9D6;
}
`;

/* ---------- shared copy ---------- */

function HalalLabel() {
  return (
    <p className="font-body text-[13.5px] text-brown-dark/90">
      <Link
        href="/promise"
        className="inline-flex items-center gap-2.5 underline-offset-4 decoration-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
      >
        <span aria-hidden="true" className="size-[7px] rotate-45 bg-current" />
        Every recipe is halal
      </Link>
    </p>
  );
}

const TITLE = 'Recipes from around the world, cooked at home.';
const TITLE_CLS = 'font-heading font-normal leading-[1.02] tracking-[-0.022em] text-brown-dark text-balance';

function Sub({ className = '' }: { className?: string }) {
  return (
    <p className={`font-body text-[16.5px] leading-relaxed text-brown-dark ${className}`}>
      Dishes I&apos;ve eaten on the road and learned to make in my own kitchen. Pick a place,
      pick a dish, and start cooking tonight.
    </p>
  );
}

function Buttons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button variant="primary" href="/recipes">Browse recipes</Button>
      <Button variant="secondary" href="/atlas">Open the atlas</Button>
    </div>
  );
}

/** Day painting, swapped for the dusk one at night when dusk is on. */
function Painting({ className = '' }: { className?: string }) {
  return (
    <>
      <div className="pic-day absolute inset-0">
        <Image src={DAY} alt={ALT} fill sizes="100vw" className={`object-cover ${className}`} />
      </div>
      <div className="pic-dusk absolute inset-0">
        <Image src={DUSK} alt={ALT} fill sizes="100vw" className={`object-cover ${className}`} />
      </div>
    </>
  );
}

/* ---------- controls ---------- */

type Knob = { key: string; label: string; min: number; max: number; hint: string };

function Controls({
  knobs, values, onChange, onReset,
}: {
  knobs: Knob[];
  values: Record<string, number>;
  onChange: (k: string, v: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-4 rounded-[3px] bg-surface px-5 py-4 ring-1 ring-line">
      {knobs.map((k) => (
        <label key={k.key} className="block min-w-[200px] flex-1">
          <span className="flex justify-between font-body text-[14px] text-brown-dark">
            <span>{k.label}</span>
            <span className="tabular-nums">{values[k.key]}</span>
          </span>
          <input
            type="range"
            min={k.min}
            max={k.max}
            value={values[k.key]}
            onChange={(e) => onChange(k.key, Number(e.target.value))}
            className="mt-2 w-full accent-teal"
          />
          <span className="mt-1 block font-body text-[13px] text-brown-medium">{k.hint}</span>
        </label>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="rounded-full px-4 py-2 font-body text-[14px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]"
      >
        Reset
      </button>
    </div>
  );
}

/* ---------- A. Dissolve ---------- */

const A_KNOBS: Knob[] = [
  { key: 'width', label: 'Fade width', min: 5, max: 60, hint: 'How far the painting melts into the page' },
];
const A_DEFAULT = { width: 30 };

function Dissolve({ v, phone }: { v: Record<string, number>; phone: boolean }) {
  const w = v.width;
  const desk = useMemo(
    () =>
      bleedVars(
        bleedSvg({ x0: 30, x1: 30 + w * 9, y0: 1000 - w * 5.7, y1: 1010, seed: 7 }),
        bleedSvg({ x0: 140, x1: 185, y0: 925, y1: 960, seed: 7, scale: 110, octaves: 4, freq: '0.009 0.014' }),
      ),
    [w],
  );
  const mob = useMemo(
    () =>
      bleedVars(
        bleedSvg({ y0: 1000 - w * 10, y1: 1000, scale: 110, seed: 11 }),
        bleedSvg({ y0: 870, y1: 910, scale: 90, seed: 11, octaves: 4, freq: '0.012 0.02' }),
      ),
    [w],
  );
  return (
    <section className="relative bg-parchment overflow-hidden">
      {!phone && (
        <div className="hidden lg:block relative h-[640px]">
          <div className="bleed absolute inset-y-0 right-0 w-[74%]" style={desk}>
            <Painting className="object-[70%_center]" />
          </div>
          <div className="relative mx-auto flex h-full max-w-[1160px] items-center px-10">
            <div className="max-w-[440px]">
              <HalalLabel />
              <h1 className={`mt-5 text-[clamp(2.3rem,3.9vw,3.4rem)] ${TITLE_CLS}`}>{TITLE}</h1>
              <Sub className="mt-6 max-w-[36ch] !text-brown-dark/85" />
              <Buttons className="mt-7" />
            </div>
          </div>
        </div>
      )}
      <div className={phone ? '' : 'lg:hidden'}>
        <div className={rs(phone, 'bleed relative h-[360px]', 'sm:h-[480px]')} style={mob}>
          <Painting />
        </div>
        <div className={rs(phone, 'relative -mt-2 px-4 pb-10', 'sm:px-10')}>
          <HalalLabel />
          <h1 className={`mt-4 text-[2.4rem] ${TITLE_CLS}`}>{TITLE}</h1>
          <Sub className="mt-5 !text-brown-dark/85" />
          <Buttons className="mt-6" />
        </div>
      </div>
    </section>
  );
}

/* ---------- B. Book jacket ---------- */

/* The glow is anchored to the text block (not the section), so it stays
   centred behind the words at any width. Day and night have their own
   strength and reach; the position nudge is shared. Sizes are in px (reach 1
   = 8px across, 6px down; phones scale by 0.6) inside an oversized box, so the
   gradient always fades out before the box edge (no seam). */
const B_KNOBS: Knob[] = [
  { key: 'dayStrength', label: 'Day: fade strength', min: 0, max: 100, hint: 'Light glow in day mode. Lower shows more painting' },
  { key: 'dayReach', label: 'Day: fade reach', min: 20, max: 110, hint: 'How far the light glow spreads' },
  { key: 'nightStrength', label: 'Night: fade strength', min: 0, max: 100, hint: 'Dark glow in night mode. Lower shows more painting' },
  { key: 'nightReach', label: 'Night: fade reach', min: 20, max: 110, hint: 'How far the dark glow spreads' },
  { key: 'x', label: 'Glow left / right', min: -30, max: 30, hint: '0 is centred behind the words' },
  { key: 'y', label: 'Glow up / down', min: -30, max: 30, hint: '0 is centred behind the words' },
];
const B_DEFAULT = { dayStrength: 90, dayReach: 75, nightStrength: 50, nightReach: 55, x: 0, y: 0 };

function glow(rgb: string, strength: number, reach: number, x: number, y: number, sc: number) {
  const k = strength / 100;
  const a = (n: number) => (n * k).toFixed(3);
  const px = (n: number) => `${Math.round(n * sc)}px`;
  return `radial-gradient(ellipse ${px(reach * 8)} ${px(reach * 6)} at calc(50% + ${px(x * 8)}) calc(50% + ${px(y * 6)}), rgb(${rgb} / ${a(0.95)}) 0%, rgb(${rgb} / ${a(0.8)}) 40%, rgb(${rgb} / ${a(0.36)}) 70%, rgb(${rgb} / 0) 100%)`;
}

function BookJacket({ v, phone }: { v: Record<string, number>; phone: boolean }) {
  const inset = phone ? '-inset-x-[600px] -inset-y-[500px]' : '-inset-x-[1000px] -inset-y-[800px]';
  const sc = phone ? 0.6 : 1;
  return (
    <section className="relative overflow-hidden">
      <div className={rs(phone, 'relative h-[640px]', 'sm:h-[600px] lg:h-[640px]')}>
        <Painting className={rs(phone, 'object-[12%_center]', 'lg:object-center')} />
        <div className="on-paint absolute inset-0">
          <div className={rs(phone, 'mx-auto flex h-full max-w-[1160px] flex-col justify-center px-4 pb-10', 'sm:px-10 lg:pb-0')}>
            <div className="relative max-w-[520px]">
              <div aria-hidden="true" className={`glow-day absolute ${inset}`} style={{ background: glow('244 247 246', v.dayStrength, v.dayReach, v.x, v.y, sc) }} />
              <div aria-hidden="true" className={`glow-night absolute ${inset}`} style={{ background: glow('18 47 49', v.nightStrength, v.nightReach, v.x, v.y, sc) }} />
              <div className="relative">
                <HalalLabel />
                <h1 className={`mt-5 ${rs(phone, 'text-[2.6rem]', 'sm:text-[clamp(2.6rem,4.6vw,4rem)]')} ${TITLE_CLS}`}>{TITLE}</h1>
                <Sub className="mt-6 max-w-[34ch]" />
                <Buttons className="mt-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- C. Watercolour wash ---------- */

const C_KNOBS: Knob[] = [
  { key: 'strength', label: 'Wash strength', min: 0, max: 100, hint: 'How solid the wash is. Lower lets the painting through' },
  { key: 'softness', label: 'Edge softness', min: 5, max: 80, hint: 'How gently the wash fades at its edges' },
  { key: 'wobble', label: 'Edge wobble', min: 0, max: 260, hint: 'How uneven and brushy the edge is' },
];
const C_DEFAULT = { strength: 86, softness: 42, wobble: 150 };

function Wash({ v, phone }: { v: Record<string, number>; phone: boolean }) {
  const mask = useMemo(() => maskFill(washSvg({ blur: v.softness, wobble: v.wobble })), [v.softness, v.wobble]);
  return (
    <section className="relative overflow-hidden">
      <div className={rs(phone, 'relative h-[680px]', 'sm:h-[600px] lg:h-[640px]')}>
        <Painting className={rs(phone, 'object-[30%_center]', 'lg:object-center')} />
        <div className="on-paint absolute inset-0">
          <div className={rs(phone, 'mx-auto flex h-full max-w-[1160px] items-start px-2 pt-6', 'lg:items-center sm:px-6 lg:pt-0')}>
            <div className="relative max-w-[600px]">
              <div
                aria-hidden="true"
                className={`absolute ${rs(phone, '-inset-10', 'sm:-inset-16')} bg-parchment`}
                style={{ ...mask, opacity: v.strength / 100 }}
              />
              <div className={rs(phone, 'relative px-8 py-10', 'sm:px-14 sm:py-14')}>
                <HalalLabel />
                <h1 className={`mt-5 ${rs(phone, 'text-[2.3rem]', 'sm:text-[clamp(2.3rem,3.9vw,3.4rem)]')} ${TITLE_CLS}`}>{TITLE}</h1>
                <Sub className="mt-6 max-w-[38ch]" />
                <Buttons className="mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- lab ---------- */

const VARIANTS = [
  { id: 'b', letter: 'B', name: 'Book jacket', C: BookJacket, knobs: B_KNOBS, defaults: B_DEFAULT,
    note: 'Words straight on the painting with a soft glow behind them. The glow now sits behind the text block itself, so 0 / 0 is centred. Day and night each have their own strength and reach; switch the theme to tune each.' },
  { id: 'a', letter: 'A', name: 'Dissolve', C: Dissolve, knobs: A_KNOBS, defaults: A_DEFAULT,
    note: 'The painting melts into the page and the words sit on the page. At night with the dusk painting, it melts into the dark page instead of standing out as a bright slab.' },
  { id: 'c', letter: 'C', name: 'Watercolour wash', C: Wash, knobs: C_KNOBS, defaults: C_DEFAULT,
    note: 'A painted wash behind the words. Turn it down for a lighter touch, soften or roughen its edge.' },
] as const;

type Values = Record<string, Record<string, number>>;
const initial = (): Values => Object.fromEntries(VARIANTS.map((v) => [v.id, { ...v.defaults }]));

function Switch<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-body text-[14px] text-brown-medium">{label}</span>
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`rounded-full px-4 py-2 font-body text-[14px] ring-1 ${value === v ? 'bg-teal text-cream ring-teal' : 'text-brown-dark ring-line hover:bg-brown-dark/[0.05]'}`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function NextSection({ phone }: { phone: boolean }): ReactNode {
  return (
    <div className={phone ? 'px-4 pt-10 pb-8' : 'mx-auto max-w-[1160px] px-4 sm:px-10 pt-14 pb-4'}>
      <h2 className={`font-heading font-normal ${phone ? 'text-[2.1rem]' : 'text-[2.4rem]'} leading-tight text-brown-dark`}>Cook something new</h2>
      <p className="mt-2 font-body text-[15px] text-brown-medium">13 recipes from 6 countries.</p>
    </div>
  );
}

export default function HeroLab() {
  const [view, setView] = useState<'laptop' | 'phone'>('laptop');
  const [night, setNight] = useState<'dusk' | 'day'>('dusk');
  const [values, setValues] = useState<Values>(initial);
  const phone = view === 'phone';

  const set = (id: string) => (k: string, n: number) => setValues((s) => ({ ...s, [id]: { ...s[id], [k]: n } }));
  const reset = (id: string, d: Record<string, number>) => () => setValues((s) => ({ ...s, [id]: { ...d } }));

  return (
    <main className={`pb-24 ${night === 'dusk' ? 'dusk-on' : 'dusk-off'}`}>
      <style>{LAB_CSS}</style>
      <div className="mx-auto max-w-[1160px] px-4 sm:px-10 pt-10">
        <h1 className="font-heading text-[2rem] text-brown-dark">Hero directions, round 4</h1>
        <p className="mt-2 max-w-[70ch] font-body text-[15px] text-brown-medium">
          Drag the sliders to tune each one. The numbers next to each slider are what I need
          to build your pick exactly. Use the sun/moon icon in the nav to see night.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Switch label="Show as" value={view} options={[['laptop', 'Laptop'], ['phone', 'Phone']]} onChange={setView} />
          <Switch label="At night use" value={night} options={[['dusk', 'Dusk painting'], ['day', 'Day painting']]} onChange={setNight} />
        </div>
      </div>

      {phone ? (
        <div className="mx-auto mt-10 flex max-w-[1800px] flex-wrap items-start justify-center gap-10 px-4">
          {VARIANTS.map((v) => (
            <figure key={v.id} className="w-[390px] max-w-full">
              <figcaption className="mb-3 font-body text-[14px] text-brown-dark">
                <span className="font-semibold">{v.letter}.</span> {v.name}
              </figcaption>
              <div className="mb-4">
                <Controls knobs={[...v.knobs]} values={values[v.id]} onChange={set(v.id)} onReset={reset(v.id, v.defaults)} />
              </div>
              <div className="overflow-hidden rounded-[28px] bg-parchment ring-1 ring-line">
                <v.C v={values[v.id]} phone />
                <NextSection phone />
              </div>
            </figure>
          ))}
        </div>
      ) : (
        VARIANTS.map((v) => (
          <div key={v.id}>
            <div className="mx-auto max-w-[1160px] px-4 sm:px-10 pt-16 pb-5">
              <p className="font-body text-[15px] font-semibold text-brown-dark">{v.letter}. {v.name}</p>
              <p className="mt-1 max-w-[70ch] font-body text-[14px] text-brown-medium">{v.note}</p>
              <div className="mt-4">
                <Controls knobs={[...v.knobs]} values={values[v.id]} onChange={set(v.id)} onReset={reset(v.id, v.defaults)} />
              </div>
            </div>
            <v.C v={values[v.id]} phone={false} />
            <NextSection phone={false} />
          </div>
        ))
      )}
    </main>
  );
}
