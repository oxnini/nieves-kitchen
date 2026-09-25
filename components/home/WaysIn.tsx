'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Eyebrow } from '@/components/courtyard';
import { COLLECTIONS, collectionBySlug } from '@/lib/collections';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/**
 * "Ways in" — a ruled three-column list drawn from lib/collections.ts.
 * Each column shows the collection title, description, and a live count,
 * hairline-divided rather than colour-blocked (spec 2026-09-25 §6.3).
 */

const BLOCKS: { slug: string }[] = [
  { slug: 'travels' },
  { slug: 'high-protein' },
  { slug: 'sunnah' },
];

function countLine(includes: ((r: Recipe) => boolean) | null, recipes: Recipe[]): string {
  if (includes === null) return 'Browse the atlas';
  const n = recipes.filter(includes).length;
  if (n === 0) return 'Coming soon';
  return `${n} ${n === 1 ? 'recipe' : 'recipes'}`;
}

export default function WaysIn() {
  const { data: recipes = [], isSuccess } = useRecipes();

  const blocks = useMemo(
    () =>
      BLOCKS.map((b) => {
        const c = collectionBySlug(b.slug) ?? COLLECTIONS[0];
        // The atlas link has no count to be wrong about, so it can show
        // immediately. Everything else depends on the live recipe count:
        // showing "Coming soon" before useRecipes resolves (SSR, loading,
        // error) would misreport collections that already have recipes.
        const count = c.includes === null || isSuccess ? countLine(c.includes, recipes) : null;
        return { collection: c, count };
      }),
    [recipes, isSuccess],
  );

  return (
    <section className="mx-auto max-w-[1160px] px-4 sm:px-10 py-14 sm:py-20" aria-labelledby="ways-in-heading">
      <h2
        id="ways-in-heading"
        className="font-heading font-normal text-[clamp(2rem,3.4vw,2.8rem)] leading-tight text-brown-dark"
      >
        Follow a thread.
      </h2>

      <ul className="mt-8 grid sm:grid-cols-3 border-t border-brown-dark">
        {blocks.map(({ collection, count }) => (
          <li
            key={collection.slug}
            className="border-b border-line sm:border-b-0 sm:border-r last:border-r-0 px-0 sm:px-6 sm:first:pl-0 sm:last:pr-0 py-6"
          >
            <Link
              href={collection.href}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
            >
              <Eyebrow tone="terracotta">Collection</Eyebrow>
              <h3 className="mt-2 font-heading font-normal text-[23px] leading-snug text-brown-dark transition-colors group-hover:text-teal">
                {collection.title}
              </h3>
              <p className="mt-2 font-body text-[14.5px] leading-normal text-brown-medium">
                {collection.description}
              </p>
              {/* Same-height placeholder while the count is unknown, so the
                  three columns don't shift once it resolves. An actual
                  non-breaking space (U+00A0), not a regular space, so it
                  can't collapse to nothing. */}
              <p className="mt-3 font-body text-[13.5px] font-semibold text-teal" aria-hidden={count === null}>
                {count ?? ' '}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
