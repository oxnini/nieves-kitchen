# Recipe Detail Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the recipe detail page from a flat single-column layout into an editorial two-column magazine spread with sticky sidebar, fixed quote formatting, visual section differentiation, and a new tips section.

**Architecture:** The page stays as a Server Component at `app/recipes/[slug]/page.tsx` that fetches data and renders a Client Component `RecipeDetail.tsx`. The RecipeDetail component gets a full rewrite for the two-column layout. A new `tips` column is added to the Supabase `recipes` table, with corresponding type updates. No new components are extracted — FlavorCompass and CookedButton are reused as-is.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Supabase (Postgres), Framer Motion, Recharts, Lucide icons.

**No test suite is configured** — verification is manual via `npm run dev` and `npm run build`.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `scripts/schema.sql` | Modify | Add `tips text[]` column to recipes table |
| `lib/types.ts` | Modify | Add `tips` to `Recipe` and `DbRecipe` interfaces, update `dbToRecipe` |
| `components/RecipeDetail.tsx` | Rewrite | Two-column layout, quote fix, tips section, visual differentiation |

---

### Task 1: Add `tips` Column to DB Schema

**Files:**
- Modify: `scripts/schema.sql:1-23`

- [ ] **Step 1: Add the tips column to the schema file**

In `scripts/schema.sql`, add the `tips` column after the `flavor_profile` line (line 22):

```sql
  tips           text[],
```

The full column list should end with:

```sql
  flavor_profile jsonb not null,
  tips           text[],
  created_at     timestamptz not null default now()
```

- [ ] **Step 2: Run the ALTER TABLE on Supabase**

If you have access to the Supabase dashboard or CLI, run:

```sql
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS tips text[];
```

If not, note this as a manual step for the user.

- [ ] **Step 3: Commit**

```bash
git add scripts/schema.sql
git commit -m "feat(db): add tips column to recipes table"
```

---

### Task 2: Update TypeScript Types

**Files:**
- Modify: `lib/types.ts:1-151`

- [ ] **Step 1: Add `tips` to the `Recipe` interface**

In `lib/types.ts`, add `tips` after the `flavorProfile` field (after line 42):

```typescript
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
```

- [ ] **Step 2: Add `tips` to the `DbRecipe` interface**

In `lib/types.ts`, add `tips` after the `flavor_profile` field in `DbRecipe` (after line 126):

```typescript
  flavor_profile: FlavorProfile;
  tips: string[] | null;
  created_at: string;
```

- [ ] **Step 3: Update `dbToRecipe` mapping**

In `lib/types.ts`, add the tips mapping in `dbToRecipe` (after the `flavorProfile` line):

```typescript
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
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add tips field to Recipe and DbRecipe"
```

---

### Task 3: Rewrite RecipeDetail Component — Structure & Hero

This is the largest task. It rewrites `components/RecipeDetail.tsx` completely. We'll build it in stages within this task.

**Files:**
- Rewrite: `components/RecipeDetail.tsx`

- [ ] **Step 1: Write the full rewritten component**

Replace the entire contents of `components/RecipeDetail.tsx` with the following. This is the complete component — hero, quote, two-column layout, sidebar, instructions, flavor profile, tips, and action buttons:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Timer, Gauge, Users, Minus, Plus,
  Copy, Check, Heart, Lightbulb,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import FlavorCompass from './FlavorCompass';
import { useFavorites } from '@/hooks/useFavorites';
import CookedButton from './CookedButton';

/* Navbar is 72px; add 24px breathing room for the sticky sidebar. */
const STICKY_TOP = 96;

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const [copiedIngredients, setCopiedIngredients] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [favorites, toggleFavorite] = useFavorites();

  const isFavorited = favorites.has(recipe.id);
  const scale = servings / recipe.servings;

  function formatAmount(amount: number): string {
    const scaled = amount * scale;
    return scaled === Math.floor(scaled) ? String(scaled) : scaled.toFixed(1);
  }

  function copyIngredients() {
    const text = recipe.ingredients
      .map(i => `${formatAmount(i.amount)} ${i.unit} ${i.name}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIngredients(true);
    setTimeout(() => setCopiedIngredients(false), 2000);
  }

  function copyFullRecipe() {
    const parts = [
      recipe.name,
      `\nServings: ${servings}`,
      `Prep: ${recipe.prepTime}m | Cook: ${recipe.cookTime}m`,
      '\n--- Ingredients ---',
      ...recipe.ingredients.map(i => `- ${formatAmount(i.amount)} ${i.unit} ${i.name}`),
      '\n--- Instructions ---',
      ...recipe.instructions.map((s, i) => `${i + 1}. ${s}`),
    ];
    navigator.clipboard.writeText(parts.join('\n'));
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  }

  const nutritionItems = [
    { label: 'Calories', value: Math.round(recipe.nutrition.calories * scale), unit: 'kcal' },
    { label: 'Protein',  value: Math.round(recipe.nutrition.protein  * scale), unit: 'g'    },
    { label: 'Carbs',    value: Math.round(recipe.nutrition.carbs    * scale), unit: 'g'    },
    { label: 'Fat',      value: Math.round(recipe.nutrition.fat      * scale), unit: 'g'    },
  ];

  const hasTips = recipe.tips && recipe.tips.length > 0;

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/recipes"
            className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            All Recipes
          </Link>
          <button
            onClick={() => toggleFavorite(recipe.id)}
            className="p-2 rounded-full bg-surface hover:bg-parchment-dark transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-brown-dark'}
            />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Hero image ── */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                {recipe.isFusion && (
                  <span className="bg-turmeric text-brown-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    FUSION
                  </span>
                )}
                <span className="text-white/80 text-sm">{recipe.country}</span>
                {recipe.inspiredBy && (
                  <span className="text-white/60 text-sm">
                    &middot; Inspired by {recipe.inspiredBy.join(', ')}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                {recipe.name}
              </h1>
            </div>
          </div>

          {/* ── Quote / Epigraph ── */}
          <div className="py-8 flex flex-col items-center">
            <div className="w-12 h-px bg-terracotta/40 mb-5" />
            <blockquote className="font-heading italic text-brown-medium text-base leading-relaxed text-center max-w-prose px-4">
              {recipe.quote}
            </blockquote>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* ── Left: Sidebar ── */}
            <aside
              className="w-full md:w-[340px] md:shrink-0"
            >
              <div
                className="md:sticky bg-surface rounded-2xl p-5 space-y-6 border border-brown-light/10"
                style={{ top: STICKY_TOP }}
              >
                {/* Quick stats */}
                <div className="flex flex-wrap gap-2 text-sm text-brown-medium">
                  <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                    <Clock size={14} /> {recipe.prepTime}m prep
                  </span>
                  <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                    <Timer size={14} /> {recipe.cookTime}m cook
                  </span>
                  <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                    <Gauge size={14} /> {recipe.difficulty}
                  </span>
                </div>

                {/* Servings scaler */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-brown-dark flex items-center gap-1.5">
                    <Users size={15} className="text-brown-medium" />
                    Servings
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      aria-label="Decrease servings"
                      className="w-8 h-8 rounded-full bg-parchment hover:bg-parchment-dark flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-brown-dark w-6 text-center tabular-nums">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      aria-label="Increase servings"
                      className="w-8 h-8 rounded-full bg-parchment hover:bg-parchment-dark flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h2 className="font-heading text-lg font-semibold text-brown-dark mb-3">
                    Ingredients
                  </h2>
                  <div className="space-y-0">
                    {recipe.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm py-2 border-b border-brown-light/10 last:border-0"
                      >
                        <span className="text-brown-dark">{ing.name}</span>
                        <span className="text-brown-medium font-medium tabular-nums ml-4 shrink-0">
                          {formatAmount(ing.amount)} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={copyIngredients}
                    className="mt-3 flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-light transition-colors"
                  >
                    {copiedIngredients ? <Check size={14} /> : <Copy size={14} />}
                    {copiedIngredients ? 'Copied!' : 'Copy ingredients'}
                  </button>
                </div>

                {/* Tags */}
                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-parchment text-brown-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Nutrition — 2x2 grid */}
                <div>
                  <h2 className="font-heading text-sm font-semibold text-brown-dark mb-2 uppercase tracking-wide">
                    Nutrition
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {nutritionItems.map(n => (
                      <div key={n.label} className="bg-parchment rounded-lg px-3 py-2 text-center">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-brown-medium mb-0.5">
                          {n.label}
                        </div>
                        <div
                          className="font-heading text-lg text-brown-dark"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {n.value}
                          <span className="text-xs text-brown-medium ml-0.5">{n.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Right: Main content ── */}
            <main className="flex-1 min-w-0 space-y-10">
              {/* Instructions */}
              <section>
                <h2 className="font-heading text-xl font-semibold text-brown-dark mb-6">
                  Instructions
                </h2>
                <div className="space-y-5">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-brown-dark leading-relaxed max-w-prose">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Flavor Profile */}
              <section className="bg-surface-alt rounded-2xl p-5">
                <h2 className="font-heading text-lg font-semibold text-brown-dark mb-2">
                  Flavor Profile
                </h2>
                <FlavorCompass profile={recipe.flavorProfile} />
              </section>

              {/* Tips (only if data exists) */}
              {hasTips && (
                <section className="bg-surface rounded-2xl p-5">
                  <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-turmeric" />
                    Tips
                  </h2>
                  <div className="space-y-0">
                    {recipe.tips!.map((tip, i) => (
                      <p
                        key={i}
                        className="text-sm text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
                      >
                        {tip}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2 pb-8">
                <button
                  onClick={copyFullRecipe}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors shadow"
                >
                  {copiedRecipe ? <Check size={18} /> : <Copy size={18} />}
                  {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
                </button>
                <CookedButton recipe={recipe} />
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start the dev server and verify**

```bash
npm run dev
```

Open a recipe page in the browser (e.g., `http://localhost:3000/recipes/burrata-mediterranean-salad`). Verify:

1. Hero image is taller (~420px), rounded corners, title overlaid
2. Quote sits below the hero with a thin terracotta rule above it, no broken quotation marks
3. Two-column layout on desktop: sidebar (ingredients, stats, nutrition) on the left, instructions on the right
4. Sidebar is sticky — scrolling through instructions keeps ingredients visible
5. Flavor profile sits on a `surface-alt` background in the right column
6. Tips section does not render (no data yet — this is correct)
7. Action buttons at the bottom of the right column
8. On mobile (resize to <768px): single column, sidebar unsticks, content reorders naturally

- [ ] **Step 3: Run the production build to check for errors**

```bash
npm run build
```

Expected: no build errors.

- [ ] **Step 4: Commit**

```bash
git add components/RecipeDetail.tsx
git commit -m "feat(recipe): redesign detail page with two-column editorial layout

- Magazine-spread two-column layout with sticky ingredients sidebar
- Taller hero image (420px) with refined gradient overlay
- Fixed quote formatting: terracotta rule replaces broken decorative marks
- Visual section differentiation via background colors (surface, surface-alt)
- Tips section UI (renders when tips data exists)
- 2x2 nutrition grid in sidebar
- Responsive collapse to single-column on mobile"
```

---

### Task 4: Verify Sepia Theme Compatibility

**Files:**
- No file changes expected (unless fixes needed)

- [ ] **Step 1: Test in sepia theme**

Open the recipe page in the browser and toggle to sepia theme. Check that:

1. The sidebar `bg-surface` renders correctly in sepia
2. The `bg-surface-alt` flavor profile panel is visible and readable
3. The terracotta rule on the quote is visible
4. The hero gradient overlay still works (sepia has an override in globals.css for `.bg-gradient-to-t`)
5. Nutrition grid items on `bg-parchment` are distinguishable from the sidebar `bg-surface`
6. Sticky sidebar border is visible

If any colors need adjustment in sepia, fix them in `app/globals.css` and commit.

- [ ] **Step 2: Commit (if changes were made)**

```bash
git add app/globals.css
git commit -m "fix(recipe): adjust sepia theme colors for redesigned recipe page"
```

---

### Task 5: Add Tips Data to a Sample Recipe (Verification)

**Files:**
- No codebase changes — Supabase data only

- [ ] **Step 1: Insert sample tips into one recipe**

Via the Supabase dashboard SQL editor or CLI, update one recipe with tips to verify the UI:

```sql
UPDATE public.recipes
SET tips = ARRAY[
  'Use day-old rice for the best texture — freshly cooked rice is too moist.',
  'Toast the spices in dry pan for 30 seconds before adding oil to unlock deeper flavor.',
  'Let the dish rest for 5 minutes after cooking. The flavors meld as it cools slightly.'
]
WHERE slug = 'burrata-mediterranean-salad';
```

(Adjust the slug and tip text to match an actual recipe in your database.)

- [ ] **Step 2: Verify the tips section renders**

Reload the recipe page in the browser. Confirm:

1. The "Tips" section appears in the right column between flavor profile and action buttons
2. Each tip is on its own line, separated by thin rules
3. The lightbulb icon appears next to the heading in turmeric
4. The section sits on `bg-surface` with rounded corners
5. Other recipes without tips still don't show the section

---

## Summary

| Task | What it does | Files |
|------|-------------|-------|
| 1 | Add `tips` column to DB schema | `scripts/schema.sql` |
| 2 | Update TypeScript types | `lib/types.ts` |
| 3 | Full component rewrite | `components/RecipeDetail.tsx` |
| 4 | Sepia theme verification | `app/globals.css` (if needed) |
| 5 | Sample tips data for verification | Supabase only |
