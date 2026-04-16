# Next.js 15 + Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Nieves Kitchen from a static Vite SPA to a Next.js 15 App Router app backed by Supabase, with SEO-ready recipe pages at `/recipes/[slug]` and Vercel deployment.

**Architecture:** App Router with a mix of Server Components (recipe detail, about, layout metadata) and Client Components (WorldMap, FilterPanel, Navbar, and pages managing filter state). Supabase stores all recipe data; the static `src/data/recipes.ts` array is seeded into Supabase via a one-time script and then deleted. TanStack Query v5 handles client-side caching. Favorites stay in `localStorage` (unchanged from current).

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4 (`@tailwindcss/postcss`), Supabase (`@supabase/ssr`), TanStack Query v5, Framer Motion, react-simple-maps, Recharts, rc-slider, Lucide React.

---

## File Map

```
# New files
app/
  globals.css                    design tokens + Tailwind import
  layout.tsx                     root layout: fonts, Navbar, Providers
  page.tsx                       / — WorldMap + FilterPanel (Client)
  recipes/
    page.tsx                     /recipes — card grid + FilterPanel (Client)
    [slug]/
      page.tsx                   /recipes/[slug] — Server, generateMetadata
  favorites/
    page.tsx                     /favorites — localStorage grid (Client)
  about/
    page.tsx                     /about — static content (Server)

lib/
  types.ts                       Recipe/DbRecipe types + dbToRecipe mapper
  filters.ts                     ALL_TAGS, DEFAULT_FILTERS, applyFilters, countActiveFilters
  regions.ts                     COUNTRY_TO_REGION, REGION_CENTERS, REGION_LABEL_POSITIONS, choropleth constants
  supabase/
    server.ts                    async createClient() for Server Components
    client.ts                    createClient() for browser

components/
  Providers.tsx                  "use client" — QueryClientProvider wrapper
  Navbar.tsx                     "use client" — usePathname + Link nav
  RecipeCard.tsx                 "use client" — motion(Link) card
  FilterPanel.tsx                "use client" — slide-out filter drawer
  FlavorCompass.tsx              "use client" — Recharts radar
  WorldMap.tsx                   "use client" — react-simple-maps, useRouter for recipe nav
  RecipeDetail.tsx               "use client" — full-page recipe view (replaces modal)

hooks/
  useFavorites.ts                "use client" — localStorage favorites Set
  useRecipes.ts                  "use client" — TanStack Query fetch all recipes

scripts/
  schema.sql                     SQL to run in Supabase dashboard
  seed.ts                        one-time data seeder

next.config.ts
postcss.config.mjs
.env.local.example

# Modified files
package.json                     replace Vite with Next.js deps + scripts
tsconfig.json                    replace with Next.js-compatible config
CLAUDE.md                        update commands

# Deleted at end
src/                             entire Vite src directory
vite.config.ts
index.html
tsconfig.app.json
tsconfig.node.json
eslint.config.js
```

---

## Task 1: Convert project config to Next.js 15

**Files:**
- Modify: `package.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Modify: `tsconfig.json`
- Create: `.env.local.example`

- [ ] **Step 1: Update package.json**

Replace the entire file content:

```json
{
  "name": "nieves-kitchen",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.4",
    "@tanstack/react-query": "^5.75.2",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.8.0",
    "next": "^15.3.1",
    "rc-slider": "^11.1.9",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-simple-maps": "^3.0.0",
    "recharts": "^3.8.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.2",
    "@types/node": "^24.12.2",
    "@types/react": "^19.1.3",
    "@types/react-dom": "^19.1.3",
    "@types/react-simple-maps": "^3.0.6",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.2.2",
    "tsx": "^4.19.3",
    "typescript": "~6.0.2"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create postcss.config.mjs**

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 4: Update tsconfig.json**

Replace the entire file content:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create .env.local.example**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

Expected: clean install, no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json next.config.ts postcss.config.mjs tsconfig.json .env.local.example
git commit -m "chore: scaffold Next.js 15 config, replace Vite"
```

---

## Task 2: Create app/globals.css

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Create the file**

```css
@import "tailwindcss";
@source "../**/*.{ts,tsx}";

@theme {
  --color-parchment: #FDF6EC;
  --color-parchment-dark: #F5EBDA;
  --color-terracotta: #E2725B;
  --color-terracotta-light: #EE9A8A;
  --color-turmeric: #E9C46A;
  --color-paprika: #E63946;
  --color-sage: #8A9A5B;
  --color-teal: #2A9D8F;
  --color-brown-dark: #3E2723;
  --color-brown-medium: #5D4037;
  --color-brown-light: #8D6E63;

  --font-heading: var(--font-playfair);
  --font-body: var(--font-inter);
}

body {
  font-family: var(--font-body);
  background-color: var(--color-parchment);
  color: var(--color-brown-dark);
  margin: 0;
}

h1, h2, h3, h4, h5 {
  font-family: var(--font-heading);
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-parchment-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--color-brown-light);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-brown-medium);
}

.rsm-geography {
  outline: none;
  transition: fill 0.2s ease;
}
.rsm-geography:focus {
  outline: none;
}

.map-bg {
  background-color: #EDE8E0;
  background-image: radial-gradient(circle, #D4CFC6 0.8px, transparent 0.8px);
  background-size: 16px 16px;
}

.rc-slider-track {
  background-color: var(--color-terracotta) !important;
}
.rc-slider-handle {
  border-color: var(--color-terracotta) !important;
  opacity: 1 !important;
}
.rc-slider-handle:hover,
.rc-slider-handle:focus,
.rc-slider-handle-dragging {
  border-color: var(--color-terracotta) !important;
  box-shadow: 0 0 0 3px rgba(226, 114, 91, 0.25) !important;
}
.rc-slider-dot-active {
  border-color: var(--color-terracotta) !important;
}
```

The `--font-heading` and `--font-body` reference `--font-playfair` and `--font-inter`, which are CSS variables injected by `next/font/google` in Task 7 (root layout).

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "chore: add app/globals.css with design tokens"
```

---

## Task 3: Create lib/ layer (types, filters, regions, Supabase clients)

**Files:**
- Create: `lib/types.ts`
- Create: `lib/filters.ts`
- Create: `lib/regions.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`

- [ ] **Step 1: Create lib/types.ts**

```typescript
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
}

export type CulinaryRegion =
  | 'Western Europe'
  | 'Eastern Europe'
  | 'East Asia'
  | 'Southeast Asia'
  | 'South Asia'
  | 'Japan & Korea'
  | 'Middle East'
  | 'North Africa'
  | 'Sub-Saharan Africa'
  | 'Caribbean & Americas';

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
  };
}
```

- [ ] **Step 2: Create lib/filters.ts**

```typescript
import type { Filters, Recipe } from './types';

export const ALL_TAGS = [
  'high-protein', 'meal-prep friendly', 'budget-friendly', 'keto-friendly',
  'one-pot', 'vegetarian', 'low-carb', 'single-serving', 'fusion',
  'spicy', 'quick', 'weekend feast', 'comfort food',
] as const;

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
    if (filters.maxTime !== null && r.prepTime + r.cookTime > filters.maxTime) return false;
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
```

- [ ] **Step 3: Create lib/regions.ts**

```typescript
import type { CulinaryRegion } from './types';

export const CHOROPLETH_BASE = { r: 160, g: 90, b: 60 };
export const CHOROPLETH_LIGHT = '#E3D4C4';
export const CHOROPLETH_EMPTY = '#ECE5DB';

export const COUNTRY_TO_REGION: Record<string, CulinaryRegion> = {
  // Western Europe
  '724': 'Western Europe', '380': 'Western Europe', '250': 'Western Europe',
  '276': 'Western Europe', '826': 'Western Europe', '620': 'Western Europe',
  '528': 'Western Europe', '056': 'Western Europe', '756': 'Western Europe',
  '040': 'Western Europe', '372': 'Western Europe', '442': 'Western Europe',
  '208': 'Western Europe', '578': 'Western Europe', '752': 'Western Europe',
  '246': 'Western Europe', '352': 'Western Europe',

  // Eastern Europe
  '300': 'Eastern Europe', '616': 'Eastern Europe', '203': 'Eastern Europe',
  '348': 'Eastern Europe', '642': 'Eastern Europe', '100': 'Eastern Europe',
  '688': 'Eastern Europe', '191': 'Eastern Europe', '705': 'Eastern Europe',
  '703': 'Eastern Europe', '804': 'Eastern Europe', '112': 'Eastern Europe',
  '498': 'Eastern Europe', '070': 'Eastern Europe', '499': 'Eastern Europe',
  '008': 'Eastern Europe', '807': 'Eastern Europe', '643': 'Eastern Europe',
  '440': 'Eastern Europe', '428': 'Eastern Europe', '233': 'Eastern Europe',
  '268': 'Eastern Europe', '051': 'Eastern Europe', '031': 'Eastern Europe',

  // East Asia
  '156': 'East Asia', '158': 'East Asia', '496': 'East Asia',

  // Japan & Korea
  '392': 'Japan & Korea', '410': 'Japan & Korea', '408': 'Japan & Korea',

  // Southeast Asia
  '764': 'Southeast Asia', '704': 'Southeast Asia', '458': 'Southeast Asia',
  '360': 'Southeast Asia', '608': 'Southeast Asia', '104': 'Southeast Asia',
  '116': 'Southeast Asia', '418': 'Southeast Asia', '096': 'Southeast Asia',

  // South Asia
  '356': 'South Asia', '586': 'South Asia', '050': 'South Asia',
  '144': 'South Asia', '524': 'South Asia', '064': 'South Asia', '004': 'South Asia',

  // Middle East
  '792': 'Middle East', '422': 'Middle East', '760': 'Middle East',
  '400': 'Middle East', '368': 'Middle East', '364': 'Middle East',
  '682': 'Middle East', '784': 'Middle East', '634': 'Middle East',
  '414': 'Middle East', '512': 'Middle East', '887': 'Middle East',
  '376': 'Middle East', '275': 'Middle East', '196': 'Middle East',

  // North Africa
  '504': 'North Africa', '012': 'North Africa', '788': 'North Africa',
  '434': 'North Africa', '818': 'North Africa', '729': 'North Africa', '478': 'North Africa',

  // Sub-Saharan Africa
  '566': 'Sub-Saharan Africa', '404': 'Sub-Saharan Africa', '231': 'Sub-Saharan Africa',
  '288': 'Sub-Saharan Africa', '710': 'Sub-Saharan Africa', '834': 'Sub-Saharan Africa',
  '800': 'Sub-Saharan Africa', '120': 'Sub-Saharan Africa', '686': 'Sub-Saharan Africa',
  '384': 'Sub-Saharan Africa', '508': 'Sub-Saharan Africa', '450': 'Sub-Saharan Africa',
  '024': 'Sub-Saharan Africa', '894': 'Sub-Saharan Africa', '716': 'Sub-Saharan Africa',
  '454': 'Sub-Saharan Africa', '466': 'Sub-Saharan Africa', '854': 'Sub-Saharan Africa',
  '562': 'Sub-Saharan Africa', '148': 'Sub-Saharan Africa', '180': 'Sub-Saharan Africa',
  '178': 'Sub-Saharan Africa', '266': 'Sub-Saharan Africa', '226': 'Sub-Saharan Africa',
  '694': 'Sub-Saharan Africa', '430': 'Sub-Saharan Africa', '324': 'Sub-Saharan Africa',
  '768': 'Sub-Saharan Africa', '204': 'Sub-Saharan Africa', '072': 'Sub-Saharan Africa',
  '516': 'Sub-Saharan Africa', '748': 'Sub-Saharan Africa', '426': 'Sub-Saharan Africa',
  '646': 'Sub-Saharan Africa', '108': 'Sub-Saharan Africa', '706': 'Sub-Saharan Africa',
  '232': 'Sub-Saharan Africa', '262': 'Sub-Saharan Africa', '140': 'Sub-Saharan Africa',
  '728': 'Sub-Saharan Africa',

  // Caribbean & Americas
  '840': 'Caribbean & Americas', '124': 'Caribbean & Americas', '484': 'Caribbean & Americas',
  '076': 'Caribbean & Americas', '032': 'Caribbean & Americas', '170': 'Caribbean & Americas',
  '604': 'Caribbean & Americas', '152': 'Caribbean & Americas', '862': 'Caribbean & Americas',
  '218': 'Caribbean & Americas', '068': 'Caribbean & Americas', '600': 'Caribbean & Americas',
  '858': 'Caribbean & Americas', '328': 'Caribbean & Americas', '740': 'Caribbean & Americas',
  '192': 'Caribbean & Americas', '388': 'Caribbean & Americas', '332': 'Caribbean & Americas',
  '214': 'Caribbean & Americas', '780': 'Caribbean & Americas', '591': 'Caribbean & Americas',
  '188': 'Caribbean & Americas', '320': 'Caribbean & Americas', '340': 'Caribbean & Americas',
  '222': 'Caribbean & Americas', '558': 'Caribbean & Americas', '084': 'Caribbean & Americas',
};

export const REGION_CENTERS: Record<CulinaryRegion, { center: [number, number]; zoom: number }> = {
  'Western Europe':       { center: [5, 48],    zoom: 4   },
  'Eastern Europe':       { center: [25, 50],   zoom: 3.5 },
  'East Asia':            { center: [105, 35],  zoom: 3.5 },
  'Japan & Korea':        { center: [135, 37],  zoom: 4.5 },
  'Southeast Asia':       { center: [110, 5],   zoom: 3.5 },
  'South Asia':           { center: [78, 22],   zoom: 3.5 },
  'Middle East':          { center: [45, 30],   zoom: 3.5 },
  'North Africa':         { center: [10, 30],   zoom: 3.5 },
  'Sub-Saharan Africa':   { center: [20, -5],   zoom: 2.5 },
  'Caribbean & Americas': { center: [-75, 15],  zoom: 3   },
};

export const REGION_LABEL_POSITIONS: Record<CulinaryRegion, [number, number]> = {
  'Western Europe':       [5, 50],
  'Eastern Europe':       [30, 52],
  'East Asia':            [110, 38],
  'Japan & Korea':        [137, 37],
  'Southeast Asia':       [112, 5],
  'South Asia':           [78, 22],
  'Middle East':          [48, 30],
  'North Africa':         [10, 28],
  'Sub-Saharan Africa':   [20, -5],
  'Caribbean & Americas': [-75, 10],
};
```

- [ ] **Step 4: Create lib/supabase/server.ts**

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

- [ ] **Step 5: Create lib/supabase/client.ts**

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 6: Type-check the lib/ files**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: errors only from `src/` (Vite imports) or missing `next-env.d.ts`. No errors from `lib/`.

If `next-env.d.ts` is missing, run `npx next dev` once briefly to generate it, then Ctrl+C.

- [ ] **Step 7: Commit**

```bash
git add lib/ && git commit -m "feat: add lib/ layer — types, filters, regions, supabase clients"
```

---

## Task 4: Create Supabase schema and seed script

**Files:**
- Create: `scripts/schema.sql`
- Create: `scripts/seed.ts`

**Prerequisites:** A Supabase project must exist. Copy `.env.local.example` to `.env.local` and fill in all three values from the Supabase project dashboard (Settings → API).

- [ ] **Step 1: Create scripts/schema.sql**

```sql
create table if not exists public.recipes (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  country        text not null,
  region         text not null,
  description    text,
  ingredients    jsonb not null default '[]',
  steps          jsonb not null default '[]',
  tags           text[] not null default '{}',
  image_url      text,
  cook_time      int not null,
  prep_time      int not null,
  servings       int not null,
  difficulty     text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  category       text not null check (category in ('main', 'dessert', 'drink', 'side')),
  coordinates    jsonb not null,
  is_fusion      boolean not null default false,
  inspired_by    text[],
  quote          text not null,
  nutrition      jsonb not null,
  flavor_profile jsonb not null,
  created_at     timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "Public can read recipes"
  on public.recipes
  for select
  to anon
  using (true);
```

- [ ] **Step 2: Run schema in Supabase**

In the Supabase dashboard → SQL Editor → New query. Paste and run `scripts/schema.sql`.

Expected: "Success. No rows returned."

- [ ] **Step 3: Create scripts/seed.ts**

```typescript
import { createClient } from '@supabase/supabase-js';
import { recipes } from '../src/data/recipes';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const rows = recipes.map(r => ({
  slug:           r.id,
  title:          r.name,
  country:        r.country,
  region:         r.region,
  description:    null,
  ingredients:    r.ingredients,
  steps:          r.instructions,
  tags:           r.tags,
  image_url:      r.image,
  cook_time:      r.cookTime,
  prep_time:      r.prepTime,
  servings:       r.servings,
  difficulty:     r.difficulty,
  category:       r.category,
  coordinates:    r.coordinates,
  is_fusion:      r.isFusion,
  inspired_by:    r.inspiredBy ?? null,
  quote:          r.quote,
  nutrition:      r.nutrition,
  flavor_profile: r.flavorProfile,
}));

const { error } = await supabase.from('recipes').insert(rows);
if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} recipes successfully.`);
```

- [ ] **Step 4: Install dotenv (needed by seed script)**

```bash
npm install --save-dev dotenv
```

- [ ] **Step 5: Run the seed script**

```bash
npx tsx --env-file=.env.local scripts/seed.ts
```

Expected output: `Seeded 17 recipes successfully.`

If you get "duplicate key" errors, the table already has data. Run in Supabase SQL editor: `truncate public.recipes;` then retry.

- [ ] **Step 6: Verify data in Supabase**

In Supabase dashboard → Table Editor → recipes. Should show 17 rows.

- [ ] **Step 7: Commit**

```bash
git add scripts/ && git commit -m "feat: Supabase schema, RLS, and seed script"
```

---

## Task 5: Create Providers and hooks

**Files:**
- Create: `components/Providers.tsx`
- Create: `hooks/useFavorites.ts`
- Create: `hooks/useRecipes.ts`

- [ ] **Step 1: Create components/Providers.tsx**

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Create hooks/useFavorites.ts**

Uses `useEffect` to read from localStorage only on the client, preventing hydration mismatch.

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useFavorites(): [Set<string>, (id: string) => void] {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nieves-favorites');
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]));
    } catch {
      // ignore parse errors
    }
  }, []);

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('nieves-favorites', JSON.stringify([...next]));
      return next;
    });
  }

  return [favorites, toggleFavorite];
}
```

- [ ] **Step 3: Create hooks/useRecipes.ts**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { dbToRecipe } from '@/lib/types';
import type { DbRecipe, Recipe } from '@/lib/types';

export function useRecipes() {
  return useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('title');
      if (error) throw error;
      return (data as DbRecipe[]).map(dbToRecipe);
    },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add components/Providers.tsx hooks/ && git commit -m "feat: QueryClient provider, useFavorites, useRecipes hooks"
```

---

## Task 6: Migrate UI components

**Files:**
- Create: `components/FlavorCompass.tsx`
- Create: `components/FilterPanel.tsx`
- Create: `components/RecipeCard.tsx`
- Create: `components/WorldMap.tsx`
- Create: `components/Navbar.tsx`
- Create: `components/RecipeDetail.tsx`

- [ ] **Step 1: Create components/FlavorCompass.tsx**

```typescript
'use client';

import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer,
} from 'recharts';
import type { FlavorProfile } from '@/lib/types';

export default function FlavorCompass({ profile }: { profile: FlavorProfile }) {
  const data = [
    { flavor: 'Sweet',  value: profile.sweet  },
    { flavor: 'Salty',  value: profile.salty  },
    { flavor: 'Umami',  value: profile.umami  },
    { flavor: 'Spicy',  value: profile.spicy  },
    { flavor: 'Sour',   value: profile.sour   },
    { flavor: 'Bitter', value: profile.bitter },
  ];

  return (
    <div className="w-full h-52">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#8D6E63" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="flavor"
            tick={{ fill: '#5D4037', fontSize: 12, fontFamily: 'Inter' }}
          />
          <Radar
            dataKey="value"
            stroke="#E2725B"
            fill="#E2725B"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Create components/FilterPanel.tsx**

```typescript
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import type { Filters, MealFilter, CulinaryRegion } from '@/lib/types';
import { ALL_TAGS } from '@/lib/filters';

const MEAL_OPTIONS: { value: MealFilter; label: string }[] = [
  { value: 'all',     label: 'All'      },
  { value: 'main',    label: 'Mains'    },
  { value: 'dessert', label: 'Desserts' },
  { value: 'drink',   label: 'Drinks'   },
  { value: 'side',    label: 'Sides'    },
];

const TIME_OPTIONS = [
  { value: null, label: 'Any'       },
  { value: 15,   label: 'Under 15m' },
  { value: 30,   label: 'Under 30m' },
  { value: 45,   label: 'Under 45m' },
  { value: 60,   label: 'Under 1h'  },
] as const;

const REGIONS: CulinaryRegion[] = [
  'Western Europe', 'Eastern Europe', 'East Asia', 'Japan & Korea',
  'Southeast Asia', 'South Asia', 'Middle East', 'North Africa',
  'Sub-Saharan Africa', 'Caribbean & Americas',
];

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  activeFilterCount: number;
}

export default function FilterPanel({ filters, onChange, activeFilterCount }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  function clearAll() {
    onChange({ mealType: 'all', minProtein: 0, maxCalories: 800, maxTime: null, regions: [], tags: [] });
  }

  function toggleTag(tag: string) {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    update({ tags });
  }

  function toggleRegion(region: CulinaryRegion) {
    const regions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    update({ regions });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-6 z-40 flex items-center gap-2 bg-terracotta text-white px-5 py-3 rounded-full shadow-lg hover:bg-terracotta/90 transition-colors"
      >
        <SlidersHorizontal size={18} />
        <span className="font-medium text-sm">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-white text-terracotta text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-parchment shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold text-brown-dark">Filters</h2>
                  <button onClick={() => setOpen(false)} className="p-1 hover:bg-parchment-dark rounded-full transition-colors">
                    <X size={20} className="text-brown-medium" />
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Type of Meal</h4>
                  <div className="flex flex-wrap gap-2">
                    {MEAL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update({ mealType: opt.value })}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filters.mealType === opt.value
                            ? 'bg-terracotta text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-1">
                    Min Protein: <span className="text-terracotta">{filters.minProtein}g+</span>
                  </h4>
                  <div className="px-2 pt-2">
                    <Slider min={0} max={50} step={5} value={filters.minProtein}
                      onChange={v => update({ minProtein: v as number })} />
                  </div>
                  <div className="flex justify-between text-[10px] text-brown-light mt-1 px-1">
                    <span>0g</span><span>25g</span><span>50g+</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-1">
                    Max Calories: <span className="text-terracotta">{filters.maxCalories} kcal</span>
                  </h4>
                  <div className="px-2 pt-2">
                    <Slider min={100} max={800} step={50} value={filters.maxCalories}
                      onChange={v => update({ maxCalories: v as number })} />
                  </div>
                  <div className="flex justify-between text-[10px] text-brown-light mt-1 px-1">
                    <span>100</span><span>400</span><span>800</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Total Time</h4>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => update({ maxTime: opt.value })}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filters.maxTime === opt.value
                            ? 'bg-terracotta text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Region</h4>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map(region => (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          filters.regions.includes(region)
                            ? 'bg-teal text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          filters.tags.includes(tag)
                            ? 'bg-sage text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearAll}
                  className="w-full py-2.5 rounded-xl border-2 border-brown-light/30 text-brown-medium text-sm font-medium hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Create components/RecipeCard.tsx**

Uses `motion(Link)` so the card navigates to `/recipes/[id]` while keeping Framer Motion animations.

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Flame, Dumbbell, Heart } from 'lucide-react';
import type { Recipe } from '@/lib/types';

const MotionLink = motion(Link);

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited?: boolean;
}

export default function RecipeCard({ recipe, isFavorited = false }: RecipeCardProps) {
  return (
    <MotionLink
      href={`/recipes/${recipe.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(62, 39, 35, 0.12)' }}
      className="bg-white rounded-2xl overflow-hidden shadow-md text-left w-full group cursor-pointer block"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {recipe.isFusion && (
          <span className="absolute top-3 left-3 bg-turmeric text-brown-dark text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            FUSION
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-brown-dark text-xs font-medium px-2.5 py-1 rounded-full shadow">
          {recipe.country}
        </span>
        {isFavorited && (
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full shadow">
            <Heart size={14} className="text-terracotta fill-terracotta" />
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-brown-dark mb-2 leading-tight">
          {recipe.name}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-parchment-dark text-brown-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-brown-medium">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {recipe.prepTime + recipe.cookTime}m
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell size={14} />
            {recipe.nutrition.protein}g protein
          </span>
          <span className="flex items-center gap-1">
            <Flame size={14} />
            {recipe.nutrition.calories} cal
          </span>
        </div>
      </div>
    </MotionLink>
  );
}
```

- [ ] **Step 4: Create components/WorldMap.tsx**

The `onSelectRecipe` prop is removed. Recipe navigation uses `useRouter` internally.

```typescript
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ComposableMap, Geographies, Geography,
  Marker, ZoomableGroup,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Recipe, CulinaryRegion } from '@/lib/types';
import {
  COUNTRY_TO_REGION, REGION_CENTERS, REGION_LABEL_POSITIONS,
  CHOROPLETH_BASE, CHOROPLETH_LIGHT, CHOROPLETH_EMPTY,
} from '@/lib/regions';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const HIDDEN_COUNTRIES = new Set(['ATA', '010']);

interface Position {
  coordinates: [number, number];
  zoom: number;
}

function getChoroplethColor(recipeCount: number, maxCount: number): string {
  if (recipeCount === 0) return CHOROPLETH_LIGHT;
  const t = recipeCount / maxCount;
  const intensity = 0.35 + 0.65 * t;
  const lightR = 235, lightG = 220, lightB = 205;
  const r = Math.round(CHOROPLETH_BASE.r * intensity + lightR * (1 - intensity));
  const g = Math.round(CHOROPLETH_BASE.g * intensity + lightG * (1 - intensity));
  const b = Math.round(CHOROPLETH_BASE.b * intensity + lightB * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function WorldMap({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const [position, setPosition] = useState<Position>({ coordinates: [20, 20], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<CulinaryRegion | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const recipesByCountry = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    for (const r of recipes) {
      const list = map.get(r.country) ?? [];
      list.push(r);
      map.set(r.country, list);
    }
    return map;
  }, [recipes]);

  const recipesByRegion = useMemo(() => {
    const map = new Map<CulinaryRegion, number>();
    for (const r of recipes) map.set(r.region, (map.get(r.region) ?? 0) + 1);
    return map;
  }, [recipes]);

  const maxRegionCount = useMemo(
    () => Math.max(1, ...recipesByRegion.values()),
    [recipesByRegion]
  );

  const markers = useMemo(() => {
    const seen = new Set<string>();
    return recipes.filter(r => {
      if (seen.has(r.country)) return false;
      seen.add(r.country);
      return true;
    });
  }, [recipes]);

  const getFill = useCallback(
    (geo: { properties: { name: string }; id?: string }) => {
      const isoCode = (geo.id as string) ?? '';
      const region = COUNTRY_TO_REGION[isoCode];
      const countryName = geo.properties.name;
      const hasRecipes = recipesByCountry.has(countryName);
      if (selectedRegion) {
        if (region === selectedRegion) {
          if (hasRecipes) {
            const count = recipesByCountry.get(countryName)!.length;
            const regionCount = recipesByRegion.get(selectedRegion) ?? 1;
            return getChoroplethColor(count, regionCount);
          }
          return CHOROPLETH_LIGHT;
        }
        return '#EDE6DC';
      }
      if (region) return getChoroplethColor(recipesByRegion.get(region) ?? 0, maxRegionCount);
      return CHOROPLETH_EMPTY;
    },
    [selectedRegion, recipesByCountry, recipesByRegion, maxRegionCount]
  );

  function handleCountryClick(geo: { properties: { name: string }; id?: string }) {
    const countryName = geo.properties.name;
    const isoCode = (geo.id as string) ?? '';
    const region = COUNTRY_TO_REGION[isoCode];
    const countryRecipes = recipesByCountry.get(countryName);
    if (!selectedRegion && region) {
      const regionData = REGION_CENTERS[region];
      setPosition({ coordinates: regionData.center, zoom: regionData.zoom });
      setSelectedRegion(region);
      setSelectedCountry(null);
    } else if (countryRecipes && countryRecipes.length > 0) {
      setSelectedCountry(countryName);
    }
  }

  function handleMarkerClick(recipe: Recipe) {
    if (selectedCountry === recipe.country) return;
    setSelectedCountry(recipe.country);
    const regionData = REGION_CENTERS[recipe.region];
    setPosition({ coordinates: regionData.center, zoom: regionData.zoom });
    setSelectedRegion(recipe.region);
  }

  function resetView() {
    setPosition({ coordinates: [20, 20], zoom: 1 });
    setSelectedRegion(null);
    setSelectedCountry(null);
  }

  const activeRegions = useMemo(() => {
    const out: { region: CulinaryRegion; count: number; position: [number, number] }[] = [];
    for (const [region, count] of recipesByRegion.entries()) {
      if (count > 0) out.push({ region, count, position: REGION_LABEL_POSITIONS[region] });
    }
    return out;
  }, [recipesByRegion]);

  const countryRecipes = selectedCountry ? recipesByCountry.get(selectedCountry) ?? [] : [];

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm">
        <button
          onClick={resetView}
          className={`font-medium transition-colors ${!selectedRegion ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
        >
          World
        </button>
        {selectedRegion && (
          <>
            <ChevronRight size={14} className="text-brown-light" />
            <button
              onClick={() => setSelectedCountry(null)}
              className={`font-medium transition-colors ${!selectedCountry ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
            >
              {selectedRegion}
            </button>
          </>
        )}
        {selectedCountry && (
          <>
            <ChevronRight size={14} className="text-brown-light" />
            <span className="font-medium text-terracotta">{selectedCountry}</span>
          </>
        )}
      </div>

      <div className="w-full h-full map-bg" style={{ touchAction: 'none' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            onMoveEnd={({ coordinates, zoom }: Position) => {
              setPosition({ coordinates, zoom });
              if (selectedRegion && zoom <= 1.5) {
                setSelectedRegion(null);
                setSelectedCountry(null);
              }
            }}
            maxZoom={12}
            filterZoomEvent={(e: Event) => {
              const evt = e as MouseEvent;
              if (evt.type === 'wheel') return true;
              return !evt.button;
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
                geographies
                  .filter(geo => !HIDDEN_COUNTRIES.has(geo.id ?? '') && !HIDDEN_COUNTRIES.has(geo.properties.name))
                  .map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={hoveredCountry === geo.properties.name ? '#D4A373' : getFill(geo)}
                      stroke="#C8B9A8"
                      strokeWidth={0.6}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.2s' },
                        hover:   { outline: 'none', cursor: 'pointer' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => handleCountryClick(geo)}
                    />
                  ))
              }
            </Geographies>

            {!selectedRegion && activeRegions.map(({ region, count, position: pos }) => (
              <Marker key={region} coordinates={pos}>
                <g style={{ cursor: 'pointer' }} onClick={() => {
                  const regionData = REGION_CENTERS[region];
                  setPosition({ coordinates: regionData.center, zoom: regionData.zoom });
                  setSelectedRegion(region);
                  setSelectedCountry(null);
                }}>
                  <circle r={5} fill="#FDF6EC" stroke="#5D4037" strokeWidth={1.2} />
                  <circle r={2.5} fill="#5D4037" />
                  <rect x={12} y={-11} width={region.length * 5.5 + 30} height={18} rx={9}
                    fill="white" fillOpacity={0.92} stroke="#C8B9A8" strokeWidth={0.5} />
                  <text x={18} y={2} style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 500, fill: '#3E2723' }}>
                    {region}
                  </text>
                  <text x={18 + region.length * 5.5 + 4} y={2} style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 700, fill: '#E2725B' }}>
                    ({count})
                  </text>
                </g>
              </Marker>
            ))}

            {selectedRegion && markers
              .filter(r => r.region === selectedRegion)
              .map(recipe => {
                const count = recipesByCountry.get(recipe.country)?.length ?? 0;
                return (
                  <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}
                    onClick={() => handleMarkerClick(recipe)}>
                    <g style={{ cursor: 'pointer' }}>
                      <circle r={6} fill="#E2725B" stroke="#FDF6EC" strokeWidth={1.5} opacity={0.9} />
                      <text textAnchor="middle" y={-10} style={{ fontFamily: 'Inter', fontSize: '8px', fontWeight: 600, fill: '#3E2723' }}>
                        {recipe.country} ({count})
                      </text>
                    </g>
                  </Marker>
                );
              })
            }
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {hoveredCountry && !selectedCountry && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-medium text-brown-dark pointer-events-none z-10">
          {hoveredCountry}
          {recipesByCountry.has(hoveredCountry) && (
            <span className="text-terracotta ml-1.5">
              ({recipesByCountry.get(hoveredCountry)!.length} recipe{recipesByCountry.get(hoveredCountry)!.length > 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedCountry && countryRecipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-16 left-4 bottom-4 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto z-10"
          >
            <div className="p-4">
              <h3 className="font-heading text-lg font-bold text-brown-dark mb-1">{selectedCountry}</h3>
              <p className="text-xs text-brown-medium mb-4">
                {countryRecipes.length} recipe{countryRecipes.length > 1 ? 's' : ''}
              </p>
              <div className="space-y-3">
                {countryRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                    className="w-full bg-parchment rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow group"
                  >
                    <div className="h-28 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-heading text-sm font-semibold text-brown-dark mb-1">{recipe.name}</h4>
                      <div className="flex gap-1.5 flex-wrap">
                        {recipe.isFusion && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-turmeric text-brown-dark">
                            FUSION
                          </span>
                        )}
                        {recipe.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-parchment-dark text-brown-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 5: Create components/Navbar.tsx**

Uses `usePathname` for active state; `useFavorites` for the favorites count badge.

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Map, BookOpen, Info, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

const links = [
  { href: '/',          label: 'Explore',     icon: Map       },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen  },
  { href: '/favorites', label: 'Favorites',   icon: Heart     },
  { href: '/about',     label: 'About',       icon: Info      },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;

  return (
    <nav className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-brown-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <UtensilsCrossed size={28} className="text-terracotta" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-brown-dark leading-tight font-heading">
                Nieves&#39; Kitchen
              </h1>
              <p className="text-xs text-brown-medium leading-tight tracking-wide hidden sm:block">
                Globally inspired halal recipes for the health-conscious foodie
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium transition-all ${
                    active
                      ? 'bg-terracotta text-white shadow-md'
                      : 'text-brown-medium hover:bg-parchment-dark hover:text-brown-dark'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                  {href === '/favorites' && favCount > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      active ? 'bg-white/20 text-white' : 'bg-terracotta text-white'
                    }`}>
                      {favCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 6: Create components/RecipeDetail.tsx**

Full-page adaptation of RecipeModal. Reads favorites from `useFavorites` hook internally.

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, ChefHat, Users, Minus, Plus,
  Copy, Check, Flame, Dumbbell, Wheat, Droplets, Heart,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import FlavorCompass from './FlavorCompass';
import { useFavorites } from '@/hooks/useFavorites';

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
    { label: 'Calories', value: Math.round(recipe.nutrition.calories * scale), unit: 'kcal', icon: <Flame size={16} /> },
    { label: 'Protein',  value: Math.round(recipe.nutrition.protein  * scale), unit: 'g',    icon: <Dumbbell size={16} /> },
    { label: 'Carbs',    value: Math.round(recipe.nutrition.carbs    * scale), unit: 'g',    icon: <Wheat size={16} /> },
    { label: 'Fat',      value: Math.round(recipe.nutrition.fat      * scale), unit: 'g',    icon: <Droplets size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-2xl mx-auto px-4 py-6">
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
            className="p-2 rounded-full bg-white shadow hover:bg-parchment-dark transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-brown-dark'} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-parchment rounded-3xl overflow-hidden"
        >
          <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-6">
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-center gap-2 mb-1">
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
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">{recipe.name}</h1>
            </div>
          </div>

          <div className="space-y-6">
            <blockquote className="italic text-brown-medium border-l-4 border-terracotta pl-4 text-sm leading-relaxed">
              &ldquo;{recipe.quote}&rdquo;
            </blockquote>

            <div className="flex flex-wrap gap-3 text-sm text-brown-medium">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Clock size={15} /> Prep: {recipe.prepTime}m
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <ChefHat size={15} /> Cook: {recipe.cookTime}m
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <ChefHat size={15} /> {recipe.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-parchment-dark text-brown-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {nutritionItems.map(n => (
                <div key={n.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="flex justify-center mb-1 text-terracotta">{n.icon}</div>
                  <div className="text-lg font-bold text-brown-dark">
                    {n.value}<span className="text-xs font-normal">{n.unit}</span>
                  </div>
                  <div className="text-[10px] text-brown-medium">{n.label}</div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-brown-dark mb-2">Flavor Profile</h2>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <FlavorCompass profile={recipe.flavorProfile} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-lg font-semibold text-brown-dark">Ingredients</h2>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-brown-medium" />
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-7 h-7 rounded-full bg-parchment-dark hover:bg-terracotta-light flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold text-brown-dark w-6 text-center">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-7 h-7 rounded-full bg-parchment-dark hover:bg-terracotta-light flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-parchment-dark last:border-0">
                    <span className="text-brown-dark">{ing.name}</span>
                    <span className="text-brown-medium font-medium">{formatAmount(ing.amount)} {ing.unit}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={copyIngredients}
                className="mt-2 flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-light transition-colors"
              >
                {copiedIngredients ? <Check size={14} /> : <Copy size={14} />}
                {copiedIngredients ? 'Copied!' : 'Copy ingredients'}
              </button>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-brown-dark mb-3">Instructions</h2>
              <div className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-brown-dark leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2 pb-8">
              <button
                onClick={copyFullRecipe}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors shadow"
              >
                {copiedRecipe ? <Check size={18} /> : <Copy size={18} />}
                {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add components/ && git commit -m "feat: migrate all UI components to Next.js (use client)"
```

---

## Task 7: Create root layout and static About page

**Files:**
- Create: `app/layout.tsx`
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/layout.tsx**

Uses `next/font/google` for optimised font loading. The CSS variables `--font-inter` and `--font-playfair` are injected onto `<html>` and referenced by `@theme` in `globals.css`.

```typescript
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nieves' Kitchen",
  description: 'Globally inspired halal recipes for the health-conscious foodie.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-parchment overflow-x-hidden">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create app/about/page.tsx**

Server Component — no data fetching, just static content. Copied from `src/pages/AboutPage.tsx` with updated import paths.

```typescript
import { UtensilsCrossed, Globe, Heart, Dumbbell } from 'lucide-react';

export const metadata = {
  title: "About — Nieves' Kitchen",
  description: "Learn about the story behind Nieves' Kitchen — halal recipes from around the world.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brown-dark mb-8 text-center">
        About Nieves&#39; Kitchen
      </h1>

      <div className="space-y-6 text-brown-dark leading-relaxed">
        <p>
          Having lived in different places and grown up around diverse cuisines, I&apos;ve collected
          these recipes over the years. Every dish you find here is{' '}
          <strong>100% halal</strong>, personally tried, tested, and deeply loved.
        </p>
        <p>
          I&apos;m ethnically Chinese, born and raised in Spain, and I&apos;ve lived across Asia and Europe.
          Food has always been the thread that connects the cultures I&apos;ve been part of. Whether it&apos;s
          my grandmother&apos;s dumpling technique meeting Italian pasta, or Moroccan spices finding their
          way into a weeknight supper — these recipes are a reflection of that journey.
        </p>
        <p>
          I believe that to understand a culture, you need to understand its food. And to truly
          understand food, you need to cook it yourself — to smell the spices, feel the dough, and
          taste as you go. I built this space to share the warmth of those experiences with you.
        </p>
        <p>
          Whether you&apos;re looking for a quick weeknight meal, a macro-friendly prep, or a slow-cooked
          weekend feast, I hope you find something here that brings joy to your table.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        {[
          {
            icon: <Heart size={24} className="text-paprika" />,
            title: '100% Halal',
            text: 'Every single recipe is halal. No exceptions, no compromises.',
          },
          {
            icon: <Globe size={24} className="text-teal" />,
            title: 'Globally Inspired',
            text: 'From Sichuan to Seville, each dish carries a story from somewhere in the world.',
          },
          {
            icon: <Dumbbell size={24} className="text-sage" />,
            title: 'Macro-Friendly',
            text: 'Most recipes are designed with nutrition in mind. High protein, balanced, and satisfying.',
          },
          {
            icon: <UtensilsCrossed size={24} className="text-turmeric" />,
            title: 'Tried & Tested',
            text: 'Nothing here is theoretical. Every recipe has been cooked, tasted, and perfected.',
          },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-3">{item.icon}</div>
            <h3 className="font-heading text-lg font-semibold text-brown-dark mb-1">{item.title}</h3>
            <p className="text-sm text-brown-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/about/ && git commit -m "feat: root layout with next/font, Providers, Navbar; About page"
```

---

## Task 8: Create Home page (/)

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create app/page.tsx**

Client Component: fetches all recipes via TanStack Query, manages filter state, renders WorldMap + FilterPanel.

```typescript
'use client';

import { useMemo, useState } from 'react';
import WorldMap from '@/components/WorldMap';
import FilterPanel from '@/components/FilterPanel';
import { useRecipes } from '@/hooks/useRecipes';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { Filters } from '@/lib/types';

export default function HomePage() {
  const { data: recipes = [] } = useRecipes();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filteredRecipes = useMemo(() => applyFilters(recipes, filters), [recipes, filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return (
    <div className="relative h-[calc(100vh-72px)]">
      <WorldMap recipes={filteredRecipes} />
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and verify the home page loads**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: Navbar renders, world map renders with choropleth colours, filter panel button visible.

If the map is blank, open browser devtools — likely a missing env var. Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx && git commit -m "feat: Home page — WorldMap + FilterPanel with TanStack Query"
```

---

## Task 9: Create Recipes list page (/recipes)

**Files:**
- Create: `app/recipes/page.tsx`

- [ ] **Step 1: Create app/recipes/page.tsx**

```typescript
'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import RecipeCard from '@/components/RecipeCard';
import FilterPanel from '@/components/FilterPanel';
import { useRecipes } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { Filters } from '@/lib/types';

export default function RecipesPage() {
  const { data: recipes = [], isLoading } = useRecipes();
  const [favorites] = useFavorites();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filteredRecipes = useMemo(() => applyFilters(recipes, filters), [recipes, filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">All Recipes</h1>
        <p className="text-brown-medium text-sm">
          {isLoading ? 'Loading…' : (
            <>
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              {activeFilterCount > 0 && (
                <span className="text-terracotta">
                  {' '}({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {!isLoading && filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown-medium text-lg mb-2">No recipes match your filters</p>
          <p className="text-brown-light text-sm">Try adjusting your filters to discover more dishes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.has(recipe.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/recipes`. Expected: recipe grid renders, filter panel button visible, cards link to `/recipes/[slug]`.

- [ ] **Step 3: Commit**

```bash
git add app/recipes/page.tsx && git commit -m "feat: Recipes list page with filter state and TanStack Query"
```

---

## Task 10: Create Recipe detail page (/recipes/[slug])

**Files:**
- Create: `app/recipes/[slug]/page.tsx`

- [ ] **Step 1: Create app/recipes/[slug]/page.tsx**

Server Component: fetches by `slug` from Supabase, generates metadata, renders `<RecipeDetail>`.

```typescript
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { dbToRecipe } from '@/lib/types';
import type { DbRecipe } from '@/lib/types';
import RecipeDetail from '@/components/RecipeDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('recipes')
    .select('title, quote')
    .eq('slug', slug)
    .single();

  if (!data) return {};

  return {
    title: `${data.title} — Nieves' Kitchen`,
    description: data.quote,
    openGraph: {
      title: `${data.title} — Nieves' Kitchen`,
      description: data.quote,
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data || error) notFound();

  const recipe = dbToRecipe(data as DbRecipe);
  return <RecipeDetail recipe={recipe} />;
}
```

- [ ] **Step 2: Verify in browser**

Click any recipe card from `/recipes`. Expected: navigates to `/recipes/lamb-dumplings` (or similar slug), full recipe detail renders with image, ingredients, instructions, FlavorCompass.

Check page source (`View Source`) — title should contain the recipe name (SSR working).

- [ ] **Step 3: Commit**

```bash
git add app/recipes/[slug]/ && git commit -m "feat: recipe detail page — Server Component, generateMetadata, SEO-ready"
```

---

## Task 11: Create Favorites page (/favorites)

**Files:**
- Create: `app/favorites/page.tsx`

- [ ] **Step 1: Create app/favorites/page.tsx**

```typescript
'use client';

import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipes } from '@/hooks/useRecipes';

export default function FavoritesPage() {
  const [favorites] = useFavorites();
  const { data: allRecipes = [] } = useRecipes();
  const favoriteRecipes = allRecipes.filter(r => favorites.has(r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">My Favorites</h1>
        <p className="text-brown-medium text-sm">
          {favoriteRecipes.length} saved recipe{favoriteRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="text-brown-light mx-auto mb-4" />
          <p className="font-heading text-xl text-brown-dark mb-2">No favorites yet</p>
          <p className="text-brown-medium text-sm">
            Open any recipe and tap the heart to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {favoriteRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/favorites`. Expected: "No favorites yet" if none saved, or favorited recipe cards if the heart was toggled on a recipe detail page.

- [ ] **Step 3: Commit**

```bash
git add app/favorites/page.tsx && git commit -m "feat: Favorites page — localStorage favorites with live recipe data"
```

---

## Task 12: Remove Vite artifacts and verify clean build

**Files to delete:**
- `src/` (entire directory)
- `vite.config.ts`
- `index.html`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `eslint.config.js`

- [ ] **Step 1: Ensure the seed script has already been run**

The seed script imports from `src/data/recipes.ts`. Verify 17 rows exist in Supabase (Table Editor → recipes) before deleting `src/`.

- [ ] **Step 2: Delete Vite-specific files**

```bash
rm -rf src vite.config.ts index.html tsconfig.app.json tsconfig.node.json eslint.config.js
```

- [ ] **Step 3: Update CLAUDE.md to reflect new commands**

Replace the commands section in `CLAUDE.md`:

```markdown
## Commands

```bash
npm run dev       # Start dev server (Next.js HMR)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Next.js ESLint
```

Also update the Architecture section: remove references to `App.tsx`, Vite, `src/data/recipes.ts`, `src/pages/`, and `src/components/`. Replace with the new App Router structure described in the migration plan.

- [ ] **Step 4: Run a production build to verify everything compiles**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. You should see output like:
```
Route (app)                              Size
┌ ○ /                                    ...
├ ○ /about                               ...
├ ○ /favorites                           ...
├ ○ /recipes                             ...
└ ● /recipes/[slug]                      ...
```

If there are TypeScript errors, fix them before continuing.

- [ ] **Step 5: Smoke-test the production build locally**

```bash
npm run start
```

Open `http://localhost:3000` and verify: home page map loads, `/recipes` shows cards, clicking a card navigates to `/recipes/[slug]`, favorites toggle persists on page reload.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: remove Vite artifacts, update CLAUDE.md — migration complete"
```

---

## Task 13: Deploy to Vercel

Manual steps — no code changes required.

- [ ] **Step 1: Push to GitHub**

Ensure the repo is on GitHub. If not:

```bash
gh repo create nieves-kitchen --public --source=. --push
```

If already on GitHub:

```bash
git push origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `nieves-kitchen` GitHub repo
3. Vercel auto-detects Next.js — accept defaults
4. Click **Deploy** (first deploy will fail because env vars are missing — that's expected)

- [ ] **Step 3: Add environment variables in Vercel**

In the Vercel project dashboard → Settings → Environment Variables. Add all three:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service role key |

- [ ] **Step 4: Trigger a redeploy**

In Vercel → Deployments → click the failed deployment → Redeploy.

Expected: build succeeds, app is live at `https://nieves-kitchen.vercel.app` (or similar).

- [ ] **Step 5: Verify SEO**

Visit `https://your-vercel-url.vercel.app/recipes/lamb-dumplings`. View page source and confirm `<title>Lamb Dumplings — Nieves' Kitchen</title>` is in the HTML (server-rendered metadata).

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Next.js 15 App Router | Task 1 |
| Tailwind v4 design tokens preserved | Task 2 |
| Supabase schema + RLS | Task 4 |
| Seed from static recipes.ts | Task 4 |
| Server Components for recipe list/detail | Tasks 9, 10 |
| Client Components for WorldMap, FilterPanel | Task 6 |
| TanStack Query v5 for client fetching | Tasks 5, 8, 9, 11 |
| Favorites in localStorage (no breaking change) | Tasks 5, 11 |
| `/recipes/[slug]` with generateMetadata | Task 10 |
| Open Graph tags on recipe pages | Task 10 |
| Static metadata on `/about` | Task 7 |
| Vercel deployment | Task 13 |

**Out of scope (not implemented):** Supabase Auth, user-submitted recipes, Supabase Storage for images, full-text search — per spec.
