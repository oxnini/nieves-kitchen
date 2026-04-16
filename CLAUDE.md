# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite is configured.

## Architecture

**Nieves Kitchen** is a single-page React + TypeScript app (Vite) for browsing global recipes on an interactive world map. There is no backend — all data is static and favorites persist via `localStorage`.

### State & routing

`App.tsx` is the root of all app state. There is no router — page navigation is handled via a `Page` string state variable (`"home" | "recipes" | "favorites" | "about"`). `App.tsx` owns:
- Active filters (`Filters`) and passes filtered recipes down
- Selected recipe (for the modal overlay, `RecipeModal`)
- Favorites set (persisted in `localStorage` under key `"nieves-favorites"`)

### Pages

| Page | Key feature |
|------|-------------|
| `HomePage` | Full-viewport interactive world map with a floating `FilterPanel` |
| `RecipesPage` | Grid of `RecipeCard` components with sidebar `FilterPanel` |
| `FavoritesPage` | Grid of favorited recipes |
| `AboutPage` | Static content |

### Data layer

All recipe data lives in `src/data/recipes.ts` as a static exported array. `src/data/regions.ts` exports:
- `COUNTRY_TO_REGION` — maps numeric ISO codes (from `world-atlas`) to `CulinaryRegion`
- `REGION_CENTERS` / `REGION_LABEL_POSITIONS` — map coordinates used by `WorldMap`
- Choropleth color constants

When adding a recipe, add it to `recipes` in `src/data/recipes.ts` and ensure its `country` name matches the `properties.name` from `world-atlas` GeoJSON (used for choropleth coloring and country matching).

### Map (`WorldMap.tsx`)

Uses `react-simple-maps` with `world-atlas` GeoJSON fetched at runtime from a CDN. The map has a two-level drill-down:
1. Click a region → zooms to region, shows country markers
2. Click a country marker → shows a recipe sidebar panel

Choropleth coloring blends from a light warm tone toward `CHOROPLETH_BASE` based on recipe density per region.

### Design tokens

Custom Tailwind v4 theme tokens are defined in `src/index.css` under `@theme`:
- Colors: `parchment`, `terracotta`, `turmeric`, `paprika`, `sage`, `teal`, `brown-dark/medium/light`
- Fonts: `font-heading` (Playfair Display), `font-body` (Inter)

Use these tokens (e.g. `bg-parchment`, `text-terracotta`) rather than raw hex values.
