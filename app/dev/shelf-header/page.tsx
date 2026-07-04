'use client';

/**
 * Design sandbox: three treatments for the collection shelf header on
 * /recipes (TODO "Collection shelf header design pass"). Rendered against
 * live data with a mock controls row and real recipe cards for context.
 * Not linked from the app. The winner gets transplanted into
 * app/recipes/page.tsx (the activeCollection block).
 */

import { useState } from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { COLLECTIONS, type Collection } from '@/lib/collections';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

const ROMAN = ['I', 'II', 'III', 'IV'];

/** Sandbox copy of the home chapter-card accent map, plus text/border forms. */
const ACCENT: Record<string, { bar: string; borderL: string; text: string }> = {
  'high-protein': { bar: 'bg-terracotta', borderL: 'border-terracotta', text: 'text-terracotta' },
  sides: { bar: 'bg-sage', borderL: 'border-sage', text: 'text-sage' },
  travels: { bar: 'bg-teal', borderL: 'border-teal', text: 'text-teal' },
  sunnah: { bar: 'bg-turmeric', borderL: 'border-turmeric', text: 'text-turmeric' },
};

/** Shelf collections only: travels is a lens on the atlas, no shelf header. */
const SHELF_COLLECTIONS = COLLECTIONS.filter(c => c.includes !== null);

interface HeaderProps {
  c: Collection;
  index: number;
  count: number;
}

/* ── Variant A: chapter card echo ───────────────────────────────────────
   The header is the "opened" version of the home chapter card: same accent
   bar, Chapter numeral + count in the eyebrow, labelled exit pill. */

function ShelfHeaderA({ c, index, count }: HeaderProps) {
  const a = ACCENT[c.slug];
  return (
    <div className="relative overflow-hidden mb-6 flex items-start justify-between gap-4 rounded-2xl border border-brown-light/25 bg-surface p-5 sm:p-6 pl-6 sm:pl-7">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${a.bar}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-stamp text-[10px] sm:text-[11px] uppercase text-brown-medium/80">
          <span className="tracking-[0.32em]">Chapter {ROMAN[index]}</span>
          <span className="tracking-[0.22em] text-brown-medium/70 nums-tabular">
            № {count} recipe{count === 1 ? '' : 's'}
          </span>
        </div>
        <h2 className="mt-1.5 font-heading text-2xl sm:text-3xl font-semibold text-brown-dark leading-snug">
          {c.title}
        </h2>
        <p className="mt-1 text-sm sm:text-base text-brown-medium leading-relaxed">{c.description}</p>
      </div>
      <button
        type="button"
        aria-label="Leave this collection"
        className="shrink-0 flex items-center gap-1.5 rounded-full border border-brown-light/30 px-3 py-1.5 font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium hover:text-brown-dark hover:border-brown-medium/50 hover:bg-parchment-dark transition-colors"
      >
        <X size={13} aria-hidden="true" />
        <span className="hidden sm:inline">All recipes</span>
      </button>
    </div>
  );
}

/* ── Variant B: absorbed into the controls row ──────────────────────────
   No card box. The header replaces the count + chips line entirely: one
   band with numeral, title, count, and a quiet exit link, hung on an
   accent left border. */

function ShelfHeaderB({ c, index, count }: HeaderProps) {
  const a = ACCENT[c.slug];
  return (
    <div className={`mt-4 mb-6 border-l-[3px] pl-4 sm:pl-5 ${a.borderL}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 min-w-0">
          <span className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80">
            Chapter {ROMAN[index]}
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-semibold text-brown-dark leading-snug">
            {c.title}
          </h2>
          <span className="font-stamp text-sm uppercase tracking-[0.22em] text-brown-dark nums-tabular">
            № {count} recipe{count === 1 ? '' : 's'}
          </span>
        </div>
        <button
          type="button"
          aria-label="Leave this collection"
          className="flex items-center gap-1 font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium hover:text-brown-dark transition-colors"
        >
          <X size={12} aria-hidden="true" />
          All recipes
        </button>
      </div>
      <p className="mt-1 text-sm sm:text-base text-brown-medium leading-relaxed max-w-2xl">
        {c.description}
      </p>
    </div>
  );
}

/* ── Variant C: chapter opener spread ───────────────────────────────────
   No box at all: a centred cookbook chapter opening between hairline
   rules, accent colour only on the numeral. */

function ShelfHeaderC({ c, index, count }: HeaderProps) {
  const a = ACCENT[c.slug];
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-brown-light/30" />
        <span className={`font-stamp text-[11px] uppercase tracking-[0.32em] ${a.text}`}>
          Chapter {ROMAN[index]}
        </span>
        <span className="h-px flex-1 bg-brown-light/30" />
      </div>
      <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-semibold text-brown-dark leading-snug">
        {c.title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-brown-medium leading-relaxed">
        {c.description}
      </p>
      <div className="mt-3 flex items-baseline justify-center gap-6">
        <span className="font-stamp text-[11px] uppercase tracking-[0.22em] text-brown-medium/80 nums-tabular">
          № {count} recipe{count === 1 ? '' : 's'}
        </span>
        <button
          type="button"
          aria-label="Leave this collection"
          className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium underline underline-offset-4 decoration-brown-light/40 hover:text-brown-dark hover:decoration-brown-medium/60 transition-colors"
        >
          Leave the shelf
        </button>
      </div>
      <div className="mt-5 h-px bg-brown-light/30" aria-hidden="true" />
    </div>
  );
}

/* ── Sandbox chrome ─────────────────────────────────────────────────── */

/** Static stand-in for the /recipes controls row (search, filters, sort). */
function MockControls({ countLine, count }: { countLine: boolean; count: number }) {
  return (
    <div aria-hidden="true">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-light" />
          <div className="w-full h-[46px] bg-surface border border-brown-light/25 rounded-full pl-11 pr-4 text-base text-brown-light flex items-center shadow-sm">
            Search by name, country, or ingredient…
          </div>
        </div>
        <div className="h-[46px] px-4 rounded-full bg-surface border border-brown-light/25 flex items-center text-sm text-brown-dark shadow-sm">
          Filters
        </div>
        <div className="h-[46px] px-3 rounded-full bg-surface border border-brown-light/25 flex items-center gap-2 text-sm text-brown-dark shadow-sm">
          <ArrowUpDown size={14} /> Latest
        </div>
      </div>
      {countLine && (
        <div className="mt-4 mb-6 font-stamp text-sm sm:text-base uppercase tracking-[0.22em] text-brown-dark nums-tabular">
          № {count} recipe{count === 1 ? '' : 's'}
        </div>
      )}
      {!countLine && <div className="mb-6" />}
    </div>
  );
}

function VariantSection({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="mb-5 border-b border-brown-light/30 pb-2">
        <h2 className="font-stamp text-sm uppercase tracking-[0.28em] text-brown-dark">{label}</h2>
        <p className="mt-1 text-sm text-brown-medium">{note}</p>
      </div>
      {children}
    </section>
  );
}

export default function ShelfHeaderPreview() {
  const { data: recipes = [] } = useRecipes();
  const [slug, setSlug] = useState('high-protein');

  const index = COLLECTIONS.findIndex(c => c.slug === slug);
  const collection = COLLECTIONS[index];
  const members: Recipe[] = collection.includes ? recipes.filter(collection.includes) : [];
  const count = members.length;

  const grid =
    count > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.slice(0, 3).map(r => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    ) : (
      <p className="text-center py-10 text-brown-medium">{collection.emptyCopy ?? 'Nothing here yet'}</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-brown-dark mb-2">
        Shelf header treatments
      </h1>
      <p className="text-brown-medium mb-6">
        Three candidates for the collection shelf header on /recipes. Switch collections to
        preview each accent.
      </p>

      <div className="mb-12 flex flex-wrap gap-2">
        {SHELF_COLLECTIONS.map(c => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setSlug(c.slug)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              c.slug === slug
                ? 'border-brown-dark bg-brown-dark text-parchment'
                : 'border-brown-light/40 text-brown-medium hover:text-brown-dark hover:border-brown-medium/50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <VariantSection
        label="A · Chapter card echo"
        note="The home chapter card, opened: accent bar, numeral and count in the eyebrow, labelled exit pill. Count line above stays as shipped."
      >
        <MockControls countLine count={count} />
        <ShelfHeaderA c={collection} index={index} count={count} />
        {grid}
      </VariantSection>

      <VariantSection
        label="B · Absorbed into the controls row"
        note="One band instead of two: the header replaces the count + chips line, hung on an accent left border. No card box."
      >
        <MockControls countLine={false} count={count} />
        <ShelfHeaderB c={collection} index={index} count={count} />
        {grid}
      </VariantSection>

      <VariantSection
        label="C · Chapter opener spread"
        note="Cookbook chapter opening between hairline rules, centred, accent only on the numeral. Count line above stays as shipped."
      >
        <MockControls countLine count={count} />
        <ShelfHeaderC c={collection} index={index} count={count} />
        {grid}
      </VariantSection>
    </div>
  );
}
