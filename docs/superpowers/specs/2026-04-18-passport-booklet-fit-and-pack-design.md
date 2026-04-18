# Passport Booklet — Fit-to-Viewport & Two-Half Packing — Design

**Status:** Draft pending user review
**Date:** 2026-04-18
**Area:** `components/passport/*`

## Context

The passport booklet (shipped in `2026-04-18-passport-booklet-redesign-design.md`) currently uses a fixed 3:2 aspect ratio with `max-w-5xl`, one sub-region per full spread, and stamps that are roughly 4× larger than the design calls for. Users must scroll to see the full booklet, and pages feel sparse because a single region — even a small one — occupies both halves of a spread.

This follow-up redesign addresses:

1. The booklet must fit the viewport without scrolling.
2. Each spread becomes two independent halves, allowing two small regions to share one spread or a large region to span multiple halves.
3. Stamps shrink to ~25% of their current size (4 per row per half).
4. The cover and back cover mimic a closed physical passport — a single centered panel, not a full spread.

## Goals

- Booklet always fully visible in the viewport regardless of screen dimensions.
- Stamp density ~16 stamps per half (4×4 grid), consistent across all region pages.
- No barren halves — small regions pair up; medium regions get decorative filler; large regions overflow.
- Cover and back cover read as a closed passport; inside-front and region pages read as an open passport.
- Keep existing flip animation, keyboard/swipe nav, URL deep-linking, and the cooked-recipes modal.

## Non-Goals

- No changes to the data model (`lib/passport.ts`, `recipes` table, stamps persistence).
- No changes to the cooked-recipes modal or favorites behavior.
- No new decorative assets (flags, maps for filler) — filler can be typography + existing tokens; real art is a future iteration.
- No changes to `/recipes` or `/favorites` routes.

## Decisions

### 1. Sizing & viewport fit

- The booklet is sized by `min(width-fit, height-fit)` so it is always fully visible.
- A single **half-page** has fixed physical dimensions in the open or closed state (a passport cover doesn't change size when opened).
- Open spread aspect ratio is **1.4:1** (two halves, each 0.7:1 portrait). Closed cover / back cover aspect ratio is **0.7:1**.
- Viewport fit is computed against the *open* state (worst case). The resulting half-size is reused for the closed cover.
- Approximately 24px outer margins; the booklet is centered horizontally within the remaining viewport below the navbar and above the page indicator.

### 2. Page structure

Pages in order:

1. **Cover** — single centered half-panel (closed passport front).
2. **Inside-front spread** — two halves (legend + summary, as today).
3. **Region spreads** — two halves each, populated by the packer below.
4. **Back cover** — single centered half-panel (closed passport back).

### 3. Packing algorithm

Sub-regions are processed in `SUB_REGION_ORDER`. Each half has a capacity of **16 stamps** (4 cols × 4 rows). Pack rules:

- **Small (≤8 countries):** may share a half with the next small region, split by a horizontal divider. Each still gets its own header. Only two small regions per half (both must be ≤8 and total ≤16).
- **Medium (9–16 countries):** occupies its own half. Empty grid rows are replaced with a decorative filler band (typography-only for v1).
- **Large (>16 countries):** overflows across subsequent halves. Continuation halves show the same header with a `(cont'd)` suffix. A large region can span as many halves as needed.

After packing, if the final region ends on a left half, a blank right-hand endpaper is inserted before the back cover so the back cover opens as a single panel.

A half contains *either* one region block (possibly a continuation) *or* two small region blocks — never a mix.

### 4. Open/close animation

- **Initial state:** closed — cover half visible, centered.
- **Opening:** clicking the cover (or →) flips the cover to the left-half position; the booklet's visible width grows from half to full spread; inside-front appears on the right. Uses the existing framer-motion 3D `rotateY` primitive.
- **Mid-book flips:** spread-to-spread, unchanged from current implementation.
- **Closing at the end:** flipping past the last region spread reveals the back cover as a single half; booklet visibly shrinks from full-spread to single panel.
- **Reduced motion:** cross-fade only, as today.

## Component Changes

### New / refactored

- **`BookletShell`** — accepts `openState: 'closed' | 'open'`. Computes overall size via `min()` of viewport fit against the open spread's aspect ratio. Renders a single-half-wide panel when closed, full-spread when open. Publishes a CSS custom property `--stamp-size` that drives all inner scaling. Uses a `ResizeObserver` tied to `window` resize.
- **`usePassportSpreads`** — replaces `usePassportPages`. Returns `SpreadDescriptor[]`. Each spread has a `kind` (`'cover' | 'inside-front' | 'region' | 'back-cover' | 'blank-endpaper'`) and, for region spreads, `left` and `right` `HalfDescriptor`s. Packing logic lives here.
- **`HalfDescriptor`** — `{ kind: 'region-half'; blocks: RegionBlock[] }` where `blocks` is 1 entry for medium/large regions or 2 entries for paired small regions. Each block holds `{ subRegion, countries, isContinuation }`.
- **`SpreadView`** (new component, extracted from `renderPage` inline function) — dispatches on `SpreadDescriptor.kind` and renders the appropriate layout.
- **`RegionHalf`** (new, rescoped from `SubRegionSpread`) — renders one half: either one full region (optionally with filler) or two paired region blocks separated by a horizontal divider.
- **`useBookletNav`** — navigates by spread index. URL slug (`?spread=<slug>`) uses the *left* region's slug when a spread contains two small regions. Cover/back-cover omit the slug as today. Flip timings remain (cover flips slower).
- **`Spread.tsx`** — default to `withSpine={true}` for region spreads (the spine is now a meaningful divider between the two halves' regions); cover/back-cover do not use `Spread`.

### Adjusted in place

- **`CountryStampSlot`** — removes all responsive breakpoints (`sm:`, `md:`). All sizes (including text) are expressed as `calc(var(--stamp-size) * k)` or `em` relative to a font-size driven by `--stamp-size`. Rotation range reduced from ±6° to ±3° to avoid clipping at 25% scale. Internal padding unchanged.
- **`InsideFrontSpread`** — kept as one component, but internally lays out as two halves with the spine divider between them (matches new spread conventions).
- **`CoverPage`** and **`BackCoverSpread`** — rendered at half-width via `BookletShell`'s `openState`. No logic changes; any layout that currently assumes full-spread width must use half-width tokens driven by `--stamp-size`.

### Deleted

- **`SubRegionSpread`** — replaced by `RegionHalf`.
- **`usePassportPages`** — replaced by `usePassportSpreads`.

### Unchanged

- `PaperTexture`, `NavChevrons`, `PageIndicator`, `StampedRecipesModal`, the stamp SVG filter, `lib/passport.ts`, `hooks/useCookedStamps.ts`.

## Architecture

```
PassportBooklet
 ├─ PaperTexture
 ├─ BookletShell (openState from current spread.kind)
 │   └─ AnimatePresence
 │       └─ SpreadView (dispatches on SpreadDescriptor.kind)
 │           ├─ CoverPage                      (kind === 'cover')
 │           ├─ InsideFrontSpread              (kind === 'inside-front')
 │           ├─ Spread
 │           │   ├─ RegionHalf (left)          (kind === 'region')
 │           │   ├─ Spine
 │           │   └─ RegionHalf (right)
 │           └─ BackCoverSpread                (kind === 'back-cover')
 ├─ NavChevrons
 ├─ PageIndicator
 └─ StampedRecipesModal
```

Data flow:

```
useRecipes + useCookedStamps
    → usePassportSpreads(recipes, summary) → SpreadDescriptor[]
    → useBookletNav(spreads) → { index, flip, jumpTo, bindSwipe, ... }
    → SpreadView consumes spreads[index] + handlers
```

## Testing

No test suite is configured in this repo. Manual verification checklist:

- Booklet fits viewport at 1920×1080, 1440×900, 1280×720, 375×667 (mobile), 768×1024 (tablet) with no scroll.
- Stamps render at 4 per row per half, 4 rows, with consistent scaling across viewports.
- Cover appears as a single centered panel; opening animates to full spread.
- Back cover appears as single panel after the last region spread.
- A small region (e.g. a sub-region with 3 countries) pairs with the next small region on the same half.
- A large region (e.g. 30+ countries) overflows across halves with `(cont'd)` labels.
- Keyboard (← →), swipe, and chevron navigation all flip by spread.
- `?spread=<slug>` deep link lands on the correct spread and renders stamps correctly.
- Cooked / uncooked clicks still open the modal / navigate to `/recipes?country=`.
- Reduced-motion users see cross-fades, not 3D rotations.

## Open Risks

- **Mobile height.** A very short viewport (e.g. landscape phone) with `min()` fit may produce stamps too small to read country names. Mitigation: enforce a minimum `--stamp-size`; below that threshold, let the booklet scroll horizontally as a fallback. Decide during implementation with real measurements.
- **Packing edge cases.** If the final region is exactly 1 large region with an odd number of halves, we may need two blank endpapers. Packer test cases should cover: zero sub-regions, one small region, one region that exactly fills 16, one region that fills 17.
- **Animation for closed→open.** Going from a half-width to full-width booklet while flipping is non-trivial; may require a two-phase animation (width grow, then flip) or a single composed animation. Implementation will pick.
