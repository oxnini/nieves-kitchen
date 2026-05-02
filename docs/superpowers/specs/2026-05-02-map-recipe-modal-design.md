# Map Recipe Modal — Design Spec

**Date:** 2026-05-02
**Status:** Awaiting user review

## Problem

On the Explorer page (`/`), clicking a country marker opens a sidebar of recipes. Clicking a recipe currently calls `router.push('/recipes/[id]')`, which navigates away from the map entirely. The user loses their zoom level, country selection, and the exploratory context. Returning requires the back button and a remount of the map.

The user's intent at this moment is exploratory ("does this recipe look good? do I have the ingredients?"), not committed ("I am cooking this"). The current flow forces a commitment they haven't made yet.

## Goal

Clicking a recipe from the map opens the recipe as a modal overlay on top of the map. The map state is preserved underneath. Dismissal is one click/keypress. Switching to a sibling recipe is fast. When the user *does* commit, an explicit affordance opens the full page.

The `/recipes` grid behavior is unchanged — that surface is for committed reading, not peeking.

## Approach: Next.js intercepting routes

Use Next.js parallel + intercepting routes. When the user is on `/` and clicks a recipe, `router.push('/recipes/[slug]')` is intercepted and rendered into a `@modal` slot above the map. Direct visits to `/recipes/[slug]` (reload, share, deep link) bypass the interceptor and render the existing full page.

**Why this approach:**
- Map zoom, country selection, sidebar — all stay mounted underneath. No state to serialize.
- URL is shareable. Browser back closes the modal naturally.
- The existing `RecipeDetail` component (~400 lines) is reused as-is. The modal is a thin shell.
- Search-bar selections from the map already use `router.push('/recipes/[id]')`, so they get the modal for free.

## File changes

### New files

| File | Type | Purpose |
|---|---|---|
| `app/@modal/default.tsx` | RSC | Returns `null`. Required for the parallel slot. |
| `app/@modal/(.)recipes/[slug]/page.tsx` | RSC | Fetches recipe via shared `getRecipe`, renders `<RecipeModal>` wrapping `<RecipeDetail>`. |
| `components/RecipeModal.tsx` | Client | Modal shell: backdrop, dismissal, focus trap, motion. |
| `lib/recipes/get.ts` | Server util | Shared `getRecipe(slug)` extracted from `app/recipes/[slug]/page.tsx`. |

### Edited files

| File | Change |
|---|---|
| `app/layout.tsx` | Accept and render the `@modal` parallel slot alongside `children`. |
| `app/recipes/[slug]/page.tsx` | Import `getRecipe` from the shared util instead of defining inline. |
| `components/WorldMap.tsx` | Two changes: (1) in the country-sidebar item `onClick` and in `handleSearchSelect`, use `router.replace` if `usePathname()` already starts with `/recipes/`, else `router.push`. (2) Add `inert` attribute to the outer map container when the modal is open (detect via the same pathname check). |

`WorldMap.tsx` does not change otherwise. The modal does not need any state to be lifted.

## Modal shell behavior

### Visual

- **Desktop:** centered card, ~880px max-width, max-height 90vh, content scrolls inside. Border radius matches existing card aesthetic. Backdrop: `bg-brown-dark/55` with `backdrop-blur-sm`.
- **Mobile:** full-width bottom sheet, max-height 92vh, with a top handle. Slides up on open.
- **Motion:** desktop fades + scales from 0.96. Mobile slides up. Both use the existing `SIDEBAR_TRANSITION` cubic-bezier `[0.25, 0.1, 0.25, 1]` at ~250ms for visual consistency with the rest of the app.

### Header (inside the modal)

Top-right of the modal contains two icon buttons:
- **Open full recipe** (left of the X) — `Maximize2` icon from lucide. Implemented as a plain `<a href="/recipes/[slug]">` to force a hard navigation that bypasses the interceptor. Tooltip: "Open full recipe."
- **Close** — `X` icon. Calls `router.back()`.

### Dismissal

Three equivalent dismissal paths, all calling `router.back()`:
1. Click the dim backdrop
2. Press `Escape`
3. Click the X button

`router.back()` works because the modal was opened via `router.push`. Popping returns to the map URL with full state intact.

### Switching between recipes

User flow: dismiss the modal (Esc / backdrop / X) → click another country marker or recipe in the sidebar → new modal opens. Two clicks total.

To prevent history pollution when this happens repeatedly, the navigation logic in `WorldMap.tsx` (and `MapSearch.tsx`) checks `usePathname()`:

```ts
const target = `/recipes/${recipe.id}`;
if (pathname.startsWith('/recipes/')) router.replace(target);
else router.push(target);
```

This means a single `router.back()` always returns to the map, regardless of how many recipes the user previewed.

### Accessibility

- Modal has `role="dialog"` and `aria-modal="true"`.
- Map page receives the `inert` attribute when the modal is open (traps focus and screen reader navigation inside the dialog).
- On open: focus moves to the close button.
- On close: focus restores to the originating sidebar item if still mounted; otherwise to `document.body`.
- Tab order is trapped inside the modal.

## Edge cases & expected behavior

| Scenario | Behavior |
|---|---|
| Reload while modal is open | URL is `/recipes/[slug]` → interceptor doesn't fire → full page renders. Acceptable; this is the documented Next.js fallback. |
| Direct visit to `/recipes/[slug]` | Existing full page renders. No change. |
| `/recipes` grid → click a card | Full-page navigation as today. Modal is map-only. |
| Search-bar selects a recipe from the map | Same `replace`-vs-`push` logic. Modal opens. |
| User clicks "Open full recipe" → presses back | Hard nav doesn't add a new history entry (URL was already `/recipes/[slug]`). Back returns to the map. |
| Map page below the modal | Marked `inert`, so wheel/pinch/keyboard cannot reach it while modal is open. |
| Cooked-stamp toggle inside modal | Works identically. The map's `useCookedStamps` hook updates live on close. |

## Non-goals (v1)

- One-click recipe switching with the country sidebar floating above the backdrop. Possible future enhancement; v1 uses two-click dismiss-then-click flow.
- Pull-down-to-dismiss gesture on mobile. Backdrop tap and the X button are sufficient.
- Modal experience on the `/recipes` grid. Intentionally scoped out — the grid is for committed reading.
- Prev/next recipe carousel inside the modal.

## Open risks

None blocking. Items to verify during implementation:
- Confirm `inert` is correctly applied/removed on modal open/close (test screen reader navigation).
- Confirm `router.replace` inside the modal slot does swap content cleanly on Next.js 15 without unmounting the backdrop.
- Confirm hard-nav back behavior: clicking "Open full recipe" → back returns to map without leaving the user on a stale modal route.
