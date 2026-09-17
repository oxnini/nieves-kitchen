# Floating Navbar — design spec

**Date:** 2026-05-26
**Owner:** Nieves Yang
**Status:** Approved, ready for implementation plan

## Why

The current `components/Navbar.tsx` is a sticky full-bleed bar that breaks on mobile:

- On a ~390px iPhone width, its contents (`text-3xl` serif "Nieves' Kitchen" wordmark + 4 nav icons + passport + theme toggle) total ~480px wide. The flex row has no overflow handling, so the document scrolls horizontally.
- The `<nav>` is `position: sticky` (not `fixed`), so when the body scrolls horizontally, the parchment background scrolls with it. Beyond the viewport width the user sees the map underneath where the nav background should have been — reads as the background "breaking off and changing colour".
- Even without the overflow, the dense row of icon-only links above a translucent scrim feels like two stacked layers of UI fighting for attention with the chrome band right below it (breadcrumb + search pill + filter FAB).

Reference: Google Maps' mobile top bar — a single rounded floating element with margins on all sides, soft shadow, and a focused set of controls.

## Design

### Floating pill (mobile, ≤640px)

```
Position: fixed; top = 0.75rem + env(safe-area-inset-top); left/right = 0.75rem
z-index:  50
Shape:    rounded-full, height ~44px (tight — hugs its contents)
Surface:  bg-parchment/95 + backdrop-blur-md
Border:   1px solid var(--brown-light) at ~25% opacity
Lift:     box-shadow: 0 8px 24px -8px rgba(60, 40, 20, 0.18)
Padding:  px-3 py-1
```

Contents, left → right:

| Slot | Element |
|------|---------|
| 1 | Brand wordmark "Nieves' Kitchen" at `text-lg` (down from `text-3xl`), linked to `/` |
| 2 | `flex-1` spacer |
| 3 | `☰` menu button (lucide `Menu`, size 18), 36×36 — opens the anchored dropdown |
| 4 | `PassportAffordance` in **compact** variant (36px square; full-sized affordance stays in the legacy snapshot) |
| 5 | `ThemeToggle` (36×36, unchanged) |

All controls remain ≥44px tap targets by including inner padding even when the visible icon is smaller. The pill itself never scrolls horizontally — total width of its contents is bounded by the viewport less left/right margins.

**Iteration note (2026-05-28):** v1 used a 52px pill with the default 64px-tall `PassportAffordance` inside, which made the bar look top-heavy. Reduced to ~44px and added a `compact` prop to the affordance for use inside the floating pill. The legacy `/dev` A/B snapshot keeps the original size so the comparison still shows the original "thick" problem.

### Floating pill (desktop, ≥640px)

Same float treatment (fixed, margins, rounded-full, shadow), wider lozenge sized to fit a horizontal row. The `☰` menu button is hidden; the 4 routes return as inline links:

```
[Nieves' Kitchen]  [Explore]  [All Recipes]  [Favorites N]  [About]  [⊙]  [◐]
```

Active route gets the existing terracotta underline. Hover, focus, and active states match the current desktop behaviour.

### Menu dropdown (mobile only)

Triggered by `☰`. Rendered as an anchored card that drops down from the `☰` button.

**Iteration note (2026-05-28):** v1 used a full-width bottom sheet with a backdrop dim. The user's feedback after seeing it: takes up too much space, feels too heavy. Replaced with a small anchored dropdown card, no backdrop, outside-click to dismiss. This matches the lighter "Google Maps mobile" feel the spec was going for.

- **No backdrop.** The map (or page) underneath stays interactive visually; outside taps dismiss the menu.
- **Card:** `position: fixed; right = 0.75rem` (matches the pill's right margin), `top = pill-bottom + 6px`, width `~14rem`. Surface `bg-parchment` + `backdrop-blur-md`, `border border-brown-light/30`, `rounded-2xl`, shadow `0 12px 28px -10px rgba(60,40,20,0.22)`.
- **Rows:** one per route, each `min-h-[48px]`, layout `icon (size 18) + label (text-sm font-medium) + meta`. Inside padding `px-3 py-2`.
  - Favorites row shows the favorite count as a terracotta numeral on the right.
  - Active route: `bg-terracotta/10` background, label colour `brown-dark`, 2px terracotta bar pinned to the left edge of the row.
  - Inactive route: transparent background, `brown-medium` text, hover/press → `bg-brown-light/15`.
- **Animation:** scale-and-fade from `scale-95 opacity-0` to `scale-100 opacity-100` over 160ms `ease-out`, `transform-origin: top right` (anchored to the `☰` button). Honour `prefers-reduced-motion` by skipping the scale.
- **Dismiss triggers:** outside-pointer (any pointerdown outside the card and outside the trigger), Escape key, route selection. Focus returns to the `☰` button on close.
- **Focus management:** when the dropdown opens, focus moves to the first row. Focus is trapped inside while open.
- **No body scroll lock.** The dropdown is small enough that the page behind doesn't need to be frozen.

### Page padding for non-map routes

The map page (`/`) renders `WorldMapMobile` as `fixed inset-0 z-0`, so the floating pill simply overlays it — no body padding needed.

Other routes (`/recipes`, `/favorites`, `/about`) currently start their content directly under the old solid sticky navbar. With the new floating pill, they need top padding so the first content clears the pill on mobile:

- Add `pt-[5rem] sm:pt-[5.5rem]` to the top-level wrapper of each of those pages, OR add it once at `app/layout.tsx` body level. The layout-level approach is preferred — it keeps the page files clean and any future page inherits the correct padding automatically.

The recipe modal (`@modal/(.)recipes/[slug]`) is its own full-bleed overlay above z-50, so it's unaffected.

### Chrome band on `/` (unchanged but worth noting)

`WorldMapMobile.tsx` positions:

- Breadcrumb at `top-3 left-3`
- Search pill at `top-[calc(4.5rem+env(safe-area-inset-top))]` (centred)
- Filter FAB at `top-[calc(4.5rem+env(safe-area-inset-top))] right-3`

These all already sit below the y-range the floating pill occupies (`~0.75rem` top + safe-area, plus 52px height + a few px of breathing room ≈ ~4rem). They do not need to move. The pill's `z-50` keeps it above the breadcrumb's `z-10`.

## Visual iteration: `/dev/floating-navbar`

Per the established workflow (`feedback_visual_iteration_workflow.md`), build the new pill at `app/dev/floating-navbar/page.tsx` first, with:

- The new floating pill rendered over a placeholder map background (`bg-map-base` + a few country shapes is fine — no need for full topology).
- A toggle button that swaps in the current production `Navbar` for direct side-by-side comparison.
- Open the menu sheet by tapping `☰` so the full interaction can be exercised.

Once the user confirms it looks right on their phone via the dev route, swap `components/Navbar.tsx` for the new implementation in a single commit.

## Out of scope (v1)

- Drag-to-dismiss gesture on the menu sheet (handle is decorative).
- Animating the menu icon between `☰` ↔ `✕` states (the X is shown only on the sheet's own close affordance, if any).
- Restyling the chrome band or merging the search pill into the navbar.
- Anything about desktop nav beyond keeping current behaviour inside the new floating shell.

## Acceptance criteria

1. On a 390×844 iPhone viewport, no horizontal page scroll on any route.
2. Navbar pill stays inside left/right margins regardless of route or viewport width down to 320px.
3. Pill background never visually breaks (no parchment-to-map transition mid-row).
4. Tapping `☰` opens the bottom sheet; tapping any route navigates and closes the sheet; backdrop/Escape close without navigating.
5. Active route is visually indicated inside the sheet on mobile and via terracotta underline on desktop.
6. Non-map routes' first content sits below the pill — no overlap.
7. Sepia theme: pill surface uses the warm sepia parchment token, not pure white. Sheet inherits the same.
8. Type checking passes (`npx tsc --noEmit`).

## Files expected to change

- `components/Navbar.tsx` — full rewrite.
- New: `components/NavMenuSheet.tsx` — the bottom sheet component.
- `app/layout.tsx` — body-level top padding for non-map routes (or page-level if cleaner).
- `app/globals.css` — possibly a sepia override for the pill surface if needed.
- New: `app/dev/floating-navbar/page.tsx` — visual A/B preview route, lives alongside existing `/dev/*` siblings (cancellation, cook-mode, cooked-indicator, passport-cover, saudi-arabia-stamp).
