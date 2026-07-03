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
  RecipeImage,
} from '@/lib/types';

export interface RecipeInput {
  // — Core: provided by the cook —
  title: string;
  /**
   * Primary influence: must match the `world-atlas` GeoJSON `properties.name`
   * (e.g. "Italy"). It is the country that earns the passport stamp. Omit
   * country, region, AND coordinates together for an origin-less recipe
   * (everyday healthy food with no single home).
   */
  country?: string;
  region?: CulinaryRegion;
  coordinates?: { lat: number; lng: number };
  /**
   * Every country that shaped the dish, world-atlas names, primary first.
   * Defaults to [country]. Set explicitly for fusion dishes.
   */
  influences?: string[];
  /** Dish from the Prophet's ﷺ table. Only with a real, citable source. */
  isSunnah?: boolean;
  /** Pantry-entry slugs featured by this recipe (phase 2). */
  featuredIngredients?: string[];
  category: 'main' | 'dessert' | 'drink' | 'side';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  time: { active: number; total: number; resting?: number };
  /** Maps to app `Recipe.yieldText` (DB column: `yield`). */
  yield?: string;
  tags: string[];
  ingredients: IngredientGroup[];
  /** Maps to app `Recipe.instructions` (DB column: `steps`). */
  steps: StepGroup[];

  // — Derived: computed/looked up by Claude —
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
  /**
   * Only genuinely special tools that shape the cook (e.g. a way to steam, an
   * oven dish). Frame each by function with everyday alternatives inline; never
   * list things nearly every kitchen has (bowls, spoons, a bowl of water) or
   * over-specific gear for a basic task (a box grater for "mince it fine").
   * Omit the field entirely when nothing special is needed. The goal is to
   * reassure, not to hand someone a shopping list that implies they're missing
   * something. No em dashes in these strings (they're user-facing).
   */
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
  /**
   * Up to 3 extra photos beyond the hero, shown in the read-mode gallery.
   * Only stored for recipes with a real hero (see the seed-time gate in
   * `inputToRow`); ignored while the recipe is still on a stock photo.
   */
  images?: RecipeImage[];
}

/**
 * WRITE-SIDE type: snake_case row written to `public.recipes`
 * (id/created_at are DB-generated).
 *
 * Intentionally narrows two columns that the DB schema allows as nullable:
 * - `image_url` is `string` (not `string | null`) because `inputToRow` always
 *   maps `RecipeInput.image`; authored recipes always supply an image URL.
 * - `time_resting` is `number` (not `number | null`) because `inputToRow`
 *   defaults it to `0` when `RecipeInput.time.resting` is omitted.
 *
 * This type is validated through `DbRecipeSchema` (which is nullable-tolerant)
 * at seed time and is never assigned directly to `DbRecipe`.
 */
export interface RecipeRow {
  slug: string;
  title: string;
  country: string | null;
  region: string | null;
  description: string | null;
  attribution: string | null;
  ingredients: IngredientGroup[];
  /** Maps to app `Recipe.instructions`. */
  steps: StepGroup[];
  tags: string[];
  image_url: string;
  /** Extra gallery photos; empty when the hero is still a stock placeholder. */
  images: RecipeImage[];
  time_active: number;
  time_total: number;
  time_resting: number;
  /** Maps to app `Recipe.yieldText`. */
  yield: string | null;
  equipment: string[] | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'main' | 'dessert' | 'drink' | 'side';
  coordinates: { lat: number; lng: number } | null;
  influences: string[];
  is_sunnah: boolean;
  featured_ingredients: string[];
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
  const placeFields = [r.country, r.region, r.coordinates].filter(v => v !== undefined).length;
  if (placeFields !== 0 && placeFields !== 3) {
    throw new Error(
      `${slug}: country, region, and coordinates must be provided together or all omitted (got ${placeFields}/3)`,
    );
  }
  return {
    slug,
    title: r.title,
    country: r.country ?? null,
    region: r.region ?? null,
    description: r.description ?? null,
    attribution: r.attribution ?? null,
    ingredients: r.ingredients,
    steps: r.steps,
    tags: r.tags,
    image_url: r.image,
    // Gate to real photos: a recipe still on a stock hero stores no extras (an
    // empty array, since the column is NOT NULL), so stock placeholders never
    // showcase a gallery. The extras re-appear the moment `imageIsStock` flips
    // to false.
    images: needsRealPhoto(r) ? [] : (r.images ?? []),
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
    coordinates: r.coordinates ?? null,
    influences: r.influences ?? (r.country ? [r.country] : []),
    is_sunnah: r.isSunnah ?? false,
    featured_ingredients: r.featuredIngredients ?? [],
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
