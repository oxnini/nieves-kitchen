import { AnimatePresence } from "framer-motion";
import RecipeCard from "../components/RecipeCard";
import FilterPanel from "../components/FilterPanel";
import type { Recipe, Filters } from "../types";

interface RecipesPageProps {
  recipes: Recipe[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount: number;
  onSelectRecipe: (recipe: Recipe) => void;
  favorites: Set<string>;
}

export default function RecipesPage({
  recipes,
  filters,
  onFiltersChange,
  activeFilterCount,
  onSelectRecipe,
  favorites,
}: RecipesPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">
          All Recipes
        </h1>
        <p className="text-brown-medium text-sm">
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} found
          {activeFilterCount > 0 && (
            <span className="text-terracotta"> ({activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active)</span>
          )}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown-medium text-lg mb-2">No recipes match your filters</p>
          <p className="text-brown-light text-sm">Try adjusting your filters to discover more dishes.</p>
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

      <FilterPanel
        filters={filters}
        onChange={onFiltersChange}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
