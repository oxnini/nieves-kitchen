'use client';

import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Eyebrow } from '@/components/courtyard';
import type { Recipe } from '@/lib/types';
import type { Neighbour, NavResult, Order } from './ordering';

/* The three prev/next treatments for /dev/recipe-nav. Presentational only:
   the lab hands in the neighbours and an onGo, so a click swaps the fixture
   recipe instead of routing. In the real build each link becomes a
   next/link to /recipes/<slug> (see the notes in RecipeNavLab). */

export type TreatmentKey = 'A' | 'B' | 'C';

export const TREATMENT_NAMES: Record<TreatmentKey, string> = {
  A: 'Ruled footer with titles',
  B: 'Thumbnail pair',
  C: 'Slim edge control',
};

export type NavKnobs = {
  aTitle: number; aRule: 'teal' | 'line';
  bThumb: number; bHeading: 'on' | 'off';
  cOffset: number; cReveal: 'hover' | 'always'; cModalPos: 'controls' | 'beside'; cPhoneShow: 'always' | 'end';
};

export type NavProps = {
  nav: NavResult;
  order: Order;
  knobs: NavKnobs;
  endCap: 'none' | 'link';
  showPosition: boolean;
  onGo: (id: string) => void;
};

/* ---------- shared bits ---------- */

const setNoun = (order: Order) => (order === 'region' ? 'region' : 'country');

/** "China" for a recipe in the same set, "New region · Middle East" when the
 *  step walks out of it. */
function subLine(n: Neighbour, order: Order): string {
  if (n.crossesInto) return `New ${setNoun(order)} · ${n.crossesInto}`;
  return n.recipe.country ?? n.recipe.region ?? '';
}

function fromLabel(nav: NavResult, order: Order): string {
  return order === 'all' ? 'All recipes' : `More from ${nav.setLabel}`;
}

function positionLine(nav: NavResult, order: Order): string {
  const where = order === 'all' ? '' : ` from ${nav.setLabel}`;
  return `${nav.index + 1} of ${nav.set.length}${where}`;
}

/** The end of the set when the ends stop: one quiet sentence and a way back. */
function endCapText(nav: NavResult, order: Order): string {
  if (nav.set.length === 1) {
    return order === 'all' ? 'This is the only recipe so far.' : `This is the only recipe from ${nav.setLabel} so far.`;
  }
  return order === 'all' ? 'That is every recipe so far.' : `That is every recipe from ${nav.setLabel} so far.`;
}

function endCapHref(nav: NavResult, order: Order): string {
  return order === 'country' ? `/recipes?country=${encodeURIComponent(nav.setLabel)}` : '/recipes';
}

function go(onGo: (id: string) => void, r: Recipe) {
  return (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through
    e.preventDefault();
    onGo(r.id);
  };
}

const focusRing = 'rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';

export function hasAnything(p: NavProps): boolean {
  return !!(p.nav.prev || p.nav.next || p.endCap === 'link');
}

function EndCap({ nav, order, align = 'left' }: { nav: NavResult; order: Order; align?: 'left' | 'right' | 'center' }) {
  return (
    <div className={`py-5 ${align === 'right' ? 'sm:text-right' : align === 'center' ? 'text-center' : ''}`}>
      <p className="font-body text-[14px] text-brown-medium">{endCapText(nav, order)}</p>
      <a href={endCapHref(nav, order)} className={`mt-1 inline-block font-body text-[14px] font-semibold text-teal underline-offset-4 hover:underline ${focusRing}`}>
        See all recipes
      </a>
    </div>
  );
}

/* ---------- A: ruled footer ---------- */

export function RuledFooter(p: NavProps) {
  const { nav, order, knobs, endCap, showPosition, onGo } = p;
  if (!hasAnything(p)) return null;
  const side = (n: Neighbour, dir: 'prev' | 'next') => (
    <a
      href={`/recipes/${n.recipe.id}`}
      onClick={go(onGo, n.recipe)}
      rel={dir}
      className={`group block py-5 ${dir === 'next' ? 'sm:text-right' : ''} ${focusRing}`}
    >
      <Eyebrow tone="muted" className={`flex items-center gap-1.5 ${dir === 'next' ? 'sm:justify-end' : ''}`}>
        {dir === 'prev' && <ArrowLeft size={16} aria-hidden />}
        {dir === 'prev' ? 'Previous' : 'Next'}
        {dir === 'next' && <ArrowRight size={16} aria-hidden />}
      </Eyebrow>
      <span
        className="mt-1.5 block font-heading font-normal leading-tight text-brown-dark transition-colors group-hover:text-teal"
        style={{ fontSize: knobs.aTitle }}
      >
        {n.recipe.name}
      </span>
      <span className="mt-1 block font-body text-[14px] text-brown-medium">{subLine(n, order)}</span>
    </a>
  );
  const atEnd = !nav.next && endCap === 'link';
  const alone = !nav.prev && !nav.next;
  return (
    <nav aria-label="More recipes" className={`mt-10 border-t border-b border-b-line ${knobs.aRule === 'teal' ? 'border-t-teal' : 'border-t-line'}`}>
      {showPosition && nav.set.length > 1 && (
        <p className="border-b border-line py-2.5 text-center font-body text-[13px] text-brown-medium">{positionLine(nav, order)}</p>
      )}
      {alone ? <EndCap nav={nav} order={order} align="center" /> : (
      <div className="grid sm:grid-cols-2">
        <div className="min-w-0 sm:pr-6">{nav.prev ? side(nav.prev, 'prev') : null}</div>
        <div className={`min-w-0 sm:pl-6 ${nav.prev ? 'border-t border-line sm:border-t-0 sm:border-l' : ''}`}>
          {nav.next ? side(nav.next, 'next') : atEnd ? <EndCap nav={nav} order={order} align="right" /> : null}
        </div>
      </div>
      )}
    </nav>
  );
}

/* ---------- B: thumbnail pair ---------- */

export function ThumbnailPair(p: NavProps) {
  const { nav, order, knobs, endCap, showPosition, onGo } = p;
  if (!hasAnything(p)) return null;
  const card = (n: Neighbour, dir: 'prev' | 'next') => (
    <a
      href={`/recipes/${n.recipe.id}`}
      onClick={go(onGo, n.recipe)}
      rel={dir}
      className={`group block min-w-0 ${focusRing}`}
      style={{ width: `min(${knobs.bThumb}px, 100%)` }}
    >
      <Eyebrow tone="muted" className={`mb-2 flex items-center gap-1.5 ${dir === 'next' ? 'justify-end' : ''}`}>
        {dir === 'prev' && <ArrowLeft size={16} aria-hidden />}
        {dir === 'prev' ? 'Previous' : 'Next'}
        {dir === 'next' && <ArrowRight size={16} aria-hidden />}
      </Eyebrow>
      <span className="relative block aspect-[3/2] overflow-hidden rounded-[3px] bg-parchment-dark">
        {n.recipe.image && (
          <Image
            src={n.recipe.image}
            alt=""
            fill
            sizes={`(max-width: 640px) 45vw, ${knobs.bThumb}px`}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        )}
      </span>
      <span className={`mt-2.5 block font-heading text-[19px] leading-tight text-brown-dark transition-colors group-hover:text-teal ${dir === 'next' ? 'text-right' : ''}`}>
        {n.recipe.name}
      </span>
      <span className={`mt-1 block font-body text-[14px] text-brown-medium ${dir === 'next' ? 'text-right' : ''}`}>{subLine(n, order)}</span>
    </a>
  );
  return (
    <nav aria-label="More recipes" className="mt-12">
      {knobs.bHeading === 'on' && (
        <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-brown-dark pb-2.5">
          <h2 className="font-heading text-[25px] font-normal text-brown-dark">{fromLabel(nav, order)}</h2>
          {showPosition && nav.set.length > 1 && (
            <span className="shrink-0 font-body text-[13px] text-brown-medium">{positionLine(nav, order)}</span>
          )}
        </div>
      )}
      {!nav.prev && !nav.next ? <EndCap nav={nav} order={order} align="center" /> : (
      <div className="grid grid-cols-2 items-start gap-4 sm:gap-8">
        <div className="flex min-w-0 justify-start">{nav.prev && card(nav.prev, 'prev')}</div>
        <div className="flex min-w-0 justify-end">
          {nav.next ? card(nav.next, 'next') : endCap === 'link' ? <EndCap nav={nav} order={order} align="right" /> : null}
        </div>
      </div>
      )}
    </nav>
  );
}

/* ---------- C: slim edge control ---------- */

/** A paper tab: chevron always, the title sliding out on hover/focus (or
 *  always). `edge` says which side is flush, so its outer corners go square. */
export function EdgeTab({
  n, dir, order, onGo, reveal, style, className = '',
}: {
  n: Neighbour; dir: 'prev' | 'next'; order: Order; onGo: (id: string) => void;
  reveal: 'hover' | 'always'; style?: CSSProperties; className?: string;
}) {
  const open = reveal === 'always';
  return (
    <a
      href={`/recipes/${n.recipe.id}`}
      onClick={go(onGo, n.recipe)}
      rel={dir}
      aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} recipe: ${n.recipe.name}`}
      style={style}
      className={`group flex items-center gap-1 rounded-[4px] bg-surface py-3 text-brown-dark ring-1 ring-line shadow-[0_12px_30px_-16px_rgba(0,0,0,0.45)] transition-colors hover:text-teal ${
        dir === 'prev' ? 'flex-row pl-2 pr-2.5' : 'flex-row-reverse pl-2.5 pr-2'
      } ${focusRing} ${className}`}
    >
      {dir === 'prev' ? <ChevronLeft size={20} aria-hidden className="shrink-0" /> : <ChevronRight size={20} aria-hidden className="shrink-0" />}
      <span
        className={`grid transition-[grid-template-columns] duration-300 ease-out ${
          open ? 'grid-cols-[1fr]' : 'grid-cols-[0fr] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]'
        }`}
      >
        <span className={`min-w-0 overflow-hidden ${dir === 'next' ? 'text-right' : ''}`}>
          <span className="block w-max max-w-[220px] px-1">
            <span className="block font-body text-[13px] text-brown-medium">{dir === 'prev' ? 'Previous' : 'Next'} · {subLine(n, order)}</span>
            <span className="block truncate font-heading text-[17px] leading-snug">{n.recipe.name}</span>
          </span>
        </span>
      </span>
    </a>
  );
}

/** Small paper pills for tight spots: the overlay's control row and phones. */
export function PillPair({
  nav, onGo, labels = false, className = '',
}: { nav: NavResult; onGo: (id: string) => void; labels?: boolean; className?: string }) {
  const pill = `inline-flex items-center gap-1 rounded-full bg-surface ring-1 ring-line text-brown-dark hover:bg-parchment-dark transition-colors ${focusRing}`;
  const size = labels ? 'h-11 px-3.5 font-body text-[14px] font-semibold' : 'p-2';
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {nav.prev && (
        <a href={`/recipes/${nav.prev.recipe.id}`} onClick={go(onGo, nav.prev.recipe)} rel="prev"
          title={`Previous: ${nav.prev.recipe.name}`} aria-label={`Previous recipe: ${nav.prev.recipe.name}`} className={`${pill} ${size}`}>
          <ChevronLeft size={labels ? 18 : 16} aria-hidden />{labels && 'Previous'}
        </a>
      )}
      {nav.next && (
        <a href={`/recipes/${nav.next.recipe.id}`} onClick={go(onGo, nav.next.recipe)} rel="next"
          title={`Next: ${nav.next.recipe.name}`} aria-label={`Next recipe: ${nav.next.recipe.name}`} className={`${pill} ${size}`}>
          {labels && 'Next'}<ChevronRight size={labels ? 18 : 16} aria-hidden />
        </a>
      )}
    </div>
  );
}

/** Page placement of C on a laptop: tabs fixed to the window edges, halfway
 *  down. `rightInset` keeps the right tab clear of the lab panel. */
export function EdgeTabsFixed({ p, rightInset }: { p: NavProps; rightInset: number }) {
  const { nav, order, knobs, onGo } = p;
  return (
    <>
      {nav.prev && (
        <EdgeTab n={nav.prev} dir="prev" order={order} onGo={onGo} reveal={knobs.cReveal}
          className="fixed top-1/2 z-30 -translate-y-1/2" style={{ left: knobs.cOffset }} />
      )}
      {nav.next && (
        <EdgeTab n={nav.next} dir="next" order={order} onGo={onGo} reveal={knobs.cReveal}
          className="fixed top-1/2 z-30 -translate-y-1/2" style={{ right: knobs.cOffset + rightInset }} />
      )}
    </>
  );
}

/** Page placement of C on a phone: labelled pills in the bottom corners,
 *  either always or only once the reader is near the end of the page. */
export function PhoneCornerPills({ p, show }: { p: NavProps; show: boolean }) {
  return (
    <div
      aria-hidden={!show}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 ${
        show ? 'opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="pointer-events-auto">{p.nav.prev && <PillPair nav={{ ...p.nav, next: null }} onGo={p.onGo} labels />}</div>
      <div className="pointer-events-auto">{p.nav.next && <PillPair nav={{ ...p.nav, prev: null }} onGo={p.onGo} labels />}</div>
    </div>
  );
}

/** C's end-of-page companion: without it a stop-at-the-end set would just go
 *  quiet. Only the end cap and position, no second set of links. */
export function EdgeFooterNote(p: NavProps) {
  const { nav, order, endCap, showPosition } = p;
  const cap = !nav.next && endCap === 'link';
  if (!cap && !(showPosition && nav.set.length > 1)) return null;
  return (
    <div className="mt-10 border-t border-line text-center">
      {showPosition && nav.set.length > 1 && <p className="pt-3 font-body text-[13px] text-brown-medium">{positionLine(nav, order)}</p>}
      {cap && <EndCap nav={nav} order={order} align="center" />}
    </div>
  );
}

/* ---------- gestures ---------- */

/** True while something else owns left/right: cook mode, the lightbox, a
 *  text field or slider, or anything that scrolls sideways. */
function blocked(target: EventTarget | null): boolean {
  if (document.querySelector('[data-cook-mode]')) return true;
  if (document.querySelector('[aria-label^="Expanded image"]')) return true;
  const el = target instanceof Element ? target : null;
  if (!el) return false;
  if (el.closest('input, textarea, select, [contenteditable="true"], [role="slider"], [data-no-swipe], [aria-label="Lab controls"]')) return true;
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
    const ox = getComputedStyle(n).overflowX;
    if ((ox === 'auto' || ox === 'scroll') && n.scrollWidth > n.clientWidth + 1) return true;
  }
  return false;
}

export function useArrowKeys(enabled: boolean, nav: NavResult, onGo: (id: string) => void) {
  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey || blocked(e.target)) return;
      const n = e.key === 'ArrowLeft' ? nav.prev : nav.next;
      if (!n) return;
      e.preventDefault();
      onGo(n.recipe.id);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, nav, onGo]);
}

/** Horizontal swipe on phones. Deliberately strict: it ignores touches that
 *  start within 24px of either screen edge (iOS Safari's own back/forward
 *  swipe lives there), anything `blocked`, and anything that is not clearly
 *  sideways (|dx| > 70px, more than twice |dy|, under 600ms). */
export function useSwipe(enabled: boolean, nav: NavResult, onGo: (id: string) => void) {
  const [hint, setHint] = useState<'prev' | 'next' | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let start: { x: number; y: number; t: number } | null = null;
    function down(e: TouchEvent) {
      const t = e.touches[0];
      if (e.touches.length !== 1 || t.clientX < 24 || t.clientX > window.innerWidth - 24 || blocked(e.target)) {
        start = null;
        return;
      }
      start = { x: t.clientX, y: t.clientY, t: e.timeStamp };
    }
    function up(e: TouchEvent) {
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const quick = e.timeStamp - start.t < 600;
      start = null;
      if (!quick || Math.abs(dx) < 70 || Math.abs(dx) < 2 * Math.abs(dy)) return;
      const n = dx < 0 ? nav.next : nav.prev;
      if (!n) return;
      setHint(dx < 0 ? 'next' : 'prev');
      setTimeout(() => setHint(null), 700);
      onGo(n.recipe.id);
    }
    window.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchend', up, { passive: true });
    return () => {
      window.removeEventListener('touchstart', down);
      window.removeEventListener('touchend', up);
    };
  }, [enabled, nav, onGo]);
  return hint;
}

export function Treatment({ k, p }: { k: TreatmentKey; p: NavProps }): ReactNode {
  if (k === 'A') return <RuledFooter {...p} />;
  if (k === 'B') return <ThumbnailPair {...p} />;
  return <EdgeFooterNote {...p} />;
}
