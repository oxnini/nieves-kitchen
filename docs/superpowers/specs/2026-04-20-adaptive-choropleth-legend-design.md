# Adaptive Choropleth + Legend

**Date:** 2026-04-20
**Status:** Draft

## Overview

Two related features for the world map:

1. **Adaptive choropleth** — country fill colors change meaning based on zoom level (continent → region → country), with smooth crossfade transitions between levels.
2. **Choropleth legend** — a persistent, compact map key (bottom-left, desktop only) showing what the color gradient means at the current zoom level.
3. **Dev mock data** — a dev-only mock recipe dataset for testing gradient visibility across all levels.

Implementation order: region restructure first, then mock data (enables testing), then adaptive choropleth, then legend.

---

## Part 0a: Region Restructure

### Goal

Replace `'Japan & Korea'` and `'Caribbean & Americas'` with a cleaner 10-region model that aligns with continent names:

| Old Region            | New Region(s)                   |
|-----------------------|---------------------------------|
| `Japan & Korea`       | Merged into `East Asia`         |
| `Caribbean & Americas`| Split into `North America` + `South America` |

Final 10 regions: Western Europe, Eastern Europe, East Asia, Southeast Asia, South Asia, Middle East, North Africa, Sub-Saharan Africa, North America, South America.

### Files to update

**`lib/types.ts`:**
- `CulinaryRegion` union: remove `'Japan & Korea'` and `'Caribbean & Americas'`, add `'North America'` and `'South America'`
- `CULINARY_REGION_ORDER`: update to new 10 regions
- `SubCulinaryRegion`: remove `'Japan & Korea (sub)'`, remap Japan/Korea countries to `'East Asia (sub)'`

**`lib/regions.ts`:**
- `COUNTRY_TO_REGION`: move Japan & Korea ISO codes (`392`, `410`, `408`) into `'East Asia'`; split Caribbean & Americas codes into `'North America'` (USA, Canada, Mexico, Central America, Caribbean islands) and `'South America'` (Brazil, Argentina, etc.)
- `REGION_CENTERS`: remove old entries, add `'North America'` and `'South America'` with appropriate centers/zooms
- `REGION_LABEL_POSITIONS`: same treatment
- `COUNTRY_TO_SUBREGION`: remap `'Japan & Korea (sub)'` entries to `'East Asia (sub)'`
- `SUB_REGION_PARENT`: remove `'Japan & Korea (sub)'` → `'Japan & Korea'`; change `'East Asia (sub)'` to parent `'East Asia'` (already correct); change `'North America'`, `'Central America & Caribbean'`, `'South America'` parents from `'Caribbean & Americas'` to `'North America'` or `'South America'` respectively; move `'Oceania'` parent (currently `'Caribbean & Americas'`) — needs a decision (likely keep unmapped or assign to closest)
- `SUB_REGION_SLUG`: remove `'Japan & Korea (sub)'` entry
- `SUB_REGION_ORDER`: remove `'Japan & Korea (sub)'`

**`components/WorldMap.tsx`:**
- `REGION_TO_CONTINENT`: remove `'Japan & Korea': 'Asia'` and `'Caribbean & Americas': 'Americas'`, add `'North America': 'North America'` and `'South America': 'South America'`

**`components/FilterPanel.tsx`:**
- `REGIONS` array: update to new 10 regions

**`scripts/seed-mock.ts`:**
- Update any recipes using old region names

**Supabase `recipes` table:**
- Existing recipes with `region = 'Japan & Korea'` need updating to `'East Asia'`
- Existing recipes with `region = 'Caribbean & Americas'` need updating to `'North America'` or `'South America'`
- This requires a manual SQL update or migration script

---

## Part 0b: Dev Mock Data

### Goal

Create ~40-50 mock recipes concentrated in Europe and Asia, with deliberate count variation across continents, regions, and countries so the choropleth gradient is clearly testable at all three zoom levels.

### Distribution Plan

| Continent     | Target Count | Region Breakdown                                                                 |
|---------------|--------------|----------------------------------------------------------------------------------|
| Europe        | ~20          | Western Europe: 12 (France 4, Italy 3, Spain 3, Germany 2), Eastern Europe: 8 (Greece 3, Poland 2, Turkey 2, Romania 1) |
| Asia          | ~18          | East Asia: 9 (China 3, Japan 3, South Korea 2, Mongolia 1), Southeast Asia: 5 (Thailand 3, Vietnam 2), South Asia: 2 (India 2), Middle East: 2 (Lebanon 1, Iran 1) |
| Africa        | ~5           | North Africa: 3 (Morocco 2, Egypt 1), Sub-Saharan Africa: 2 (Ethiopia 1, Nigeria 1) |
| North America | ~3           | North America: Mexico 2, Cuba 1                                                 |
| South America | ~3           | South America: Brazil 2, Peru 1                                                 |
| Oceania       | ~1           | (no culinary region mapped — remains empty, tests the empty state)               |

This gives clear gradients at every level:
- **Macro:** Europe (20) > Asia (18) > Africa (5) > Americas (3 each) > Oceania (1)
- **Meso (Europe):** Western Europe (12) > Eastern Europe (8)
- **Micro (Western Europe):** France (4) > Italy/Spain (3) > Germany (2)

### Implementation

- Create `lib/mock-recipes.ts` exporting a `MOCK_RECIPES: Recipe[]` array.
- Each recipe needs: `id`, `name`, `country`, `region`, `coordinates` (lng/lat), `image` (placeholder), `tags`, and all other `Recipe` fields with sensible defaults.
- In `hooks/useRecipes.ts`, when an env var `NEXT_PUBLIC_USE_MOCK_DATA=true` is set, return mock data instead of fetching from Supabase.
- The mock file is never imported in production builds (tree-shaken via the env check).

---

## Part 1: Adaptive Choropleth

### Current State

- `getChoroplethColor(recipeCount, maxCount, isSepia)` computes a single color by lerping between a light base and `CHOROPLETH_BASE` based on `recipeCount / maxCount`.
- The `getFill` callback in `WorldMap` looks up each country's culinary region and passes the region's recipe count. This means coloring is always at the **region level** regardless of zoom.
- `REGION_TO_CONTINENT` exists but maps region → continent name. `CONTINENTS` array has 6 entries (North America and South America are separate).

### Three Choropleth Levels

| Level | Unit     | "How many recipes?" | Max normalization              |
|-------|----------|---------------------|--------------------------------|
| Macro | Continent | Sum of all recipes in all regions belonging to that continent | Max continent count |
| Meso  | Culinary Region | Sum of all recipes in that region (current behavior) | Max region count |
| Micro | Country  | Recipes in that specific country | Max country count (within visible region, or global) |

### New Data Structures

#### Continent derivation

After the region restructure (Part 0a), every culinary region maps cleanly to a continent via `REGION_TO_CONTINENT`. No special-casing needed — `'North America'` → `'North America'`, `'South America'` → `'South America'`, etc. A helper `getContinent(isoCode)` chains `COUNTRY_TO_REGION[isoCode]` → `REGION_TO_CONTINENT[region]`.

#### Computed data (new `useMemo` hooks in WorldMap)

```ts
// Recipes per continent
const recipesByContinent: Map<string, number>
// e.g., { "Europe": 20, "Asia": 18, "Africa": 5, ... }

// Recipes per individual country (by name, for micro level)
const recipesPerCountry: Map<string, number>
// e.g., { "France": 4, "Italy": 3, ... }
// (Derived from existing recipesByCountry.get(name).length)

// Max values for normalization
const maxContinentCount: number
const maxCountryCount: number
// maxRegionCount already exists
```

### Transition Bands

Reuse existing zoom thresholds from the `ZOOM` constants:

| Transition      | Blend start          | Blend end            |
|-----------------|----------------------|----------------------|
| Macro → Meso    | `CONTINENT_FADE` (1.5) | `REGION_FULL` (2.5)  |
| Meso → Micro    | `REGION_FADE_OUT` (3.5) | `COUNTRY_FULL` (4.3) |

The blend factor `t` is computed the same way as `crossfadeOpacity`:
- `t = 0` → fully the "from" level
- `t = 1` → fully the "to" level
- Between → linear interpolation

### Adaptive Fill Function

Replace the current `getFill` callback with:

```ts
function getAdaptiveFill(
  isoCode: string,
  zoom: number,
  // pre-computed data:
  continentForCountry: Map<string, string>,   // isoCode → continent
  regionForCountry: Map<string, CulinaryRegion>, // isoCode → region (existing COUNTRY_TO_REGION)
  recipesByContinent: Map<string, number>,
  recipesByRegion: Map<CulinaryRegion, number>,
  recipesPerCountry: Map<string, number>,      // countryName → count
  countryNameForIso: Map<string, string>,       // isoCode → display name (from GeoJSON)
  maxContinent: number,
  maxRegion: number,
  maxCountry: number,
  isSepia: boolean,
): string
```

Logic:
1. Look up continent, region for the ISO code.
2. Compute three colors:
   - `macroColor = getChoroplethColor(continentCount, maxContinent, isSepia)`
   - `mesoColor = getChoroplethColor(regionCount, maxRegion, isSepia)`
   - `microColor = getChoroplethColor(countryCount, maxCountry, isSepia)`
3. Determine which transition band we're in:
   - `zoom < 1.5` → return `macroColor`
   - `1.5 ≤ zoom < 2.5` → lerp(macroColor, mesoColor, t1)
   - `2.5 ≤ zoom < 3.5` → return `mesoColor`
   - `3.5 ≤ zoom < 4.3` → lerp(mesoColor, microColor, t2)
   - `zoom ≥ 4.3` → return `microColor`
4. Return the computed color string.

### Color Lerp Utility

```ts
function lerpColor(colorA: string, colorB: string, t: number): string
```

Parses two `rgb(r, g, b)` strings, interpolates each channel, returns a new `rgb()` string. Since `getChoroplethColor` already returns `rgb()` format, this is straightforward.

### GeoJSON Country Name Lookup

The `getAdaptiveFill` needs to map ISO code → country display name (for the micro level lookup against `recipesPerCountry`). Two options:

- **Option A:** Build a `Map<isoCode, name>` from the GeoJSON on first load (inside the `Geographies` render callback). Cache in a ref.
- **Option B:** Pass `geo.properties.name` directly into the fill function from the render callback.

**Go with Option B** — simpler, no extra cache. The `getFill` callback already receives the geo object.

### Sepia Theme

No new sepia constants needed. `getChoroplethColor` already handles `isSepia` branching. The three levels all go through the same function, just with different count/max inputs.

### Performance Considerations

- The adaptive fill runs ~180 times per throttled render frame (~20fps during zoom gestures). Each call does: 2 map lookups + 3 color computations + 1 lerp. This is pure arithmetic with no allocations — negligible cost.
- If profiling reveals issues: quantize zoom to `Math.round(zoom * 5) / 5` and memoize the entire fill map per quantized zoom step.

---

## Part 2: Choropleth Legend

### Behavior

- **Container:** Always visible on desktop, hidden on mobile (`hidden sm:block`).
- **Position:** Bottom-left (`absolute bottom-4 left-4`), above where the breadcrumb sits on mobile (but breadcrumb is top-left on desktop, so no collision).
- **Hidden when:** Recipe sidebar is open (the sidebar occupies the left side).
- **Content crossfade:** The label text and gradient endpoints update with a CSS transition when the choropleth level changes. The container itself does not animate in/out.

### Visual Design

```
┌───────────────────────────────────┐
│  fewer  ┃━━━━━━━━━━━━━━┃  more   │
│        Recipes per region         │
└───────────────────────────────────┘
```

- Pill shape, matches existing overlay style: `bg-parchment/92 backdrop-blur-sm rounded-full shadow-md`
- Gradient bar: ~80px wide, 6px tall, rounded, rendered as a `<div>` with `background: linear-gradient(to right, lightColor, darkColor)`
- "fewer" / "more" labels in `text-xs text-brown-medium`
- Level label ("Recipes per continent/region/country") in `text-xs text-brown-medium`, centered below gradient
- All text and gradient colors transition via CSS `transition: all 0.4s ease`

### Level Detection

Derive the current display level from zoom:

```ts
function getChoroplethLevel(zoom: number): 'continent' | 'region' | 'country' {
  if (zoom < 1.5) return 'continent';
  if (zoom < 3.5) return 'region';
  return 'country';
}
```

During transition bands, the label shows the *target* level (the level being transitioned into) since that's where the user is heading.

### Component Interface

```tsx
function ChoroplethLegend({
  level,
  gradientFrom,
  gradientTo,
  hidden,
}: {
  level: 'continent' | 'region' | 'country';
  gradientFrom: string; // lightest choropleth color at current level
  gradientTo: string;   // darkest choropleth color at current level
  hidden: boolean;       // true when sidebar is open
}) 
```

### Gradient Endpoint Computation

The legend needs the actual lightest and darkest colors for the current level:
- `gradientFrom`: the color for count=0 (or 1) at the current level
- `gradientTo`: the color for count=max at the current level

During transition bands, these endpoints lerp between the two adjacent levels' endpoints (matching what the map is showing).

### Sepia Theme

The legend reads from the same `isSepia` state and passes sepia-appropriate colors. No additional sepia handling needed beyond what the choropleth already provides.

---

## Anticipated Issues & Mitigations

| Issue | Severity | Mitigation |
|-------|----------|------------|
| Region restructure touches many files | Medium | Methodical find-and-replace with type-checker as safety net; update Supabase data separately |
| Sparse micro-level data (most countries 0-1 recipes) | Low | Independent max normalization per level ensures even small differences produce visible gradient. Mock data tests this. |
| Color lerp during transitions may produce muddy intermediate colors | Low | Both endpoints use the same base hue (terracotta/brown family), so interpolation stays within the warm palette. Verify with mock data. |
| `onMove` handler triggers re-renders during zoom gestures | Low | Already throttled to 20fps. Adaptive fill is pure arithmetic. Monitor with React DevTools if concerned. |
| GeoJSON country names may not match recipe country names | Medium | Already an existing constraint (documented in CLAUDE.md). The mock data must use names that match the GeoJSON `properties.name` values. |
| Legend collision with breadcrumb on tablet breakpoints | Low | Breadcrumb moves to top-left at `sm:`. Legend is also `sm:` only. Test at 640px to confirm no overlap. |
| Oceania has no culinary region mapping | None | Falls through to `CHOROPLETH_EMPTY` at all levels — correct behavior. |

---

## Files Changed

| File | Change |
|------|--------|
| `lib/mock-recipes.ts` | **New** — mock recipe dataset (~40-50 entries) |
| `hooks/useRecipes.ts` | Add env var gate to return mock data |
| `lib/types.ts` | Region restructure: update `CulinaryRegion`, `CULINARY_REGION_ORDER`, `SubCulinaryRegion` |
| `lib/regions.ts` | Region restructure: update all region mappings, centers, labels, sub-region parents |
| `components/FilterPanel.tsx` | Update `REGIONS` array |
| `scripts/seed-mock.ts` | Update region names in seed data |
| `components/WorldMap.tsx` | Replace `getFill` with adaptive fill logic, add computed data hooks, pass legend props |
| `components/ChoroplethLegend.tsx` | **New** — legend component |
| `.env.local.example` | Add `NEXT_PUBLIC_USE_MOCK_DATA` entry |
