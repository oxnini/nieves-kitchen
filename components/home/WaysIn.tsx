'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Eyebrow } from '@/components/courtyard';
import { COLLECTIONS, collectionBySlug, type Collection } from '@/lib/collections';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/**
 * "Ways in" — a ruled three-column list drawn from lib/collections.ts.
 * Each column shows the collection title, description, and a live count,
 * hairline-divided rather than colour-blocked (spec 2026-09-25 §6.3). Every
 * link line is a count and where it leads ("7 recipes →"); a collection with
 * no recipes yet points at its `meanwhile` instead (audit F14).
 */

const BLOCKS: { slug: string }[] = [
  { slug: 'travels' },
  { slug: 'high-protein' },
  { slug: 'sunnah' },
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The thread's link, description and line, from the live recipe list. */
function thread(c: Collection, recipes: Recipe[], pantrySunnah: number) {
  // The atlas lens: every recipe with a country has a pin.
  if (c.includes === null) {
    return { href: c.href, description: c.description, line: `${plural(recipes.filter((r) => r.country).length, 'dish', 'dishes')} on the atlas` };
  }
  const n = recipes.filter(c.includes).length;
  if (n === 0 && c.meanwhile) {
    return { href: c.meanwhile.href, description: c.meanwhile.description, line: `${pantrySunnah} ${c.meanwhile.line}` };
  }
  return { href: c.href, description: c.description, line: n === 0 ? 'Coming soon' : plural(n, 'recipe', 'recipes') };
}

/** `pantrySunnah`: how many Sunnah foods have landed in the pantry, resolved
    on the server (the pantry's art check reads the filesystem). */
export default function WaysIn({ pantrySunnah }: { pantrySunnah: number }) {
  const { data: recipes = [], isSuccess } = useRecipes();

  const blocks = useMemo(
    () =>
      BLOCKS.map((b) => {
        const c = collectionBySlug(b.slug) ?? COLLECTIONS[0];
        // Every line is a live count, so none shows before useRecipes
        // resolves (SSR, loading, error): a guess would misreport the
        // collections, and would send the Sunnah thread to the pantry when
        // it already has recipes.
        return { collection: c, t: isSuccess ? thread(c, recipes, pantrySunnah) : null };
      }),
    [recipes, isSuccess, pantrySunnah],
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
        {blocks.map(({ collection, t }) => (
          <li
            key={collection.slug}
            className="border-b border-line sm:border-b-0 sm:border-r last:border-r-0 px-0 sm:px-6 sm:first:pl-0 sm:last:pr-0 py-6"
          >
            <Link
              href={t?.href ?? collection.href}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
            >
              <Eyebrow tone="terracotta">Collection</Eyebrow>
              <h3 className="mt-2 font-heading font-normal text-[23px] leading-snug text-brown-dark transition-colors group-hover:text-teal">
                {collection.title}
              </h3>
              <p className="mt-2 font-body text-[14.5px] leading-normal text-brown-medium">
                {t?.description ?? collection.description}
              </p>
              {/* Same-height placeholder while the count is unknown, so the
                  three columns don't shift once it resolves. An actual
                  non-breaking space (U+00A0), not a regular space, so it
                  can't collapse to nothing. */}
              <p className="mt-3 font-body text-[13.5px] font-semibold text-teal" aria-hidden={t === null}>
                {t ? <>{t.line} <span aria-hidden="true">→</span></> : ' '}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
