'use client';

import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipes } from '@/hooks/useRecipes';

export default function FavoritesPage() {
  const [favorites] = useFavorites();
  const { data: allRecipes = [], isLoading, isError, refetch } = useRecipes();
  const favoriteRecipes = allRecipes.filter(r => favorites.has(r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">My Favorites</h1>
        <p className="text-brown-medium text-sm">
          {favoriteRecipes.length} saved recipe{favoriteRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isError ? (
        <div className="text-center py-24">
          <p className="font-heading text-xl text-brown-dark mb-2">Something went wrong</p>
          <p className="text-brown-medium text-sm mb-5">Your favorites are saved locally — this is a temporary hiccup loading recipe details.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta/90 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : isLoading && favorites.size > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
          {Array.from({ length: Math.min(favorites.size, 6) }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
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
          <p className="text-brown-medium text-sm mb-5">
            Tap the heart on any recipe to save it for later.
          </p>
          <a
            href="/recipes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta/90 transition-colors"
          >
            Browse recipes
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {favoriteRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
