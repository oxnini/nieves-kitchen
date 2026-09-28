'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { recipeNav, type RecipeNeighbour } from '@/lib/recipe-nav';
import { useRecipes } from '@/hooks/useRecipes';
import { Eyebrow } from '@/components/courtyard';
import { useModalScrollRef } from './ModalScrollContext';

/**
 * Previous / next at the end of a recipe: a ruled footer with the two
 * neighbouring titles, walking region by region in atlas order and handing
 * over to the next region at the end of this one (lib/recipe-nav.ts). Left
 * and right arrow keys do the same. Designed in /dev/recipe-nav.
 *
 * In the overlay, a step is a client navigation that replaces the history
 * entry, so Back still closes the overlay instead of retracing every recipe.
 * On the full page it is a plain page load: a client navigation to
 * /recipes/<slug> from anywhere is caught by the @modal intercepting route,
 * which would open the overlay on top of the page (the overlay's own "Open
 * full recipe" link is a plain <a> for the same reason).
 */
export default function RecipeNav({ recipe, inModal = false }: { recipe: Recipe; inModal?: boolean }) {
  const { data: recipes } = useRecipes();
  const nav = useMemo(() => (recipes ? recipeNav(recipes, recipe.id) : null), [recipes, recipe.id]);
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const modalScroll = useModalScrollRef();

  // A new recipe in the same overlay starts at its top, as a page would.
  useEffect(() => {
    modalScroll?.current?.scrollTo({ top: 0 });
  }, [recipe.id, modalScroll]);

  useEffect(() => {
    if (!nav) return;
    const { prev, next } = nav;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
      // RecipeModal mounts its content twice (desktop and phone sheets, one
      // hidden), so only the copy that is actually on screen answers.
      if (!ref.current?.offsetParent) return;
      if (arrowsTaken(e.target)) return;
      const n = e.key === 'ArrowLeft' ? prev : next;
      if (!n) return;
      e.preventDefault();
      const href = `/recipes/${n.recipe.id}`;
      if (inModal) router.replace(href);
      else window.location.assign(href);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav, inModal, router]);

  if (!nav) return null;

  const side = (n: RecipeNeighbour, dir: 'prev' | 'next') => {
    const Tag = inModal ? Link : 'a';
    return (
    <Tag
      href={`/recipes/${n.recipe.id}`}
      replace={inModal || undefined}
      rel={dir}
      className={`group block py-5 rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${dir === 'next' ? 'sm:text-right' : ''}`}
    >
      <Eyebrow tone="muted" className={`flex items-center gap-1.5 ${dir === 'next' ? 'sm:justify-end' : ''}`}>
        {dir === 'prev' && <ArrowLeft size={16} aria-hidden="true" />}
        {dir === 'prev' ? 'Previous' : 'Next'}
        {dir === 'next' && <ArrowRight size={16} aria-hidden="true" />}
      </Eyebrow>
      <span className="mt-1.5 block font-heading text-[22px] font-normal leading-tight text-brown-dark transition-colors group-hover:text-teal">
        {n.recipe.name}
      </span>
      <span className="mt-1 block text-[14px] text-brown-medium">
        {n.newRegion ? `New region · ${n.newRegion}` : n.recipe.country ?? n.recipe.region}
      </span>
    </Tag>
    );
  };

  return (
    <nav ref={ref} aria-label="More recipes" className="mt-10 border-t border-b border-t-teal border-b-line">
      {nav.regionSize > 1 && (
        <p className="border-b border-line py-2.5 text-center text-[13px] text-brown-medium">
          {nav.index + 1} of {nav.regionSize} from {nav.region}
        </p>
      )}
      <div className="grid sm:grid-cols-2">
        <div className="min-w-0 sm:pr-6">{nav.prev && side(nav.prev, 'prev')}</div>
        <div className={`min-w-0 sm:pl-6 ${nav.prev ? 'border-t border-line sm:border-t-0 sm:border-l' : ''}`}>
          {side(nav.next, 'next')}
        </div>
      </div>
    </nav>
  );
}

/** Left/right belong to something else: cook mode, the photo viewer, a
 *  text field or slider, or anything that scrolls sideways. */
function arrowsTaken(target: EventTarget | null): boolean {
  if (document.querySelector('[data-cook-mode]')) return true;
  if (document.querySelector('[aria-label^="Expanded image"]')) return true;
  const el = target instanceof Element ? target : null;
  if (!el) return false;
  if (el.closest('input, textarea, select, [contenteditable="true"], [role="slider"]')) return true;
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
    const ox = getComputedStyle(n).overflowX;
    if ((ox === 'auto' || ox === 'scroll') && n.scrollWidth > n.clientWidth + 1) return true;
  }
  return false;
}
