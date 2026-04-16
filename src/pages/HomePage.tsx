import WorldMap from "../components/WorldMap";
import FilterPanel from "../components/FilterPanel";
import type { Recipe, Filters } from "../types";

interface HomePageProps {
  recipes: Recipe[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount: number;
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function HomePage({
  recipes,
  filters,
  onFiltersChange,
  activeFilterCount,
  onSelectRecipe,
}: HomePageProps) {
  return (
    <div className="relative h-[calc(100vh-72px)]">
      {/* Map fills the entire viewport below the navbar */}
      <WorldMap recipes={recipes} onSelectRecipe={onSelectRecipe} />

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onChange={onFiltersChange}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
