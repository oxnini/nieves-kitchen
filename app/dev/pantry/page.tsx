'use client';

/**
 * Design sandbox: the phase 2 Pantry (spec §7 of the 2026-07-03 revamp).
 * Three shelf-card treatments (A/B/C) x three prophetic seal marks, plus one
 * entry-view proposal, rendered against production recipe data. Not linked
 * from the app. The winning combination moves to /pantry + data/pantry/.
 */

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, X } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';
import {
  DEV_PANTRY, KIND_ORDER, pantryArt, PropheticSeal,
  type DevPantryEntry, type SealVariant,
} from './entries';

type CardVariant = 'A' | 'B' | 'C' | 'D';

const VARIANT_LABELS: Record<CardVariant, string> = {
  A: 'A · Specimen cards',
  B: 'B · Ledger rows',
  C: 'C · Loose sheets',
  D: 'D · Etched (A x C)',
};

const SEAL_LABELS: Record<SealVariant, string> = {
  rosette: 'Rosette',
  octagon: 'Octagon',
  scallop: 'Scallop',
  khatam: 'Khatam star',
  beaded: 'Beaded ring',
  shamsa: 'Shamsa',
  girih: 'Girih star',
};

/* ── Group heading — shared by all variants ─────────────────────────── */
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

/* ── Variant A: specimen cards ──────────────────────────────────────────
   Museum-drawer feel: art centred on a bordered card, small-caps label. */
function SpecimenCard({ entry, seal, onOpen }: { entry: DevPantryEntry; seal: SealVariant; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="relative bg-surface border border-brown-light/25 rounded-xl p-5 pt-6 flex flex-col items-center gap-3 text-center hover:border-terracotta/40 hover:shadow-md transition-[border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      {entry.prophetic && (
        <span className="absolute top-2.5 right-2.5"><PropheticSeal variant={seal} /></span>
      )}
      <span className="w-24 h-24">{pantryArt(entry.slug)}</span>
      <span className="font-stamp text-[11px] uppercase tracking-[0.24em] text-brown-dark">
        {entry.name}
      </span>
    </button>
  );
}

/* ── Variant B: ledger rows ─────────────────────────────────────────────
   Editorial density: framed art beside the name and the note's opening. */
function LedgerRow({ entry, seal, onOpen }: { entry: DevPantryEntry; seal: SealVariant; onOpen: () => void }) {
  const firstSentence = entry.note.split('. ')[0] + '.';
  return (
    <button
      onClick={onOpen}
      className="relative w-full bg-surface border border-brown-light/25 rounded-xl p-4 flex items-center gap-4 text-left hover:border-terracotta/40 hover:shadow-md transition-[border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      <span className="w-16 h-16 shrink-0 border border-brown-light/20 rounded-lg p-2 bg-parchment">
        {pantryArt(entry.slug)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-heading text-base font-semibold text-brown-dark">{entry.name}</span>
          {entry.prophetic && <PropheticSeal variant={seal} size={17} />}
        </span>
        <span className="block text-sm text-brown-medium leading-snug mt-0.5 line-clamp-2">
          {firstSentence}
        </span>
      </span>
      {entry.recipeSlugs.length > 0 && (
        <span className="font-stamp text-[10px] uppercase tracking-[0.2em] text-brown-medium/70 shrink-0">
          {entry.recipeSlugs.length}&thinsp;rec.
        </span>
      )}
    </button>
  );
}

/* ── Variant C: loose sheets ────────────────────────────────────────────
   Nordic restraint: no card box at all, art floats on the page. */
function LooseSheet({ entry, seal, onOpen }: { entry: DevPantryEntry; seal: SealVariant; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="relative flex flex-col items-center gap-2.5 py-3 rounded-xl hover:bg-brown-light/8 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      <span className="relative w-24 h-24">
        {pantryArt(entry.slug)}
        {entry.prophetic && (
          <span className="absolute -top-1 -right-3"><PropheticSeal variant={seal} size={19} /></span>
        )}
      </span>
      <span className="font-body text-sm font-medium text-brown-dark tracking-wide">{entry.name}</span>
    </button>
  );
}

/* ── Variant D: etched cards (A x C hybrid, user feedback 2026-07-04) ───
   The specimen card's hairline outline and corner seal, without the filled
   surface: the parchment page shows through, so the card reads as a line
   etched onto the page rather than a tile laid on it. */
function EtchedCard({ entry, seal, onOpen }: { entry: DevPantryEntry; seal: SealVariant; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="relative border border-brown-medium/30 rounded-xl p-5 pt-6 flex flex-col items-center gap-3 text-center hover:border-terracotta/50 hover:bg-brown-light/6 transition-[border-color,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      {entry.prophetic && (
        <span className="absolute top-2.5 right-2.5"><PropheticSeal variant={seal} /></span>
      )}
      <span className="w-24 h-24">{pantryArt(entry.slug)}</span>
      <span className="font-stamp text-[11px] uppercase tracking-[0.24em] text-brown-dark">
        {entry.name}
      </span>
    </button>
  );
}

/* ── Entry view — one proposal (spec: small overlay, shelf behind) ────── */
function EntryOverlay({ entry, seal, recipes, onClose }: {
  entry: DevPantryEntry;
  seal: SealVariant;
  recipes: Recipe[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cookWith = recipes.filter(r => entry.recipeSlugs.includes(r.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-label={entry.name}>
      <div className="absolute inset-0 bg-brown-dark/35" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-parchment border border-brown-light/30 rounded-2xl shadow-2xl max-w-xl w-full max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="flex items-start gap-6">
          <div className="w-28 h-28 shrink-0">{pantryArt(entry.slug)}</div>
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
              <PropheticSeal variant={seal} size={24} />
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
                  className="flex items-center gap-3 rounded-xl hover:bg-brown-light/10 p-1.5 -m-1.5 transition-colors"
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

/* ── Page ───────────────────────────────────────────────────────────── */
export default function DevPantryPage() {
  const [variant, setVariant] = useState<CardVariant>('A');
  const [seal, setSeal] = useState<SealVariant>('rosette');
  const [open, setOpen] = useState<DevPantryEntry | null>(null);
  const { data: recipes = [] } = useRecipes();

  const byKind = useMemo(() => {
    const m = new Map<string, DevPantryEntry[]>();
    for (const kind of KIND_ORDER) m.set(kind, []);
    for (const e of DEV_PANTRY) m.get(e.kind)!.push(e);
    return m;
  }, []);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Dev chrome — variant pickers */}
      <div className="sticky top-0 z-40 bg-brown-dark text-parchment px-4 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
        <span className="font-stamp uppercase tracking-[0.2em]">/dev/pantry</span>
        <div className="flex items-center gap-1.5">
          {(Object.keys(VARIANT_LABELS) as CardVariant[]).map(v => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`px-2.5 py-1 rounded-full border transition-colors ${variant === v ? 'bg-parchment text-brown-dark border-parchment' : 'border-parchment/40 hover:border-parchment'}`}
            >
              {VARIANT_LABELS[v]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="opacity-70">Seal:</span>
          {(Object.keys(SEAL_LABELS) as SealVariant[]).map(s => (
            <button
              key={s}
              onClick={() => setSeal(s)}
              className={`px-2.5 py-1 rounded-full border transition-colors ${seal === s ? 'bg-parchment text-brown-dark border-parchment' : 'border-parchment/40 hover:border-parchment'}`}
            >
              {SEAL_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Seal specimen strip — every candidate at card size and zoomed,
          for the side-by-side pick. Dev chrome, not part of /pantry. */}
      <div className="max-w-4xl mx-auto px-5 pt-6">
        <div className="border border-dashed border-brown-medium/30 rounded-xl p-4 flex flex-wrap gap-x-7 gap-y-3">
          {(Object.keys(SEAL_LABELS) as SealVariant[]).map(s => (
            <button
              key={s}
              onClick={() => setSeal(s)}
              className={`flex flex-col items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${seal === s ? 'bg-brown-light/15' : 'hover:bg-brown-light/8'}`}
            >
              <span className="flex items-end gap-2.5">
                <PropheticSeal variant={s} size={22} />
                <PropheticSeal variant={s} size={44} />
              </span>
              <span className="font-stamp text-[9px] uppercase tracking-[0.18em] text-brown-medium">
                {SEAL_LABELS[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Page masthead — proposed /pantry framing */}
      <header className="max-w-4xl mx-auto px-5 pt-12 pb-9">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brown-dark">The Pantry</h1>
        <p className="mt-3 text-brown-medium text-base sm:text-lg max-w-xl leading-relaxed">
          The ingredients this kitchen leans on, from the everyday to the beloved.
          The sealed ones come with a story worth knowing.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-5 pb-24 space-y-12">
        {KIND_ORDER.map(kind => {
          const entries = byKind.get(kind)!;
          if (entries.length === 0) return null;
          return (
            <section key={kind}>
              <KindHeading kind={kind} />
              {variant === 'A' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {entries.map(e => <SpecimenCard key={e.slug} entry={e} seal={seal} onOpen={() => setOpen(e)} />)}
                </div>
              )}
              {variant === 'B' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {entries.map(e => <LedgerRow key={e.slug} entry={e} seal={seal} onOpen={() => setOpen(e)} />)}
                </div>
              )}
              {variant === 'C' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {entries.map(e => <LooseSheet key={e.slug} entry={e} seal={seal} onOpen={() => setOpen(e)} />)}
                </div>
              )}
              {variant === 'D' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {entries.map(e => <EtchedCard key={e.slug} entry={e} seal={seal} onOpen={() => setOpen(e)} />)}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {open && (
        <EntryOverlay entry={open} seal={seal} recipes={recipes} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
