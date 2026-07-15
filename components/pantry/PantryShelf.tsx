'use client';

/**
 * The Pantry (2026-07-15 redesign; spec:
 * docs/superpowers/specs/2026-07-15-pantry-redesign-design.md).
 *
 * Two modes, switched at the top:
 *  - The shelf: an accordion index (one shelf-group open at a time, so the list
 *    never runs endlessly) beside an in-place reading spread. On mobile the
 *    spread opens as an overlay.
 *  - Cook from what I have: a checklist of the pantry, matched against each
 *    recipe's `featuredIngredients` into ranked results (Ready / near-miss).
 *
 * The reading spread carries the note, a "Good for you" benefit row, the
 * set-apart prophetic passage (Sunnah foods; label keeps the ﷺ), and the
 * recipes that cook with it. Only entries with real ink art on disk reach here
 * (`landedPantryEntries`), so both modes operate on the same landed set.
 *
 * Labels use the bold SANS eyebrow style (not the monospace stamp font) so the
 * category and section headings read crisply. Colours use the theme-stable
 * Courtyard tokens (cobalt / cobalt-deep / brass / cream) for the dark passage
 * card and keystone, so they render identically in light and cobalt-night.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, Clock, X } from 'lucide-react';
import { KIND_ORDER, type PantryEntry, type PantryKind } from '@/data/pantry';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/* Shared eyebrow: bold sans, uppercase, moderate tracking. Colour set per use. */
const EYEBROW = 'font-bold uppercase tracking-[0.12em]';

/* ── Small pieces ─────────────────────────────────────────────────────────── */
function Keystone({ size = 9 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block rotate-45 bg-brass shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

function Plinth({ entry, size = 168 }: { entry: PantryEntry; size?: number }) {
  return (
    <span className="relative bg-plinth rounded-2xl ring-1 ring-brown-dark/8 p-3.5 shrink-0">
      <span className="relative block" style={{ width: size, height: size }}>
        <Image src={entry.artSrc} alt={entry.name} fill sizes="168px" className="object-contain" />
      </span>
    </span>
  );
}

function GoodForYou({ points }: { points: string[] }) {
  return (
    <div className="mt-6">
      <h3 className={`${EYEBROW} text-[11px] text-olive mb-2.5`}>Good for you</h3>
      <div className="flex flex-wrap gap-2">
        {points.map((p) => (
          <span
            key={p}
            className="text-[13px] text-brown-dark bg-surface ring-1 ring-brown-dark/10 rounded-full px-3 py-1.5"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

function HadithBlock({ prophetic }: { prophetic: NonNullable<PantryEntry['prophetic']> }) {
  return (
    <div className="mt-7 max-w-xl">
      <div className="flex items-center gap-2.5 mb-3">
        <Keystone size={10} />
        <span className={`${EYEBROW} text-[11px] text-turmeric`}>From the Prophet’s ﷺ table</span>
      </div>
      <div className="relative bg-cobalt-deep rounded-2xl p-6">
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-7 w-3.5 h-3.5 rotate-45 bg-brass"
          style={{ boxShadow: '0 0 0 3px var(--color-cobalt-deep)' }}
        />
        <p className="text-[15px] leading-relaxed text-cream">{prophetic.note}</p>
        <p className={`${EYEBROW} mt-3 text-[11px] tracking-[0.06em] text-brass`}>{prophetic.citation}</p>
      </div>
    </div>
  );
}

function CookWith({ entry, recipes }: { entry: PantryEntry; recipes: Recipe[] }) {
  const list = recipes.filter((r) => r.featuredIngredients.includes(entry.slug));
  return (
    <div className="mt-8 pt-6 border-t border-brown-light/25">
      <h3 className={`${EYEBROW} text-[11px] text-terracotta mb-4`}>Cook with it</h3>
      {list.length ? (
        <div className="flex flex-wrap gap-3">
          {list.map((r) => (
            <Link
              key={r.id}
              href={`/recipes/${encodeURIComponent(r.id)}`}
              className="flex items-center gap-3 rounded-xl bg-surface ring-1 ring-brown-dark/8 hover:ring-terracotta/40 p-2 pr-4 transition-shadow min-w-[220px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <span className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg">
                <Image src={r.image} alt={r.name} fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-sm font-semibold text-brown-dark leading-tight">{r.name}</span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-brown-medium">
                  <Clock size={11} aria-hidden="true" /> {r.time.total}m
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-brown-medium italic">Nothing on the site cooks with it yet. That will not last.</p>
      )}
    </div>
  );
}

function SpreadContent({ entry, recipes }: { entry: PantryEntry; recipes: Recipe[] }) {
  return (
    <div>
      <div className="flex flex-wrap gap-7 items-start">
        <div className="flex-1 min-w-[260px]">
          <p className={`${EYEBROW} text-[11px] text-olive mb-2`}>{entry.kind}</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brown-dark leading-tight">{entry.name}</h2>
          <p className="mt-4 text-base leading-relaxed text-brown-dark/90 max-w-md">{entry.note}</p>
          {entry.benefits && <GoodForYou points={entry.benefits} />}
        </div>
        <Plinth entry={entry} />
      </div>
      {entry.prophetic && <HadithBlock prophetic={entry.prophetic} />}
      <CookWith entry={entry} recipes={recipes} />
    </div>
  );
}

/* ── Mobile spread overlay ────────────────────────────────────────────────── */
function SpreadOverlay({ entry, recipes, onClose }: { entry: PantryEntry; recipes: Recipe[]; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={entry.name}>
      <div className="absolute inset-0 bg-scrim/45" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="relative bg-parchment rounded-2xl shadow-2xl w-full max-h-[85dvh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <SpreadContent entry={entry} recipes={recipes} />
      </div>
    </div>,
    document.body,
  );
}

/* ── Controls ─────────────────────────────────────────────────────────────── */
function ModeToggle({ mode, setMode }: { mode: 'shelf' | 'cook'; setMode: (m: 'shelf' | 'cook') => void }) {
  const seg = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      active ? 'bg-brown-dark text-parchment' : 'text-brown-medium hover:text-brown-dark'
    }`;
  return (
    <div className="inline-flex gap-1 p-1 rounded-full bg-surface-alt ring-1 ring-brown-dark/10">
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
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
        on ? 'bg-brown-dark text-parchment' : 'text-brown-dark ring-1 ring-brown-light/50 hover:ring-terracotta/50'
      }`}
    >
      <Keystone size={8} /> The Prophet’s ﷺ table
    </button>
  );
}

/* ── The shelf (accordion + spread) ───────────────────────────────────────── */
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

  const selected = shown.find((e) => e.slug === openSlug) ?? shown[0] ?? null;
  const overlayEntry = overlaySlug ? shown.find((e) => e.slug === overlaySlug) ?? null : null;

  const pick = (slug: string) => {
    setOpenSlug(slug);
    setOverlaySlug(slug);
  };

  return (
    <div className="mt-6 grid md:grid-cols-[280px_1fr] rounded-2xl overflow-hidden ring-1 ring-brown-dark/10">
      {/* accordion index */}
      <div className="bg-surface md:border-r border-brown-light/20 p-5">
        <div className={`${EYEBROW} text-[11px] text-terracotta mb-1.5`}>The list</div>
        <p className="text-sm text-brown-medium mb-4 leading-relaxed">Open a shelf, then pick a line to read it.</p>
        <div className="mb-4">
          <SunnahFilter on={sunnahOnly} toggle={() => setSunnahOnly((v) => !v)} />
        </div>
        {byKind.map(({ kind, items }) => {
          const expanded = expandedKind === kind;
          return (
            <div key={kind} className="border-b border-brown-light/20 last:border-b-0">
              <button
                onClick={() => setExpandedKind(expanded ? null : kind)}
                aria-expanded={expanded}
                className="flex items-center gap-2 w-full py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <span className={`${EYEBROW} flex-1 text-left text-xs tracking-[0.1em] ${expanded ? 'text-brown-dark' : 'text-olive'}`}>
                  {kind}
                </span>
                <span className="text-xs font-semibold text-brown-medium">{items.length}</span>
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                  className={`text-brown-medium transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
              {expanded && (
                <div className="pb-2">
                  {items.map((e) => {
                    const active = selected?.slug === e.slug;
                    return (
                      <button
                        key={e.slug}
                        onClick={() => pick(e.slug)}
                        className={`flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                          active ? 'bg-surface-alt' : 'hover:bg-brown-light/10'
                        } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta`}
                      >
                        <span className="w-2.5 shrink-0 inline-flex">{e.prophetic && <Keystone size={9} />}</span>
                        <span className={`font-heading text-base ${active ? 'text-brown-dark font-semibold' : 'text-brown-dark/85'}`}>
                          {e.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* in-place spread (desktop) */}
      <div className="hidden md:block bg-parchment p-8">
        {selected ? (
          <SpreadContent entry={selected} recipes={recipes} />
        ) : (
          <p className="text-brown-medium italic">Nothing on this shelf yet.</p>
        )}
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
        const missNames = missing
          .map((x) => entries.find((e) => e.slug === x)?.name)
          .filter((n): n is string => Boolean(n));
        return { recipe: r, haveN, total: featured.length, missingCount: missing.length, missNames, ready: missing.length === 0 };
      })
      .filter((s) => s.haveN > 0)
      .sort((a, b) => a.missingCount - b.missingCount || b.haveN - a.haveN);
  }, [recipes, have, entries]);

  const readyN = scored.filter((s) => s.ready).length;

  return (
    <div className="mt-6 grid md:grid-cols-[280px_1fr] rounded-2xl overflow-hidden ring-1 ring-brown-dark/10">
      {/* checklist */}
      <div className="bg-surface md:border-r border-brown-light/20 p-5">
        <h3 className={`${EYEBROW} text-[11px] text-terracotta mb-1.5`}>The market list</h3>
        <p className="text-sm text-brown-medium mb-4 leading-relaxed">Tick what is in your kitchen.</p>
        {byKind.map(({ kind, items }) => (
          <div key={kind} className="mb-3">
            <div className={`${EYEBROW} text-xs tracking-[0.1em] text-olive pb-1.5 mb-1 border-b border-brown-light/20`}>
              {kind}
            </div>
            {items.map((e) => {
              const on = !!have[e.slug];
              return (
                <button
                  key={e.slug}
                  onClick={() => setHave((p) => ({ ...p, [e.slug]: !p[e.slug] }))}
                  aria-pressed={on}
                  className="flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-lg hover:bg-brown-light/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <span
                    className={`w-5 h-5 shrink-0 rounded-md inline-flex items-center justify-center ring-1 ring-brown-dark/25 ${
                      on ? 'bg-brown-dark text-parchment' : 'bg-transparent'
                    }`}
                  >
                    {on && <Check size={13} aria-hidden="true" />}
                  </span>
                  <span className={`flex-1 font-heading text-base ${on ? 'text-brown-dark font-semibold' : 'text-brown-dark/85'}`}>
                    {e.name}
                  </span>
                  {e.prophetic && <Keystone size={9} />}
                </button>
              );
            })}
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-brown-light/20 flex items-center gap-3">
          <span className="font-heading italic text-brown-dark">
            {haveCount === 0 ? 'Nothing ticked' : `${haveCount} ticked`}
          </span>
          {haveCount > 0 && (
            <button
              onClick={() => setHave({})}
              className="ml-auto text-[13px] font-semibold text-brown-dark ring-1 ring-brown-light/50 hover:ring-terracotta/50 rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* results */}
      <div className="bg-parchment p-6 sm:p-8">
        {haveCount === 0 && (
          <div className="text-center bg-surface ring-1 ring-brown-dark/10 rounded-2xl px-8 py-16">
            <div className={`${EYEBROW} text-[11px] text-terracotta mb-2.5`}>An empty list</div>
            <p className="font-heading text-2xl text-brown-dark max-w-sm mx-auto leading-snug">
              Tick a few things on the left and I will find what you can cook tonight.
            </p>
          </div>
        )}

        {haveCount > 0 && scored.length === 0 && (
          <div className="text-center bg-surface ring-1 ring-brown-dark/10 rounded-2xl px-8 py-14">
            <div className={`${EYEBROW} text-[11px] text-terracotta mb-2.5`}>No match yet</div>
            <p className="font-heading text-xl text-brown-dark max-w-md mx-auto leading-snug mb-1.5">Nothing lines up with just those.</p>
            <p className="text-brown-medium max-w-sm mx-auto">Add a workhorse like eggs, olive oil, or butter and try again.</p>
          </div>
        )}

        {scored.length > 0 && (
          <>
            <div className={`${EYEBROW} text-[11px] text-terracotta mb-1`}>Cook from what I have</div>
            <h2 className="font-heading text-2xl font-bold text-brown-dark mb-5">
              {readyN > 0 ? `${readyN} ${readyN === 1 ? 'recipe' : 'recipes'} ready to cook` : 'Closest to your list'}
            </h2>
            <div className="flex flex-col gap-3">
              {scored.map(({ recipe, haveN, total, missingCount, missNames, ready }) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${encodeURIComponent(recipe.id)}`}
                  className="flex items-center gap-4 bg-surface ring-1 ring-brown-dark/8 hover:ring-terracotta/40 rounded-2xl p-3 pr-5 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <span className="relative w-20 h-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={recipe.image} alt={recipe.name} fill sizes="80px" className="object-cover" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`${EYEBROW} block text-[10px] tracking-[0.1em] text-brown-medium`}>
                      {recipe.country} · {recipe.time.total}m
                    </span>
                    <span className="block font-heading text-lg font-semibold text-brown-dark leading-tight truncate">
                      {recipe.name}
                    </span>
                    {missingCount > 0 && (
                      <span className="mt-0.5 block text-xs font-semibold text-terracotta">
                        {missingCount === 1 ? `1 more: ${missNames[0]}` : `${missingCount} more to go`}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-right">
                    {ready ? (
                      <span className={`${EYEBROW} text-[10px] tracking-[0.1em] bg-brass text-cobalt-deep rounded-full px-2.5 py-1`}>
                        Ready
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-brown-medium">{haveN} of {total}</span>
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
