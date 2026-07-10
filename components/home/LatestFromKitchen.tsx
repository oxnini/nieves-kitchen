'use client';

import { useMemo } from 'react';
import RecipeCard from '@/components/RecipeCard';
import DepartmentHeader from '@/components/home/DepartmentHeader';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipes } from '@/hooks/useRecipes';

export default function LatestFromKitchen() {
  const { data: recipes = [], isLoading } = useRecipes();
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
      <DepartmentHeader
        id="latest-heading"
        label="Latest from the Kitchen"
        link={{ href: '/recipes', label: 'All recipes' }}
      />
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
