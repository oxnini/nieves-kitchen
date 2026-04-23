# Recipe Page Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the recipe detail page with interactive cooking features, new content sections, a stamp-themed "I Cooked This" button, and a flat cookbook-spread layout.

**Architecture:** Flat page layout replaces the current sticky sidebar. Recipe info (stats, nutrition, tags, flavor compass) becomes its own section above a two-column ingredients-beside-instructions spread. New hooks manage sessionStorage (cook progress checkboxes) and localStorage (unit preference). Two new DB columns (`substitutions`, `storage`) extend the recipe model.

**Tech Stack:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4, Framer Motion, Supabase, Recharts (FlavorCompass)

---

### Task 1: Database Migration — Add `substitutions` and `storage` columns

**Files:**
- Modify: `scripts/schema.sql`
- Run: Supabase migration

- [ ] **Step 1: Update schema.sql**

Add the two new columns to the `recipes` table definition in `scripts/schema.sql`. Insert them after the `tips` line (line 23):

```sql
  substitutions  text[],
  storage        text,
```

So lines 22-25 become:

```sql
  tips           text[],
  substitutions  text[],
  storage        text,
  created_at     timestamptz not null default now()
```

- [ ] **Step 2: Run the migration against Supabase**

Run the ALTER TABLE to add the columns to the live database:

```bash
npx supabase migration new add_substitutions_and_storage
```

Then write the migration file content:

```sql
ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS substitutions text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS storage text DEFAULT NULL;
```

Apply it:

```bash
npx supabase db push
```

If `supabase` CLI is not set up locally, run the ALTER TABLE directly via the Supabase dashboard SQL editor instead.

- [ ] **Step 3: Commit**

```bash
git add scripts/schema.sql supabase/migrations/
git commit -m "feat(db): add substitutions and storage columns to recipes"
```

---

### Task 2: Update Types — `Ingredient`, `Recipe`, `DbRecipe`, `dbToRecipe`

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Add metric fields to `Ingredient`**

In `lib/types.ts`, update the `Ingredient` interface (lines 1-5):

```typescript
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  metricAmount?: number;
  metricUnit?: string;
}
```

- [ ] **Step 2: Add `substitutions` and `storage` to `Recipe`**

Add after the `tips` field (line 43):

```typescript
  tips?: string[];
  substitutions?: string[];
  storage?: string;
```

- [ ] **Step 3: Add `substitutions` and `storage` to `DbRecipe`**

Add after the `tips` field (line 127):

```typescript
  tips: string[] | null;
  substitutions: string[] | null;
  storage: string | null;
```

- [ ] **Step 4: Update `dbToRecipe` mapping**

Add after the `tips` mapping (line 152):

```typescript
    tips: db.tips ?? undefined,
    substitutions: db.substitutions ?? undefined,
    storage: db.storage ?? undefined,
```

- [ ] **Step 5: Verify the build compiles**

```bash
cd /Users/nievesyang/Documents/GitHub/nieves-kitchen && npx tsc --noEmit
```

Expected: no errors (new fields are all optional, so existing code won't break).

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add metricAmount/metricUnit to Ingredient, substitutions and storage to Recipe"
```

---

### Task 3: Create `useCookProgress` Hook (sessionStorage)

**Files:**
- Create: `hooks/useCookProgress.ts`

- [ ] **Step 1: Write the hook**

Create `hooks/useCookProgress.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

interface CookProgress {
  ingredients: number[];
  steps: number[];
}

const EMPTY: CookProgress = { ingredients: [], steps: [] };

function storageKey(slug: string) {
  return `nieves-cook-progress-${slug}`;
}

export function useCookProgress(slug: string) {
  const [progress, setProgress] = useState<CookProgress>(EMPTY);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(slug));
      if (raw) setProgress(JSON.parse(raw) as CookProgress);
    } catch {
      // ignore parse errors
    }
  }, [slug]);

  const toggle = useCallback(
    (type: 'ingredients' | 'steps', index: number) => {
      setProgress((prev) => {
        const list = prev[type];
        const next = list.includes(index)
          ? list.filter((i) => i !== index)
          : [...list, index];
        const updated = { ...prev, [type]: next };
        sessionStorage.setItem(storageKey(slug), JSON.stringify(updated));
        return updated;
      });
    },
    [slug],
  );

  const isChecked = useCallback(
    (type: 'ingredients' | 'steps', index: number) =>
      progress[type].includes(index),
    [progress],
  );

  return { progress, toggle, isChecked };
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useCookProgress.ts
git commit -m "feat: add useCookProgress hook (sessionStorage checkboxes)"
```

---

### Task 4: Create `useUnitPref` Hook (localStorage)

**Files:**
- Create: `hooks/useUnitPref.ts`

- [ ] **Step 1: Write the hook**

Create `hooks/useUnitPref.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

export type UnitSystem = 'us' | 'metric';

const STORAGE_KEY = 'nieves-unit-pref';

export function useUnitPref() {
  const [unit, setUnit] = useState<UnitSystem>('us');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'us' || stored === 'metric') setUnit(stored);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setUnit((prev) => {
      const next: UnitSystem = prev === 'us' ? 'metric' : 'us';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { unit, toggle };
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useUnitPref.ts
git commit -m "feat: add useUnitPref hook (localStorage metric/imperial toggle)"
```

---

### Task 5: Reduce FlavorCompass Size

**Files:**
- Modify: `components/FlavorCompass.tsx`

- [ ] **Step 1: Reduce the chart height**

In `components/FlavorCompass.tsx`, change the container height from `h-36` to `h-28` (line 19):

```typescript
  return (
    <div className="w-full h-28">
```

Also reduce the font size of the axis labels from `fontSize: 12` to `fontSize: 11` (line 26):

```typescript
            tick={{ fill: 'var(--color-brown-medium)', fontSize: 11, fontFamily: 'var(--font-figtree), system-ui, sans-serif' }}
```

- [ ] **Step 2: Verify visually**

Open `http://localhost:3004/recipes/<any-slug>` and confirm the radar chart is smaller but still readable — all six flavor labels (Sweet, Salty, Umami, Spicy, Sour, Bitter) should be fully visible.

- [ ] **Step 3: Commit**

```bash
git add components/FlavorCompass.tsx
git commit -m "style: reduce FlavorCompass height for compact layout"
```

---

### Task 6: Redesign CookedButton — Stamp Theme + Animation

**Files:**
- Modify: `components/CookedButton.tsx`

- [ ] **Step 1: Restyle the button with stamp aesthetic and press animation**

Replace the button element (the `<button onClick={handleClick}...>` block, lines 58-71) in `components/CookedButton.tsx` with:

```tsx
      <div className="flex flex-col items-center gap-2">
        <motion.button
          onClick={handleClick}
          disabled={logCook.isPending}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="w-full max-w-md flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg border-2 border-dashed border-brown-medium/40 bg-turmeric/15 font-stamp text-sm tracking-wider text-brown-dark hover:bg-turmeric/25 hover:border-brown-medium/60 transition-colors shadow-sm disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:ring-offset-2 focus-visible:ring-offset-parchment focus-visible:outline-none"
        >
          {logCook.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : showCheck ? (
            <Check size={18} />
          ) : (
            <ChefHat size={18} />
          )}
          {logCook.isPending ? 'LOGGING\u2026' : showCheck ? 'STAMPED!' : 'I COOKED THIS'}
        </motion.button>
        <span className="text-xs text-brown-medium/70">
          Add this to your culinary passport
        </span>
      </div>
```

Note: The text is uppercase because `font-stamp` class already applies `text-transform: uppercase`, but the source strings should also be uppercase for clarity. "Logged!" changes to "STAMPED!" to match passport language.

- [ ] **Step 2: Remove `flex-1` from the old button**

The old button had `flex-1` because it was in a horizontal row in the sidebar. The new button is standalone — ensure no parent in RecipeDetail still wraps it in a flex row (this will be handled in Task 7 when the layout is restructured).

- [ ] **Step 3: Verify visually**

Open a recipe page and check:
- Button has dashed border and warm background
- Text uses the Cutive stamp font
- Clicking causes a brief scale-down spring animation
- "STAMPED!" appears briefly after click
- Confetti and toast still fire correctly
- "Add this to your culinary passport" subtitle appears below

- [ ] **Step 4: Commit**

```bash
git add components/CookedButton.tsx
git commit -m "feat: stamp-themed CookedButton with press animation and passport subtitle"
```

---

### Task 7: Restructure RecipeDetail Layout

This is the largest task. It restructures the entire page from a two-column sidebar layout to the flat section-based layout described in the spec. Read the full current file before making changes.

**Files:**
- Modify: `components/RecipeDetail.tsx`

- [ ] **Step 1: Add new imports**

Add the new hooks and icons at the top of `components/RecipeDetail.tsx`. Update the imports:

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Timer, Gauge, Users, Minus, Plus,
  Copy, Check, Heart, Lightbulb, RefreshCw, Archive,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookProgress } from '@/hooks/useCookProgress';
import { useUnitPref } from '@/hooks/useUnitPref';
import CookedButton from './CookedButton';

const FlavorCompass = dynamic(() => import('./FlavorCompass'), {
  ssr: false,
  loading: () => <div className="w-full h-28 bg-parchment rounded-lg animate-pulse" />,
});
```

- [ ] **Step 2: Add hooks and helper functions inside the component**

Inside the `RecipeDetail` component function, after the existing state declarations, add:

```typescript
  const { isChecked, toggle } = useCookProgress(recipe.id);
  const { unit, toggle: toggleUnit } = useUnitPref();

  const totalTime = recipe.prepTime + recipe.cookTime;

  function displayAmount(ing: { amount: number; unit: string; metricAmount?: number; metricUnit?: string }): string {
    if (unit === 'metric' && ing.metricAmount != null && ing.metricUnit) {
      const scaled = ing.metricAmount * scale;
      return `${scaled === Math.floor(scaled) ? String(scaled) : scaled.toFixed(1)} ${ing.metricUnit}`;
    }
    return `${formatAmount(ing.amount)} ${ing.unit}`;
  }
```

- [ ] **Step 3: Rewrite the JSX — Header Bar**

The header bar simplifies to just the back link. The Copy Recipe and Favorite buttons move into the hero overlay.

```tsx
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/recipes"
            className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium rounded focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            <ArrowLeft size={18} />
            All Recipes
          </Link>
        </div>
```

- [ ] **Step 4: Rewrite the JSX — Hero Image with action buttons**

Add Copy Recipe and Favorite buttons to the bottom-right of the hero overlay:

```tsx
          {/* ── Hero image ── */}
          <div className="relative h-[320px] rounded-2xl overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
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
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={copyFullRecipe}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors text-sm font-medium text-white/90 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                >
                  {copiedRecipe ? <Check size={16} /> : <Copy size={16} />}
                  {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
                </button>
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    size={20}
                    className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-white/90'}
                  />
                </button>
              </div>
            </div>
          </div>
```

- [ ] **Step 5: Rewrite the JSX — Quote (unchanged)**

```tsx
          {/* ── Quote caption ── */}
          <p className="font-heading italic text-brown-medium text-sm leading-relaxed mt-3 mb-8 max-w-prose">
            {recipe.quote}
          </p>
```

- [ ] **Step 6: Rewrite the JSX — Recipe Info Section**

Replace the old two-column layout with a flat recipe info block:

```tsx
          {/* ── Recipe Info ── */}
          <div className="bg-surface rounded-2xl p-5 mb-10 border border-brown-light/10">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-2 text-sm text-brown-medium mb-5">
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Clock size={14} /> {recipe.prepTime}m prep
              </span>
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Timer size={14} /> {recipe.cookTime}m cook
              </span>
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Clock size={14} /> {totalTime}m total
              </span>
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Gauge size={14} /> {recipe.difficulty}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Nutrition */}
              <div className="flex-1">
                <h2 className="font-heading text-sm font-semibold text-brown-dark mb-2 uppercase tracking-wide">
                  Nutrition
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {nutritionItems.map(n => (
                    <div key={n.label} className="bg-parchment rounded-lg px-3 py-2 text-center">
                      <div className="text-xs uppercase tracking-[0.1em] text-brown-medium mb-0.5">
                        {n.label}
                      </div>
                      <div
                        className="font-heading text-xl text-brown-dark"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {n.value}
                        <span className="text-xs text-brown-medium ml-0.5">{n.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flavor Compass */}
              <div className="w-full md:w-48 shrink-0">
                <FlavorCompass profile={recipe.flavorProfile} />
              </div>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
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
          </div>
```

- [ ] **Step 7: Rewrite the JSX — Two-Column Ingredients + Instructions**

```tsx
          {/* ── Cookbook Spread: Ingredients + Instructions ── */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">
            {/* Left: Ingredients */}
            <section className="w-full md:w-[340px] md:shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-xl font-semibold text-brown-dark">
                  Ingredients
                </h2>
                <div className="flex items-center gap-3">
                  {/* Unit toggle */}
                  <button
                    onClick={toggleUnit}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-brown-light/20 text-brown-medium hover:bg-parchment-dark transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  >
                    {unit === 'us' ? 'US' : 'Metric'}
                  </button>
                  {/* Servings adjuster */}
                  <div className="flex items-center gap-1.5">
                    <Users size={15} className="text-brown-medium" />
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      aria-label="Decrease servings"
                      className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-brown-dark w-6 text-center tabular-nums">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      aria-label="Increase servings"
                      className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-brown-light/10">
                {recipe.ingredients.map((ing, i) => (
                  <label
                    key={ing.name}
                    className={`flex items-center justify-between text-sm py-2 border-b border-brown-light/10 last:border-0 cursor-pointer transition-opacity ${
                      isChecked('ingredients', i) ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked('ingredients', i)}
                        onChange={() => toggle('ingredients', i)}
                        className="accent-terracotta w-4 h-4 rounded"
                      />
                      <span className={isChecked('ingredients', i) ? 'line-through' : ''}>
                        {ing.name}
                      </span>
                    </span>
                    <span className={`text-brown-medium font-medium tabular-nums ml-4 shrink-0 ${
                      isChecked('ingredients', i) ? 'line-through' : ''
                    }`}>
                      {displayAmount(ing)}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={copyIngredients}
                className="mt-2 flex items-center gap-1.5 text-sm text-teal hover:text-teal/70 transition-colors rounded focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              >
                {copiedIngredients ? <Check size={14} /> : <Copy size={14} />}
                {copiedIngredients ? 'Copied!' : 'Copy ingredients'}
              </button>
            </section>

            {/* Right: Instructions */}
            <section className="flex-1 min-w-0">
              <h2 className="font-heading text-xl font-semibold text-brown-dark mb-6">
                Instructions
              </h2>
              <ol className="space-y-5 list-none pl-0">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className={`flex gap-3 transition-opacity ${
                    isChecked('steps', i) ? 'opacity-50' : ''
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked('steps', i)}
                        onChange={() => toggle('steps', i)}
                        className="accent-terracotta w-4 h-4 rounded mt-1.5 shrink-0"
                      />
                      <span aria-hidden="true" className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className={`text-sm text-brown-dark leading-relaxed max-w-prose ${
                        isChecked('steps', i) ? 'line-through' : ''
                      }`}>
                        {step}
                      </p>
                    </label>
                  </li>
                ))}
              </ol>
            </section>
          </div>
```

- [ ] **Step 8: Rewrite the JSX — Supplementary Sections**

```tsx
          {/* ── Supplementary Sections ── */}
          {(recipe.substitutions?.length || recipe.storage || hasTips) && (
            <div className="space-y-6 mb-10">
              {/* Substitutions + Storage grid */}
              {(recipe.substitutions?.length || recipe.storage) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                    <section className="bg-surface rounded-2xl p-5">
                      <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                        <RefreshCw size={18} className="text-sage" />
                        Substitutions
                      </h2>
                      <div>
                        {recipe.substitutions.map((sub, i) => (
                          <p
                            key={i}
                            className="text-sm text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
                          >
                            {sub}
                          </p>
                        ))}
                      </div>
                    </section>
                  )}

                  {recipe.storage && (
                    <section className="bg-surface rounded-2xl p-5">
                      <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                        <Archive size={18} className="text-teal" />
                        Storage & Reheating
                      </h2>
                      <p className="text-sm text-brown-dark leading-relaxed">
                        {recipe.storage}
                      </p>
                    </section>
                  )}
                </div>
              )}

              {/* Tips */}
              {hasTips && (
                <section className="bg-surface rounded-2xl p-5">
                  <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-turmeric" />
                    Tips
                  </h2>
                  <div>
                    {recipe.tips?.map((tip, i) => (
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
            </div>
          )}
```

- [ ] **Step 9: Rewrite the JSX — I Cooked This placement**

Place the CookedButton at the end, after supplementary sections:

```tsx
          {/* ── I Cooked This ── */}
          <div className="flex justify-center py-6">
            <CookedButton recipe={recipe} />
          </div>
```

- [ ] **Step 10: Remove old sidebar and layout code**

Make sure the entire old `<aside>` sidebar element and the old two-column `flex` wrapper are removed. The new JSX from steps 3-9 replaces everything inside the `<motion.div>` block. The full structure inside `<motion.div>` should be:

1. Hero image (step 4)
2. Quote (step 5)
3. Recipe Info section (step 6)
4. Two-column ingredients + instructions (step 7)
5. Supplementary sections (step 8)
6. CookedButton (step 9)

- [ ] **Step 11: Verify visually**

Open `http://localhost:3004/recipes/<any-slug>` and verify:
- Header only has "← All Recipes"
- Copy Recipe and Favorite buttons are in the hero overlay
- Recipe info (stats, nutrition, tags, flavor compass) appears as a flat section
- Ingredients (left) sit beside Instructions (right) on desktop
- Checking ingredients/steps dims and strikes through them
- Unit toggle appears and switches values for ingredients with metric data
- Supplementary sections render when data exists
- CookedButton is at the bottom with stamp styling
- Mobile (resize to <768px): all sections stack vertically

- [ ] **Step 12: Commit**

```bash
git add components/RecipeDetail.tsx
git commit -m "feat: restructure recipe page — flat layout, checkboxes, unit toggle, supplementary sections"
```

---

### Task 8: Update `copyIngredients` to Respect Unit Preference

**Files:**
- Modify: `components/RecipeDetail.tsx`

- [ ] **Step 1: Update the `copyIngredients` function**

The `copyIngredients` function currently uses `formatAmount` which always shows US units. Update it to use `displayAmount` so it copies whatever the user is currently viewing:

```typescript
  function copyIngredients() {
    const text = recipe.ingredients
      .map(i => `${displayAmount(i)} ${i.name}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIngredients(true);
    setTimeout(() => setCopiedIngredients(false), 2000);
  }
```

Note the order change: `displayAmount(i)` now returns the full "amount unit" string, so the format becomes `amount unit name` (e.g., "200 g flour").

- [ ] **Step 2: Also update `copyFullRecipe` to respect units**

```typescript
  function copyFullRecipe() {
    const parts = [
      recipe.name,
      `\nServings: ${servings}`,
      `Prep: ${recipe.prepTime}m | Cook: ${recipe.cookTime}m | Total: ${totalTime}m`,
      '\n--- Ingredients ---',
      ...recipe.ingredients.map(i => `- ${displayAmount(i)} ${i.name}`),
      '\n--- Instructions ---',
      ...recipe.instructions.map((s, i) => `${i + 1}. ${s}`),
    ];
    navigator.clipboard.writeText(parts.join('\n'));
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  }
```

- [ ] **Step 3: Commit**

```bash
git add components/RecipeDetail.tsx
git commit -m "fix: copy functions respect current unit preference"
```

---

### Task 9: Update FlavorCompass Loading Skeleton

**Files:**
- Modify: `components/RecipeDetail.tsx`

- [ ] **Step 1: Update the loading skeleton height**

The dynamic import loading skeleton for FlavorCompass should match the new reduced height. This was already updated in the imports in Task 7 Step 1 (changed from `h-36` to `h-28`). Verify the loading skeleton in the dynamic import matches:

```typescript
const FlavorCompass = dynamic(() => import('./FlavorCompass'), {
  ssr: false,
  loading: () => <div className="w-full h-28 bg-parchment rounded-lg animate-pulse" />,
});
```

If this was already set correctly in Task 7, this task is a no-op. Verify and commit if needed.

- [ ] **Step 2: Commit (if changes were needed)**

```bash
git add components/RecipeDetail.tsx
git commit -m "fix: match FlavorCompass loading skeleton to reduced height"
```

---

### Task 10: Final Visual QA and Cleanup

**Files:**
- All modified files

- [ ] **Step 1: Run the build to catch any errors**

```bash
cd /Users/nievesyang/Documents/GitHub/nieves-kitchen && npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 2: Visual QA checklist**

Open `http://localhost:3004` and navigate to a recipe page. Check each item:

- [ ] Header: only "← All Recipes" link, no buttons
- [ ] Hero: Copy Recipe + Favorite buttons visible in bottom-right overlay
- [ ] Hero: Buttons are legible against the image (semi-transparent bg)
- [ ] Quote: renders correctly below hero
- [ ] Recipe Info: quick stats with total time, nutrition grid, tags, compact flavor compass
- [ ] Ingredients: checkboxes work, checked items dim + strikethrough
- [ ] Ingredients: unit toggle switches between US and Metric (for ingredients that have metric data)
- [ ] Ingredients: servings adjuster scales amounts correctly
- [ ] Instructions: checkboxes work, checked steps dim + strikethrough
- [ ] Instructions: numbered circles still visible and aligned
- [ ] Supplementary: Tips section renders (if recipe has tips)
- [ ] Supplementary: Substitutions and Storage don't render (until data is populated)
- [ ] CookedButton: stamp-themed, dashed border, Cutive font
- [ ] CookedButton: press animation works (spring scale)
- [ ] CookedButton: "STAMPED!" text after click, confetti fires
- [ ] CookedButton: "Add this to your culinary passport" subtitle visible
- [ ] Mobile (<768px): all sections stack vertically, no horizontal overflow
- [ ] Sepia theme: toggle theme and verify all new sections look correct

- [ ] **Step 3: Fix any issues found during QA**

Address any visual bugs, spacing issues, or broken interactions discovered in step 2.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final QA fixes for recipe page improvements"
```
