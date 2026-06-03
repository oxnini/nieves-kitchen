// data/recipes/_types.ts
//
// Source-of-truth shape for a hand-authored recipe. One file per recipe in
// this folder exports a `RecipeInput` as default. `_`-prefixed files (like
// this one) are helpers and are skipped by the seed loader.
import type {
  CulinaryRegion,
  IngredientGroup,
  StepGroup,
  Nutrition,
  FlavorProfile,
} from '@/lib/types';

export interface RecipeInput {
  // — Core: provided by the cook —
  title: string;
  /** Must match the `world-atlas` GeoJSON `properties.name` (e.g. "Italy"). */
  country: string;
  category: 'main' | 'dessert' | 'drink' | 'side';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  time: { active: number; total: number; resting?: number };
  yield?: string;
  tags: string[];
  ingredients: IngredientGroup[];
  steps: StepGroup[];

  // — Derived: computed/looked up by Claude —
  region: CulinaryRegion;
  coordinates: { lat: number; lng: number };
  /** Per-serving estimate. UI labels nutrition as approximate. */
  nutrition: Nutrition;
  flavorProfile: FlavorProfile;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;

  // — Editorial: drafted by Claude, approved by the cook —
  quote: string;
  description?: string;
  attribution?: string;
  headnoteIngredients?: string;
  headnoteInstructions?: string;
  equipment?: string[];
  tips?: string[];
  substitutions?: string[];
  variations?: string[];
  storage?: string;
  dropcap?: boolean;
  isFusion?: boolean;
  inspiredBy?: string[];

  // — Media —
  /** Stock placeholder URL for now; swap to a real photo later. */
  image: string;
  /** Defaults to true. Set false once a real photo replaces the stock image. */
  imageIsStock?: boolean;
}

/** Snake_case row written to `public.recipes` (id/created_at are DB-generated). */
export interface RecipeRow {
  slug: string;
  title: string;
  country: string;
  region: string;
  description: string | null;
  attribution: string | null;
  ingredients: IngredientGroup[];
  steps: StepGroup[];
  tags: string[];
  image_url: string;
  time_active: number;
  time_total: number;
  time_resting: number;
  yield: string | null;
  equipment: string[] | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'main' | 'dessert' | 'drink' | 'side';
  coordinates: { lat: number; lng: number };
  is_fusion: boolean;
  inspired_by: string[] | null;
  quote: string;
  nutrition: Nutrition;
  flavor_profile: FlavorProfile;
  headnote_ingredients: string | null;
  headnote_instructions: string | null;
  tips: string[] | null;
  substitutions: string[] | null;
  variations: string[] | null;
  storage: string | null;
  dropcap: boolean;
}

export function inputToRow(slug: string, r: RecipeInput): RecipeRow {
  return {
    slug,
    title: r.title,
    country: r.country,
    region: r.region,
    description: r.description ?? null,
    attribution: r.attribution ?? null,
    ingredients: r.ingredients,
    steps: r.steps,
    tags: r.tags,
    image_url: r.image,
    time_active: r.time.active,
    time_total: r.time.total,
    time_resting: r.time.resting ?? 0,
    yield: r.yield ?? null,
    equipment: r.equipment ?? null,
    is_vegetarian: r.isVegetarian,
    is_vegan: r.isVegan,
    is_gluten_free: r.isGlutenFree,
    is_dairy_free: r.isDairyFree,
    servings: r.servings,
    difficulty: r.difficulty,
    category: r.category,
    coordinates: r.coordinates,
    is_fusion: r.isFusion ?? false,
    inspired_by: r.inspiredBy ?? null,
    quote: r.quote,
    nutrition: r.nutrition,
    flavor_profile: r.flavorProfile,
    headnote_ingredients: r.headnoteIngredients ?? null,
    headnote_instructions: r.headnoteInstructions ?? null,
    tips: r.tips ?? null,
    substitutions: r.substitutions ?? null,
    variations: r.variations ?? null,
    storage: r.storage ?? null,
    dropcap: r.dropcap ?? false,
  };
}

/** Default flag for recipes that haven't set `imageIsStock`. */
export function needsRealPhoto(r: RecipeInput): boolean {
  return r.imageIsStock !== false;
}
