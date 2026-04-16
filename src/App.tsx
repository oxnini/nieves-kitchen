import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import RecipeModal from "./components/RecipeModal";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import AboutPage from "./pages/AboutPage";
import { recipes } from "./data/recipes";
import type { Page, Recipe, Filters } from "./types";

const DEFAULT_FILTERS: Filters = {
  mealType: "all",
  minProtein: 0,
  maxCalories: 800,
  maxTime: null,
  regions: [],
  tags: [],
};

function applyFilters(allRecipes: Recipe[], filters: Filters): Recipe[] {
  return allRecipes.filter(r => {
    if (filters.mealType !== "all" && r.category !== filters.mealType) return false;
    if (r.nutrition.protein < filters.minProtein) return false;
    if (r.nutrition.calories > filters.maxCalories) return false;
    if (filters.maxTime !== null && r.prepTime + r.cookTime > filters.maxTime) return false;
    if (filters.regions.length > 0 && !filters.regions.includes(r.region)) return false;
    if (filters.tags.length > 0 && !filters.tags.some(tag => r.tags.includes(tag))) return false;
    return true;
  });
}

function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.mealType !== "all") count++;
  if (filters.minProtein > 0) count++;
  if (filters.maxCalories < 800) count++;
  if (filters.maxTime !== null) count++;
  count += filters.regions.length;
  count += filters.tags.length;
  return count;
}

function useLocalStorageFavorites(): [Set<string>, (id: string) => void] {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("nieves-favorites");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("nieves-favorites", JSON.stringify([...next]));
      return next;
    });
  }

  return [favorites, toggleFavorite];
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, toggleFavorite] = useLocalStorageFavorites();

  const filteredRecipes = useMemo(
    () => applyFilters(recipes, filters),
    [filters]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  const favoriteRecipes = useMemo(
    () => recipes.filter(r => favorites.has(r.id)),
    [favorites]
  );

  return (
    <div className="min-h-screen bg-parchment overflow-x-hidden">
      <Navbar currentPage={page} onNavigate={setPage} favoritesCount={favorites.size} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={page === "home" ? "h-[calc(100vh-72px)]" : ""}
        >
          {page === "home" && (
            <HomePage
              recipes={filteredRecipes}
              filters={filters}
              onFiltersChange={setFilters}
              activeFilterCount={activeFilterCount}
              onSelectRecipe={setSelectedRecipe}
            />
          )}
          {page === "recipes" && (
            <RecipesPage
              recipes={filteredRecipes}
              filters={filters}
              onFiltersChange={setFilters}
              activeFilterCount={activeFilterCount}
              onSelectRecipe={setSelectedRecipe}
              favorites={favorites}
            />
          )}
          {page === "favorites" && (
            <FavoritesPage
              recipes={favoriteRecipes}
              favorites={favorites}
              onSelectRecipe={setSelectedRecipe}
            />
          )}
          {page === "about" && <AboutPage />}
        </motion.main>
      </AnimatePresence>

      {/* Recipe modal overlay */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorited={favorites.has(selectedRecipe.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
