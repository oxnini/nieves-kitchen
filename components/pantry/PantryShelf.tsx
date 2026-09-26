'use client';

/**
 * The Pantry (2026-09 "Glazed Folio" restyle, phase 7 of the premium revamp;
 * plan: .superpowers/sdd/2026-09-25-premium-revamp/task-7.1-brief.md,
 * rulings: .superpowers/sdd/2026-09-25-premium-revamp/p7-constraints.md).
 * Original structure/behaviour: docs/superpowers/specs/2026-07-15-pantry-redesign-design.md.
 *
 * Two modes, switched at the top:
 *  - The shelf: an accordion index of kinds (one open at a time) revealing a
 *    ruled grid of plates for the open kind, beside an in-place reading panel.
 *    On mobile, tapping a plate opens the reading content as an overlay.
 *  - Cook from what I have: a checklist of the pantry, matched against each
 *    recipe's `featuredIngredients` into ranked results (Ready / near-miss).
 *
 * The reading panel carries the note, a "Good for you" benefit row, the
 * set-apart prophetic passage (Sunnah foods; label keeps the ﷺ), and the
 * recipes that cook with it. Only entries with real ink art on disk reach here
 * (`landedPantryEntries`), so both modes operate on the same landed set.
 *
 * Ink art (the pantry drawings) sits directly on the page by day and falls
 * back to the warm paper `.ink-plinth` at night (app/globals.css) — dark line
 * work on transparency would otherwise vanish on the night paper.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, X } from 'lucide-react';
import { Eyebrow } from '@/components/courtyard/Eyebrow';
import { KIND_ORDER, type PantryEntry, type PantryKind } from '@/data/pantry';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/* ── Small pieces ─────────────────────────────────────────────────────────── */

function capitalizeKind(kind: PantryKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

/** A missing `featuredIngredients` slug with no landed pantry entry (e.g. `beef`,
    which has no ink art yet) still needs a readable name: hyphens become spaces,
    sentence case (only the first letter capitalised — "olive-oil" → "Olive oil"). */
function humanizeSlug(slug: string): string {
  const words = slug.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
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
    <span className="ink-plinth relative mx-auto block aspect-square w-full max-w-[120px] rounded-[3px]">
      <Image src={entry.artSrc} alt="" fill sizes="120px" className="object-contain p-2" />
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
      <Eyebrow as="span" className="mb-2 block">Cook with it</Eyebrow>
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
                  <span className="nums-tabular shrink-0">{r.time.total} min</span>
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

/* ── Controls ─────────────────────────────────────────────────────────────── */
function ModeToggle({ mode, setMode }: { mode: 'shelf' | 'cook'; setMode: (m: 'shelf' | 'cook') => void }) {
  const seg = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-brown-dark text-parchment' : 'text-brown-medium hover:text-brown-dark'
    }`;
  return (
    <div className="inline-flex gap-0.5 rounded-full bg-surface p-[3px] shadow-[inset_0_0_0_1px_var(--color-line)]">
      <button className={seg(mode === 'shelf')} aria-pressed={mode === 'shelf'} onClick={() => setMode('shelf')}>
        The shelf
      </button>
      <button className={seg(mode === 'cook')} aria-pressed={mode === 'cook'} onClick={() => setMode('cook')}>
        Cook from what I have
      </button>
    </div>
  );
}

function SunnahFilter({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
        on
          ? 'bg-brown-dark text-parchment'
          : 'bg-surface text-brown-dark shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-brown-light)]'
      }`}
    >
      <SunnahLabel className={on ? '!text-parchment' : ''} /> The Prophet’s ﷺ table
    </button>
  );
}

/* ── The shelf (accordion + ruled plates + reading panel) ────────────────── */
function ShelfBrowse({ entries, recipes }: { entries: PantryEntry[]; recipes: Recipe[] }) {
  const [sunnahOnly, setSunnahOnly] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [overlaySlug, setOverlaySlug] = useState<string | null>(null);
  const [expandedKind, setExpandedKind] = useState<PantryKind | null>(entries[0]?.kind ?? null);

  const shown = useMemo(
    () => (sunnahOnly ? entries.filter((e) => e.prophetic) : entries),
    [entries, sunnahOnly],
  );
  const byKind = useMemo(
    () => KIND_ORDER.map((k) => ({ kind: k, items: shown.filter((e) => e.kind === k) })).filter((g) => g.items.length),
    [shown],
  );

  // The Sunnah filter can empty out whichever kind was expanded (e.g. "Dairy &
  // eggs" has no prophetic entries) — fall back to the first remaining kind
  // rather than rendering no plate grid at all. `null` still means collapsed.
  const effectiveOpenKind =
    expandedKind !== null && !byKind.some((g) => g.kind === expandedKind)
      ? byKind[0]?.kind ?? null
      : expandedKind;

  const selected = shown.find((e) => e.slug === openSlug) ?? shown[0] ?? null;
  const overlayEntry = overlaySlug ? shown.find((e) => e.slug === overlaySlug) ?? null : null;

  const pick = (slug: string) => {
    setOpenSlug(slug);
    setOverlaySlug(slug);
  };

  return (
    <div className="mt-6">
      <SunnahFilter on={sunnahOnly} toggle={() => setSunnahOnly((v) => !v)} />

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] md:gap-12">
        {/* accordion index + ruled plates */}
        <div className="border-t border-brown-dark">
          {byKind.map(({ kind, items }) => {
            const expanded = effectiveOpenKind === kind;
            return (
              <div key={kind}>
                <button
                  onClick={() => setExpandedKind(expanded ? null : kind)}
                  aria-expanded={expanded}
                  className="flex w-full items-baseline gap-3 border-b border-line py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <span className="font-heading text-[21px] font-normal text-brown-dark">{capitalizeKind(kind)}</span>
                  <span className="text-[13px] text-brown-medium">{items.length}</span>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className={`ml-auto shrink-0 text-brown-medium transition-transform ${expanded ? 'rotate-90' : ''}`}
                  />
                </button>
                {expanded && (
                  <div className="mb-5 mt-4 grid grid-cols-2 border-l border-t border-line sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                    {items.map((e) => {
                      const active = selected?.slug === e.slug;
                      return (
                        <button
                          key={e.slug}
                          onClick={() => pick(e.slug)}
                          aria-pressed={active}
                          className={`relative border-b border-r border-line px-3 pb-3.5 pt-6 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                            active ? 'ring-2 ring-inset ring-terracotta' : ''
                          }`}
                        >
                          {e.prophetic && <SunnahLabel className="absolute right-2.5 top-2" />}
                          <PlateArt entry={e} />
                          <span className="mt-2.5 block font-heading text-[18px] leading-tight text-brown-dark">
                            {e.name}
                          </span>
                          <span className="block text-[12.5px] text-brown-medium">{capitalizeKind(e.kind)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* in-place reading panel (desktop) */}
        <div className="hidden rounded-[3px] bg-surface p-8 ring-1 ring-line md:block md:sticky md:top-28">
          {selected ? (
            <SpreadContent entry={selected} recipes={recipes} />
          ) : (
            <p className="italic text-brown-medium">Nothing on this shelf yet.</p>
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

/* ── Cook from what I have (checklist) ────────────────────────────────────── */
function CookMode({ entries, recipes }: { entries: PantryEntry[]; recipes: Recipe[] }) {
  const [have, setHave] = useState<Record<string, boolean>>({});
  const haveCount = Object.values(have).filter(Boolean).length;

  const byKind = useMemo(
    () => KIND_ORDER.map((k) => ({ kind: k, items: entries.filter((e) => e.kind === k) })).filter((g) => g.items.length),
    [entries],
  );

  const scored = useMemo(() => {
    return recipes
      .map((r) => {
        const featured = r.featuredIngredients;
        const haveN = featured.filter((x) => have[x]).length;
        const missing = featured.filter((x) => !have[x]);
        const missNames = missing.map((x) => entries.find((e) => e.slug === x)?.name ?? humanizeSlug(x));
        return { recipe: r, haveN, total: featured.length, missingCount: missing.length, missNames, ready: missing.length === 0 };
      })
      .filter((s) => s.haveN > 0)
      .sort((a, b) => a.missingCount - b.missingCount || b.haveN - a.haveN);
  }, [recipes, have, entries]);

  const readyN = scored.filter((s) => s.ready).length;

  return (
    <div className="mt-6 grid overflow-hidden rounded-[3px] ring-1 ring-line md:grid-cols-[280px_1fr]">
      {/* checklist */}
      <div className="border-b border-line bg-surface p-5 md:border-b-0 md:border-r">
        <Eyebrow as="span" className="mb-1 block">The market list</Eyebrow>
        <p className="mb-4 text-sm leading-relaxed text-brown-medium">Tick what is in your kitchen.</p>
        {byKind.map(({ kind, items }) => (
          <div key={kind} className="mb-3.5">
            <div className="mb-1.5 border-b border-line pb-1 text-[12.5px] font-semibold text-brown-medium">
              {capitalizeKind(kind)}
            </div>
            {items.map((e) => {
              const on = !!have[e.slug];
              return (
                <button
                  key={e.slug}
                  onClick={() => setHave((p) => ({ ...p, [e.slug]: !p[e.slug] }))}
                  aria-pressed={on}
                  className="flex w-full items-center gap-2.5 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] ${
                      on ? 'bg-brown-dark' : 'shadow-[inset_0_0_0_1.5px_var(--color-brown-medium)]'
                    }`}
                  >
                    {on && <Check size={12} strokeWidth={3} className="text-parchment" aria-hidden="true" />}
                  </span>
                  <span className="flex-1 font-heading text-[17px] text-brown-dark">{e.name}</span>
                  {e.prophetic && <SunnahLabel />}
                </button>
              );
            })}
          </div>
        ))}
        <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
          <span className="font-heading italic text-brown-dark">
            {haveCount === 0 ? 'Nothing ticked' : `${haveCount} ticked`}
          </span>
          {haveCount > 0 && (
            <button
              onClick={() => setHave({})}
              className="ml-auto rounded-full px-3 py-1.5 text-[13px] font-semibold text-brown-dark shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1.5px_var(--color-terracotta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* results */}
      <div className="bg-parchment p-6 sm:p-8">
        {haveCount === 0 && (
          <p className="mx-auto max-w-[26ch] py-12 text-center font-heading text-xl text-brown-dark sm:text-2xl">
            Tick a few things on the left and I will find what you can cook tonight.
          </p>
        )}

        {haveCount > 0 && scored.length === 0 && (
          <div className="mx-auto max-w-md py-10 text-center">
            <p className="mb-1.5 font-heading text-xl text-brown-dark">Nothing lines up with just those.</p>
            <p className="text-brown-medium">Add a workhorse like eggs, olive oil, or butter and try again.</p>
          </div>
        )}

        {scored.length > 0 && (
          <>
            <Eyebrow as="span" className="mb-1 block">Cook from what I have</Eyebrow>
            <h2 className="mb-4 font-heading text-[27px] font-normal text-brown-dark">
              {readyN > 0 ? `${readyN} ${readyN === 1 ? 'recipe' : 'recipes'} ready to cook` : 'Closest to your list'}
            </h2>
            <div>
              {scored.map(({ recipe, haveN, total, missingCount, missNames, ready }) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${encodeURIComponent(recipe.id)}`}
                  className="grid grid-cols-[72px_1fr_auto] items-center gap-4 border-t border-line py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:grid-cols-[90px_1fr_auto]"
                >
                  <span className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-[2px] bg-parchment-dark sm:h-[60px] sm:w-[90px]">
                    <Image src={recipe.image} alt={recipe.name} fill sizes="90px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-[13px] text-brown-medium">
                      <span className="truncate">{recipe.country}</span>
                      <MetaDot />
                      <span className="nums-tabular shrink-0">{recipe.time.total} min</span>
                    </span>
                    <span className="block font-heading text-[19px] font-normal leading-tight text-brown-dark">
                      {recipe.name}
                    </span>
                    {missingCount > 0 && (
                      <span className="mt-0.5 block text-[13px] font-semibold text-terracotta">
                        {missingCount === 1 ? `1 more: ${missNames[0]}` : `${missingCount} more to go`}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-right text-[13px]">
                    {ready ? (
                      <span className="font-semibold text-teal">Ready</span>
                    ) : (
                      <span className="text-brown-medium">{haveN} of {total}</span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Shell ────────────────────────────────────────────────────────────────── */
export default function PantryShelf({ entries }: { entries: PantryEntry[] }) {
  const [mode, setMode] = useState<'shelf' | 'cook'>('shelf');
  const { data: recipes = [] } = useRecipes();

  return (
    <div>
      <ModeToggle mode={mode} setMode={setMode} />
      {mode === 'shelf' ? (
        <ShelfBrowse entries={entries} recipes={recipes} />
      ) : (
        <CookMode entries={entries} recipes={recipes} />
      )}
    </div>
  );
}
