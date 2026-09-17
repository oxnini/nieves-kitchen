# Mobile World Map Overhaul — Design

**Date:** 2026-05-24 (revised 2026-05-25)
**Status:** Approved (C+ pivot), partial implementation in progress
**Scope:** Mobile-only redesign of the world map (`/` route). Desktop behaviour unchanged.

## Pivot history

| Date | Pivot | Reason |
| --- | --- | --- |
| 2026-05-24 | Original Option A: portrait 900×1600 viewBox + top chip strip with all 11 regions. | Reclaim full viewport, make any region one tap away. |
| 2026-05-25 | **Option C+: landscape 1600×900 viewBox with east–west wrap + thin bottom region rail + top-left breadcrumb + first-visit coachmark.** | Spike at `/dev/mobile-map-c-plus` showed Option A still felt cramped — a portrait phone slice of a portrait viewBox shows ~120° of longitude even at default zoom, which lost too much of the "world" feeling. Triple-rendering a landscape world unlocks free east–west panning; moving region navigation to a thin bottom rail keeps the map as hero and converts "navigation chrome" into "ambient escape valve". |

The rest of this spec describes the **C+ design**. Decisions superseded by the pivot are flagged inline.

## Goals

The mobile world map today letterboxes a desktop-shaped SVG into ~⅓ of the phone screen, renders labels at ~3–4px effective size, and freezes during pan/zoom because every interaction repaints ~250 country geographies. The user described it as basically unusable on phone.

This redesign:

1. Reclaims the full mobile viewport (no letterbox, no white space top/bottom).
2. Makes the map itself the primary interaction surface — pan/pinch/double-tap are the natural verbs — with a thin bottom rail as the ambient escape valve to any region.
3. Bumps label sizes ~5× so they're actually legible at a glance.
4. Cuts the per-pan render cost so pan/zoom stays at 60fps on mid-range phones, even with the triple-rendered wrap.
5. Preserves the cooked-country hatch overlay (passport-on-map is a brand signature).
6. Touches desktop only via a careful refactor of shared math into hooks.

## Decisions reached during brainstorming + C+ pivot

| Decision | Choice | Reason |
| --- | --- | --- |
| Scope | One unified mobile overhaul, single spec | Multiple issues share a root cause (desktop-sized SVG on a phone); fixing piecemeal would mean reworking the same code 3–4 times. |
| Layout | Full-bleed map under a floating translucent navbar | Reclaims the lost ~⅔ of vertical screen. Reads as native-app, fits the editorial-cookbook brand. |
| Map viewBox | **Landscape 1600×900 with east–west wrap (triple-rendered)** ~~(was: portrait 900×1600)~~ | A portrait viewBox shows ~120° of longitude at default zoom on a phone slice, which loses the "whole world" feel. Landscape + wrap lets the user swipe freely around the globe without hitting an edge. |
| Region navigation | **Thin bottom region rail + top-left breadcrumb + first-visit coachmark** ~~(was: top chip strip with name + count)~~ | The chip strip ate a band of the viewport and read as primary navigation, which competed with the map. A 32px rail with quiet typography stays ambient, the breadcrumb says "you're here", and the coachmark teaches the gesture vocabulary. |
| Active-region detection | Closest region centre to current pan centre; rail auto-scrolls active chip into view | Cheap, deterministic, and works under free pan. |
| Zoom hierarchy | **Flat: dots fade in at zoom 1.7, names+counts at zoom 2.2; no map-rendered region or continent labels** ~~(was: 3-level continent → region → country drill-down with map labels at each level)~~ | The rail + breadcrumb already name the region; map-rendered region pills duplicated that role and crowded the canvas. Continent/region labels still drive the choropleth fill blend, just not the label layer. |
| Country tap gating | Country taps only register at zoom ≥ 1.7 (dot-visible band) | At world view, fingertips overlap several countries; gating prevents misfires. |
| Per-region tap zoom | `REGION_TAP_ZOOM` table (1.5–2.4) instead of a single `ZOOM.COUNTRY_FULL` | A portrait phone slice of a landscape viewBox needs different math per region: Western Europe wants 2.4 (small dense cluster), North America wants 1.5 (huge sprawl). |
| Cooked-hatch overlay | Keep on mobile, optimise it | Passport-on-map is signature brand. Perf is solvable. |
| Code architecture | Split into `WorldMapMobile.tsx` + `WorldMapDesktop.tsx`, shared hooks | Mobile diverges enough (chrome, perf, layout) that one branched file would balloon past 1800 LOC and let the two flows break each other. |

## Architecture

### File layout

**Built / promoted to production (C+ shape):**
- `components/WorldMapMobile.tsx` — mobile shell. Owns the canvas, bottom region rail, top-left breadcrumb, first-visit coachmark, recipe sheet. Promoted from the validated spike at `components/dev/MobileMapCPlus.tsx`.
- `components/map/MobileMapCanvas.tsx` — mobile-tuned SVG. Landscape 1600×900 viewBox, triple-rendered worlds at lng offsets −1600 / 0 / +1600 for seamless east–west wrap, single-pass cooked-hatch overlay, country markers only (no region/continent label layer). Promoted from the spike at `components/dev/MobileMapCPlusCanvas.tsx`.
- `components/WorldMapDesktop.tsx` — byte-identical rename of today's `WorldMap.tsx`. No behaviour change.
- `hooks/useMobileMapPosition.ts` — mobile-only controlled position + zoom animation + wrap-aware `zoomTo`. Built fresh during Phase 1 to keep desktop's position math untouched. Extended in the C+ promotion with a `wrapLongitude: true` option that normalises lng back into `[-180, 180]` on `onMoveEnd` and picks the shorter wrap direction when animating between far-apart points.
- `hooks/useChoroplethFill.ts` — per-zoom blended fill computation. Extracted from current `WorldMap.tsx`.
- `hooks/useTheme.ts` — small read-only theme hook backed by a module-level signal, replaces the `MutationObserver` in current `WorldMap.tsx`.

**Retired:**
- `components/map/RegionChipStrip.tsx`, `components/map/RegionChip.tsx` — never built. Superseded by the inline bottom region rail in `WorldMapMobile`. (If the rail grows enough to deserve its own file, split it later.)
- `components/dev/MobileMapCPlus.tsx`, `components/dev/MobileMapCPlusCanvas.tsx`, `app/dev/mobile-map-c-plus/` — deleted at promotion.

**Modified:**
- `components/WorldMap.tsx` — becomes a thin router: `useIsMobile() ? <WorldMapMobile/> : <WorldMapDesktop/>`. Same public API (`recipes`, `isLoading`, `flyTo`).
- `components/Navbar.tsx` — gains a mobile-only translucent treatment (`bg-parchment/70 backdrop-blur-md`). Desktop unchanged.
- `components/ThemeToggle.tsx` — writes to the new `useTheme` signal in addition to (or instead of) `document.documentElement.dataset.theme`.

**Unchanged:**
- `app/page.tsx`, `app/layout.tsx`, all routes (other than the temporary `/dev/mobile-map-c-plus`).
- `MapSearch`, `ChoroplethLegend`, `FilterPanel`.
- `lib/regions.ts`, `lib/types.ts`, all data hooks (`useRecipes`, `useCookedStamps`, etc.).
- All passport / stamp / theming behaviour.

### Desktop guarantee

Desktop's *intended* state after this change is "byte-identical visual and behavioural output." The only desktop touch is:

1. The rename `WorldMap.tsx` → `WorldMapDesktop.tsx`.
2. Extraction of `useMapPosition`, `useChoroplethFill`, `useTheme` into shared hooks consumed by the renamed desktop component.

To minimise regression risk, these refactors land in their own commit, separate from any mobile work. Verification: manually exercise zoom/pan/region click/breadcrumb/hover tooltip/sidebar on the desktop dev server pre- and post-refactor.

## Layout

### Vertical zones

```
┌─────────────────────────────────────────┐  ← top: 0
│ Navbar — fixed, bg-parchment/70,        │     z-30, ~56px tall
│ backdrop-blur-md                        │
├─────────────────────────────────────────┤
│ [Region] breadcrumb chip (top-left)     │     z-10, ~30px tall, floats
│                                         │
│ Map canvas — fixed, inset-0,            │     z-0, fills 100dvh
│ bg-map-base. Renders UNDER navbar +     │     under chrome
│ rail thanks to z-order. Vignette        │
│ overlay above the map, below chrome.    │
│                                         │
│              (no zoom buttons —         │     pinch + double-tap only
│              pinch + double-tap)        │
│                                         │
│  [coachmark — first visit only,         │     z-30, above rail
│   "Swipe to wander, double-tap to       │     auto-dismiss after 3s or
│   dive in"]                             │     on first pan
│                                         │
│  [recipe sheet — floats above rail,     │     z-30, 12px gap above rail
│   8px map-gap, rounded corners]         │     when a country is selected
├─────────────────────────────────────────┤
│ Bottom region rail — fixed inset-x-0,   │     z-20, ~32px tall,
│ bg-parchment/75 backdrop-blur-md,       │     h-scroll list of region
│ h-scroll, no scrollbar                  │     names, active gets terracotta
└─────────────────────────────────────────┘  ← respects safe-area-inset-bottom

Search pill + filter FAB sit in the same top band on mobile (see "Mobile top
chrome band" below), not at the bottom of the screen.
```

### Sizing

- Map container: `fixed inset-0 bg-map-base`. Escapes its parent so it can go full-bleed regardless of `app/page.tsx`'s height constraints.
- Navbar (mobile only): `fixed top-0 inset-x-0 z-30 bg-parchment/70 backdrop-blur-md`.
- Breadcrumb: `absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-parchment/80 backdrop-blur-md border border-brown-light/25 shadow-sm`. Reads the closest region centre via `findClosestRegion(liveCenter)` and shows the region name (or `World` when far from any region centre).
- Bottom region rail: `absolute bottom-0 inset-x-0 z-20 bg-parchment/75 backdrop-blur-md border-t border-brown-light/25`, ~32px tall, with `paddingBottom: max(0.25rem, env(safe-area-inset-bottom))`.
- Vignette: `absolute inset-0 pointer-events-none z-[1]`, radial gradient that holds focus on the centre and softens the wrap-zone seams.
- Top safe area: chrome stacks under any iOS notch automatically because of `fixed top-0`.
- Filter FAB: **top-right icon-only on mobile** at `top-[calc(4.5rem+env(safe-area-inset-top))] right-3`. The "Filters" text label is hidden on mobile so the button is a compact ~44×44 square; the slider icon and badge count carry the meaning. This keeps the FAB next to the search pill in the same top band without crowding the expanded search field. Desktop preserves the bottom-right pill (`sm:bottom-6 sm:right-5`) with the full "Filters" label.

  **Why moved out of bottom-right (2026-05-26 M8):** the bottom-right FAB would clash with the rail's terracotta underline and with the floating recipe sheet's right edge. Putting all three primary affordances (breadcrumb, search, filter) in the same chrome band below the navbar reads as a single piece of furniture instead of three floating islands. The icon-only collapse on mobile is the trade-off that lets a centred search pill expand cleanly without overlapping the FAB.
- Map's `translateExtent` is intentionally wide-open (~±4000 SVG units on x) so the user can swipe deep into the wrap zone before `onMoveEnd` snaps lng back into `[-180, 180]`. Translation snap is invisible because the duplicate worlds already cover the seam.

### Mobile viewBox + east–west wrap

Today: `1600 × 800` (2:1) shared with desktop. On a 390×680 phone, this letterboxes to ~390×195.

Mobile (C+): `1600 × 900` landscape, **rendered three times** at lng offsets `−1600 / 0 / +1600`. With `preserveAspectRatio="xMidYMid slice"`, a portrait phone slice crops east–west and fills both axes — no letterbox top or bottom. Pan across the seam reveals the duplicate world; on `onMoveEnd` the shell normalises `lng` back into `[-180, 180]`, which is visually invisible because the next render of the three copies puts a country in the same screen pixel.

Constants:

| Constant | Value | Notes |
| --- | --- | --- |
| `C_VIEWBOX_WIDTH` | `1600` | Same width as desktop. |
| `C_VIEWBOX_HEIGHT` | `900` | Landscape. |
| `C_PROJ_SCALE` | `1600 / (2π)` ≈ `254.6` | World fits exactly inside the viewBox width; world height (2π × scale) overflows vertically by ~700 units, cropping >±60° latitude (no recipes up there anyway). |
| `C_WORLD_WIDTH` | `1600` | Used as the offset between the three rendered copies. |
| `M_DEFAULT_ZOOM` | `0.95` | Frames the inhabited world so all of South America, all of Africa, and all of Western Europe fit in one portrait frame. Visible vertical viewBox span = `900 / zoom` ≈ 947 units (lat ~−60 to ~+80); horizontal span on a typical phone aspect ~125° lng. (Was briefly `1.05` 2026-05-26 morning, but smoke testing said SA's western coast and southern tip clipped — bumped out 10% to `0.95`.) |
| `M_DEFAULT_CENTER` | `[-15, 22]` | Lat 22° puts the proj-y midpoint of the inhabited lat band at viewport centre. Lng −15° balances the Atlantic so South America's western coast and Africa's eastern edge both stay in frame at zoom 0.95; Madrid (~lng −4°) still reads as right-of-centre. |
| `M_PAN_EXTENT.x` | `viewBox/2 ± 4000` | Very wide so swiping into the wrap zone feels free. |
| `minZoom` / `maxZoom` | `0.9` / `12` | `minZoom` raised to sit just below `M_DEFAULT_ZOOM=0.95` so pinch-out has a small bit of tactile give but never reveals the empty parchment that the old `0.7` floor exposed. The landing zoom IS the curated "look at the whole world" framing; there's nothing useful to see further out. |

> The canvas-side constants are prefixed `M_*` in the shipped code (`MobileMapCanvas.tsx`) — they were renamed from `C_*` when the C+ spike was promoted out of `components/dev/`. The spec keeps the `M_` names for clarity.

### Crossfade thresholds (`C_ZOOM`)

| Threshold | Zoom | Triggers |
| --- | --- | --- |
| `DOT_FADE_IN` | `1.3` | Country marker dots start fading in. |
| `DOT_FULL` | `1.7` | Dots fully visible; country taps become live (gating threshold). |
| `LABEL_FADE_IN` | `1.4` | Country name + count text starts fading in next to the dot. (Was `2.2`; lowered 2026-05-25 so every `REGION_TAP_ZOOM` value lands at or above `LABEL_FULL`, i.e. tapping any region produces fully opaque labels rather than the previous 0–50% fade.) |
| `LABEL_FULL` | `1.7` | Country labels fully visible. (Was `2.8`.) Coupled with the floor on `REGION_TAP_ZOOM` — every region must zoom to ≥ `LABEL_FULL`. |
| `REGION_FULL` | `2.5` | Choropleth fill blend pivots from region → country. |
| `REGION_FADE_OUT` | `3.2` | Region-band of the choropleth blend ends. |
| `COUNTRY_FULL` | `3.6` | Choropleth fully country-keyed. |

There are **no map-rendered continent labels, region labels, or region pills**. The breadcrumb (top-left) and rail (bottom) name the user's location; the map is left clean.

### Label and marker sizing (target on-screen pixels at default zoom)

| Element | Target | Today (effective) |
| --- | --- | --- |
| Breadcrumb (HTML, top-left) | 12px small-caps | n/a |
| Bottom rail chip | 11px small-caps (`tracking-[0.14em]`) | n/a |
| Country marker dot | 10px ⌀ (`r=10` SVG; scaled by `1/zoom`) | ~1.8px |
| Country marker text (`Country · N`) | 28px SVG (~12–14 px on screen at zoom 1.7–2.8) | ~3px |
| Coachmark | 14px body, parchment background | n/a |

All on-map sizes are computed as `SVG_UNITS / liveZoom` (via `markerScale = 1/zoom`) so they stay constant on-screen as the user zooms. Country labels alternate `y = -24` and `y = +32` by lng-sorted index — this de-overlaps dense east-west clusters (Europe especially) at zoom 1.7–2.8.

For north-south clusters (Cyprus/Egypt, Thailand/Vietnam) the alternation alone wasn't enough; both labels landed in the gap *between* the two dots. The canvas additionally runs a per-zoom-band AABB collision pass over the projected label boxes and hides the "loser" of each colliding pair (fewer recipes; lexicographic tie-break) until the user zooms in far enough to separate them on screen. The hidden set is memoised by zoom band (`round(z*4)/4`) so it doesn't churn during pinch.

## Bottom region rail

A thin, ambient escape valve — not the primary navigation. Pan/pinch/double-tap is what the user is meant to reach for; the rail exists for users who don't yet trust the gestures or want a fast jump.

### Content

Eleven items, in `CULINARY_REGION_ORDER` from `lib/types.ts`:

`Western Europe · Eastern Europe · East Asia · Southeast Asia · South Asia · Middle East · North Africa · Sub-Saharan Africa · North America · South America · Oceania`

No `World` chip. Resetting to the world view is done by panning out, double-tapping into a region you don't want, or by the breadcrumb (future enhancement — see Risks).

### Visual

- Container: `bg-parchment/75 backdrop-blur-md border-t border-brown-light/25`, ~32px tall.
- Each entry: `<button role="tab">`, `px-3 py-1.5`, `font-body text-[11px] uppercase tracking-[0.14em]`, region name only (no count — counts crowd the rail and the breadcrumb already tells you where you are).
- Inactive: `text-brown-medium`. Hover: `text-brown-dark`.
- Active: `text-terracotta` + 2px terracotta underline rendered as an absolutely-positioned `<span>` 0.5px below the chip.
- Empty regions (count = 0 after filters): `opacity-50`, still tappable.

### Scroll behaviour

- `overflow-x-auto`, `scrollbar-none`.
- On pan, the active region updates from `findClosestRegion(liveCenter)` and the active chip auto-scrolls into view: `chipRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })`. The rail effectively follows the user's gaze across the globe.

### Tap behaviour

- Tap region → `zoomTo({ coordinates: REGION_CENTERS[region].center, zoom: REGION_TAP_ZOOM[region] })` with the per-region table below. Clears `selectedCountry`.

### Per-region tap zoom (`REGION_TAP_ZOOM`)

A portrait phone slice of a 1600×900 viewBox is narrow vertically, so a single `ZOOM.COUNTRY_FULL` value is wrong for everyone. Each region gets a target zoom that yields ~50–70° of visible longitude (roughly "the region fills the screen, with breathing room"). All values are floored at `LABEL_FULL` (1.7) so every region tap produces 100% opaque labels.

| Region | Zoom | Centre override (mobile-only) |
| --- | --- | --- |
| Western Europe | 2.8 | `[0, 48]` — shifted west so UK/Iberia/France/Germany are the dominant content; eastern Balkans deliberately fall off so Eastern Europe is visibly different. |
| Eastern Europe | 2.8 | `[25, 52]` — Poland/Ukraine/Romania/Balkans/western Russia. UK no longer in frame; that was the 2026-05-25 trade once smoke testing said WE/EE looked identical. |
| East Asia | 1.7 | — (lowered from 1.8 so western China clears the frame) |
| Southeast Asia | 2.2 | — |
| South Asia | 2.2 | — |
| Middle East | 2.2 | — |
| North Africa | 1.8 | — |
| Sub-Saharan Africa | 2.0 | — |
| North America | 1.7 | — (floored at `LABEL_FULL`) |
| South America | 1.7 | `[-58, -20]` — shifted south so Tierra del Fuego clears the bottom rail; northern frame clips at southern Mexico, which is fine for a "South America" view. |
| Oceania | 1.7 | — (lowered from 1.8 so Australia's outline plus the Pacific islands fit in one frame) |

`REGION_TAP_CENTER` in `WorldMapMobile.tsx` is a partial override map — regions absent from it fall back to `REGION_CENTERS[region].center` (shared with desktop). This keeps mobile reframing from disturbing the desktop drill-down.

### Active-region detection

- `findClosestRegion(liveCenter)` — Euclidean distance in `[lng, lat]` space to each `REGION_CENTERS[r].center`. Same primitive as desktop's drill-down.
- The breadcrumb shows the same region name (or `World` if `findClosestRegion` returns null — currently it always returns a closest region, so `World` is only shown by the breadcrumb during the initial coachmark hint).

### Accessibility

- `<nav aria-label="Jump to culinary region">` wrapper around an `sr-only` list of region buttons (the visible rail uses `role="tablist"` + `role="tab"`). Buttons announce as "Region, N recipe(s)" — pluralised at N=1.
- Each visible button: `aria-selected={isActive}`.
- Empty regions: `aria-disabled="true"` and `opacity-50` on both the sr-only and visible rail buttons; sr-only buttons also `disabled` so screen readers skip the activation noise.
- Arrow-left / arrow-right move focus between visible chips when the rail has focus (deferred until after the smoke test).
- **Map keyboard control** (M7 addition): the `MobileMapCanvas` wrapper is `tabIndex={0}` with `role="application"` and `aria-label="Interactive world map. Arrow keys pan, plus and minus zoom."`. Arrow keys pan ~60/zoom° of longitude / 30/zoom° of latitude per press; `+`/`=` zoom in 1.5×, `-`/`_` zoom out, clamped to `[0.9, 12]`. Keyboard handler emits via `onMoveEnd` so the shell's `useMobileMapPosition` stays the single source of truth.
- **Recipe sheet focus management** (M7 addition): on open the sheet's close button receives focus; on close focus is restored to whatever was focused before opening (typically the rail chip that triggered the pan), with a fallback to the currently-active rail chip if the original element is gone. Country markers are SVG circles with no tabindex so they can't be focused back directly.

## Top-left breadcrumb

Always-visible "you are here" badge.

- `absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-parchment/80 backdrop-blur-md border border-brown-light/25 shadow-sm`.
- Content: the active region name (from `findClosestRegion(liveCenter)`), in `font-heading text-xs font-medium text-brown-dark tracking-wide`.
- `aria-hidden="true"` because the sr-only nav already announces the same information.

## First-visit coachmark

A teaching hint, shown once per device, for the new gesture vocabulary.

- Position: `absolute left-1/2 -translate-x-1/2 bottom-[88px] z-30` (sits above the rail, doesn't overlap the recipe sheet).
- Visual: `px-4 py-2.5 rounded-full bg-parchment/95 backdrop-blur-md border border-brown-light/30 shadow-lg`, slow `animate-pulse` (2.4s).
- Content: `"Swipe to wander, double-tap to dive in"`. (No em dashes — see CLAUDE memory.)
- Dismiss: tap, OR first pan (lng/lat differs from `C_DEFAULT_CENTER`), OR auto after 3000 ms.
- Persistence: `localStorage["nieves-mobile-map-coach-seen"] = "1"` on dismiss.
- v1 visual: text + an emoji finger pointer (`👆`). v2 (follow-up): replace with an animated finger SVG that taps the rail then drags across the map.

## Map vignette

Soft warm shadow that focuses the eye on the centre and hides the wrap-zone seam without a hard mask.

- `absolute inset-0 pointer-events-none z-[1]`.
- `background: radial-gradient(ellipse 140% 140% at 50% 50%, transparent 38%, var(--map-vignette) 100%)`.
- `--map-vignette` is the existing token, deeper in sepia.

## Map interactions

### Gestures

| Gesture | Behaviour |
| --- | --- |
| One-finger drag | Pan. Freely swipeable east–west thanks to triple-rendered worlds; `onMoveEnd` normalises lng back into `[-180, 180]` invisibly. |
| Two-finger pinch | Zoom centred on pinch midpoint. `minZoom: 0.85`, `maxZoom: 12`. |
| Country tap | Opens the recipe sheet for that country — **only when `liveZoom >= 1.7` (`DOT_FULL`)**. Below that, country taps are no-ops so users don't misfire when several countries sit under one fingertip at world view. |
| Double-tap | Step zoom in 1.5× centred on tap. If resulting zoom would still be below `C_ZOOM.REGION_FULL` (2.5), instead fly to the closest region centre using `REGION_TAP_ZOOM[region]` (avoids zooming into ocean). Built via touch-time-stamp pattern in `MobileMapCanvas` (280ms gap, 32px tolerance); tap-vs-drag classifier (≤250ms, ≤12px drift) keeps it from competing with pan. |
| Long press 500ms | Out of scope for v1. Revisit after smoke test if users ask for it. |
| Left-edge swipe | No-op. Reserved for iOS back gesture; `touch-action: none` is on the SVG, not page edges. |

### Recipe sheet

The sheet **floats above the bottom rail** rather than anchoring to the screen edge. This keeps the rail visible (so the user can still see "which region am I in") and reads as a card lifted off the page rather than a sheet glued to the chrome.

- Container: `absolute bottom-[52px] left-3 right-3 z-30 bg-parchment border border-brown-light/30 rounded-2xl shadow-[0_18px_40px_-12px_rgba(60,40,20,0.32)] flex flex-col max-h-[55dvh] overflow-hidden`.
- 8px map-gap between rail top and sheet bottom; full rounded corners on all four sides; warm-toned shadow.
- Header: country name + recipe count + close (X) button.
- Body: scrollable list of recipe cards (96×96 image, name, time, difficulty pill). Each card is a `<Link>` to `/recipes/[id]` with `onPointerEnter={() => router.prefetch(...)}`.
- `max-h-[55dvh]` so the rail and breadcrumb remain visible even when the sheet is full.
- Closes on the X button or when a different country is tapped (the sheet swaps in place).
- **No drag-to-expand in v1.** The sheet is tap-only; if smoke testing shows users want a fuller view, that's a follow-up (was original plan Task 9).

## Performance strategy

The mid-range-phone target is smooth 60fps pan/zoom with no freezes. Identified bottlenecks and fixes:

1. **Triple-rendered worlds = 3× the country paths.** The C+ wrap renders the topology three times per repaint. Even with `<Geography>` memoisation this is the biggest new cost the design adds. **Mitigations (in priority order):**
   - **Bake a simplified `topology-low.json`** (Mapshaper `−simplify dp 10%`, ~⅓ of the original size) and use it for the two duplicate copies; the real-zoom copy keeps the full-resolution topology. The seam is invisible at world zoom because the duplicates aren't centred under the user.
   - During an active pan/pinch, render only the centre copy and re-mount the wrap copies on `onMoveEnd`. The blink across the seam is acceptable cost for 60fps; landing zoomed-in means the wrap copies are off-screen anyway.
   - Hide the cooked-hatch layer entirely on the two duplicate copies (only the centre copy gets hatch). Wrap copies show choropleth only.
2. **`getFill` recomputed per geography per render.** Replaced with a `fillByCountry: Map<string, string>` keyed on `[choroplethZoomBand, isSepia, recipeCount]`. Built once per zoom band, reused for ~250 country lookups. **Done (Phase 1).**
3. **`MutationObserver` for theme detection.** Replaced by `useTheme()` hook backed by a module-level signal written from `ThemeToggle`. `MutationObserver` deleted. **Done (Phase 1).**
4. **Throttle is too generous + rerenders the whole tree.** `handleMove` throttle is one `requestAnimationFrame` (~16ms) in the spike. Future: subscribe zoom-dependent display values to `liveZoomRef` via `useSyncExternalStore` so the full tree no longer rerenders during pan.
5. **Inline `style` objects on every `<Geography>`.** Lifted to module-level constants in the canvas. Where dynamic, branched to one of 2–3 precomputed objects. **Done in spike.**
6. **Viewport culling for geographies.** Today only markers are viewport-filtered. Mobile additionally filters `geographies` against the current viewport using each country's bounding box (`d3-geo`'s `geoBounds`). At country-level zoom, ~10 countries render instead of ~250. Compounds well with the triple-render — once you're zoomed in past `REGION_FULL`, the wrap copies cull to zero.
7. **Cooked-hatch pattern density.** Pattern unit is `9` SVG units in the spike (vs `3.6` desktop). Less dense, still reads as "visited," halves rasterisation cost per hatched country.
8. **`zoomToRef` reassignment.** A ref holds the latest `zoomTo` closure (kept in sync via `useLayoutEffect`), and the exposed callback reads the ref. Identity stays stable across renders so consumers can `useEffect` on it safely.

Fixes 2–8 live in shared hooks and benefit desktop too as a side effect. Fix 1 is mobile-only (only mobile triple-renders).

**Fallback if real-device testing falls short:** during active pan/zoom, drop the wrap copies and only re-mount them on `onMoveEnd`. The seam is briefly visible mid-pan; acceptable.

## Bug fixes folded in

- **"White line" glitch when zooming.** Caused by `WORLD_EXTENT` numbers keyed off the desktop viewBox. The C+ canvas keeps `translateExtent` deliberately wide (~±4000 on x) and lets the triple-rendered worlds cover any seam, eliminating the visible white line at all zoom levels.
- **`MapSearch` placement** on mobile is a floating pill at top-center under the navbar (`top-[calc(4.5rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2`). Breadcrumb anchors top-left, search pill top-center, filter FAB top-right — three balanced zones in the same band below the navbar. Implemented via a `containerClassName` prop on `MapSearch` so the desktop centring (`top-9 left-1/2 -translate-x-1/2 -translate-y-1/2`) isn't disturbed.
- **First-visit hint** is replaced by the coachmark: `"Swipe to wander, double-tap to dive in"`. Auto-dismisses; persists to localStorage.
- **Empty-filter-state banner** repositions above the rail on mobile (avoids fighting the sheet).
- **Explicit zoom controls (+/−/↺)** are dropped on mobile. Pinch + double-tap are the canonical mobile zoom verbs; the coachmark teaches them once.

## Out of scope

- Recipe modal interception (`@modal/(.)recipes/[slug]`) — works as-is.
- Anonymous Supabase session bootstrapping.
- Passport overlay, passport stamps, cooked-recipe tracking.
- `FilterPanel` UX — stays as right-side drawer triggered by FAB.
- Desktop UX in general.
- `app/page.tsx` layout / height (mobile escapes its parent via `fixed inset-0`).
- Tablet treatment. `useIsMobile()` is true below 640px; tablet keeps the desktop layout. If tablet feels wrong later, that's a follow-up.

## Risks and open questions

- **Triple-render perf on mid-range Android.** The single biggest open risk. Mitigations listed in Performance §1. Measure on a real device before deciding which fallbacks to ship.
- **`World` reset affordance.** The rail has no `World` chip. Resetting to the world view currently requires pinch-out or panning past every region. If smoke testing shows users hunt for an explicit reset, add a tap-on-breadcrumb behaviour (`breadcrumb.onClick → zoomTo(DEFAULT_CENTER, DEFAULT_ZOOM)`).
- **Double-tap discoverability.** The coachmark teaches the gesture and the gesture is now wired. Smoke-test that "fingertip taps in quick succession" reliably register on actual phones — a v1 follow-up could replace the static coachmark with an animated finger demo (Task M6 in the plan).
- **Hook extraction regression risk.** Mitigated by landing the extraction in its own commit, separate from mobile work, with manual desktop smoke testing.
- **`max-h-[55dvh]` for the recipe sheet** behaves well on iOS 16+. Older iOS may need a fallback to `vh`. Defer until tested.
- **Coachmark a11y.** Auto-dismiss after 3s can break screen-reader pacing. Consider keeping it visible until first interaction when `prefers-reduced-motion` is true.

## Definition of done

1. Mobile viewport (≤640px) shows the new full-bleed C+ map: landscape wrap, bottom rail, top-left breadcrumb, first-visit coachmark, floating recipe sheet.
2. Desktop viewport (≥640px) is visually and behaviourally identical to pre-change (verified by side-by-side dev-server comparison).
3. Pan/zoom hold 60fps on iPhone 11-class hardware during free pan across the wrap seam and during rail-tap fly-in.
4. East–west wrap is seamless: panning across the date line never flashes a white edge.
5. Country labels readable at zoom 1.7–2.8 (≥14px screen pixels).
6. Cooked-hatch overlay still visible on stamped countries (at least on the centre copy).
7. All routes still work (`/`, `/recipes`, `/favorites`, etc.).
8. The `/dev/mobile-map-c-plus` scratch route and `components/dev/` files are deleted.
9. `npx tsc --noEmit` passes. (Project's lint script is broken; see memory.)
10. Double-tap-to-zoom is built and matches the coachmark promise.
