import { z } from 'zod';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  metricAmount?: number;
  metricUnit?: string;
}

export interface IngredientGroup {
  heading?: string;
  items: Ingredient[];
}

/**
 * An extra recipe-detail photo beyond the hero. Shown whole and uncropped in
 * the read-mode gallery. `width`/`height` are the image's intrinsic pixel
 * dimensions, required by next/image to render at the right ratio without
 * layout shift (filled in when the photo is wired up, not by hand).
 */
export interface RecipeImage {
  url: string;
  caption?: string;
  width: number;
  height: number;
}

export interface StepGroup {
  heading?: string;
  headnote?: string;
  items: string[];
}

/**
 * All values are per-serving. The detail page renders cumulative totals
 * by multiplying by the current servings count.
 */
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

export interface RecipeTime {
  /** Hands-on minutes. */
  active: number;
  /** Wall-clock minutes including resting. */
  total: number;
  /** Optional inactive minutes. Omitted from UI if 0/undefined. */
  resting?: number;
}

export interface Recipe {
  id: string;
  name: string;
  /** Primary influence: the country that earns the passport stamp. Null for origin-less recipes. */
  country: string | null;
  region: CulinaryRegion | null;
  coordinates: { lat: number; lng: number } | null;
  /** Every country that shaped the dish (world-atlas names). Empty for origin-less recipes. */
  influences: string[];
  /** Dish from the Prophet's ﷺ table (talbina, tharid). Always cited where surfaced. */
  isSunnah: boolean;
  /** Pantry-entry slugs featured by this recipe (phase 2 consumer). */
  featuredIngredients: string[];
  /** ISO timestamp from the DB row; powers "latest from the kitchen". */
  createdAt: string;
  category: 'main' | 'dessert' | 'drink' | 'side';
  tags: string[];
  isFusion: boolean;
  inspiredBy?: string[];
  /** Italic pull-quote (Literata). Editorial voice, distinct from `description`. */
  quote: string;
  /** Editorial intro paragraph, 2–4 sentences. Optional. */
  description?: string;
  /** Single-line attribution. Cutive Mono on the page. */
  attribution?: string;
  image: string;
  /** Extra photos beyond the hero, shown in the read-mode gallery. */
  images?: RecipeImage[];
  time: RecipeTime;
  /** Free-form output description: "12 dumplings", "1 loaf". Falls back to "{servings} servings". */
  yieldText?: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  equipment?: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  ingredients: IngredientGroup[];
  instructions: StepGroup[];
  headnoteIngredients?: string;
  headnoteInstructions?: string;
  nutrition: Nutrition;
  flavorProfile: FlavorProfile;
  tips?: string[];
  substitutions?: string[];
  variations?: string[];
  storage?: string;
  /** Per-recipe opt-in for editorial drop cap on the description block. */
  dropcap?: boolean;
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
  | 'South America'
  | 'Oceania';

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
  'Oceania',
];

export type Continent = 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Oceania';

export const CONTINENT_ORDER: Continent[] = ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'];

export const CONTINENT_OF: Record<CulinaryRegion, Continent> = {
  'Western Europe': 'Europe',
  'Eastern Europe': 'Europe',
  'East Asia': 'Asia',
  'Southeast Asia': 'Asia',
  'South Asia': 'Asia',
  'Middle East': 'Asia',
  'North Africa': 'Africa',
  'Sub-Saharan Africa': 'Africa',
  'North America': 'Americas',
  'South America': 'Americas',
  'Oceania': 'Oceania',
};

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
  country: string | null;
  region: CulinaryRegion | null;
  description: string | null;
  attribution: string | null;
  ingredients: IngredientGroup[];
  steps: StepGroup[];
  tags: string[];
  image_url: string | null;
  /** Optional/nullable so rows from before the column existed still parse. */
  images?: RecipeImage[] | null;
  time_active: number;
  time_total: number;
  time_resting: number | null;
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
  is_fusion: boolean;
  /** Optional/nullable so rows from before the column existed still parse. */
  influences?: string[] | null;
  is_sunnah?: boolean | null;
  featured_ingredients?: string[] | null;
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
  created_at: string;
}

/* ─────────────────────────────────────────────────────────────────────────── *
 * Zod validators for Supabase rows
 *
 * Defines runtime parsers that mirror `DbRecipe`. Used at the Supabase
 * boundary (`getRecipe`, `useRecipes`, `useRecipeIndex`) so a malformed
 * jsonb cell can't crash a Server Component or React Query consumer.
 *
 * `passthrough()` on objects accepts unknown extra keys (forwards
 * compatibility with new columns). Lists drop invalid rows; single-row
 * fetches return `null` on parse failure.
 * ─────────────────────────────────────────────────────────────────────────── */

const IngredientSchema: z.ZodType<Ingredient> = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
  metricAmount: z.number().optional(),
  metricUnit: z.string().optional(),
});

const IngredientGroupSchema: z.ZodType<IngredientGroup> = z.object({
  heading: z.string().optional(),
  items: z.array(IngredientSchema),
});

const RecipeImageSchema: z.ZodType<RecipeImage> = z.object({
  url: z.string(),
  caption: z.string().optional(),
  width: z.number(),
  height: z.number(),
});

const StepGroupSchema: z.ZodType<StepGroup> = z.object({
  heading: z.string().optional(),
  headnote: z.string().optional(),
  items: z.array(z.string()),
});

const NutritionSchema: z.ZodType<Nutrition> = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

const FlavorProfileSchema: z.ZodType<FlavorProfile> = z.object({
  sweet: z.number(),
  salty: z.number(),
  sour: z.number(),
  bitter: z.number(),
  umami: z.number(),
  spicy: z.number(),
});

const CulinaryRegionSchema = z.enum([
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
  'Oceania',
]);

const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

/** Full row from `public.recipes`. */
export const DbRecipeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  country: z.string().nullable(),
  region: CulinaryRegionSchema.nullable(),
  description: z.string().nullable(),
  attribution: z.string().nullable(),
  ingredients: z.array(IngredientGroupSchema),
  steps: z.array(StepGroupSchema),
  tags: z.array(z.string()),
  // `image_url` is nullable at the DB level (schema.sql:12). Consumers see
  // `Recipe.image: string` via the empty-string fallback in `dbToRecipe`.
  image_url: z.string().nullable(),
  // Optional + nullable so a row predating the `images` column still parses
  // (the key is simply absent until the migration adds it).
  images: z.array(RecipeImageSchema).nullable().optional(),
  time_active: z.number(),
  time_total: z.number(),
  time_resting: z.number().nullable(),
  yield: z.string().nullable(),
  equipment: z.array(z.string()).nullable(),
  is_vegetarian: z.boolean(),
  is_vegan: z.boolean(),
  is_gluten_free: z.boolean(),
  is_dairy_free: z.boolean(),
  servings: z.number(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.enum(['main', 'dessert', 'drink', 'side']),
  coordinates: CoordinatesSchema.nullable(),
  is_fusion: z.boolean(),
  // Optional + nullable so rows predating the influences migration still parse.
  influences: z.array(z.string()).nullable().optional(),
  is_sunnah: z.boolean().nullable().optional(),
  featured_ingredients: z.array(z.string()).nullable().optional(),
  inspired_by: z.array(z.string()).nullable(),
  quote: z.string(),
  nutrition: NutritionSchema,
  flavor_profile: FlavorProfileSchema,
  headnote_ingredients: z.string().nullable(),
  headnote_instructions: z.string().nullable(),
  tips: z.array(z.string()).nullable(),
  substitutions: z.array(z.string()).nullable(),
  variations: z.array(z.string()).nullable(),
  storage: z.string().nullable(),
  dropcap: z.boolean(),
  created_at: z.string(),
});

/**
 * Slim projection used by `useRecipeIndex`. Mirrors the columns the
 * Supabase `select` actually pulls down — keeps payloads small for
 * consumers that don't need ingredient/step blobs.
 */
export const DbRecipeIndexSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  country: z.string().nullable(),
  region: CulinaryRegionSchema.nullable(),
  tags: z.array(z.string()),
  image_url: z.string().nullable(),
  time_active: z.number(),
  time_total: z.number(),
  time_resting: z.number().nullable(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.enum(['main', 'dessert', 'drink', 'side']),
  coordinates: CoordinatesSchema.nullable(),
  is_fusion: z.boolean(),
  influences: z.array(z.string()).nullable().optional(),
  quote: z.string(),
  nutrition: NutritionSchema,
  flavor_profile: FlavorProfileSchema,
});

export type DbRecipeIndex = z.infer<typeof DbRecipeIndexSchema>;

/** Slim Recipe shape returned by `useRecipeIndex` (no ingredients/steps). */
export interface RecipeIndexEntry {
  id: string;
  name: string;
  country: string | null;
  region: CulinaryRegion | null;
  coordinates: { lat: number; lng: number } | null;
  /** Every country that shaped the dish (world-atlas names). Empty for origin-less recipes. */
  influences: string[];
  category: 'main' | 'dessert' | 'drink' | 'side';
  tags: string[];
  isFusion: boolean;
  quote: string;
  image: string;
  time: RecipeTime;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nutrition: Nutrition;
  flavorProfile: FlavorProfile;
}

export function dbIndexToEntry(db: DbRecipeIndex): RecipeIndexEntry {
  const active = db.time_active ?? 0;
  const total = db.time_total ?? active;
  const resting = db.time_resting ?? undefined;
  return {
    id: db.slug,
    name: db.title,
    country: db.country,
    region: db.region,
    coordinates: db.coordinates,
    influences: db.influences ?? (db.country ? [db.country] : []),
    category: db.category,
    tags: db.tags,
    isFusion: db.is_fusion,
    quote: db.quote,
    image: db.image_url ?? '',
    time: { active, total, resting },
    difficulty: db.difficulty,
    nutrition: db.nutrition,
    flavorProfile: db.flavor_profile,
  };
}

export function dbToRecipe(db: DbRecipe): Recipe {
  // Defensive defaults: rows still mid-migration may arrive with null time
  // columns. The Recipe shape requires numeric active/total so downstream
  // filtering doesn't throw.
  const active = db.time_active ?? 0;
  const total = db.time_total ?? active;
  const resting = db.time_resting ?? undefined;

  return {
    id: db.slug,
    name: db.title,
    country: db.country,
    region: db.region,
    coordinates: db.coordinates,
    influences: db.influences ?? (db.country ? [db.country] : []),
    isSunnah: db.is_sunnah ?? false,
    featuredIngredients: db.featured_ingredients ?? [],
    createdAt: db.created_at,
    category: db.category,
    tags: db.tags,
    isFusion: db.is_fusion,
    inspiredBy: db.inspired_by ?? undefined,
    quote: db.quote,
    description: db.description ?? undefined,
    attribution: db.attribution ?? undefined,
    // `image_url` is nullable at the DB level (schema.sql:12) but
    // `Recipe.image` stays a non-null string so downstream <Image> calls
    // don't crash. Coalesce to '' here; consumers that care about the
    // missing-image case can check `recipe.image === ''`.
    image: db.image_url ?? '',
    images: db.images && db.images.length > 0 ? db.images : undefined,
    time: { active, total, resting },
    yieldText: db.yield ?? undefined,
    servings: db.servings,
    difficulty: db.difficulty,
    equipment: db.equipment ?? undefined,
    isVegetarian: db.is_vegetarian,
    isVegan: db.is_vegan,
    isGlutenFree: db.is_gluten_free,
    isDairyFree: db.is_dairy_free,
    ingredients: db.ingredients,
    instructions: db.steps,
    headnoteIngredients: db.headnote_ingredients ?? undefined,
    headnoteInstructions: db.headnote_instructions ?? undefined,
    nutrition: db.nutrition,
    flavorProfile: db.flavor_profile,
    tips: db.tips ?? undefined,
    substitutions: db.substitutions ?? undefined,
    variations: db.variations ?? undefined,
    storage: db.storage ?? undefined,
    dropcap: db.dropcap,
  };
}
