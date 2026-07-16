'use client';

import { Heart } from 'lucide-react';
import { Button, Eyebrow } from '@/components/courtyard';
import RecipeCard from '@/components/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipes } from '@/hooks/useRecipes';

export default function FavoritesPage() {
  const [favorites] = useFavorites();
  const { data: allRecipes = [], isLoading, isError, refetch } = useRecipes();
  const favoriteRecipes = allRecipes.filter(r => favorites.has(r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 pb-10 sm:pt-7 sm:pb-14">
      {/* Editorial header — same system as /recipes and /about */}
      <header className="mb-8 max-w-3xl">
        <Eyebrow tone="terracotta">The Collection &middot; Nieves&#39;s Kitchen</Eyebrow>
        <h1 className="mt-2.5 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark tracking-tight leading-[1.05]">
          My Favorites
        </h1>
        <p className="mt-2.5 text-brown-medium text-base sm:text-lg italic leading-relaxed">
          {favoriteRecipes.length} saved recipe{favoriteRecipes.length !== 1 ? 's' : ''}, kept close for the next cook.
        </p>
      </header>

      {isError ? (
        <div className="text-center py-24">
          <p className="font-heading text-xl text-brown-dark mb-2">Something went wrong</p>
          <p className="text-brown-medium text-base mb-5">Your favorites are saved locally. This is a temporary hiccup loading recipe details.</p>
          <Button variant="primary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : isLoading && favorites.size > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
          {Array.from({ length: Math.min(favorites.size, 6) }).map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl overflow-hidden shadow-md animate-pulse">
              <div className="h-44 bg-parchment-dark" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-parchment-dark rounded w-3/4" />
                <div className="h-3 bg-parchment-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : favoriteRecipes.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="text-brown-light mx-auto mb-4" />
          <p className="font-heading text-xl text-brown-dark mb-2">Your collection starts here</p>
          <p className="text-brown-medium text-base mb-5">
            Tap the heart on any recipe to save it for later.
          </p>
          <Button variant="primary" href="/recipes">
            Browse recipes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited
              />
            ))}
        </div>
      )}
    </div>
  );
}
