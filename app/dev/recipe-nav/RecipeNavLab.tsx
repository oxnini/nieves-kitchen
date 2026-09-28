'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Maximize2, X } from 'lucide-react';
import RecipeDetail from '@/components/RecipeDetail';
import { ModalScrollContext } from '@/components/recipe/ModalScrollContext';
import { useRecipes } from '@/hooks/useRecipes';
import { useIsMobile } from '@/hooks/useIsMobile';
import { setTheme, useIsSepia } from '@/hooks/useTheme';
import { MOCK_RECIPES } from '@/lib/mock-recipes';
import type { Recipe } from '@/lib/types';
import { Choice, Group, Slider } from '../hero-viewport/controls';
import { neighbours, setKey, type AllSort, type Ends, type Order } from './ordering';
import {
  EdgeTab, EdgeTabsFixed, PhoneCornerPills, PillPair, TREATMENT_NAMES, Treatment,
  useArrowKeys, useSwipe, type NavKnobs, type NavProps, type TreatmentKey,
} from './treatments';

/**
 * /dev/recipe-nav: prev/next between recipes (TODO "Recipe swipe/navigation"),
 * on the real RecipeDetail over the frosted ground, as a page or inside a
 * replica of the @modal sheet. Clicking prev/next swaps the fixture recipe in
 * place rather than routing, so the lab never leaves itself. The "I cooked
 * this" slip is made inert here so the lab writes nothing to Supabase.
 * Settings persist in localStorage for this viewer only. There is no phone
 * frame: RecipeDetail's sm:/md: breakpoints follow the real window, and an
 * iframe is refused by the site-wide X-Frame-Options: DENY. For phone views,
 * narrow the window or use the browser's device mode.
 */

const STORE = 'nieves-lab-recipe-nav-v1';
const PANEL_W = 350;

/* The CookedButton wrapper is the last child of RecipeDetail's content column
   (flex justify-center py-6). Inert here: tapping it would log a real cook. */
const LAB_CSS = `
.lab-recipe .max-w-5xl > div > .flex.justify-center.py-6 { pointer-events: none; }
`;

type Settings = NavKnobs & {
  treatment: TreatmentKey;
  order: Order;
  ends: Ends;
  allSort: AllSort;
  endCap: 'none' | 'link';
  position: 'on' | 'off';
  where: 'page' | 'modal';
  catalogue: 'live' | 'mock';
  recipeId: string;
  keys: 'on' | 'off';
  swipe: 'off' | 'on';
};

const DEFAULTS: Settings = {
  treatment: 'A', order: 'region', ends: 'handover', allSort: 'atlas', endCap: 'link', position: 'off',
  where: 'page', catalogue: 'live', recipeId: '', keys: 'on', swipe: 'off',
  aTitle: 24, aRule: 'teal',
  bThumb: 260, bHeading: 'on',
  cOffset: 0, cReveal: 'hover', cModalPos: 'controls', cPhoneShow: 'end',
};

const ENDS_HINT: Record<Ends, string> = {
  wrap: 'After the last recipe in the set, next goes back to the first.',
  handover: 'After the last recipe in the set, next walks on into the next one in atlas order.',
  stop: 'The first recipe has no previous and the last has no next.',
};

/* ---------- the modal sheet, minus the router ---------- */

function LabModal({
  children, onClose, besideTabs, controls, phoneControls, scrollRef, panelOpen,
}: {
  children: ReactNode; onClose: () => void; besideTabs: ReactNode; controls: ReactNode; phoneControls: ReactNode;
  scrollRef: React.RefObject<HTMLDivElement | null>; panelOpen: boolean;
}) {
  const mobile = useIsMobile();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const pill = 'p-2 rounded-full bg-surface ring-1 ring-line text-brown-dark hover:bg-parchment-dark transition-colors';
  const shut = (
    <>
      <button type="button" onClick={onClose} aria-label="Open full recipe" className={pill}><Maximize2 size={16} aria-hidden /></button>
      <button type="button" onClick={onClose} aria-label="Close recipe" className={pill}><X size={16} aria-hidden /></button>
    </>
  );
  return (
    <ModalScrollContext.Provider value={scrollRef}>
      <div aria-hidden className="fixed inset-0 z-[60] bg-brown-dark/55 backdrop-blur-sm" />
      {mobile ? (
        <div role="dialog" aria-modal="true" aria-label="Recipe detail" className="fixed inset-x-0 bottom-0 z-[70]">
          <div className="relative overflow-hidden rounded-t-2xl border-t border-brown-light/20 bg-parchment shadow-2xl">
            <div ref={scrollRef} className="max-h-[92dvh] overflow-y-auto scrollbar-quiet">{children}</div>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-3 pb-3 pt-2.5">
              <div className="pointer-events-auto">{phoneControls}</div>
              <div className="pointer-events-auto flex items-center gap-1.5">{shut}</div>
            </div>
            <span aria-hidden className="absolute left-1/2 top-0 z-20 flex h-11 w-36 -translate-x-1/2 items-start justify-center pt-2">
              <span className="block h-1.5 w-11 rounded-full bg-brown-light/60" />
            </span>
          </div>
        </div>
      ) : (
        <div
          role="dialog" aria-modal="true" aria-label="Recipe detail"
          className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ paddingRight: panelOpen ? PANEL_W + 24 : undefined }}
        >
          <div className="pointer-events-auto relative w-full max-w-[880px]">
            {besideTabs}
            <div className="relative max-h-[90dvh] overflow-hidden rounded-2xl border border-brown-light/20 bg-parchment shadow-2xl">
              <div ref={scrollRef} className="max-h-[90dvh] overflow-y-auto scrollbar-quiet">{children}</div>
              <div className="absolute right-4 top-3 z-20 flex items-center gap-1.5">
                {controls}
                {shut}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalScrollContext.Provider>
  );
}

/* ---------- panel ---------- */

function Panel({
  s, set, reset, sepia, catalogue, current, onGo, onHide,
}: {
  s: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void; reset: () => void; sepia: boolean;
  catalogue: Recipe[]; current: Recipe; onGo: (id: string) => void; onHide: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(s, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked; the settings are on screen */ }
  };
  const num = (k: keyof Settings) => (v: number) => set(k, v as never);
  const pill = 'rounded-full px-3 py-1.5 font-body text-[13.5px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]';

  const nav = neighbours(catalogue, current.id, s.order, s.ends, s.allSort);

  // Edge cases, found in whatever catalogue is loaded, for the current order.
  const sets = new Map<string, Recipe[]>();
  for (const r of nav.sequence) {
    const k = setKey(r, s.order);
    sets.set(k, [...(sets.get(k) ?? []), r]);
  }
  const groups = [...sets.values()];
  const biggest = groups.reduce<Recipe[]>((a, g) => (g.length > a.length ? g : a), []);
  const cases: [string, Recipe | undefined][] = [
    ['Only one in its set', groups.find((g) => g.length === 1)?.[0]],
    ['Two in its set', groups.find((g) => g.length === 2)?.[0]],
    ['First in a set', biggest.length > 1 ? biggest[0] : undefined],
    ['Last in a set', biggest.length > 1 ? biggest[biggest.length - 1] : undefined],
  ];

  // Keep the current recipe in view in the sequence list.
  const listRef = useRef<HTMLOListElement | null>(null);
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (list && row) list.scrollTop = row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2;
  }, [current.id, s.order, s.allSort]);

  let lastKey = '';
  return (
    <aside
      aria-label="Lab controls"
      className="fixed inset-x-2 bottom-2 z-[80] max-h-[55svh] overflow-y-auto rounded-[6px] bg-surface p-5 ring-1 ring-line shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] lg:inset-x-auto lg:right-4 lg:top-[6.5rem] lg:bottom-4 lg:max-h-none lg:w-[330px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-[22px] leading-tight text-brown-dark">Previous and next</p>
          <p className="mt-1 font-body text-[13px] text-brown-medium">
            Clicks swap the recipe here instead of leaving the page. The &ldquo;I cooked this&rdquo; slip is switched off.
          </p>
        </div>
        <button type="button" onClick={onHide} className={`shrink-0 ${pill}`}>Hide</button>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Group title="Design">
          <Choice label="Treatment" value={s.treatment} options={(['A', 'B', 'C'] as TreatmentKey[]).map((v) => [v, v])}
            onChange={(v) => set('treatment', v)} hint={`${s.treatment}: ${TREATMENT_NAMES[s.treatment]}`} />
          <Choice label="Theme" value={sepia ? 'night' : 'day'} options={[['day', 'Day'], ['night', 'Night']]} onChange={(v) => setTheme(v === 'night' ? 'sepia' : 'parchment')} />
          <Choice label="Where" value={s.where} options={[['page', 'Full page'], ['modal', 'Overlay']]} onChange={(v) => set('where', v)}
            hint="Overlay is the sheet you get when you open a recipe from a card or the map." />
          <p className="font-body text-[13px] leading-snug text-brown-medium">For the phone layout, make the window narrow or use the browser&rsquo;s device mode. The page follows the real window width.</p>
        </Group>

        <Group title="Order">
          <Choice label="Walk through" value={s.order} options={[['region', 'Same region'], ['country', 'Same country'], ['all', 'All recipes']]} onChange={(v) => set('order', v)} />
          {s.order === 'all' ? (
            <>
              <Choice label="All recipes, in" value={s.allSort} options={[['atlas', 'Atlas order'], ['az', 'A to Z']]} onChange={(v) => set('allSort', v)}
                hint="Atlas order goes region by region, then country, then title. A to Z matches the recipe grid today." />
              <Choice label="At the ends" value={s.ends === 'handover' ? 'wrap' : s.ends} options={[['wrap', 'Wrap around'], ['stop', 'Stop']]} onChange={(v) => set('ends', v)} hint={ENDS_HINT[s.ends === 'handover' ? 'wrap' : s.ends]} />
            </>
          ) : (
            <Choice label="At the ends" value={s.ends} options={[['handover', 'Hand over'], ['wrap', 'Wrap around'], ['stop', 'Stop']]} onChange={(v) => set('ends', v)} hint={ENDS_HINT[s.ends]} />
          )}
          <Choice label="When there is no next" value={s.endCap} options={[['link', 'Say so, link to all recipes'], ['none', 'Show nothing']]} onChange={(v) => set('endCap', v)} />
          <Choice label="Position (3 of 7)" value={s.position} options={[['off', 'Hide'], ['on', 'Show']]} onChange={(v) => set('position', v)} />
        </Group>

        <Group title="Recipe">
          <Choice label="Catalogue" value={s.catalogue} options={[['live', `Live (${catalogue.length && s.catalogue === 'live' ? catalogue.length : 'real'})`], ['mock', 'Mock']]} onChange={(v) => set('catalogue', v)} />
          <div className="flex flex-wrap gap-1.5">
            {cases.map(([label, r]) => (
              <button key={label} type="button" disabled={!r} onClick={() => r && onGo(r.id)} className={`${pill} disabled:opacity-40`}>{label}</button>
            ))}
          </div>
          <ol ref={listRef} className="relative max-h-[280px] overflow-y-auto rounded-[4px] ring-1 ring-line">
            {nav.sequence.map((r, i) => {
              const k = setKey(r, s.order);
              const head = k !== lastKey && s.order !== 'all';
              lastKey = k;
              const mark = r.id === current.id ? '●' : r.id === nav.prev?.recipe.id ? '←' : r.id === nav.next?.recipe.id ? '→' : '';
              const inSet = k === nav.setLabel;
              return (
                <li key={`${r.id}-${i}`}>
                  {head && <p className="border-t border-line px-3 pt-2 pb-0.5 font-body text-[12px] font-semibold uppercase tracking-[0.12em] text-brown-medium first:border-t-0">{k}</p>}
                  <button type="button" onClick={() => onGo(r.id)} aria-current={r.id === current.id ? 'true' : undefined}
                    className={`flex w-full items-baseline gap-2 px-3 py-1.5 text-left font-body text-[13.5px] hover:bg-brown-dark/[0.05] ${inSet ? 'text-brown-dark' : 'text-brown-medium'} ${r.id === current.id ? 'font-semibold' : ''}`}>
                    <span className="w-3 shrink-0 text-teal">{mark}</span>
                    <span className="min-w-0 flex-1 truncate">{r.name}</span>
                    {s.order === 'all' && <span className="shrink-0 text-[13px] text-brown-medium">{r.country}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </Group>

        <Group title={`Treatment ${s.treatment} knobs`}>
          {s.treatment === 'A' && (
            <>
              <Slider label="Title size" value={s.aTitle} min={18} max={32} unit="px" onChange={num('aTitle')} />
              <Choice label="Top rule" value={s.aRule} options={[['teal', 'Teal'], ['line', 'Hairline']]} onChange={(v) => set('aRule', v)} />
            </>
          )}
          {s.treatment === 'B' && (
            <>
              <Slider label="Photo width" value={s.bThumb} min={140} max={360} step={10} unit="px" onChange={num('bThumb')} hint="On phones each photo takes half the width whatever this says." />
              <Choice label="Heading" value={s.bHeading} options={[['on', 'More from…'], ['off', 'None']]} onChange={(v) => set('bHeading', v)} />
            </>
          )}
          {s.treatment === 'C' && (
            <>
              <Choice label="Titles" value={s.cReveal} options={[['hover', 'On hover'], ['always', 'Always']]} onChange={(v) => set('cReveal', v)} />
              <Slider label="Gap from the window edge" value={s.cOffset} min={0} max={32} unit="px" onChange={num('cOffset')} />
              <Choice label="In the overlay" value={s.cModalPos} options={[['controls', 'Beside close'], ['beside', 'Either side of the sheet']]} onChange={(v) => set('cModalPos', v)}
                hint="Phones always use the sheet's top row." />
              <Choice label="On a phone page" value={s.cPhoneShow} options={[['end', 'Near the end'], ['always', 'Always']]} onChange={(v) => set('cPhoneShow', v)}
                hint="Two pills in the bottom corners. Always means they sit over the recipe the whole way down." />
            </>
          )}
        </Group>

        <Group title="Gestures">
          <Choice label="Arrow keys" value={s.keys} options={[['on', 'On'], ['off', 'Off']]} onChange={(v) => set('keys', v)}
            hint="Left and right. Ignored in cook mode, over the photo viewer, and in text fields." />
          <Choice label="Swipe on phones" value={s.swipe} options={[['off', 'Off'], ['on', 'On']]} onChange={(v) => set('swipe', v)}
            hint="Ignored within 24px of the screen edge (Safari's own back swipe), in cook mode, over the photo viewer and anything that scrolls sideways." />
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

export default function RecipeNavLab() {
  const sepia = useIsSepia();
  const mobile = useIsMobile();
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { data: live = [], isPending, isError } = useRecipes();
  const modalScroll = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) setS({ ...DEFAULTS, ...(JSON.parse(saved) as Partial<Settings>) });
    } catch { /* storage blocked: defaults */ }
    const q = new URLSearchParams(window.location.search);
    setOpen(q.get('panel') !== 'closed' && window.innerWidth >= 1024);
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s, loaded]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));

  // Live once it has loaded; the mock file only when asked for, or when the
  // live read failed or came back empty. The mock file repeats some slugs.
  const catalogue = useMemo(() => {
    const pool = s.catalogue === 'mock' || isError || (!isPending && !live.length) ? MOCK_RECIPES : live;
    const seen = new Set<string>();
    return pool.filter((r) => !seen.has(r.id) && seen.add(r.id));
  }, [live, s.catalogue, isPending, isError]);
  const waiting = s.catalogue === 'live' && isPending;
  const current = catalogue.find((r) => r.id === s.recipeId) ?? catalogue[0] ?? MOCK_RECIPES[0];
  const nav = useMemo(() => neighbours(catalogue, current.id, s.order, s.ends, s.allSort), [catalogue, current.id, s.order, s.ends, s.allSort]);

  const onGo = useCallback((id: string) => {
    setS((p) => ({ ...p, recipeId: id }));
    // A real navigation lands at the top of the next recipe. In the overlay
    // the sheet's scroll box has to be reset by hand (see notes).
    if (modalScroll.current) modalScroll.current.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, []);

  const showRecipe = !waiting;
  useArrowKeys(showRecipe && s.keys === 'on', nav, onGo);
  const swiped = useSwipe(showRecipe && s.swipe === 'on', nav, onGo);

  // "Near the end" for C's phone pills: within about a screen of the bottom.
  const [nearEnd, setNearEnd] = useState(false);
  useEffect(() => {
    if (!showRecipe) return;
    const box = s.where === 'modal' ? modalScroll.current : null;
    const measure = () => {
      const top = box ? box.scrollTop : window.scrollY;
      const h = box ? box.clientHeight : window.innerHeight;
      const total = box ? box.scrollHeight : document.documentElement.scrollHeight;
      setNearEnd(total - (top + h) < h * 1.2);
    };
    measure();
    const target: HTMLElement | Window = box ?? window;
    target.addEventListener('scroll', measure, { passive: true });
    return () => target.removeEventListener('scroll', measure);
  }, [showRecipe, s.where, current.id]);

  const p: NavProps = { nav, order: s.order, knobs: s, endCap: s.endCap, showPosition: s.position === 'on', onGo };
  const isC = s.treatment === 'C';
  const panelInset = open && !mobile && typeof window !== 'undefined' && window.innerWidth >= 1024 ? PANEL_W : 0;

  const recipeAndNav = (inModal: boolean) => (
    <div className="lab-recipe">
      <RecipeDetail key={current.id} recipe={current} inModal={inModal} />
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <Treatment k={s.treatment} p={p} />
      </div>
    </div>
  );

  return (
    <>
      <style>{LAB_CSS}</style>

      {waiting ? (
        <p className="py-24 text-center font-body text-[14px] text-brown-medium">Loading recipes…</p>
      ) : s.where === 'page' ? (
        <div className={open ? 'lg:pr-[350px]' : ''}>
          {recipeAndNav(false)}
          {isC && !mobile && <EdgeTabsFixed p={p} rightInset={panelInset} />}
          {isC && mobile && <PhoneCornerPills p={p} show={s.cPhoneShow === 'always' || nearEnd} />}
        </div>
      ) : (
        <LabModal
          onClose={() => set('where', 'page')}
          scrollRef={modalScroll}
          panelOpen={panelInset > 0}
          controls={isC && s.cModalPos === 'controls' ? (
            <PillPair nav={nav} onGo={onGo} className="mr-1.5 border-r border-line pr-3" />
          ) : null}
          phoneControls={isC ? <PillPair nav={nav} onGo={onGo} /> : null}
          besideTabs={isC && s.cModalPos === 'beside' ? (
            <>
              {nav.prev && <EdgeTab n={nav.prev} dir="prev" order={s.order} onGo={onGo} reveal={s.cReveal} className="absolute right-full top-1/2 mr-3 w-max -translate-y-1/2" />}
              {nav.next && <EdgeTab n={nav.next} dir="next" order={s.order} onGo={onGo} reveal={s.cReveal} className="absolute left-full top-1/2 ml-3 w-max -translate-y-1/2" />}
            </>
          ) : null}
        >
          {recipeAndNav(true)}
        </LabModal>
      )}

      {swiped && (
        <div aria-hidden className={`pointer-events-none fixed top-1/2 z-[90] -translate-y-1/2 rounded-full bg-surface px-4 py-2 font-body text-[14px] text-brown-dark ring-1 ring-line ${swiped === 'next' ? 'right-4' : 'left-4'}`}>
          {swiped === 'next' ? 'Next' : 'Previous'}
        </div>
      )}

      {open ? (
        <Panel s={s} set={set} reset={() => setS({ ...DEFAULTS, recipeId: s.recipeId })} sepia={sepia}
          catalogue={catalogue} current={current} onGo={onGo} onHide={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="lab-show-controls fixed right-4 top-[calc(var(--nav-h,64px)+12px)] z-[80] rounded-full lg:top-auto lg:bottom-4 bg-teal px-4 py-2.5 font-body text-[14px] text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        >
          Show controls
        </button>
      )}
    </>
  );
}
