'use client';

import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipes } from '@/hooks/useRecipes';

export default function FavoritesPage() {
  const [favorites] = useFavorites();
  const { data: allRecipes = [] } = useRecipes();
  const favoriteRecipes = allRecipes.filter(r => favorites.has(r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">My Favorites</h1>
        <p className="text-brown-medium text-sm">
          {favoriteRecipes.length} saved recipe{favoriteRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="text-brown-light mx-auto mb-4" />
          <p className="font-heading text-xl text-brown-dark mb-2">No favorites yet</p>
          <p className="text-brown-medium text-sm">
            Open any recipe and tap the heart to save it here.
          </p>
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
