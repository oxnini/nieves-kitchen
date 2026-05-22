import type { Filters, Recipe } from './types';

export const TAG_GROUPS = [
  {
    label: 'Dietary',
    tags: ['vegetarian', 'high-protein', 'low-carb', 'keto-friendly'],
    visibleCount: 2,
  },
  {
    label: 'Style',
    tags: ['quick', 'one-pot', 'comfort food', 'spicy', 'fusion'],
    visibleCount: 4,
  },
  {
    label: 'Occasion',
    tags: ['budget-friendly', 'meal-prep friendly', 'single-serving', 'weekend feast'],
    visibleCount: 2,
  },
] as const;

export const ALL_TAGS: readonly string[] = TAG_GROUPS.flatMap(g => g.tags);

export const DEFAULT_FILTERS: Filters = {
  mealType: 'all',
  minProtein: 0,
  maxCalories: 800,
  maxTime: null,
  regions: [],
  tags: [],
};

export function applyFilters(allRecipes: Recipe[], filters: Filters): Recipe[] {
  return allRecipes.filter(r => {
    if (filters.mealType !== 'all' && r.category !== filters.mealType) return false;
    if (r.nutrition.protein < filters.minProtein) return false;
    if (r.nutrition.calories > filters.maxCalories) return false;
    if (filters.maxTime !== null && r.time.total > filters.maxTime) return false;
    if (filters.regions.length > 0 && !filters.regions.includes(r.region)) return false;
    if (filters.tags.length > 0 && !filters.tags.some(tag => r.tags.includes(tag))) return false;
    return true;
  });
}

export function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.mealType !== 'all') count++;
  if (filters.minProtein > 0) count++;
  if (filters.maxCalories < 800) count++;
  if (filters.maxTime !== null) count++;
  count += filters.regions.length;
  count += filters.tags.length;
  return count;
}
