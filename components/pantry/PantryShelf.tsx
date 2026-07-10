'use client';

/**
 * The Pantry shelf (spec §7 + design pick: variant D "etched" cards, rosette
 * seal). Entries are grouped under small-caps kind headings; a card opens a
 * small overlay with the margin note, a set-apart prophetic passage where one
 * exists, and the recipes that cook with it.
 *
 * The server passes only the entries whose ink art has actually landed in
 * `public/pantry/` (no placeholder assets in production), already in shelf
 * order. We still group by KIND_ORDER here rather than trusting the incoming
 * array order, so a data reshuffle can never scramble the headings.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, X } from 'lucide-react';
import { KIND_ORDER, type PantryEntry, type PantryKind } from '@/data/pantry';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';
import PropheticSeal from './PropheticSeal';

/* ── Group heading ──────────────────────────────────────────────────── */
function KindHeading({ kind }: { kind: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h2 className="font-stamp text-[11px] uppercase tracking-[0.3em] text-brown-medium whitespace-nowrap">
        {kind}
      </h2>
      <div className="flex-1 h-px bg-brown-light/30" aria-hidden="true" />
    </div>
  );
}

/* ── Etched card — hairline outline, corner seal, no filled surface ───── */
function EtchedCard({ entry, onOpen }: { entry: PantryEntry; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="relative border border-brown-medium/30 rounded-xl p-5 pt-6 flex flex-col items-center gap-3 text-center hover:border-terracotta/50 hover:bg-brown-light/6 transition-[border-color,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      <span className="relative bg-plinth rounded-xl ring-1 ring-brown-dark/8 p-2.5">
        <span className="relative block w-24 h-24">
          <Image
            src={entry.artSrc}
            alt={entry.name}
            fill
            sizes="96px"
            className="object-contain"
          />
        </span>
        {entry.prophetic && (
          <span className="absolute -top-1.5 -right-1.5"><PropheticSeal /></span>
        )}
      </span>
      <span className="font-stamp text-[11px] uppercase tracking-[0.24em] text-brown-dark">
        {entry.name}
      </span>
    </button>
  );
}

/* ── Entry overlay ────────────────────────────────────────────────────
   Small centred card, shelf visible behind (the passport instinct). Focus
   trap + Escape + backdrop close. */
function EntryOverlay({ entry, recipes, onClose }: {
  entry: PantryEntry;
  recipes: Recipe[];
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    }, 60);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [handleKeyDown]);

  const cookWith = recipes.filter(r => r.featuredIngredients.includes(entry.slug));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={entry.name}>
      <div className="absolute inset-0 bg-brown-dark/35" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className="relative bg-parchment border border-brown-light/30 rounded-2xl shadow-2xl max-w-xl w-full max-h-[85dvh] overflow-y-auto p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="flex items-start gap-6">
          <div className="shrink-0 bg-plinth rounded-xl ring-1 ring-brown-dark/8 p-3">
            <div className="relative w-24 h-24">
              <Image src={entry.artSrc} alt={entry.name} fill sizes="96px" className="object-contain" />
            </div>
          </div>
          <div className="min-w-0 pt-1">
            <p className="font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium/80 mb-1">
              {entry.kind}
            </p>
            <h2 className="font-heading text-2xl font-bold text-brown-dark leading-tight">{entry.name}</h2>
          </div>
        </div>

        <p className="mt-5 text-[15px] text-brown-dark/90 leading-relaxed">{entry.note}</p>

        {entry.prophetic && (
          <div className="mt-6 border border-brown-light/30 rounded-xl p-5 bg-surface">
            <div className="flex items-center gap-2.5 mb-2.5">
              <PropheticSeal size={24} />
              <span className="font-stamp text-[10px] uppercase tracking-[0.26em] text-brown-medium">
                From the Prophet’s ﷺ table
              </span>
            </div>
            <p className="text-sm text-brown-dark/90 leading-relaxed">{entry.prophetic.note}</p>
            <p className="mt-3 font-stamp text-[11px] tracking-[0.06em] text-brown-medium">
              {entry.prophetic.citation}
            </p>
          </div>
        )}

        <div className="mt-7">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-stamp text-[11px] uppercase tracking-[0.3em] text-brown-medium whitespace-nowrap">
              Cook with it
            </h3>
            <div className="flex-1 h-px bg-brown-light/30" aria-hidden="true" />
          </div>
          {cookWith.length > 0 ? (
            <div className="space-y-3">
              {cookWith.map(r => (
                <Link
                  key={r.id}
                  href={`/recipes/${encodeURIComponent(r.id)}`}
                  className="flex items-center gap-3 rounded-xl hover:bg-brown-light/10 p-1.5 -m-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <span className="relative w-16 h-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={r.image} alt={r.name} fill sizes="64px" className="object-cover" />
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
            <p className="text-sm text-brown-medium italic">
              Nothing on the site cooks with it yet. That will not last.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shelf ────────────────────────────────────────────────────────────── */
export default function PantryShelf({ entries }: { entries: PantryEntry[] }) {
  const [open, setOpen] = useState<PantryEntry | null>(null);
  const [mounted, setMounted] = useState(false);
  const { data: recipes = [] } = useRecipes();

  useEffect(() => setMounted(true), []);

  const byKind = useMemo(() => {
    const m = new Map<PantryKind, PantryEntry[]>();
    for (const kind of KIND_ORDER) m.set(kind, []);
    for (const e of entries) m.get(e.kind)?.push(e);
    return m;
  }, [entries]);

  return (
    <>
      <div className="space-y-12">
        {KIND_ORDER.map(kind => {
          const group = byKind.get(kind)!;
          if (group.length === 0) return null;
          return (
            <section key={kind}>
              <KindHeading kind={kind} />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {group.map(e => (
                  <EtchedCard key={e.slug} entry={e} onOpen={() => setOpen(e)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {mounted && open && createPortal(
        <EntryOverlay entry={open} recipes={recipes} onClose={() => setOpen(null)} />,
        document.body,
      )}
    </>
  );
}
