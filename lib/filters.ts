import type { Filters, Recipe } from './types';

export const TAG_GROUPS = [
  {
    label: 'Dietary',
    tags: ['vegetarian', 'high-protein', 'treat', 'low-carb', 'keto-friendly'],
    visibleCount: 3,
  },
  {
    label: 'Style',
    tags: ['quick', 'one-pot', 'comfort food', 'spicy', 'fusion', 'baking'],
    visibleCount: 4,
  },
  {
    label: 'Occasion',
    tags: ['budget-friendly', 'meal-prep friendly', 'single-serving', 'weekend feast'],
    visibleCount: 2,
  },
] as const;

export const ALL_TAGS: readonly string[] = TAG_GROUPS.flatMap(g => g.tags);

/**
 * What a reader sees for each stored tag. The stored values stay as they are
 * (they live in Supabase rows and filter state); only the words change.
 * `single-serving` reads as an occasion, not a limit: the servings stepper
 * still scales the recipe up. `baking` is the baker's craft (breads, pastry,
 * cakes, biscuits), not anything that sees an oven: a lasagna is not a bake.
 * User-facing: no em dashes.
 */
const TAG_LABELS: Record<string, string> = {
  vegetarian: 'Vegetarian',
  'high-protein': 'High protein',
  treat: 'A treat',
  'low-carb': 'Low carb',
  'keto-friendly': 'Keto friendly',
  quick: 'Quick',
  'one-pot': 'One pot',
  'comfort food': 'Comfort food',
  spicy: 'Spicy',
  fusion: 'Fusion',
  baking: 'Baking',
  'budget-friendly': 'Budget friendly',
  'meal-prep friendly': 'Good for meal prep',
  'single-serving': 'Cooking for one',
  'weekend feast': 'Weekend feast',
};

/** A stored tag as a reader sees it. Unknown tags get sentence case. */
export function tagLabel(tag: string): string {
  const known = TAG_LABELS[tag];
  if (known) return known;
  const words = tag.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export const DEFAULT_FILTERS: Filters = {
  mealType: 'all',
  minProtein: 0,
  maxCalories: 800,
  maxTime: null,
  regions: [],
  tags: [],
};

export function applyFilters<T extends Recipe>(allRecipes: T[], filters: Filters): T[] {
  return allRecipes.filter(r => {
    if (filters.mealType !== 'all' && r.category !== filters.mealType) return false;
    if (r.nutrition.protein < filters.minProtein) return false;
    if (r.nutrition.calories > filters.maxCalories) return false;
    if (filters.maxTime !== null && r.time.total > filters.maxTime) return false;
    if (filters.regions.length > 0 && (r.region === null || !filters.regions.includes(r.region))) return false;
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
