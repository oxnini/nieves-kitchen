'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';
import type { Recipe } from '@/lib/types';

interface Props {
  recipes: Recipe[];
  isLoading: boolean;
}

export default function LatestFromKitchen({ recipes, isLoading }: Props) {
  const [favorites] = useFavorites();
  const latest = useMemo(
    () =>
      [...recipes]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 3),
    [recipes],
  );

  if (!isLoading && latest.length === 0) return null;

  return (
    <section aria-labelledby="latest-heading">
      <div className="flex items-baseline justify-between mb-4">
        <h2 id="latest-heading" className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80">
          Latest from the kitchen
        </h2>
        <Link
          href="/recipes"
          className="text-sm text-brown-medium hover:text-brown-dark underline decoration-brown-light/40 underline-offset-2 transition-colors"
        >
          All recipes
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl overflow-hidden shadow-md animate-pulse">
              <div className="h-44 bg-parchment-dark" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-parchment-dark rounded w-3/4" />
                <div className="h-3 bg-parchment-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {latest.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} isFavorited={favorites.has(recipe.id)} />
          ))}
        </div>
      )}
    </section>
  );
}
