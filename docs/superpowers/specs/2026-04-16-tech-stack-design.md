# Tech Stack Design: Nieves Kitchen

**Date:** 2026-04-16
**Status:** Approved

## Goal

Migrate Nieves Kitchen from a static Vite SPA to a production-ready Next.js app with Supabase as the backend — optimised for SEO, scalable toward user accounts and user-submitted recipes, and deployable on Vercel.

## Core Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | Replaces Vite |
| Language | TypeScript | Keep |
| Styling | Tailwind v4 | Keep, including all design tokens |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) | Replaces static data |
| Client data fetching | TanStack Query v5 | Caching, loading states, mutations |
| Animation | Framer Motion | Keep |
| Icons | Lucide React | Keep |
| Map | react-simple-maps | Keep as Client Component |
| Charts | Recharts | Keep as Client Component |
| Deployment | Vercel | Native Next.js host |

## Architecture

### Routing

Replace `App.tsx` string-based `Page` state with file-based Next.js routes:

| Current | Next.js route |
|---------|--------------|
| `"home"` | `/` |
| `"recipes"` | `/recipes` |
| Recipe detail (modal) | `/recipes/[slug]` — SEO-critical, new page |
| `"favorites"` | `/favorites` |
| `"about"` | `/about` |

### Server vs Client Components

- **Server Components** (default): recipe list pages, recipe detail pages, layout, metadata generation. Fetch from Supabase server-side — keys never exposed to client, fast for crawlers.
- **Client Components** (`"use client"`): WorldMap, FilterPanel, RecipeCard interactions, anything using hooks or browser events. Add directive only where required.

### Data Fetching Pattern

- Server Components call Supabase directly using the anon key + RLS (service role key only for future admin operations)
- Client Components use TanStack Query for caching, loading states, and eventual mutations
- Favorites stay in `localStorage` until auth is added — no breaking change at migration time

## Data Layer (Supabase)

### Schema

```sql
-- recipes table
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug         text UNIQUE NOT NULL
title        text NOT NULL
country      text NOT NULL
region       text NOT NULL
description  text
ingredients  jsonb
steps        jsonb
tags         text[]
image_url    text
cook_time    int  -- minutes
difficulty   text
created_at   timestamptz DEFAULT now()

-- favorites table (add when auth is ready)
user_id      uuid REFERENCES auth.users
recipe_id    uuid REFERENCES recipes
created_at   timestamptz DEFAULT now()
PRIMARY KEY (user_id, recipe_id)
```

### Row Level Security

Enable RLS from day one:
- `recipes`: public `SELECT` for `anon` role
- `favorites` (future): `SELECT/INSERT/DELETE` where `user_id = auth.uid()`

### Seeding

Migrate existing `src/data/recipes.ts` array via a one-time seed script. Delete the file after seeding.

## SEO

- Each recipe gets a crawlable URL at `/recipes/[slug]`
- `generateMetadata()` on the recipe detail page sets `title`, `description`, and Open Graph tags
- Static pages (`/`, `/about`) use static metadata exports

## Migration Strategy

**Approach:** Scaffold a new Next.js project, migrate components, then replace. Always have a working app.

### Phase 1 — Scaffold & configure (~1–2 hrs)
- `npx create-next-app@latest` with TypeScript + Tailwind
- Copy design tokens, fonts, and Tailwind config from `src/index.css`
- Install: Framer Motion, Lucide, react-simple-maps, Recharts, TanStack Query, Supabase JS

### Phase 2 — Migrate UI components (~2–4 hrs)
- Copy components as-is
- Add `"use client"` to components using hooks, event handlers, or browser APIs
- Purely presentational components become Server Components automatically

### Phase 3 — Wire up routing & Supabase (~2–3 hrs)
- Create file-based routes matching the table above
- Set up Supabase server client and browser client
- Seed recipes into Supabase from existing static array
- Add `generateMetadata()` to `/recipes/[slug]`

### Phase 4 — Deploy to Vercel (~30 min)
- Connect GitHub repo to Vercel
- Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Vercel auto-deploys on every push to main

**Total estimated effort:** ~1 focused day for a working, deployed Next.js version.

## Future Extensions (out of scope now)

- Supabase Auth for user accounts (login, favorites sync, recipe submission)
- Supabase Storage for recipe images
- Admin route for adding/editing recipes
- Full-text search via Supabase `pg_trgm` or Algolia
