# Map Search Feature — Design Spec

**Date:** 2026-04-28
**Status:** Approved

## Overview

Add a search feature to the map view that lets users search for recipes by country name, recipe name, or ingredient. Results appear in a grouped inline dropdown. Selecting a result flies the map to the matching country and either opens the sidebar or navigates to the recipe detail page. As part of this work, the existing recipe sidebar cards are enriched with additional metadata.

## Component: `MapSearch`

### Location
New file: `components/MapSearch.tsx` (client component)

### Props
```ts
interface MapSearchProps {
  recipes: Recipe[];
  onSelect: (result: {
    country: string;
    coordinates: { lng: number; lat: number };
    recipeId?: string;
  }) => void;
}
```

### Positioning
- Top-right of the map container
- Styled to match existing map controls: `bg-parchment/92 backdrop-blur-sm rounded-full shadow-md`

### Collapsed State
- Magnifying glass icon button
- Expands on click via CSS transition (width + opacity on the input)

### Expanded State
- Text input (~250px wide on desktop, near full width on mobile)
- Auto-focused on expand
- X button or Escape collapses and clears query

## Search Logic

### Matching
Client-side, synchronous filtering on every keystroke against the `recipes` array (already loaded via TanStack Query `useRecipes` hook). No debounce needed — dataset is small (hundreds of recipes).

### Ranking
Starts-with matches are prioritized over contains matches (e.g. searching "rice" ranks "Rice Pilaf" above "Licorice Cake").

### Result Groups (3 max per group, 9 total)

1. **Countries** — `recipe.country` matches query. Deduplicated. Shows recipe count per country.
2. **Recipes** — `recipe.name` matches query. Each match is its own entry.
3. **Ingredient matches** — any recipe where an `ingredient.name` matches query. Shown as recipe entries with the matched ingredient noted. Deduplicated against the Recipes group.

If more matches exist beyond the cap, show "+N more" text.

### No matches
Dropdown shows "No matches found".

## Dropdown UI

- Appears below the input when there are results
- Parchment background, rounded corners, shadow (matches existing design tokens)
- Each group has a subtle label header ("Countries", "Recipes", "Ingredient matches")
- Items are hoverable and keyboard-navigable (arrow up/down, Enter to select)

## Selection Behavior

| Result type | Action |
|---|---|
| Country | Fly to country coordinates, open recipe sidebar (`setSelectedCountry`) |
| Recipe | Fly to recipe's country, navigate to `/recipes/[recipeId]` |
| Ingredient match | Fly to recipe's country, navigate to `/recipes/[recipeId]` |

After selection: input clears, search collapses back to icon.

## Integration with WorldMap

`WorldMap.tsx` renders `<MapSearch>` inside its container div and passes:
- `recipes` prop (already available)
- `onSelect` callback that internally calls `zoomTo()` and either `setSelectedCountry()` or `router.push()`

No changes to WorldMap's core zoom/navigation logic.

## Sidebar Changes

### Position
Sidebar stays on the left (no change).

### Enriched Recipe Cards
Current cards show: thumbnail, name, tags (up to 2).

Add to each card:
- **Cook + prep time** — inline text, e.g. "15 + 30 min", shares a line with difficulty
- **Difficulty badge** — Easy/Medium/Hard with subtle color coding, inline with time
- **Cooked stamp** — subtle icon/checkmark overlaid on thumbnail corner (from `useCookedStamps`), takes zero extra vertical space

Net addition: one line of text per card.

## Keyboard Interaction

| Key | Action |
|---|---|
| Escape | Close search, clear query |
| Arrow Down | Next result in dropdown |
| Arrow Up | Previous result in dropdown |
| Enter | Select highlighted result |

## Edge Cases

- **Empty query** — dropdown hidden
- **Special characters** — regex metacharacters (e.g. `(`, `)`, `.`, `*`) in the query are escaped before building the match pattern
- **Recipes loading** — search icon hidden/disabled until data is available
- **Click outside dropdown** — closes dropdown, keeps search expanded with query text
- **Mid-animation selection** — cancels current `zoomTo` animation, starts new one (existing behavior)

## Out of Scope

- Server-side search (not needed for current dataset size)
- Region search (regions are navigable via the existing map drill-down)
- Mobile bottom sheet sidebar (separate future feature)
- Resizable/collapsible sidebar panel
- Search hint/tooltip (magnifying glass icon is sufficient)
