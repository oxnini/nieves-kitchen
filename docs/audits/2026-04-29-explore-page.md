# Explore Page — Technical Audit

_Date: 2026-04-29_
_Scope: home `/` route — `app/page.tsx`, `components/WorldMap.tsx`, `components/FilterPanel.tsx`, `.map-bg` styles in `app/globals.css`_

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2 | No keyboard zoom; SVG buttons lack focus rings; tooltip aria-live spam risk |
| 2 | Performance | 2 | Throttled rerender re-renders every Geography on every pan tick |
| 3 | Theming | 2 | `.map-bg` and sepia choropleth use hard-coded hex/rgb, not tokens |
| 4 | Responsive | 2 | No pan bounds; `h-[calc(100vh-72px)]` fragile; sidebar covers most of mobile map |
| 5 | Anti-Patterns | 2 | Dot-grid background, glassmorphism in 6+ places, nested cards, FAB-with-badge |
| **Total** | | **10/20** | **Acceptable — significant work needed** |

## Anti-Patterns Verdict

**Mixed pass.** Not full AI-slop, but several tells are dragging the page away from the brand brief:

- **Dot-grid map background** — `radial-gradient(circle, … 0.8px) 16px 16px` is the "graph paper" SaaS texture. CLAUDE.md explicitly says "publication, not product" and "no chalkboard fonts, burlap textures, or country-kitchen energy" — but the dot grid is the *opposite* failure: generic dashboard texture. A printed cookbook map would have a paper tone, not a grid.
- **Glassmorphism everywhere** — `bg-parchment/92 backdrop-blur-sm` on breadcrumb, hover tooltip, tap feedback, empty state, hint, search, sidebar. The impeccable rules ban "glassmorphism everywhere."
- **Nested cards** — sidebar (rounded-2xl) → recipe button (rounded-xl) → image (rounded). Three nested radii.
- **Floating action button with circular count badge** — generic SaaS pattern, not editorial.
- **Pill-shaped everything** — `rounded-full` on breadcrumb, hint, tooltip, tap feedback, FAB, chips, difficulty pills, region labels. Monotonous pill rhythm.

---

## Executive Summary

**Issues**: 1 P0, 7 P1, 9 P2, 4 P3.

**Top 5 critical issues:**
1. **No pan/zoom bounds** — `ZoomableGroup` has only `maxZoom={12}`; no `minZoom`, no `translateExtent`. Drag carries the map off-screen with no rubber-band.
2. **Dot-grid background betrays brand** — reads as dashboard, not cookbook.
3. **No keyboard zoom** — pinch/wheel only. Keyboard users cannot zoom in/out at all.
4. **Theme tokens skipped** in `.map-bg` and `SEPIA_CHOROPLETH` — hard-coded hex/rgb literals.
5. **Re-render storm** during pan: `rerender()` fires every 50ms; every Geography re-runs `getFill` (which itself depends on `zoom`), recomputing choropleth interpolation for every country every tick.

---

## Detailed Findings

### P0 — Blocking

**[P0] Map can be dragged into infinite empty space**
- **Location**: `components/WorldMap.tsx:781-792` (`ZoomableGroup`)
- **Category**: Responsive / UX
- **Impact**: User can lose the map entirely; no recovery affordance besides the breadcrumb "World" button (which they may not associate with reset).
- **Recommendation**: Add `minZoom` and `translateExtent` matched to the projected world bbox so d3-zoom refuses to pan past the edges.
- **Suggested command**: `/harden`
- **Status (2026-04-29)**: ✅ Addressed — `WORLD_EXTENT` + `MIN_ZOOM=0.8` applied; continent label fade adjusted so labels stay readable at low zoom.

### P1 — Major

**[P1] Dot-grid map background conflicts with brand direction**
- **Location**: `app/globals.css:263-267` and the sepia variant at `:140-143`
- **Category**: Anti-Pattern
- **Impact**: Reads as "data-viz dashboard," undercuts the "printed cookbook / editorial" primary aesthetic in CLAUDE.md.
- **Recommendation**: Replace with a subtle paper texture or a flat warm tint. Options: a soft `radial-gradient` vignette tinted toward terracotta; a noisy SVG paper texture at very low opacity; a faint engraved-style line weave; or simply a flat parchment with a 1–2px inset shadow at the page edge. Drop the geometric grid.
- **Suggested command**: `/quieter` then `/polish`

**[P1] No keyboard zoom controls**
- **Location**: `components/WorldMap.tsx` — entire map
- **Category**: Accessibility (WCAG 2.1.1 Keyboard)
- **Impact**: Keyboard-only users cannot zoom in/out. The only programmatic entry points are the breadcrumb and continent labels.
- **Recommendation**: Add a small +/− stepper (and "reset" button) somewhere unobtrusive — e.g. bottom-right above the FAB. Wire to `zoomTo` with the current center.
- **Suggested command**: `/harden`

**[P1] Re-render storm during pan/zoom**
- **Location**: `components/WorldMap.tsx:412-424` (`handleMove` calling `rerender()`); `getFill` at `:587-617`
- **Category**: Performance
- **Impact**: Every 50ms during a pan, every Geography path re-renders and `getFill` recomputes. Choropleth `lerpColor` runs hundreds of times per frame.
- **Recommendation**: (a) Memoize `getFill` per-geography by zoom band rather than continuous zoom; (b) split the live-zoom-driven layer (markers/labels/opacity) from the static Geography layer so `<Geographies>` only re-renders on zoom-band crossings; (c) consider rounding `liveZoomRef` to 2 decimals before triggering re-render.
- **Suggested command**: `/optimize`

**[P1] Theme tokens bypassed in `.map-bg` and sepia choropleth**
- **Location**: `app/globals.css:264-265` (literal `#F5F0E4`, `oklch(0.88 0.012 65)`); `components/WorldMap.tsx:108-112` (literal rgb/hex constants for sepia)
- **Category**: Theming
- **Impact**: Sepia/parchment swap is incomplete — the map base color does not flow from tokens, so future theme tweaks miss the map.
- **Recommendation**: Promote map-base and choropleth colors to tokens in `@theme` (`--color-map-base`, `--color-choropleth-base`, `--color-choropleth-empty`). Reference them everywhere.
- **Suggested command**: `/polish` (theming pass)

**[P1] First-visit hint says "Click" — wrong verb on touch**
- **Location**: `components/WorldMap.tsx:1048`
- **Category**: Accessibility / UX writing
- **Impact**: On phones/tablets the instruction is literally inaccurate.
- **Recommendation**: "Tap a continent to start exploring" — touch verbs work for mouse users too. Or detect `(pointer: coarse)`.
- **Suggested command**: `/clarify`

**[P1] Sidebar covers most of the mobile map**
- **Location**: `components/WorldMap.tsx:1078` — `w-[calc(100vw-1.5rem)] max-w-72`
- **Category**: Responsive
- **Impact**: On a 375px phone the sidebar takes ~93% of the screen, hiding the very map context the user just clicked into. The "passport" mental model breaks.
- **Recommendation**: On mobile, render the recipes as a bottom sheet (slide up from the bottom, ~50% height) rather than a left panel. Keep left-panel behavior at `sm:` and up.
- **Suggested command**: `/adapt`

**[P1] Glassmorphism overuse**
- **Location**: 6+ instances of `bg-parchment/9X backdrop-blur-sm` in WorldMap and MapSearch
- **Category**: Anti-Pattern
- **Impact**: The page reads "tech UI" rather than "editorial cookbook."
- **Recommendation**: Pick *one* surface treatment (e.g. solid parchment with a hairline 1px border) and use it for breadcrumb, tooltip, hint, empty state. Reserve translucency for the sidebar only, if at all.
- **Suggested command**: `/quieter`

### P2 — Minor

**[P2] `h-[calc(100vh-72px)]`** in `app/page.tsx:27` hardcodes navbar height. Use `dvh` and a CSS variable for navbar height to avoid mobile chrome jumps. → `/adapt`

**[P2] Multiple bottom-anchored overlays stack at `bottom-3 / bottom-4 / bottom-14`**: breadcrumb (mobile), hint, tap feedback, empty state, FAB. Two of these can collide. → `/layout`

**[P2] `aria-live="polite"` hover tooltip** at `:999-1015` re-announces on every hover; can spam screen readers during map exploration. Use `aria-live="off"` or only announce on focus, not hover. → `/harden`

**[P2] SVG button focus rings missing** on continent/region/country `<g role="button" tabIndex={0}>` (`outline: 'none'` is set explicitly). Keyboard focus is invisible. → `/harden`

**[P2] No `prefers-reduced-motion` honored**: `zoomTo` always animates 700ms cubic; framer-motion components don't check the media query either. → `/harden`

**[P2] Hard-coded magic numbers in label width**: `region.length * 5.5 + 30` at `:938` is fragile across fonts/locales. Use `<text>` + `getBBox`, or render a `<foreignObject>` with HTML for layout. → `/polish`

**[P2] Difficulty pill colors use `text-sage` on `bg-sage/30`** at `:1123-1126` — same-hue washed-out text on translucent same-hue background. Low contrast risk. → `/audit` (re-check) → `/colorize`

**[P2] Country marker text has no background plate** (`:975-980`) — small 11px label drawn directly over the choropleth, contrast varies wildly with map color. → `/polish`

**[P2] Filter FAB lives at `right-5 bottom-6`** while the breadcrumb sits at `bottom-3 left-3` on mobile; with the empty state or hint also at `bottom-14`, the bottom edge is busy. → `/layout`

### P3 — Polish

- **[P3]** `ZOOM_ANIMATION_DURATION` (700ms) is on the long side for frequent zoom-to-continent — consider 450–550ms with `easeOutQuart`. → `/animate`
- **[P3]** `localStorage` keys (`nieves-map-hint-v2`, `nieves-filters-v2`) duplicate the hint/pulse-dismissal pattern. Tiny shared hook would help. → `/polish`
- **[P3]** `Infinity` sentinels in `crossfadeOpacity` are fine but noisy; consider a separate `oneSidedFade` helper for clarity. → `/polish`
- **[P3]** Mercator at high latitudes distorts clickable area badly — Greenland is hidden but Russia/Canada are still huge. Consider switching to `geoEqualEarth` or `geoNaturalEarth1`. → `/critique`

---

## Patterns & Systemic Issues

- **Translucent-parchment pill is the default UI**: 6+ overlays share `bg-parchment/9X backdrop-blur-sm rounded-full`. The breadcrumb, hint, tooltip, tap feedback, and empty state are visually identical containers — no hierarchy.
- **Hard-coded colors in two of three theme code paths**: tokens exist (`@theme` in globals.css) but the map base, choropleth bases, and sepia choropleth all bypass them.
- **SVG interactive elements skip the standard a11y checklist**: outline removed, no visible focus state, no `aria-pressed` for selected continent.
- **Bottom-edge real estate is contested**: at least 5 components anchor near `bottom-3..16` and any combination can co-exist.

## Positive Findings

- Zoom-band logic with sequential, non-overlapping fades is genuinely well thought through.
- Good use of `useMemo` for derived recipe maps.
- Breadcrumb is keyboard-accessible with proper focus rings.
- Filter panel has a real focus trap and Escape handling — that's rare and right.
- Tap feedback for mobile (where hover doesn't work) is a thoughtful touch.
- The first-visit hint with persistent dismissal is the correct UX for a novel interaction.

---

## Recommended Actions

1. **[P0] `/harden`** — ✅ Pan/zoom bounds applied (2026-04-29). Remaining: +/−/reset stepper, focus rings on SVG buttons, `prefers-reduced-motion`, calmer `aria-live`.
2. **[P1] `/quieter`** — Replace dot-grid `.map-bg` with a calmer paper-tone surface; reduce the 6 glassmorphism overlays to one shared treatment.
3. **[P1] `/optimize`** — Decouple Geography rendering from per-tick zoom updates; memoize `getFill` per zoom band; round live zoom before re-render.
4. **[P1] `/adapt`** — Convert the recipe sidebar to a bottom sheet on mobile; replace `100vh-72px` with `dvh` + a navbar-height CSS variable.
5. **[P1] `/clarify`** — Fix "Click a continent" → tap-friendly copy; review map microcopy.
6. **[P2] `/layout`** — De-conflict the bottom-edge stack (breadcrumb, FAB, hint, empty state, tap toast).
7. **[P2] `/colorize`** — Re-check difficulty pill contrast; consider plate behind country marker text.
8. **[P2] `/polish`** — Migrate `.map-bg` and sepia choropleth to design tokens; fix the magic-number label widths.
9. **Final `/polish`** — Catch-all alignment/spacing pass after the above land.
