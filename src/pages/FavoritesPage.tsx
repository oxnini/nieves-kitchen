import { AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types";

interface FavoritesPageProps {
  recipes: Recipe[];
  favorites: Set<string>;
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function FavoritesPage({ recipes, favorites, onSelectRecipe }: FavoritesPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">
          My Favorites
        </h1>
        <p className="text-brown-medium text-sm">
          {recipes.length} saved recipe{recipes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {recipes.length === 0 ? (
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
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => onSelectRecipe(recipe)}
                isFavorited={favorites.has(recipe.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
