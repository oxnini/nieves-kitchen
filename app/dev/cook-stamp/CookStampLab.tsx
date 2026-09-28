'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import PaperTexture from '@/components/passport/PaperTexture';
import SupplementarySections from '@/components/recipe/SupplementarySections';
import StampsUnavailable from '@/components/StampsUnavailable';
import { useRecipes } from '@/hooks/useRecipes';
import { setTheme, useIsSepia } from '@/hooks/useTheme';
import type { CookTier } from '@/hooks/useLogCook';
import type { ExplorerTitle } from '@/lib/passport';
import { MOCK_RECIPES } from '@/lib/mock-recipes';
import type { Recipe } from '@/lib/types';
import { Choice, Group, Slider } from '../hero-viewport/controls';
import { CountryStamp, VARIANTS, type ButtonState, type Knobs, type VariantKey } from './variants';

/**
 * /dev/cook-stamp: four redesigns of "I cooked this" (CookedButton) for the
 * Glazed Folio revamp, on the real recipe back matter over the frosted
 * ground. Every state is a fixture: tapping runs a fake save with a delay,
 * so new country / new dish / cooked again / new title / removed / error can
 * all be seen without a single Supabase write. Confetti follows the live
 * rule: milestones only, never on a repeat. Settings persist in localStorage
 * for this viewer only.
 */

const STORE = 'nieves-lab-cook-stamp-v4';

/* Night paper for the journal slips (C and E). "Warm" keeps the slip a
   light journal page at night, the way the passport paper and the /journal
   stamp plinth never dim: warm paper, day ink. "Lift" keeps the night teal
   but raises the paper and frame so the edge reads on the dark ground. The
   stamp plinth gets a little padding at night only, like .ink-plinth-panel. */
const LAB_CSS = `
[data-theme="sepia"] .lab-warm-night {
  --color-parchment-dark: #F3EDE0; --color-surface: #F3EDE0;
  --color-brown-dark: #1A2B2D; --color-brown-medium: #4E6366; --color-brown-light: #8BA19E;
  --color-terracotta: #B4532E; --color-paprika: #9E4527; --color-teal: #337677; --color-line: #CAD9D6;
}
[data-theme="sepia"] .lab-warm-night .text-teal { color: var(--color-teal); }
[data-theme="sepia"] .lab-lift-night { --color-parchment-dark: #21494B; --color-teal: #8CC3C1; }
/* C's in-betweens. Dimmed page: the day page white pulled toward the night
   page by --lab-dim, keeping day ink (dark text, day terracotta), so it
   reads as the same paper with the lights down. Night teal (C only): the
   paper lifted toward mist by --lab-lift, light ink, a bright teal frame. */
[data-theme="sepia"] .lab-dim-night {
  --color-surface: color-mix(in srgb, #FAFCFB calc(100% - var(--lab-dim)), #122F31);
  --color-parchment-dark: color-mix(in srgb, #E3ECEA calc(100% - var(--lab-dim)), #122F31);
  --color-brown-dark: #1A2B2D; --color-brown-medium: #3E5053;
  --color-terracotta: #A94C29; --color-teal: #2A6364;
}
[data-theme="sepia"] .lab-lift-night.group {
  --color-surface: color-mix(in srgb, #E9F0EE var(--lab-lift), #122F31);
  --color-parchment-dark: color-mix(in srgb, #E9F0EE var(--lab-lift), #122F31);
}
[data-theme="sepia"] .lab-stamp-plinth { padding: 6px; }
[data-theme="sepia"] .lab-warm-night .lab-stamp-plinth { padding: 0; background: transparent; }
`;

type Scenario = 'new_country' | 'new_country_title' | 'new_recipe';
type Session = 'ready' | 'preparing' | 'failed';

type Settings = Knobs & {
  variant: VariantKey;
  recipeIdx: number;
  scenario: Scenario;
  session: Session;
  delay: number;
  failNext: 'no' | 'yes';
  allowAgain: 'off' | 'on';
  toastStyle: 'paper' | 'night';
  toastRing: number;
  toastRingAlpha: number;
  toastStamp: 'on' | 'off';
  toastHold: 'timed' | 'pinned';
  confetti: number;
  context: 'page' | 'cook';
  width: 'laptop' | 'phone';
  backMatter: 'on' | 'off';
};

const DEFAULTS: Settings = {
  variant: 'C', recipeIdx: 0, scenario: 'new_country', session: 'ready', delay: 900, failNext: 'no',
  allowAgain: 'on', toastStyle: 'night', toastRing: 2, toastRingAlpha: 35, toastStamp: 'on', toastHold: 'timed', confetti: 70,
  context: 'page', width: 'laptop', backMatter: 'on',
  aButton: 'secondary', aMark: 104, aTilt: -8, aInk: 90,
  bAlign: 'left', bStamp: 80, bTilt: 0, bRule: 'teal',
  cWidth: 420, cBite: 5, cTilt: 0, cWash: 6, cPaper: 'surface', cNight: 'dim', cDim: 22, cLift: 12, cFrame: 'terracotta',
  eWidth: 560, eStamp: 80, eTilt: 0, eSlipTilt: 0, eWash: 8, eNight: 'warm',
  dSize: 132, dTilt: -7, dPress: 10,
  texture: 'on',
};

const VARIANT_NAMES: Record<VariantKey, string> = {
  A: 'Quiet button, postmark',
  B: 'Journal slip',
  C: 'Perforated stamp, retuned',
  D: 'The seal you press',
  E: 'Journal slip with the stamp (B and C together)',
};

type LabToast =
  | { kind: 'cooked'; tier: CookTier; title: ExplorerTitle | null; count: number }
  | { kind: 'undone' }
  | { kind: 'error'; message: string };

/* ---------- confetti: the live rule and palette, with a strength knob ---------- */

function confettiColors(): string[] {
  const s = getComputedStyle(document.documentElement);
  return ['--color-terracotta', '--color-turmeric', '--color-sage', '--color-brown-medium']
    .map((v) => s.getPropertyValue(v).trim())
    .filter(Boolean);
}

async function fireConfetti(tier: CookTier, strength: number) {
  if (tier === 'repeat' || strength <= 0) return;
  const confetti = (await import('canvas-confetti')).default;
  const colors = confettiColors();
  const n = (x: number) => Math.max(1, Math.round((x * strength) / 100));
  const base = {
    colors: colors.length ? colors : ['#B4532E', '#F0A988', '#B9CBC7', '#337677'],
    origin: { y: 0.7 }, gravity: 0.8, ticks: 280, scalar: 1.1,
    shapes: ['square'] as ('square' | 'circle' | 'star')[], disableForReducedMotion: true,
  };
  // New country, new title and a new dish all get the same full burst (user,
  // 2026-09-28: a new dish should feel as big as a new country).
  confetti({ ...base, particleCount: n(160), spread: 120, startVelocity: 48 });
  setTimeout(() => confetti({ ...base, particleCount: n(70), spread: 140, angle: 60, startVelocity: 40 }), 180);
  setTimeout(() => confetti({ ...base, particleCount: n(70), spread: 140, angle: 120, startVelocity: 40 }), 260);
}

/* ---------- the toast ---------- */

function Toast({
  toast, s, recipe, onUndo, undoing, onClose,
}: {
  toast: LabToast; s: Settings; recipe: Recipe; onUndo: () => void; undoing: boolean; onClose: () => void;
}) {
  const night = s.toastStyle === 'night';
  const shell = night
    ? 'bg-night text-cream'
    : 'bg-surface text-brown-dark ring-1 ring-line';
  const sub = night ? 'text-cream/80' : 'text-brown-medium';
  const name = recipe.name;
  const country = recipe.country;

  let heading = '';
  let body = '';
  let stamp = false;
  let title: ExplorerTitle | null = null;
  if (toast.kind === 'error') {
    heading = 'Something went wrong';
    body = toast.message;
  } else if (toast.kind === 'undone') {
    heading = 'Cook removed';
    body = 'Your journal is back the way it was.';
  } else if (toast.tier === 'new_country' && country) {
    heading = `A new country: ${country}`;
    body = `${name} is your first dish from ${country}. Its stamp is in your journal.`;
    stamp = s.toastStamp === 'on';
    title = toast.title;
  } else if (toast.tier === 'repeat') {
    heading = 'Cooked again';
    body = `That is ${toast.count} times for ${name}.`;
  } else {
    heading = 'In your journal';
    body = `${name} is in your Cook's Journal.`;
  }

  return (
    <div
      className={`${shell} rounded-[4px] px-5 py-4`}
      style={{
        boxShadow: `${night ? `0 0 0 ${s.toastRing}px rgb(233 240 238 / ${s.toastRingAlpha / 100}), ` : ''}0 20px 40px -18px rgba(0,0,0,0.45)`,
      }}
    >
      <div className="flex items-center gap-4">
        {stamp && country && <CountryStamp country={country} slug={recipe.id} size={40} tilt={-6} />}
        <div className="min-w-0 flex-1">
          <p className={`font-heading text-[19px] leading-tight ${toast.kind === 'error' ? (night ? 'text-terracotta-lit' : 'text-paprika') : ''}`}>
            {heading}
          </p>
          <p className={`mt-1 font-body text-[14px] leading-snug ${sub}`}>{body}</p>
          {title && (
            <p className="mt-2 flex items-center gap-2 font-body text-[14px]">
              <span aria-hidden className={`size-[7px] rotate-45 ${night ? 'bg-terracotta-lit' : 'bg-terracotta'}`} />
              <span>You are now a <strong className="font-semibold">{title}</strong>.</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {toast.kind === 'cooked' && (
            <button
              type="button"
              onClick={onUndo}
              disabled={undoing}
              className={`rounded-sm px-3 py-2 font-body text-[14px] font-semibold ring-1 transition-colors disabled:opacity-60 ${
                night ? 'ring-cream/40 hover:bg-cream/10' : 'ring-brown-dark/40 hover:bg-brown-dark/[0.05]'
              }`}
            >
              {undoing ? 'Undoing…' : 'Undo'}
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Dismiss" className={`rounded-full p-1.5 ${night ? 'hover:bg-cream/10' : 'hover:bg-brown-dark/[0.06]'}`}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- panel ---------- */

function Panel({
  s, set, reset, sepia, recipes, onJump, onPreview, onHide,
}: {
  s: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void; reset: () => void; sepia: boolean;
  recipes: Recipe[]; onJump: (n: number) => void; onPreview: (t: LabToast) => void; onHide: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(s, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked; the numbers are on screen */ }
  };
  const num = (k: keyof Settings) => (v: number) => set(k, v as never);
  const pill = 'rounded-full px-3 py-1.5 font-body text-[13.5px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]';

  return (
    <aside
      aria-label="Lab controls"
      className="fixed inset-x-2 bottom-2 z-40 max-h-[55svh] overflow-y-auto rounded-[6px] bg-surface p-5 ring-1 ring-line shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] lg:inset-x-auto lg:right-4 lg:top-[6.5rem] lg:bottom-4 lg:max-h-none lg:w-[330px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-[22px] leading-tight text-brown-dark">I cooked this</p>
          <p className="mt-1 font-body text-[13px] text-brown-medium">
            Every state is a fixture. Nothing here is saved to your real journal.
          </p>
        </div>
        <button type="button" onClick={onHide} className={`shrink-0 ${pill}`}>Hide</button>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Group title="Design">
          <Choice label="Variant" value={s.variant} options={(['A', 'B', 'C', 'D', 'E'] as VariantKey[]).map((v) => [v, v])} onChange={(v) => set('variant', v)}
            hint={`${s.variant}: ${VARIANT_NAMES[s.variant]}`} />
          <Choice label="Theme" value={sepia ? 'night' : 'day'} options={[['day', 'Day'], ['night', 'Night']]} onChange={(v) => setTheme(v === 'night' ? 'sepia' : 'parchment')} />
          <Choice label="Where" value={s.context} options={[['page', 'End of the recipe'], ['cook', 'Cook mode card']]} onChange={(v) => set('context', v)} />
          <Choice label="Width" value={s.width} options={[['laptop', 'Laptop'], ['phone', 'Phone']]} onChange={(v) => set('width', v)} />
          <Choice label="Back matter above" value={s.backMatter} options={[['on', 'Show'], ['off', 'Hide']]} onChange={(v) => set('backMatter', v)} />
          {recipes.length > 1 && (
            <Choice label="Recipe" value={s.recipeIdx} options={recipes.map((r, i) => [i, r.country ?? r.name] as [number, string])} onChange={(v) => set('recipeIdx', v)} />
          )}
        </Group>

        <Group title={`Variant ${s.variant} knobs`}>
          {s.variant === 'A' && (
            <>
              <Choice label="Button" value={s.aButton} options={[['secondary', 'Ink outline'], ['primary', 'Teal'], ['accent', 'Terracotta']]} onChange={(v) => set('aButton', v)} />
              <Slider label="Postmark size" value={s.aMark} min={72} max={150} unit="px" onChange={num('aMark')} />
              <Slider label="Postmark tilt" value={s.aTilt} min={-15} max={15} unit="°" onChange={num('aTilt')} />
              <Slider label="Ink strength" value={s.aInk} min={40} max={100} unit="%" onChange={num('aInk')} />
            </>
          )}
          {s.variant === 'B' && (
            <>
              <Choice label="Text" value={s.bAlign} options={[['left', 'Left'], ['centre', 'Centred']]} onChange={(v) => set('bAlign', v)} />
              <Choice label="Top edge" value={s.bRule} options={[['teal', 'Teal rule'], ['none', 'None']]} onChange={(v) => set('bRule', v)} />
              <Slider label="Country stamp size" value={s.bStamp} min={48} max={110} unit="px" onChange={num('bStamp')} />
              <Slider label="Stamp tilt" value={s.bTilt} min={-15} max={15} unit="°" onChange={num('bTilt')} />
            </>
          )}
          {s.variant === 'C' && (
            <>
              <Choice label="Paper" value={s.cPaper} options={[['parchment-dark', 'Deep mist'], ['surface', 'Page white']]} onChange={(v) => set('cPaper', v)} />
              <Choice label="Frame before cooking" value={s.cFrame} options={[['teal', 'Teal'], ['terracotta', 'Terracotta']]} onChange={(v) => set('cFrame', v)}
                hint="Cooked is always a terracotta double frame." />
              <Choice label="Paper at night" value={s.cNight} options={[['dim', 'Dimmed page'], ['lift', 'Night teal'], ['warm', 'Warm journal paper']]} onChange={(v) => set('cNight', v)}
                hint="Dimmed page is the in-between: the day paper with the lights turned down, dark ink kept." />
              {s.cNight === 'dim' && (
                <Slider label="How dim at night" value={s.cDim} min={10} max={50} unit="%" onChange={num('cDim')} hint="Higher sits closer to the night page. Past about 45% the dark text gets hard to read." />
              )}
              {s.cNight === 'lift' && (
                <Slider label="Night teal lightness" value={s.cLift} min={4} max={24} unit="%" onChange={num('cLift')} hint="How far the paper is lifted from the night page toward mist." />
              )}
              <Slider label="Width" value={s.cWidth} min={300} max={520} unit="px" onChange={num('cWidth')} />
              <Slider label="Perforation" value={s.cBite} min={3} max={8} unit="px" onChange={num('cBite')} />
              <Slider label="Tilt when cooked" value={s.cTilt} min={-6} max={6} step={0.2} unit="°" onChange={num('cTilt')} />
              <Slider label="Terracotta wash when cooked" value={s.cWash} min={0} max={30} unit="%" onChange={num('cWash')} />
            </>
          )}
          {s.variant === 'D' && (
            <>
              <Slider label="Seal size" value={s.dSize} min={96} max={180} unit="px" onChange={num('dSize')} />
              <Slider label="Tilt when cooked" value={s.dTilt} min={-15} max={15} unit="°" onChange={num('dTilt')} />
              <Slider label="Press depth" value={s.dPress} min={0} max={20} unit="%" onChange={num('dPress')} hint="How far the seal sinks while you hold it down." />
            </>
          )}
          {s.variant === 'E' && (
            <>
              <Choice label="Paper at night" value={s.eNight} options={[['warm', 'Warm journal paper'], ['lift', 'Night teal, brighter frame']]} onChange={(v) => set('eNight', v)} />
              <Slider label="Width" value={s.eWidth} min={380} max={680} unit="px" onChange={num('eWidth')} />
              <Slider label="Country stamp size" value={s.eStamp} min={56} max={110} unit="px" onChange={num('eStamp')} />
              <Slider label="Stamp tilt" value={s.eTilt} min={-10} max={10} unit="°" onChange={num('eTilt')} />
              <Slider label="Slip tilt when cooked" value={s.eSlipTilt} min={-4} max={4} step={0.2} unit="°" onChange={num('eSlipTilt')} />
              <Slider label="Terracotta wash when cooked" value={s.eWash} min={0} max={25} unit="%" onChange={num('eWash')} />
            </>
          )}
          {s.variant !== 'C' && s.variant !== 'E' && (
            <Choice label="Ink texture" value={s.texture} options={[['on', 'Rough ink'], ['off', 'Clean']]} onChange={(v) => set('texture', v)} />
          )}
        </Group>

        <Group title="Try it">
          <Choice label="The next tap is" value={s.scenario}
            options={[['new_country', 'A new country'], ['new_country_title', 'New country and title'], ['new_recipe', 'A new dish']]}
            onChange={(v) => set('scenario', v)} hint="Only the first cook. Cooking again is always a repeat." />
          <Choice label="Jump to" value={-1 as number} options={[[0, 'Not cooked'], [1, 'Cooked once'], [3, 'Cooked 3 times']]} onChange={onJump} />
          <Choice label="Journal session" value={s.session} options={[['ready', 'Ready'], ['preparing', 'Opening'], ['failed', 'Failed']]} onChange={(v) => set('session', v)} />
          <Choice label="Make the next save fail" value={s.failNext} options={[['no', 'No'], ['yes', 'Yes']]} onChange={(v) => set('failNext', v)} />
          <Choice label="I cooked it again" value={s.allowAgain} options={[['off', 'Off (today)'], ['on', 'On']]} onChange={(v) => set('allowAgain', v)}
            hint="Today the button locks after the first cook, so a repeat can never be logged. On adds a way to log another cook." />
          <Slider label="Fake save time" value={s.delay} min={0} max={2500} step={100} unit="ms" onChange={num('delay')} />
        </Group>

        <Group title="Moments">
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className={pill} onClick={() => onPreview({ kind: 'cooked', tier: 'new_country', title: null, count: 1 })}>New country</button>
            <button type="button" className={pill} onClick={() => onPreview({ kind: 'cooked', tier: 'new_country', title: 'Wanderer', count: 1 })}>New title</button>
            <button type="button" className={pill} onClick={() => onPreview({ kind: 'cooked', tier: 'new_recipe', title: null, count: 1 })}>New dish</button>
            <button type="button" className={pill} onClick={() => onPreview({ kind: 'cooked', tier: 'repeat', title: null, count: 3 })}>Cooked again</button>
            <button type="button" className={pill} onClick={() => onPreview({ kind: 'undone' })}>Removed</button>
            <button type="button" className={pill} onClick={() => onPreview({ kind: 'error', message: 'We could not save this cook. Check your connection and try again.' })}>Error</button>
          </div>
          <Choice label="Message style" value={s.toastStyle} options={[['paper', 'Paper'], ['night', 'Night band']]} onChange={(v) => set('toastStyle', v)} />
          {s.toastStyle === 'night' && (
            <>
              <Slider label="Night band outline" value={s.toastRing} min={0} max={4} step={0.5} unit="px" onChange={num('toastRing')} />
              <Slider label="Outline strength" value={s.toastRingAlpha} min={10} max={80} step={5} unit="%" onChange={num('toastRingAlpha')} />
            </>
          )}
          <Choice label="Country stamp in the message" value={s.toastStamp} options={[['on', 'Show'], ['off', 'Hide']]} onChange={(v) => set('toastStamp', v)} />
          <Choice label="Message stays" value={s.toastHold} options={[['timed', 'Timed, like live'], ['pinned', 'Until closed']]} onChange={(v) => set('toastHold', v)} />
          <Slider label="Confetti" value={s.confetti} min={0} max={150} step={10} unit="%" onChange={num('confetti')} hint="New country, new title and a new dish all get the same burst. Cooking again gets none." />
        </Group>

        <div className="flex gap-2 border-t border-line pt-4">
          <button type="button" onClick={copy} className="flex-1 rounded-sm bg-teal px-3 py-2 font-body text-[14px] font-semibold text-cream">
            {copied ? 'Copied' : 'Copy settings'}
          </button>
          <button type="button" onClick={reset} className="rounded-sm px-3 py-2 font-body text-[14px] text-brown-dark ring-1 ring-line">Reset</button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- lab ---------- */

const LAST_WEEK = () => new Date(Date.now() - 16 * 864e5);

export default function CookStampLab() {
  const sepia = useIsSepia();
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(true);
  const { data: live = [] } = useRecipes();

  const [cooks, setCooks] = useState<Date[]>([]);
  const [pending, setPending] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState<LabToast | null>(null);
  const [pressKey, setPressKey] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) setS({ ...DEFAULTS, ...(JSON.parse(saved) as Partial<Settings>) });
    } catch { /* storage blocked: defaults */ }
    const q = new URLSearchParams(window.location.search);
    const v = q.get('v')?.toUpperCase();
    if (v && v in VARIANTS) setS((p) => ({ ...p, variant: v as VariantKey }));
    const c = Number(q.get('cooked'));
    if (c > 0) setCooks(Array.from({ length: c }, LAST_WEEK));
    setOpen(q.get('panel') !== 'closed' && window.innerWidth >= 1024);
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));

  const recipes = useMemo(() => {
    const pool = live.length ? live : MOCK_RECIPES;
    const seen = new Set<string>();
    return pool.filter((r) => r.country && !seen.has(r.country) && seen.add(r.country)).slice(0, 5);
  }, [live]);
  const recipe = recipes[Math.min(s.recipeIdx, recipes.length - 1)] ?? MOCK_RECIPES[0];

  // Toast lifetime mirrors the live button: 9s with an undo, 6s otherwise.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!toast || s.toastHold === 'pinned') return;
    timer.current = setTimeout(() => setToast(null), toast.kind === 'cooked' ? 9000 : 6000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [toast, s.toastHold]);

  const count = cooks.length;
  const state: ButtonState =
    pending ? 'pending'
      : count > 0 ? 'cooked'
        : s.session === 'failed' ? 'failed'
          : s.session === 'preparing' ? 'preparing'
            : 'idle';

  function cook() {
    if (pending || s.session !== 'ready') return;
    if (count > 0 && s.allowAgain === 'off') return;
    setPending(true);
    setConfirming(false);
    setTimeout(() => {
      setPending(false);
      if (s.failNext === 'yes') {
        set('failNext', 'no');
        setToast({ kind: 'error', message: 'We could not save this cook. Check your connection and try again.' });
        return;
      }
      const tier: CookTier = count > 0 ? 'repeat' : s.scenario === 'new_recipe' ? 'new_recipe' : 'new_country';
      const title: ExplorerTitle | null = count === 0 && s.scenario === 'new_country_title' ? 'Wanderer' : null;
      setCooks((c) => [...c, new Date()]);
      setPressKey((k) => k + 1);
      setToast({ kind: 'cooked', tier, title, count: count + 1 });
      void fireConfetti(tier, s.confetti);
    }, s.delay);
  }

  function remove() {
    if (removing || count === 0) return;
    setRemoving(true);
    setTimeout(() => {
      setRemoving(false);
      setConfirming(false);
      setCooks((c) => c.slice(0, -1));
      setToast({ kind: 'undone' });
    }, s.delay);
  }

  function jump(n: number) {
    setPending(false);
    setConfirming(false);
    setToast(null);
    setPressKey(0);
    setCooks(Array.from({ length: n }, (_, i) => new Date(Date.now() - (n - i) * 9 * 864e5)));
  }

  function preview(t: LabToast) {
    setToast(t);
    if (t.kind === 'cooked') void fireConfetti(t.tier, s.confetti);
  }

  const Variant = VARIANTS[s.variant];
  const button = (
    <Variant
      state={state}
      count={count}
      lastCooked={cooks[cooks.length - 1] ?? null}
      country={recipe.country}
      slug={recipe.id}
      allowAgain={s.allowAgain === 'on'}
      confirming={confirming}
      removing={removing}
      pressKey={pressKey}
      knobs={s}
      onCook={cook}
      onAskRemove={() => setConfirming(true)}
      onConfirmRemove={remove}
      onCancelRemove={() => setConfirming(false)}
    />
  );
  const failure = state === 'failed' && (
    <StampsUnavailable compact className="mt-2 w-full max-w-md" title="Your journal did not open" failure="captcha-failed" onRetry={() => set('session', 'ready')} />
  );

  const phone = s.width === 'phone';
  return (
    <>
      <style>{LAB_CSS}</style>
      <PaperTexture />
      <div className={open ? 'lg:pr-[350px]' : ''}>
        <div className={`@container mx-auto ${phone ? 'max-w-[390px] rounded-[28px] ring-1 ring-line my-8 overflow-hidden' : 'max-w-5xl'} px-4 sm:px-6 lg:px-8 py-8`}>
          <header className="mb-8">
            <p className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-brown-medium">Lab · {VARIANT_NAMES[s.variant]}</p>
            <h1 className="mt-2 font-heading text-[clamp(2rem,4vw,2.8rem)] font-normal leading-tight text-brown-dark">{recipe.name}</h1>
            <p className="mt-1 font-body text-[14px] text-brown-medium">
              {recipe.country}. The end of the recipe page, where &ldquo;I cooked this&rdquo; lives.
            </p>
          </header>

          {s.context === 'page' ? (
            <>
              {s.backMatter === 'on' && <div className="mb-10"><SupplementarySections recipe={recipe} /></div>}
              <div id="cook-slot" className="flex flex-col items-center py-6">
                {button}
                {failure}
              </div>
            </>
          ) : (
            <div id="cook-slot" className="mx-auto max-w-3xl">
              <p className="mb-3 font-body text-[14px] text-brown-medium">Cook mode, after the last step is ticked:</p>
              <div className="rounded-2xl border border-brown-light/25 bg-surface p-4 shadow-lg sm:p-5">
                <div className="flex flex-col items-center">
                  {button}
                  {failure}
                </div>
              </div>
            </div>
          )}
          <div className="h-40" />
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-6 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 ${open ? 'left-1/2 lg:left-[calc(50%-175px)]' : 'left-1/2'}`}
          >
            <Toast toast={toast} s={s} recipe={recipe} onUndo={remove} undoing={removing} onClose={() => setToast(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {open ? (
        <Panel s={s} set={set} reset={() => setS(DEFAULTS)} sepia={sepia} recipes={recipes} onJump={jump} onPreview={preview} onHide={() => setOpen(false)} />
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
