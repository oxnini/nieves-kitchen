'use client';

import Link from 'next/link';
import { COLLECTIONS, COLLECTION_ACCENTS, type Collection } from '@/lib/collections';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/** Members of a collection; 'travels' is a lens on placed recipes. */
function membersOf(c: Collection, recipes: Recipe[]): Recipe[] {
  if (c.includes) return recipes.filter(c.includes);
  if (c.slug === 'travels') return recipes.filter((r) => r.country !== null);
  return [];
}

const ROMAN = ['I', 'II', 'III', 'IV'];

export default function CollectionsRow() {
  const { data: recipes = [] } = useRecipes();

  return (
    <section aria-label="Collections">
      <div className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80 mb-4">
        The Collections
      </div>
      <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {COLLECTIONS.map((c, i) => {
          const a = COLLECTION_ACCENTS[c.slug];
          const members = membersOf(c, recipes);
          const countLine =
            c.slug === 'travels'
              ? 'Browse on the atlas'
              : members.length === 0
                ? 'First dishes on their way'
                : `${members.length} recipe${members.length === 1 ? '' : 's'}`;
          return (
            <li key={c.slug}>
              <Link
                href={c.href}
                className={`group relative block overflow-hidden rounded-2xl border border-brown-light/25 bg-surface p-5 pl-6 hover:shadow-md transition-[border-color,box-shadow] ${a.edge} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta`}
              >
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${a.bar}`} />
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium/80">
                    Chapter {ROMAN[i]}
                  </span>
                  <span className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium/70 nums-tabular">
                    {countLine}
                  </span>
                </span>
                <h3 className={`mt-2 font-heading text-xl font-semibold text-brown-dark transition-colors leading-snug ${a.hover}`}>
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-brown-medium leading-relaxed">{c.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
