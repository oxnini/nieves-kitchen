'use client';

import { useMemo } from 'react';
import { DestinationTile, Eyebrow } from '@/components/courtyard';
import { COLLECTIONS, collectionBySlug } from '@/lib/collections';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/**
 * "Ways in" (Courtyard "1A" closer) — three colour blocks drawn from
 * lib/collections.ts. Each shows the collection title, a live count, and links
 * to its lens. Kept to cobalt + terracotta (with a cobalt-deep shade) so the
 * view holds to two accents.
 */

const BLOCKS: { slug: string; tone: 'cobalt' | 'terracotta' | 'cobaltDeep' }[] = [
  { slug: 'travels', tone: 'cobalt' },
  { slug: 'high-protein', tone: 'terracotta' },
  { slug: 'sunnah', tone: 'cobaltDeep' },
];

function countLine(includes: ((r: Recipe) => boolean) | null, recipes: Recipe[]): string {
  if (includes === null) return 'Browse the atlas';
  const n = recipes.filter(includes).length;
  if (n === 0) return 'Coming soon';
  return `${n} ${n === 1 ? 'recipe' : 'recipes'}`;
}

export default function WaysIn() {
  const { data: recipes = [] } = useRecipes();

  const blocks = useMemo(
    () =>
      BLOCKS.map((b) => {
        const c = collectionBySlug(b.slug) ?? COLLECTIONS[0];
        return { tone: b.tone, collection: c, count: countLine(c.includes, recipes) };
      }),
    [recipes],
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10" aria-labelledby="ways-in-heading">
      <Eyebrow tone="terracotta">Ways in</Eyebrow>
      <h2 id="ways-in-heading" className="mt-2 font-heading text-[clamp(1.7rem,4vw,2.4rem)] font-normal leading-tight text-brown-dark">
        Follow a thread.
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {blocks.map(({ tone, collection, count }) => (
          <DestinationTile
            key={collection.slug}
            tone={tone}
            eyebrow="Collection"
            title={collection.title}
            href={collection.href}
            minHeight={196}
            className="h-full"
          >
            <p className="font-body text-[13.5px] leading-normal text-cream/85">{collection.description}</p>
            <p className={`mt-3 font-body text-[13px] font-bold ${tone === 'terracotta' ? 'text-cream' : 'text-brass'}`}>
              {count}
            </p>
          </DestinationTile>
        ))}
      </div>
    </section>
  );
}
