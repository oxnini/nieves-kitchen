export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FlavorProfile {
  sweet: number;
  salty: number;
  sour: number;
  bitter: number;
  umami: number;
  spicy: number;
}

export interface Recipe {
  id: string;
  name: string;
  country: string;
  region: CulinaryRegion;
  coordinates: { lat: number; lng: number };
  category: 'main' | 'dessert' | 'drink' | 'side';
  tags: string[];
  isFusion: boolean;
  inspiredBy?: string[];
  quote: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
  flavorProfile: FlavorProfile;
  tips?: string[];
}

export type CulinaryRegion =
  | 'Western Europe'
  | 'Eastern Europe'
  | 'East Asia'
  | 'Southeast Asia'
  | 'South Asia'
  | 'Middle East'
  | 'North Africa'
  | 'Sub-Saharan Africa'
  | 'North America'
  | 'South America';

// Ordered list for iteration where stable display order matters (passport booklet).
// Matches the declaration order of the CulinaryRegion union above.
export const CULINARY_REGION_ORDER: CulinaryRegion[] = [
  'Western Europe',
  'Eastern Europe',
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Middle East',
  'North Africa',
  'Sub-Saharan Africa',
  'North America',
  'South America',
];

export type SubCulinaryRegion =
  | 'Northern Europe'
  | 'Western Europe (sub)'
  | 'Mediterranean'
  | 'Eastern Europe (sub)'
  | 'East Asia (sub)'
  | 'Southeast Asia (sub)'
  | 'South Asia (sub)'
  | 'Central Asia'
  | 'West Asia / Levant'
  | 'Arabian Peninsula'
  | 'North Africa (sub)'
  | 'West Africa'
  | 'East Africa'
  | 'Central Africa'
  | 'Southern Africa'
  | 'North America (sub)'
  | 'Central America & Caribbean'
  | 'South America (sub)'
  | 'Oceania';

export type MealFilter = 'all' | 'main' | 'dessert' | 'drink' | 'side';

export interface Filters {
  mealType: MealFilter;
  minProtein: number;
  maxCalories: number;
  maxTime: number | null;
  regions: CulinaryRegion[];
  tags: string[];
}

export interface DbRecipe {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: CulinaryRegion;
  description: string | null;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  image_url: string;
  cook_time: number;
  prep_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'main' | 'dessert' | 'drink' | 'side';
  coordinates: { lat: number; lng: number };
  is_fusion: boolean;
  inspired_by: string[] | null;
  quote: string;
  nutrition: Nutrition;
  flavor_profile: FlavorProfile;
  tips: string[] | null;
  created_at: string;
}

export function dbToRecipe(db: DbRecipe): Recipe {
  return {
    id: db.slug,
    name: db.title,
    country: db.country,
    region: db.region,
    coordinates: db.coordinates,
    category: db.category,
    tags: db.tags,
    isFusion: db.is_fusion,
    inspiredBy: db.inspired_by ?? undefined,
    quote: db.quote,
    image: db.image_url,
    prepTime: db.prep_time,
    cookTime: db.cook_time,
    servings: db.servings,
    difficulty: db.difficulty,
    ingredients: db.ingredients,
    instructions: db.steps,
    nutrition: db.nutrition,
    flavorProfile: db.flavor_profile,
    tips: db.tips ?? undefined,
  };
}
