# Map Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an expandable search bar to the map view that lets users search by country, recipe name, or ingredient, with grouped results that fly the map to the selected location. Also enrich sidebar recipe cards with cook time, difficulty, and cooked-stamp metadata.

**Architecture:** A standalone `MapSearch` client component handles search state, filtering, and the dropdown UI. It communicates with `WorldMap` via a single `onSelect` callback. WorldMap wires the callback into its existing `zoomTo()` and `setSelectedCountry()` / `router.push()` logic. Sidebar card enrichment is a self-contained edit within WorldMap's existing sidebar JSX.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind v4 (design tokens), lucide-react (icons), framer-motion (animations)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/MapSearch.tsx` | Create | Search icon, expandable input, filtering logic, grouped dropdown, keyboard navigation |
| `components/WorldMap.tsx` | Modify | Render `<MapSearch>`, wire `onSelect` callback, enrich sidebar recipe cards with time/difficulty/cooked stamp |

---

### Task 1: Create MapSearch — Expandable Icon + Input

**Files:**
- Create: `components/MapSearch.tsx`

- [ ] **Step 1: Create the component with collapsed/expanded state**

```tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';

interface SearchResult {
  type: 'country' | 'recipe' | 'ingredient';
  label: string;
  sublabel?: string;
  country: string;
  coordinates: { lng: number; lat: number };
  recipeId?: string;
}

interface MapSearchProps {
  recipes: Recipe[];
  onSelect: (result: {
    country: string;
    coordinates: { lng: number; lat: number };
    recipeId?: string;
  }) => void;
}

export default function MapSearch({ recipes, onSelect }: MapSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus on expand
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Click outside closes dropdown but keeps search expanded
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
        setQuery('');
      }
    }
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [expanded]);

  function handleClose() {
    setExpanded(false);
    setQuery('');
  }

  if (recipes.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-4 right-4 z-10 flex items-center"
    >
      {expanded ? (
        <div className="relative">
          <div className="flex items-center gap-2 bg-parchment/92 backdrop-blur-sm pl-3 pr-2 py-2 rounded-full shadow-md">
            <Search size={16} className="text-brown-medium shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Country, recipe, ingredient..."
              className="bg-transparent text-sm text-brown-dark placeholder:text-brown-light outline-none w-48 sm:w-56"
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleClose();
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-0.5 rounded-full text-brown-medium hover:text-brown-dark transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Search recipes"
          className="bg-parchment/92 backdrop-blur-sm p-2.5 rounded-full shadow-md text-brown-medium hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify it renders**

Run: `npm run dev`

Open `localhost:3000` in a browser. Verify:
- A magnifying glass icon appears top-right on the map
- Clicking it expands to a text input
- Typing shows placeholder text
- Pressing Escape collapses it
- Clicking outside collapses it

- [ ] **Step 3: Commit**

```bash
git add components/MapSearch.tsx
git commit -m "feat: add MapSearch component with expandable icon/input"
```

---

### Task 2: Add Search Filtering Logic

**Files:**
- Modify: `components/MapSearch.tsx`

- [ ] **Step 1: Add the search filtering function inside MapSearch**

Add this helper function inside the component, above the return statement. It escapes regex metacharacters, prioritises starts-with over contains, and builds three groups capped at 3 results each:

```tsx
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWithRe = new RegExp(`^${escaped}`, 'i');
    const containsRe = new RegExp(escaped, 'i');

    // --- Countries ---
    const countryMap = new Map<string, { count: number; coordinates: { lng: number; lat: number } }>();
    for (const r of recipes) {
      if (containsRe.test(r.country)) {
        const existing = countryMap.get(r.country);
        if (existing) {
          existing.count++;
        } else {
          countryMap.set(r.country, { count: 1, coordinates: r.coordinates });
        }
      }
    }
    const countries: SearchResult[] = Array.from(countryMap.entries())
      .sort((a, b) => {
        const aStarts = startsWithRe.test(a[0]) ? 0 : 1;
        const bStarts = startsWithRe.test(b[0]) ? 0 : 1;
        return aStarts - bStarts || a[0].localeCompare(b[0]);
      })
      .slice(0, 3)
      .map(([country, { count, coordinates }]) => ({
        type: 'country' as const,
        label: country,
        sublabel: `${count} recipe${count !== 1 ? 's' : ''}`,
        country,
        coordinates,
      }));

    // --- Recipes ---
    const recipeMatches: SearchResult[] = recipes
      .filter(r => containsRe.test(r.name))
      .sort((a, b) => {
        const aStarts = startsWithRe.test(a.name) ? 0 : 1;
        const bStarts = startsWithRe.test(b.name) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 3)
      .map(r => ({
        type: 'recipe' as const,
        label: r.name,
        sublabel: r.country,
        country: r.country,
        coordinates: r.coordinates,
        recipeId: r.id,
      }));

    // --- Ingredients --- (deduplicated against recipe matches)
    const recipeIds = new Set(recipeMatches.map(r => r.recipeId));
    const ingredientMatches: SearchResult[] = [];
    for (const r of recipes) {
      if (recipeIds.has(r.id)) continue;
      const matchedIng = r.ingredients.find(ing => containsRe.test(ing.name));
      if (matchedIng) {
        ingredientMatches.push({
          type: 'ingredient' as const,
          label: r.name,
          sublabel: matchedIng.name,
          country: r.country,
          coordinates: r.coordinates,
          recipeId: r.id,
        });
        if (ingredientMatches.length >= 3) break;
      }
    }
    // Sort ingredient matches: starts-with first
    ingredientMatches.sort((a, b) => {
      const aStarts = startsWithRe.test(a.sublabel!) ? 0 : 1;
      const bStarts = startsWithRe.test(b.sublabel!) ? 0 : 1;
      return aStarts - bStarts;
    });

    return [...countries, ...recipeMatches, ...ingredientMatches];
  }, [query, recipes]);
```

Add `useMemo` to the import at the top of the file:

```tsx
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
```

- [ ] **Step 2: Verify filtering works**

Run: `npm run dev`

Temporarily add `{JSON.stringify(results.map(r => r.label))}` below the input to verify results are computed. Search for a known country, recipe name, and ingredient. Verify:
- Country results are deduplicated with counts
- Recipe results show individual matches
- Ingredient results don't duplicate recipe results
- Starts-with matches appear first

Remove the debug output after verifying.

- [ ] **Step 3: Commit**

```bash
git add components/MapSearch.tsx
git commit -m "feat: add search filtering logic with grouped results and starts-with ranking"
```

---

### Task 3: Add Dropdown UI and Keyboard Navigation

**Files:**
- Modify: `components/MapSearch.tsx`

- [ ] **Step 1: Add keyboard navigation state and handlers**

Add this state and handler inside the component, after the `results` useMemo:

```tsx
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  function handleSelect(result: SearchResult) {
    onSelect({
      country: result.country,
      coordinates: result.coordinates,
      recipeId: result.recipeId,
    });
    handleClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
      return;
    }
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  }
```

Update the `onKeyDown` on the input to use `handleKeyDown`:

```tsx
onKeyDown={handleKeyDown}
```

- [ ] **Step 2: Add the dropdown JSX**

Add this JSX inside the `{expanded && ...}` block, after the closing `</div>` of the input bar and still inside the `<div className="relative">`:

```tsx
          {/* Dropdown */}
          {query.trim() && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-parchment/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden z-20">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-brown-medium">No matches found</p>
              ) : (
                <div className="py-1">
                  {/* Countries group */}
                  {results.some(r => r.type === 'country') && (
                    <>
                      <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-brown-light uppercase tracking-wider">Countries</p>
                      {results.filter(r => r.type === 'country').map((result, i) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`country-${result.label}`}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${globalIndex === activeIndex ? 'bg-sage/20 text-brown-dark' : 'text-brown-dark hover:bg-parchment-dark'}`}
                          >
                            <span className="font-medium">{result.label}</span>
                            <span className="ml-2 text-xs text-brown-medium">{result.sublabel}</span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Recipes group */}
                  {results.some(r => r.type === 'recipe') && (
                    <>
                      <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-brown-light uppercase tracking-wider">Recipes</p>
                      {results.filter(r => r.type === 'recipe').map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`recipe-${result.recipeId}`}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${globalIndex === activeIndex ? 'bg-sage/20 text-brown-dark' : 'text-brown-dark hover:bg-parchment-dark'}`}
                          >
                            <span className="font-medium">{result.label}</span>
                            <span className="ml-2 text-xs text-brown-medium">{result.sublabel}</span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Ingredient matches group */}
                  {results.some(r => r.type === 'ingredient') && (
                    <>
                      <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-brown-light uppercase tracking-wider">Ingredient matches</p>
                      {results.filter(r => r.type === 'ingredient').map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`ingredient-${result.recipeId}`}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${globalIndex === activeIndex ? 'bg-sage/20 text-brown-dark' : 'text-brown-dark hover:bg-parchment-dark'}`}
                          >
                            <span className="font-medium">{result.label}</span>
                            <span className="ml-2 text-xs text-brown-medium italic">{result.sublabel}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
```

- [ ] **Step 3: Verify dropdown works**

Run: `npm run dev`

Test in browser:
- Type a country name — "Countries" group appears with deduplicated entries and recipe counts
- Type a recipe name — "Recipes" group appears
- Type an ingredient — "Ingredient matches" group appears with ingredient name in italics
- Arrow up/down highlights items (sage background)
- Enter selects highlighted item
- Escape closes
- "No matches found" appears for gibberish queries
- Click outside closes dropdown

- [ ] **Step 4: Commit**

```bash
git add components/MapSearch.tsx
git commit -m "feat: add search dropdown UI with grouped results and keyboard navigation"
```

---

### Task 4: Integrate MapSearch into WorldMap

**Files:**
- Modify: `components/WorldMap.tsx:1-12` (imports)
- Modify: `components/WorldMap.tsx:336` (component signature area)
- Modify: `components/WorldMap.tsx:694-695` (inside the return, after the opening `<div>`)

- [ ] **Step 1: Add MapSearch import to WorldMap**

Add this import after the existing component imports (around line 13):

```tsx
import MapSearch from './MapSearch';
```

- [ ] **Step 2: Add the onSelect handler and render MapSearch**

Add this handler inside the WorldMap component, after the `resetView` function (around line 685):

```tsx
  function handleSearchSelect(result: { country: string; coordinates: { lng: number; lat: number }; recipeId?: string }) {
    if (result.recipeId) {
      // Fly to country, then navigate to recipe detail
      zoomTo({
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        zoom: Math.max(zoom, ZOOM.COUNTRY_FULL),
      });
      router.push(`/recipes/${result.recipeId}`);
    } else {
      // Fly to country and open sidebar
      zoomTo({
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        zoom: Math.max(zoom, ZOOM.COUNTRY_FULL),
      });
      setSelectedCountry(result.country);
    }
  }
```

Then render `<MapSearch>` inside the return JSX, right after the opening `<div className="relative w-full h-full">` (line 695):

```tsx
      <MapSearch recipes={recipes} onSelect={handleSearchSelect} />
```

- [ ] **Step 3: Verify integration works end-to-end**

Run: `npm run dev`

Test in browser:
- Search for a country → map flies to it, sidebar opens with that country's recipes
- Search for a recipe name → map flies to the country, navigates to `/recipes/[slug]`
- Search for an ingredient → map flies to the country, navigates to `/recipes/[slug]`
- Search collapses and clears after selection
- Verify search icon doesn't overlap with breadcrumb or filter panel button

- [ ] **Step 4: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat: integrate MapSearch into WorldMap with fly-to and sidebar/navigation"
```

---

### Task 5: Enrich Sidebar Recipe Cards

**Files:**
- Modify: `components/WorldMap.tsx:1066-1097` (sidebar recipe card JSX)

- [ ] **Step 1: Add Clock and ChefHat imports**

Update the lucide-react import at the top of WorldMap.tsx (line 11):

```tsx
import { ChevronRight, X, Clock, ChefHat } from 'lucide-react';
```

- [ ] **Step 2: Access cooked stamps data for the sidebar**

The `passportSummary` from `useCookedStamps()` is already available in the component (line 338). It includes `passportSummary.stampsPerCountry` which is a `Map<string, Stamp[]>`. To check if a specific recipe has been cooked, check the stamps by recipe slug.

Add this derived set after the existing `passportSummary` usage, inside the component:

```tsx
  const cookedRecipeSlugs = useMemo(() => {
    const slugs = new Set<string>();
    for (const stamps of passportSummary.stampsPerCountry.values()) {
      for (const stamp of stamps) {
        slugs.add(stamp.recipe_slug);
      }
    }
    return slugs;
  }, [passportSummary.stampsPerCountry]);
```

Add `useMemo` to the React imports if not already present (it is — line 1).

- [ ] **Step 3: Update the sidebar card JSX**

Replace the existing card content (the `<div className="p-3">` block inside each recipe card, approximately lines 1081-1094) with enriched content:

Old code:
```tsx
                    <div className="p-3">
                      <h4 className="font-heading text-sm font-semibold text-brown-dark mb-1">{recipe.name}</h4>
                      <div className="flex gap-1.5 flex-wrap">
                        {recipe.isFusion && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-turmeric text-brown-dark">
                            FUSION
                          </span>
                        )}
                        {recipe.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-parchment-dark text-brown-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
```

New code:
```tsx
                    <div className="p-3">
                      <h4 className="font-heading text-sm font-semibold text-brown-dark mb-1">{recipe.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-brown-medium mb-1.5">
                        <span className="flex items-center gap-0.5">
                          <Clock size={10} className="shrink-0" />
                          {recipe.prepTime + recipe.cookTime}m
                        </span>
                        <span className={`font-semibold px-1.5 py-0.5 rounded-full ${
                          recipe.difficulty === 'Easy' ? 'bg-sage/30 text-sage' :
                          recipe.difficulty === 'Medium' ? 'bg-turmeric/30 text-turmeric' :
                          'bg-paprika/20 text-paprika'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {recipe.isFusion && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-turmeric text-brown-dark">
                            FUSION
                          </span>
                        )}
                        {recipe.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-parchment-dark text-brown-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
```

- [ ] **Step 4: Add cooked stamp overlay on the thumbnail**

Add a cooked indicator inside the `<div className="relative h-28 overflow-hidden">` block, after the `<Image>` tag:

```tsx
                      {cookedRecipeSlugs.has(recipe.id) && (
                        <div className="absolute top-1.5 right-1.5 bg-sage/90 text-white rounded-full p-1" title="Cooked!">
                          <ChefHat size={12} />
                        </div>
                      )}
```

- [ ] **Step 5: Verify enriched cards**

Run: `npm run dev`

Test in browser:
- Click a country with recipes → sidebar opens
- Each card shows: thumbnail, name, total time with clock icon, difficulty badge (colored), tags
- If a recipe has been cooked, a chef hat icon appears on the thumbnail corner
- Cards still scroll correctly in the sidebar
- No layout overflow or clipping issues

- [ ] **Step 6: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat: enrich sidebar recipe cards with cook time, difficulty, and cooked stamp"
```

---

### Task 6: Final Verification and Type Check

**Files:**
- None (verification only)

- [ ] **Step 1: Run the type checker**

Run: `npx tsc --noEmit`

Expected: No type errors. If there are errors, fix them before proceeding.

- [ ] **Step 2: Run the linter**

Run: `npm run lint`

Expected: No lint errors related to the changed files.

- [ ] **Step 3: Run a production build**

Run: `npm run build`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Full end-to-end manual test**

Run: `npm run dev`

Test the complete flow:
1. Map loads, search icon visible top-right
2. Click search icon → expands to input
3. Search "Japan" → Countries group shows Japan with recipe count
4. Click Japan → map flies to Japan, sidebar opens with Japanese recipes
5. Cards show time, difficulty badge, cooked stamp (if applicable), tags
6. Close sidebar, search for a specific recipe name → Recipes group shows it
7. Click recipe → map flies, navigates to recipe detail page
8. Go back, search for an ingredient (e.g. "rice") → Ingredient matches group shows recipes
9. Click one → navigates to recipe detail page
10. Search gibberish → "No matches found"
11. Escape closes search
12. Arrow keys navigate dropdown
13. Enter selects highlighted item
14. Test on mobile viewport (responsive)
15. Verify filter panel button (bottom-right) doesn't overlap with search

- [ ] **Step 5: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```

Only run this step if fixes were needed.
