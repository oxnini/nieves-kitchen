'use client';

/**
 * The Pantry (2026-09 "Glazed Folio" restyle, then audit F9 on 2026-10-13;
 * spec 2026-09-25 §10).
 *
 * One page, one job: the ingredients I cook with most, in one ruled grid,
 * most used first. Picking a plate shows what it does and every recipe that
 * features it (`featuredIngredients`): beside the grid from md, as an overlay
 * on phones. A two-part filter narrows the grid to the Sunnah foods. The page
 * opens on the most-used entry, or on `?entry=<slug>` when a recipe page links
 * in (on phones that opens its overlay too).
 *
 * The reading panel carries the note, a "Good for you" benefit row, the
 * set-apart prophetic passage (Sunnah foods; label keeps the ﷺ), and the
 * recipes that cook with it. Only entries with real ink art on disk reach here
 * (`landedPantryEntries`).
 *
 * Ink art (the pantry drawings) sits directly on the page by day and falls
 * back to the warm paper `.ink-plinth` at night (app/globals.css) — dark line
 * work on transparency would otherwise vanish on the night paper.
 *
 * "Cook from what I have", the checklist mode, was retired in F9: with one to
 * four featured ingredients per recipe it repeated what a plate already shows.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Eyebrow } from '@/components/courtyard/Eyebrow';
import type { PantryEntry, PantryKind } from '@/data/pantry';
import { useRecipes } from '@/hooks/useRecipes';
import { formatMinutes } from '@/lib/recipes/format';
import type { Recipe } from '@/lib/types';

/* ── Small pieces ─────────────────────────────────────────────────────────── */

function capitalizeKind(kind: PantryKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

/** The `.meta span + span::before` separator (RecipeCard): a small rotated
    terracotta square between meta items. Decorative only. */
function MetaDot() {
  return <span aria-hidden="true" className="inline-block h-1 w-1 shrink-0 rotate-45 bg-terracotta" />;
}

/** The Sunnah mark: a small tracked-caps word (replaces the retired terracotta
    diamond marker). `tone="lit"` is for the theme-stable dark passage card, where
    the ordinary theme-aware terracotta would go dark-on-dark by day. */
function SunnahLabel({ tone = 'terracotta', className = '' }: { tone?: 'terracotta' | 'lit'; className?: string }) {
  return (
    <span
      className={`font-body text-[10.5px] font-semibold uppercase tracking-[0.12em] ${
        tone === 'lit' ? 'text-terracotta-lit' : 'text-terracotta'
      } ${className}`}
    >
      Sunnah
    </span>
  );
}

/** Shelf plate art: transparent by day, the warm plinth at night (`.ink-plinth`).
    Decorative — the plate's visible name text already carries it, so `alt=""`
    keeps the plate button's accessible name from repeating itself. */
function PlateArt({ entry }: { entry: PantryEntry }) {
  return (
    <span className="ink-plinth relative mx-auto block aspect-square w-full max-w-[96px] rounded-[3px]">
      <Image src={entry.artSrc} alt="" fill sizes="96px" className="object-contain p-1.5" />
    </span>
  );
}

/** Reading-panel art: the plinth in both themes (spec §10 — small art on a surface).
    Decorative — it duplicates the adjacent h2, so `alt=""`. */
function ReadingArt({ entry, size = 120 }: { entry: PantryEntry; size?: number }) {
  return (
    <span
      className="relative block shrink-0 rounded-[3px] bg-plinth"
      style={{ width: size, height: size }}
    >
      <Image src={entry.artSrc} alt="" fill sizes={`${size}px`} className="object-contain p-3" />
    </span>
  );
}

function GoodForYou({ points }: { points: string[] }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 text-[13px]">
      <Eyebrow as="span" tone="muted" className="mr-1">Good for you</Eyebrow>
      {points.map((p) => (
        <span key={p} className="rounded-full px-3 py-1 text-brown-dark shadow-[inset_0_0_0_1px_var(--color-line)]">
          {p}
        </span>
      ))}
    </div>
  );
}

function Passage({ prophetic }: { prophetic: NonNullable<PantryEntry['prophetic']> }) {
  return (
    <div className="pantry-passage mb-5 rounded-[3px] bg-night px-5 py-5">
      <div className="mb-2 flex items-center gap-2.5 text-[13.5px] font-semibold text-cream">
        <SunnahLabel tone="lit" />
        <span>From the Prophet’s ﷺ table</span>
      </div>
      <p className="font-heading text-[17.5px] leading-[1.45] text-cream">{prophetic.note}</p>
      <p className="mt-2.5 text-[13px] text-cream/80">{prophetic.citation}</p>
    </div>
  );
}

function CookWith({ entry, recipes }: { entry: PantryEntry; recipes: Recipe[] }) {
  const list = recipes.filter((r) => r.featuredIngredients.includes(entry.slug));
  return (
    <div>
      <Eyebrow as="span" className="mb-2 block">
        Cook with it{list.length > 0 && ` · ${countRecipes(list.length)}`}
      </Eyebrow>
      {list.length ? (
        <div>
          {list.map((r) => (
            <Link
              key={r.id}
              href={`/recipes/${encodeURIComponent(r.id)}`}
              className="flex items-center gap-3 border-t border-line py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <span className="relative h-11 w-[66px] shrink-0 overflow-hidden rounded-[2px]">
                <Image src={r.image} alt={r.name} fill sizes="66px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-[17px] font-normal leading-tight text-brown-dark">
                  {r.name}
                </span>
                <span className="flex items-center gap-1.5 text-[12.5px] text-brown-medium">
                  <span className="truncate">{r.country}</span>
                  <MetaDot />
                  <span className="nums-tabular shrink-0">{formatMinutes(r.time.total)}</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-2 text-sm italic text-brown-medium">Nothing on the site cooks with it yet. That will not last.</p>
      )}
    </div>
  );
}

function SpreadContent({
  entry,
  recipes,
  artSize = 120,
  reserveTopRight = false,
}: {
  entry: PantryEntry;
  recipes: Recipe[];
  artSize?: number;
  /** The mobile overlay's close button sits absolute top-right of the panel;
      reserve clearance so the art never sits under it (C2, fix round 1). */
  reserveTopRight?: boolean;
}) {
  return (
    <div>
      <div className={`mb-4 grid grid-cols-[1fr_auto] items-end gap-[18px] ${reserveTopRight ? 'pr-11' : ''}`}>
        <div>
          <Eyebrow as="span" className="mb-1.5 block">{capitalizeKind(entry.kind)}</Eyebrow>
          <h2 className="font-heading text-[28px] font-normal leading-[1.05] text-brown-dark sm:text-[34px]">
            {entry.name}
          </h2>
        </div>
        <ReadingArt entry={entry} size={artSize} />
      </div>
      <p className="mb-[18px] max-w-md text-base leading-relaxed text-brown-dark/90">{entry.note}</p>
      {entry.benefits && <GoodForYou points={entry.benefits} />}
      {entry.prophetic && <Passage prophetic={entry.prophetic} />}
      <CookWith entry={entry} recipes={recipes} />
    </div>
  );
}

/* ── Mobile spread overlay (paper, not glass) ────────────────────────────── */
function SpreadOverlay({ entry, recipes, onClose }: { entry: PantryEntry; recipes: Recipe[]; onClose: () => void }) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden" role="dialog" aria-modal="true" aria-label={entry.name}>
      <div className="absolute inset-0 bg-scrim/45" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[85dvh] w-full overflow-y-auto rounded-[3px] bg-surface p-6 shadow-2xl ring-1 ring-line">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-brown-medium transition-colors hover:bg-brown-light/15 hover:text-brown-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <SpreadContent entry={entry} recipes={recipes} artSize={88} reserveTopRight />
      </div>
    </div>,
    document.body,
  );
}

/* ── Filter ──────────────────────────────────────────────────────────────── */
/** Two parts, so it reads as a filter and says how many each one shows. */
function SunnahFilter({ on, set, all, sunnah }: { on: boolean; set: (on: boolean) => void; all: number; sunnah: number }) {
  const seg = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
      active ? 'bg-brown-dark text-parchment' : 'text-brown-dark hover:bg-brown-dark/[0.05]'
    }`;
  return (
    <div role="group" aria-label="Show" className="inline-flex gap-0.5 rounded-full bg-surface p-[3px] shadow-[inset_0_0_0_1px_var(--color-line)]">
      <button className={seg(!on)} aria-pressed={!on} onClick={() => set(false)}>
        All <span className="nums-tabular">· {all}</span>
      </button>
      <button className={seg(on)} aria-pressed={on} onClick={() => set(true)}>
        Sunnah foods <span className="nums-tabular">· {sunnah}</span>
      </button>
    </div>
  );
}

function countRecipes(n: number): string {
  return n === 1 ? '1 recipe' : `${n} recipes`;
}

/* ── The grid and its reading panel ──────────────────────────────────────── */
export default function PantryShelf({
  entries,
  initialSlug,
  initialSunnah = false,
}: {
  entries: PantryEntry[];
  initialSlug?: string;
  initialSunnah?: boolean;
}) {
  const { data: recipes = [] } = useRecipes();
  const [sunnahOnly, setSunnahOnly] = useState(initialSunnah);
  const [openSlug, setOpenSlug] = useState<string | null>(initialSlug ?? null);
  const [overlaySlug, setOverlaySlug] = useState<string | null>(null);

  // How many recipes feature each entry: the plate's "in N recipes" and the order.
  const uses = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of recipes) for (const slug of r.featuredIngredients) m.set(slug, (m.get(slug) ?? 0) + 1);
    return m;
  }, [recipes]);

  // Most used first, ties A to Z, so entries no recipe uses yet sit at the end.
  const shown = useMemo(() => {
    const list = sunnahOnly ? entries.filter((e) => e.prophetic) : entries;
    return [...list].sort((a, b) => (uses.get(b.slug) ?? 0) - (uses.get(a.slug) ?? 0) || a.name.localeCompare(b.name));
  }, [entries, sunnahOnly, uses]);

  // The chosen entry, else the most used one still showing (the filter can hide it).
  const selected = shown.find((e) => e.slug === openSlug) ?? shown[0] ?? null;
  const overlayEntry = overlaySlug ? entries.find((e) => e.slug === overlaySlug) ?? null : null;

  // Arriving from a recipe's pantry link on a phone: open the entry straight
  // away, since the reading panel only sits beside the grid from md.
  useEffect(() => {
    if (initialSlug && entries.some((e) => e.slug === initialSlug) && window.matchMedia('(max-width: 767px)').matches) {
      setOverlaySlug(initialSlug);
    }
  }, [initialSlug, entries]);

  const pick = (slug: string) => {
    setOpenSlug(slug);
    setOverlaySlug(slug);
  };

  return (
    <div>
      <SunnahFilter
        on={sunnahOnly}
        set={setSunnahOnly}
        all={entries.length}
        sunnah={entries.filter((e) => e.prophetic).length}
      />

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] md:gap-12">
        <div className="grid grid-cols-3 border-l border-t border-line sm:grid-cols-[repeat(auto-fill,minmax(115px,1fr))]">
          {shown.map((e) => {
            const active = selected?.slug === e.slug;
            const n = uses.get(e.slug) ?? 0;
            return (
              <button
                key={e.slug}
                onClick={() => pick(e.slug)}
                aria-pressed={active}
                className={`relative flex flex-col border-b border-r border-line px-2 pb-3 pt-6 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                  active ? 'ring-2 ring-inset ring-terracotta' : ''
                }`}
              >
                {e.prophetic && <SunnahLabel className="absolute right-2 top-1.5" />}
                <PlateArt entry={e} />
                <span className="mt-2 block font-heading text-[17px] leading-tight text-brown-dark">{e.name}</span>
                {/* No recipes yet says nothing, never "0". */}
                {n > 0 && <span className="mt-0.5 block text-[13px] text-brown-medium">in {countRecipes(n)}</span>}
              </button>
            );
          })}
        </div>

        {/* in-place reading panel (desktop) */}
        <div className="hidden rounded-[3px] bg-surface p-8 ring-1 ring-line md:block md:sticky md:top-28">
          {selected ? (
            <SpreadContent entry={selected} recipes={recipes} />
          ) : (
            <p className="italic text-brown-medium">Nothing in the pantry yet.</p>
          )}
        </div>
      </div>

      {/* overlay (mobile) */}
      {overlayEntry && (
        <SpreadOverlay entry={overlayEntry} recipes={recipes} onClose={() => setOverlaySlug(null)} />
      )}
    </div>
  );
}
