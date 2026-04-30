# Explore Page P1 Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all six P1 issues from the 2026-04-29 Explore Page audit — UX copy, theming, glass overuse, performance, accessibility, and mobile layout.

**Architecture:** All changes are confined to `components/WorldMap.tsx`, `components/MapSearch.tsx`, `app/globals.css`, and `lib/regions.ts`. Tasks are ordered from simplest to most complex and are independently committable. No new files needed.

**Tech Stack:** Next.js 15 (App Router), React, TypeScript, Tailwind v4, Framer Motion, react-simple-maps.

---

## File Map

| File | What changes |
|------|--------------|
| `components/WorldMap.tsx` | Hint copy, glassmorphism, SEPIA_CHOROPLETH removal, zoom quantization, zoom controls UI, sidebar layout |
| `components/MapSearch.tsx` | Glassmorphism (3 instances) |
| `app/globals.css` | Add `--color-map-base` token; update `.map-bg` |
| `lib/regions.ts` | Export SEPIA_CHOROPLETH constants |

---

## Task 1: Fix "Click" verb in first-visit hint

**Files:**
- Modify: `components/WorldMap.tsx` (line 1132)

- [ ] **Step 1: Edit the hint text**

In `components/WorldMap.tsx`, find:
```jsx
<span>Click a continent to explore its recipes</span>
```
Replace with:
```jsx
<span>Tap a continent to explore its recipes</span>
```

- [ ] **Step 2: Verify**

Run `npm run dev`, open the app in an incognito window (so `nieves-map-hint-v2` is not set), wait 1.2 s for the hint to appear. Confirm it says "Tap" on screen.

- [ ] **Step 3: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "fix(map): change hint verb from Click to Tap"
```

---

## Task 2: Promote map colors to theme tokens

The `.map-bg` rule hard-codes `#F5F0E4` (the same as `--color-parchment`) and the sepia choropleth constants live only in `WorldMap.tsx`. This task moves them to `lib/regions.ts` (choropleth) and `globals.css` (map background).

**Files:**
- Modify: `app/globals.css`
- Modify: `lib/regions.ts`
- Modify: `components/WorldMap.tsx`

- [ ] **Step 1: Add `--color-map-base` to the CSS theme**

In `app/globals.css`, inside the `@theme { ... }` block (after the existing color tokens, around line 16), add:
```css
  --color-map-base: #F5F0E4;
```

In `[data-theme="sepia"] { ... }` (around line 38), add:
```css
  --color-map-base: var(--color-parchment-dark);
```

- [ ] **Step 2: Update `.map-bg` to reference the token**

In `app/globals.css` (around line 265–267), change:
```css
.map-bg {
  background-color: #F5F0E4;
```
to:
```css
.map-bg {
  background-color: var(--color-map-base);
```

- [ ] **Step 3: Export sepia choropleth constants from `lib/regions.ts`**

In `lib/regions.ts`, after the existing `CHOROPLETH_EMPTY` export (around line 5), add:
```ts
export const SEPIA_CHOROPLETH_BASE  = { r: 94, g: 176, b: 200 };
export const SEPIA_CHOROPLETH_LIGHT = '#2E3638';
export const SEPIA_CHOROPLETH_EMPTY = '#2A3133';
```

- [ ] **Step 4: Import the new exports in `WorldMap.tsx` and remove inline constants**

In `components/WorldMap.tsx`, update the import from `@/lib/regions` to include the new names:
```ts
import {
  COUNTRY_TO_REGION, COUNTRY_NAME_TO_REGION, REGION_CENTERS, REGION_LABEL_POSITIONS,
  CHOROPLETH_BASE, CHOROPLETH_LIGHT, CHOROPLETH_EMPTY,
  SEPIA_CHOROPLETH_BASE, SEPIA_CHOROPLETH_LIGHT, SEPIA_CHOROPLETH_EMPTY,
} from '@/lib/regions';
```

Delete the inline `const SEPIA_CHOROPLETH = { ... }` block (lines 107–111):
```ts
// DELETE this entire block:
const SEPIA_CHOROPLETH = {
  base: { r: 94, g: 176, b: 200 },
  light: '#2E3638',
  empty: '#2A3133',
};
```

- [ ] **Step 5: Update `getChoroplethColor` to use the new names**

In `getChoroplethColor` (lines 113–125), replace every `SEPIA_CHOROPLETH.base`, `SEPIA_CHOROPLETH.light`, `SEPIA_CHOROPLETH.empty`:

```ts
function getChoroplethColor(recipeCount: number, maxCount: number, isSepia: boolean): string {
  const base = isSepia ? SEPIA_CHOROPLETH_BASE : CHOROPLETH_BASE;
  const light = isSepia ? SEPIA_CHOROPLETH_LIGHT : CHOROPLETH_LIGHT;
  if (recipeCount === 0) return light;
  const t = recipeCount / maxCount;
  const maxIntensity = isSepia ? 0.55 : 0.65;
  const intensity = 0.35 + maxIntensity * t;
  const lightR = isSepia ? 58 : 235, lightG = isSepia ? 44 : 220, lightB = isSepia ? 34 : 205;
  const r = Math.round(base.r * intensity + lightR * (1 - intensity));
  const g = Math.round(base.g * intensity + lightG * (1 - intensity));
  const b = Math.round(base.b * intensity + lightB * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}
```

Also update the `getFill` return for unmapped countries (around line 667):
```ts
if (!region) return isSepia ? SEPIA_CHOROPLETH_EMPTY : CHOROPLETH_EMPTY;
```

- [ ] **Step 6: Verify**

Run `npm run dev`. Toggle between parchment and sepia themes. Confirm the map background switches correctly (parchment in light, `--color-parchment-dark` in sepia). Confirm choropleth colors still render correctly in both themes.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css lib/regions.ts components/WorldMap.tsx
git commit -m "refactor(map): promote map-base and sepia choropleth colors to named exports/tokens"
```

---

## Task 3: Remove glassmorphism — 9 instances across WorldMap and MapSearch

Replace every `bg-*/9X backdrop-blur-*` instance with a solid surface + hairline border. The sidebar gets a solid opaque background (no blur). The dark hint banner goes fully opaque.

**Files:**
- Modify: `components/WorldMap.tsx` (6 instances)
- Modify: `components/MapSearch.tsx` (3 instances)

### WorldMap.tsx changes

- [ ] **Step 1: Breadcrumb nav (line ~803)**

Find:
```
bg-parchment/92 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md
```
Replace with:
```
bg-parchment border border-brown-light/20 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-sm
```

- [ ] **Step 2: Hover tooltip (line ~1085)**

Find:
```
className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-parchment/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-medium text-brown-dark pointer-events-none z-10 hidden sm:block"
```
Replace with:
```
className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-brown-light/20 px-4 py-2 rounded-full shadow-sm text-sm font-medium text-brown-dark pointer-events-none z-10 hidden sm:block"
```

- [ ] **Step 3: Tap feedback (line ~1110)**

Find:
```
className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-parchment/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-medium text-brown-dark pointer-events-none z-10 sm:hidden"
```
Replace with:
```
className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-parchment border border-brown-light/20 px-4 py-2 rounded-full shadow-sm text-sm font-medium text-brown-dark pointer-events-none z-10 sm:hidden"
```

- [ ] **Step 4: First-visit hint (line ~1130)**

Find:
```
className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-brown-dark/90 backdrop-blur-sm text-parchment px-5 py-2.5 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-2 pointer-events-auto"
```
Replace with:
```
className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-brown-dark text-parchment px-5 py-2.5 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-2 pointer-events-auto"
```

- [ ] **Step 5: Empty state (line ~1146)**

Find:
```
className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-parchment/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md text-center z-10 max-w-xs"
```
Replace with:
```
className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-brown-light/20 px-5 py-3 rounded-2xl shadow-sm text-center z-10 max-w-xs"
```

- [ ] **Step 6: Recipe sidebar (line ~1162)**

Find:
```
className="absolute top-14 left-3 bottom-3 sm:top-16 sm:left-4 sm:bottom-4 w-[calc(100vw-1.5rem)] max-w-72 bg-parchment/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto z-10"
```
Replace with (this is the pre-bottom-sheet version; Task 6 will change the layout classes):
```
className="absolute top-14 left-3 bottom-3 sm:top-16 sm:left-4 sm:bottom-4 w-[calc(100vw-1.5rem)] max-w-72 bg-parchment border border-brown-light/20 rounded-2xl shadow-xl overflow-y-auto z-10"
```

### MapSearch.tsx changes

- [ ] **Step 7: Search FAB (collapsed state, line ~275)**

Find:
```
className="bg-parchment/92 backdrop-blur-sm p-2.5 rounded-full shadow-md text-brown-medium hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
```
Replace with:
```
className="bg-parchment border border-brown-light/20 p-2.5 rounded-full shadow-sm text-brown-medium hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
```

- [ ] **Step 8: Search input bar (expanded state, line ~178)**

Find:
```
<div className="flex items-center gap-2 bg-parchment/92 backdrop-blur-sm pl-3 pr-2 py-2 rounded-full shadow-md">
```
Replace with:
```
<div className="flex items-center gap-2 bg-parchment border border-brown-light/20 pl-3 pr-2 py-2 rounded-full shadow-sm">
```

- [ ] **Step 9: Search dropdown (line ~202)**

Find:
```
<div className="absolute top-full right-0 mt-2 w-72 bg-parchment/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden z-20">
```
Replace with:
```
<div className="absolute top-full right-0 mt-2 w-72 bg-parchment border border-brown-light/20 rounded-xl shadow-xl overflow-hidden z-20">
```

- [ ] **Step 10: Verify**

Run `npm run dev`. Hover over countries, trigger a search, open the sidebar. Confirm all floating surfaces look solid and editorial (no frosted glass effect). Check in both parchment and sepia themes.

- [ ] **Step 11: Commit**

```bash
git add components/WorldMap.tsx components/MapSearch.tsx
git commit -m "fix(map): replace glassmorphism with solid surfaces and hairline borders"
```

---

## Task 4: Performance — reduce re-render storm during pan/zoom

Two targeted changes: (a) round the live zoom value before triggering a re-render so throttled renders are less frequent in practice; (b) quantize zoom to 0.25-step bands for `getFill`'s `useCallback` dependency so the function reference only changes ~4× per zoom unit instead of every render tick.

**Files:**
- Modify: `components/WorldMap.tsx`

- [ ] **Step 1: Round live zoom in `handleMove`**

Find `handleMove` (around line 462). Change:
```ts
liveZoomRef.current = z;
```
to:
```ts
liveZoomRef.current = Math.round(z * 100) / 100;
```

- [ ] **Step 2: Compute choropleth zoom band and use it in `getFill`**

Find where `zoom` and `center` are derived from refs (around lines 455–456):
```ts
const zoom   = liveZoomRef.current;
const center = liveCenterRef.current;
```

Add the band value immediately after:
```ts
const zoom   = liveZoomRef.current;
const center = liveCenterRef.current;
// Quantized zoom for choropleth — only changes every 0.25 units, reducing getFill recreation
const choroplethZoomBand = Math.round(zoom * 4) / 4;
```

- [ ] **Step 3: Update `getFill` to use `choroplethZoomBand`**

Find `getFill` (around line 662). Replace the two `blendFactor` calls that use `zoom`:
```ts
const t1 = blendFactor(zoom, ZOOM.CONTINENT_FADE, ZOOM.REGION_FULL);
const t2 = blendFactor(zoom, ZOOM.REGION_FADE_OUT, ZOOM.COUNTRY_FULL);
```
with:
```ts
const t1 = blendFactor(choroplethZoomBand, ZOOM.CONTINENT_FADE, ZOOM.REGION_FULL);
const t2 = blendFactor(choroplethZoomBand, ZOOM.REGION_FADE_OUT, ZOOM.COUNTRY_FULL);
```

And update the `useCallback` dependency array — remove `zoom`, add `choroplethZoomBand`:
```ts
  [recipesByContinent, maxContinentCount, recipesByRegion, maxRegionCount,
   recipesPerCountry, maxCountryCount, isSepia, choroplethZoomBand],
```

Also update the unmapped-country empty fill line so it doesn't reference the old `zoom`:
```ts
if (!region) return isSepia ? SEPIA_CHOROPLETH_EMPTY : CHOROPLETH_EMPTY;
```
(This line doesn't use `zoom`, so it's unchanged — just confirm it compiles.)

- [ ] **Step 4: Verify**

Run `npm run dev`. Pan and zoom aggressively. In Chrome DevTools → Performance, record a 3-second pan. Confirm frame times have improved (fewer long tasks). Choropleth blending should still work correctly — colors should still transition smoothly between zoom bands at the expense of slightly stepwise transitions (imperceptible at 0.25-unit granularity).

- [ ] **Step 5: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "perf(map): quantize choropleth zoom band to reduce getFill recreation frequency"
```

---

## Task 5: Add keyboard zoom controls

Add a +/−/↺ control group in the bottom-right corner. Wire to the existing `zoomTo` and `resetView` functions. Uses the same solid-surface style established in Task 3.

**Files:**
- Modify: `components/WorldMap.tsx`

- [ ] **Step 1: Add zoom controls JSX**

Find the choropleth legend block (around line 1073):
```jsx
      {/* ── Choropleth legend ── */}
      <ChoroplethLegend
```

Insert the zoom controls just before it:
```jsx
      {/* ── Keyboard zoom controls ── */}
      <div
        role="group"
        aria-label="Map zoom controls"
        className="absolute bottom-14 right-3 sm:bottom-4 sm:right-4 z-10 flex flex-col gap-1"
      >
        <button
          onClick={() => zoomTo({ coordinates: center, zoom: Math.min(zoom * 1.5, 12) })}
          aria-label="Zoom in"
          className="w-8 h-8 flex items-center justify-center bg-parchment border border-brown-light/20 shadow-sm rounded text-brown-dark text-lg font-light leading-none hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta select-none"
        >
          +
        </button>
        <button
          onClick={() => zoomTo({ coordinates: center, zoom: Math.max(zoom / 1.5, MIN_ZOOM) })}
          aria-label="Zoom out"
          className="w-8 h-8 flex items-center justify-center bg-parchment border border-brown-light/20 shadow-sm rounded text-brown-dark text-lg font-light leading-none hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta select-none"
        >
          −
        </button>
        <button
          onClick={resetView}
          aria-label="Reset map view"
          className="w-8 h-8 flex items-center justify-center bg-parchment border border-brown-light/20 shadow-sm rounded text-brown-medium text-base leading-none hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta mt-0.5 select-none"
        >
          ↺
        </button>
      </div>

      {/* ── Choropleth legend ── */}
      <ChoroplethLegend
```

- [ ] **Step 2: Verify keyboard accessibility**

Run `npm run dev`. Tab to the zoom controls. Confirm:
- `+` zooms in, `−` zooms out, `↺` resets to world view
- Focus rings are visible (terracotta outline)
- Controls are positioned above the filter FAB on mobile (bottom-14)
- Controls work with keyboard Enter key

- [ ] **Step 3: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat(map): add keyboard-accessible zoom controls (+/−/↺)"
```

---

## Task 6: Mobile sidebar → bottom sheet

On viewport widths below `sm` (640 px), the recipe sidebar currently spans ~93 % of screen width as a left panel, hiding the map. This task renders it as a full-width bottom sheet at 50 % height. Above `sm` the left-panel layout is preserved.

**Files:**
- Modify: `components/WorldMap.tsx`

- [ ] **Step 1: Update `SIDEBAR_VARIANTS` animation**

Find (around lines 285–293):
```ts
const SIDEBAR_VARIANTS = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};
const SIDEBAR_TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};
```

Replace with:
```ts
const SIDEBAR_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 16 },
};
const SIDEBAR_TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};
```

- [ ] **Step 2: Update sidebar layout classes**

Find the `motion.aside` className (around line 1162). It currently reads (after Task 3's glassmorphism fix):
```
className="absolute top-14 left-3 bottom-3 sm:top-16 sm:left-4 sm:bottom-4 w-[calc(100vw-1.5rem)] max-w-72 bg-parchment border border-brown-light/20 rounded-2xl shadow-xl overflow-y-auto z-10"
```

Replace with:
```
className="absolute bottom-0 left-0 right-0 h-1/2 sm:top-16 sm:left-4 sm:bottom-4 sm:right-auto sm:w-72 sm:h-auto bg-parchment border border-brown-light/20 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-y-auto z-10"
```

- [ ] **Step 3: Verify on mobile viewport**

Run `npm run dev`. In DevTools, switch to a 375 × 812 iPhone viewport. Click a country with recipes. Confirm:
- The sidebar slides up as a bottom sheet (~50 % screen height)
- The map remains visible above the sheet
- Recipes are scrollable within the sheet
- The close button is accessible

Then resize to desktop (≥ 640 px). Confirm the left-panel layout is unchanged.

- [ ] **Step 4: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat(map): render recipe sidebar as bottom sheet on mobile"
```

---

## Self-review checklist

- [x] **Spec coverage:** All 6 P1 issues have a corresponding task.
  - No keyboard zoom → Task 5
  - Re-render storm → Task 4
  - Theme tokens bypassed → Task 2
  - "Click" verb on touch → Task 1
  - Sidebar covers mobile map → Task 6
  - Glassmorphism overuse → Task 3

- [x] **Placeholder scan:** No TBDs, all steps have full code.

- [x] **Type consistency:** `SEPIA_CHOROPLETH_BASE`, `SEPIA_CHOROPLETH_LIGHT`, `SEPIA_CHOROPLETH_EMPTY` named consistently in Task 2 Steps 3–5. `choroplethZoomBand` introduced in Task 4 Step 2 and referenced in Step 3.

- [x] **Task 3 dependency:** Task 3 Step 6 (sidebar glassmorphism) must run before Task 6 Step 2 (sidebar layout) so the base className is correct. Tasks are ordered accordingly.
