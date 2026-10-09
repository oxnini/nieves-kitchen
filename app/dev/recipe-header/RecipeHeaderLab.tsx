'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Maximize2, X } from 'lucide-react';
import { ModalScrollContext } from '@/components/recipe/ModalScrollContext';
import { useRecipes } from '@/hooks/useRecipes';
import { useIsMobile } from '@/hooks/useIsMobile';
import { setTheme, useIsSepia } from '@/hooks/useTheme';
import { MOCK_RECIPES } from '@/lib/mock-recipes';
import { Choice, Group, Slider } from '../hero-viewport/controls';
import LabRecipeDetail, { DEFAULT_KNOBS, type HeaderKnobs, type Layout } from './LabRecipeDetail';

/**
 * /dev/recipe-header: audit F2 (the dish photo never reaches the first screen
 * of a recipe on a laptop, nor in the overlay) and F22 (the lede runs about
 * 115 characters a line). Three ways to bring the plate up, against "Now",
 * on a lab copy of RecipeDetail over the frosted ground, as a page or inside
 * a replica of the @modal sheet. Phones are the same in every layout (the
 * plate already follows the facts row there); narrow the window or use device
 * mode to check. The "I cooked this" slip is inert. Settings persist in
 * localStorage for this viewer only.
 */

const STORE = 'nieves-lab-recipe-header-v1';
const PANEL_W = 350;

type Settings = HeaderKnobs & {
  where: 'page' | 'modal';
  catalogue: 'live' | 'mock';
  recipeId: string;
  fold: 'on' | 'off';
};

const DEFAULTS: Settings = { ...DEFAULT_KNOBS, where: 'page', catalogue: 'live', recipeId: '', fold: 'on' };

const LAYOUTS: [Layout, string][] = [
  ['now', 'Now'],
  ['title', 'A · Beside the title'],
  ['lede', 'B · Beside the lede'],
  ['wide', 'C · Wide plate'],
];

const LAYOUT_HINT: Record<Layout, string> = {
  now: 'Production today. The photo tops the Method page, about 1,100px down. The measure and Start cooking knobs do nothing here.',
  title: 'The audit mockup. Title, facts and actions on the left, the plate on the right, the lede below.',
  lede: 'The title keeps the full width. The plate sits beside the narrowed lede, filling the room the measure frees up.',
  wide: 'A contained landscape plate across the column, under the facts row, then the lede.',
};

const FLAVOUR_HINT: Record<HeaderKnobs['flavour'], string> = {
  heat: 'A Heat fact (Mild, Medium, Hot) beside Difficulty, from the spicy score. Hidden when a dish has no heat.',
  words: 'Every taste scored 3 or more, strongest first: "Tastes savoury, salty and spicy".',
  none: 'No flavour information at all.',
  chart: 'The six-point radar, as today.',
};

/* Justified lede: even word spacing needs hyphenation. */
const LAB_CSS = `.lab-justify p { text-align: justify; hyphens: auto; -webkit-hyphens: auto; }`;

/* ---------- the modal sheet, minus the router ---------- */

function LabModal({ children, onClose, scrollRef, panelOpen }: {
  children: ReactNode; onClose: () => void; scrollRef: React.RefObject<HTMLDivElement | null>; panelOpen: boolean;
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
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end gap-2 px-3 pb-3 pt-2.5">
              <div className="pointer-events-auto flex items-center gap-1.5">{shut}</div>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="dialog" aria-modal="true" aria-label="Recipe detail"
          className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ paddingRight: panelOpen ? PANEL_W + 24 : undefined }}
        >
          <div className="pointer-events-auto relative w-full max-w-[880px]">
            <div className="relative max-h-[90dvh] overflow-hidden rounded-2xl border border-brown-light/20 bg-parchment shadow-2xl">
              <div ref={scrollRef} className="max-h-[90dvh] overflow-y-auto scrollbar-quiet">{children}</div>
              <div className="absolute right-4 top-3 z-20 flex items-center gap-1.5">{shut}</div>
            </div>
          </div>
        </div>
      )}
    </ModalScrollContext.Provider>
  );
}

/* ---------- panel ---------- */

function Panel({ s, set, reset, sepia, ids, onHide }: {
  s: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void; reset: () => void; sepia: boolean;
  ids: { id: string; name: string; extras: number }[]; onHide: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(s, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked; the settings are on screen */ }
  };
  const side = s.layout === 'title' || s.layout === 'lede';
  const narrowedLede = s.layout === 'title' || s.layout === 'wide';
  const pill = 'rounded-full px-3 py-1.5 font-body text-[13.5px] text-brown-dark ring-1 ring-line hover:bg-brown-dark/[0.05]';

  return (
    <aside
      aria-label="Lab controls"
      className="fixed inset-x-2 bottom-2 z-[80] max-h-[55svh] overflow-y-auto rounded-[6px] bg-surface p-5 ring-1 ring-line shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] lg:inset-x-auto lg:right-4 lg:top-[6.5rem] lg:bottom-4 lg:max-h-none lg:w-[330px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-[22px] leading-tight text-brown-dark">Recipe header</p>
          <p className="mt-1 font-body text-[13px] text-brown-medium">
            Bringing the dish photo into the first screen (audit F2) and holding the lede to a readable measure (F22).
          </p>
        </div>
        <button type="button" onClick={onHide} className={`shrink-0 ${pill}`}>Hide</button>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Group title="Layout">
          <Choice label="Plate" value={s.layout} options={LAYOUTS} onChange={(v) => set('layout', v)} hint={LAYOUT_HINT[s.layout]} />
          <Choice label="Theme" value={sepia ? 'night' : 'day'} options={[['day', 'Day'], ['night', 'Night']]} onChange={(v) => setTheme(v === 'night' ? 'sepia' : 'parchment')} />
          <Choice label="Where" value={s.where} options={[['page', 'Full page'], ['modal', 'Overlay']]} onChange={(v) => set('where', v)}
            hint="Overlay is the sheet you get when you open a recipe from a card or the map." />
          <Choice label="First-screen line" value={s.fold} options={[['on', 'Show'], ['off', 'Hide']]} onChange={(v) => set('fold', v)}
            hint="A dashed line where a 1440×900 laptop's first screen ends, on the full page only." />
          <p className="font-body text-[13px] leading-snug text-brown-medium">Phones look the same in every layout. To check, make the window narrow or use the browser&rsquo;s device mode.</p>
        </Group>

        {s.layout !== 'now' && (
          <Group title="Plate">
            {side && (
              <>
                <Choice label="Shape" value={s.shape} options={[['3 / 2', '3:2'], ['4 / 3', '4:3'], ['1 / 1', 'Square']]} onChange={(v) => set('shape', v)} />
                <Slider label="Plate width" value={s.plateCol} min={38} max={56} unit="%" onChange={(v) => set('plateCol', v)}
                  hint="Its share of the header width, from tablet up." />
              </>
            )}
            {s.layout === 'title' && (
              <Choice label="Long titles" value={s.titleFit} options={[['auto', 'Across the top when long'], ['across', 'Always across the top'], ['shrink', 'Smaller when long'], ['same', 'Leave']]} onChange={(v) => set('titleFit', v)}
                hint="Long means over 22 characters (Gochujang Double-Fried Chicken is 30). Across the top puts the plate beside the facts instead." />
            )}
            {s.layout === 'title' && (
              <Choice label="Line the text up with the plate's" value={s.align} options={[['end', 'Bottom'], ['start', 'Top']]} onChange={(v) => set('align', v)} />
            )}
            {s.layout === 'wide' && (
              <Choice label="Shape" value={s.wideShape} options={[['16 / 9', '16:9'], ['2 / 1', '2:1'], ['5 / 2', '5:2']]} onChange={(v) => set('wideShape', v)}
                hint="From tablet up. Phones keep 3:2." />
            )}
          </Group>
        )}

        {s.layout !== 'now' && (
          <Group title="Text">
            <Slider label="Lede measure" value={s.measure} min={50} max={120} unit="ch" onChange={(v) => set('measure', v)}
              hint="About 62 is the audit's suggestion. Today it runs to the column edge, about 115." />
            {narrowedLede && (
              <Choice label="Beside the lede" value={s.beside} options={[['info', 'Nutrition and compass'], ['space', 'Open space']]} onChange={(v) => set('beside', v)}
                hint="Open space keeps today's info block below the lede at full width." />
            )}
            <Choice label="Lede edges" value={s.ledeAlign} options={[['justify', 'Justified'], ['left', 'Ragged right']]} onChange={(v) => set('ledeAlign', v)}
              hint="Justified lines both margins up, with hyphenation so the spacing stays even." />
            <Choice label="Start cooking" value={s.start} options={[['header', 'In the header'], ['now', 'Before the recipe'], ['both', 'Both']]} onChange={(v) => set('start', v)}
              hint="Before the recipe is where it is today, under Equipment. Applies on phones too." />
          </Group>
        )}

        {s.layout !== 'now' && (
          <Group title="Info">
            <Choice label="Nutrition" value={s.nutrition} options={[['tiles', 'Under the facts, tiles'], ['row', 'Under the facts, row'], ['section', 'Own section']]} onChange={(v) => set('nutrition', v)}
              hint="Under the facts takes the dietary line with it. Own section is where it sits today, below the lede." />
            <Choice label="Flavour" value={s.flavour} options={[['heat', 'Heat in the facts'], ['words', 'A line of words'], ['none', 'Retire it'], ['chart', 'Chart (today)']]} onChange={(v) => set('flavour', v)}
              hint={FLAVOUR_HINT[s.flavour]} />
          </Group>
        )}

        <Group title="Recipe">
          <Choice label="Catalogue" value={s.catalogue} options={[['live', 'Live'], ['mock', 'Mock']]} onChange={(v) => set('catalogue', v)} />
          <div className="flex flex-col">
            {ids.map((r) => (
              <button key={r.id} type="button" onClick={() => set('recipeId', r.id)} aria-current={r.id === s.recipeId ? 'true' : undefined}
                className={`flex items-baseline justify-between gap-2 rounded-[3px] px-2 py-1.5 text-left font-body text-[13.5px] hover:bg-brown-dark/[0.05] ${r.id === s.recipeId ? 'font-semibold text-brown-dark' : 'text-brown-medium'}`}>
                <span className="min-w-0 truncate">{r.name}</span>
                {r.extras > 0 && <span className="shrink-0 text-[13px]">+{r.extras} photos</span>}
              </button>
            ))}
          </div>
          <p className="font-body text-[13px] leading-snug text-brown-medium">
            Recipes with extra photos show whether they still land beside Ingredients or move to the row below.
          </p>
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

export default function RecipeHeaderLab() {
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
  const ids = catalogue.map((r) => ({ id: r.id, name: r.name, extras: r.images?.length ?? 0 }));

  // A new recipe or layout lands at the top, as a real navigation would.
  useEffect(() => {
    modalScroll.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [current.id, s.where]);

  const panelOpen = open && !mobile && typeof window !== 'undefined' && window.innerWidth >= 1024;
  const recipe = (inModal: boolean) => (
    <LabRecipeDetail key={`${current.id}-${s.layout}`} recipe={current} inModal={inModal} knobs={s} />
  );

  return (
    <>
      <style>{LAB_CSS}</style>
      {waiting ? (
        <p className="py-24 text-center font-body text-[14px] text-brown-medium">Loading recipes…</p>
      ) : s.where === 'page' ? (
        <div className={open ? 'lg:pr-[350px]' : ''}>{recipe(false)}</div>
      ) : (
        <LabModal onClose={() => set('where', 'page')} scrollRef={modalScroll} panelOpen={panelOpen}>
          {recipe(true)}
        </LabModal>
      )}

      {/* Where a 1440×900 laptop's first screen ends. The page sits under the
          fixed navbar, so 900px of window is 900px from the top of the page. */}
      {s.where === 'page' && s.fold === 'on' && !mobile && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[900px] z-[55] border-t-2 border-dashed border-terracotta/70">
          <span className="absolute left-3 -top-6 rounded-sm bg-surface px-1.5 py-0.5 font-body text-[12px] text-terracotta ring-1 ring-line">
            First screen ends (1440×900)
          </span>
        </div>
      )}

      {open ? (
        <Panel s={s} set={set} reset={() => setS({ ...DEFAULTS, recipeId: s.recipeId })} sepia={sepia}
          ids={ids} onHide={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 top-[calc(var(--nav-h,64px)+12px)] z-[80] rounded-full lg:top-auto lg:bottom-4 bg-teal px-4 py-2.5 font-body text-[14px] text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        >
          Show controls
        </button>
      )}
    </>
  );
}
