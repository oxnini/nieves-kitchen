# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js HMR)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Next.js ESLint
```

No test suite is configured.

Environment: copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (the service role key is only needed for the seed script).

## Architecture

**Nieves Kitchen** is a Next.js 15 (App Router) + TypeScript app for browsing global recipes on an interactive world map, backed by Supabase. Favorites persist in `localStorage`.

### Routing

App Router structure under `app/`:

| Route | File | Rendering |
|-------|------|-----------|
| `/` | `app/page.tsx` | Client — `WorldMap` + `FilterPanel` |
| `/recipes` | `app/recipes/page.tsx` | Client — card grid + `FilterPanel` |
| `/recipes/[slug]` | `app/recipes/[slug]/page.tsx` | Server — Supabase fetch, `generateMetadata` (SEO) |
| `/favorites` | `app/favorites/page.tsx` | Client — reads from `localStorage` |
| `/about` | `app/about/page.tsx` | Server — static |

Navigation is handled by `next/link`; active state uses `usePathname()` in `components/Navbar.tsx`.

### Data layer

All recipe data lives in Supabase in the `public.recipes` table. RLS is enabled with an anon-readable SELECT policy. The schema is defined in `scripts/schema.sql`.

- `lib/types.ts` — `Recipe`, `DbRecipe`, `Filters`, `CulinaryRegion`, plus `dbToRecipe()` which converts DB rows (snake_case) into the app's `Recipe` shape (camelCase).
- `lib/filters.ts` — `ALL_TAGS`, `DEFAULT_FILTERS`, `applyFilters`, `countActiveFilters`.
- `lib/regions.ts` — `COUNTRY_TO_REGION` (numeric ISO code → `CulinaryRegion`), `REGION_CENTERS`, `REGION_LABEL_POSITIONS`, choropleth color constants.
- `lib/supabase/server.ts` — async `createClient()` for Server Components (uses cookies).
- `lib/supabase/client.ts` — `createClient()` for the browser.
- `hooks/useRecipes.ts` — TanStack Query hook; fetches all recipes and maps via `dbToRecipe`.
- `hooks/useFavorites.ts` — `localStorage`-backed `Set<string>` under key `"nieves-favorites"`.
- `scripts/seed.ts` — one-time seeder; run with `npx tsx --env-file=.env.local scripts/seed.ts`.

When adding a recipe, insert a row into the Supabase `recipes` table and ensure `country` matches the `properties.name` from `world-atlas` GeoJSON (used for choropleth coloring and country matching in `WorldMap`).

### Map (`components/WorldMap.tsx`)

Uses `react-simple-maps` with `world-atlas` GeoJSON fetched at runtime from a CDN. Two-level drill-down:
1. Click a region → zooms to region, shows country markers.
2. Click a country marker → shows a recipe sidebar panel; clicking a recipe navigates to `/recipes/[slug]` via `useRouter`.

Choropleth coloring blends from a light warm tone toward `CHOROPLETH_BASE` based on recipe density per region.

### Client vs Server Components

Everything in `components/` is a Client Component (`"use client"`) because it uses hooks, browser APIs, or interactive state. `app/recipes/[slug]/page.tsx` and `app/about/page.tsx` are Server Components. `app/layout.tsx` is a Server Component that renders the Client `Providers` (TanStack Query) and `Navbar`.

### Design tokens

Custom Tailwind v4 theme tokens are defined in `app/globals.css` under `@theme`:
- Colors: `parchment`, `terracotta`, `turmeric`, `paprika`, `sage`, `teal`, `brown-dark/medium/light`
- Fonts: `font-heading` (Playfair Display), `font-body` (Inter), injected as CSS variables via `next/font/google` in `app/layout.tsx`.

Use these tokens (e.g. `bg-parchment`, `text-terracotta`) rather than raw hex values.
