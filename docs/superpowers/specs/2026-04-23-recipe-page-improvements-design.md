# Recipe Page Improvements — Design Spec

Supersedes the layout portions of `2026-04-22-recipe-detail-redesign.md`. That spec's tips and two-column work shipped; this spec covers the next round of feature additions and layout refinements.

## Summary

Add interactive cooking features (checkable ingredients/steps, unit conversion), new content sections (substitutions, storage notes), redesign the "I Cooked This" button with contextual placement and stamp-themed styling, and refine the page layout to better match a cooking workflow.

## Motivation

The current recipe page presents information well but is passive — a document to read, not a tool to cook with. Users actively cooking need to track progress through ingredients and steps, may need metric units, and want practical info like substitutions and storage. The "I Cooked This" button is buried in the sidebar with no visual personality, despite being the gateway to the app's signature passport feature.

## Scope

### In scope

- Checkable ingredients and instruction steps (sessionStorage)
- Metric/imperial unit toggle (localStorage)
- New `substitutions` field and dedicated section
- New `storage` field and dedicated section
- "I Cooked This" button redesign — moved after instructions, stamp-themed
- Layout restructure: quick stats bar, flipped two-column zone, supplementary grid
- Flavor compass sizing reduction (smaller, no heading)
- Hero overlay: move Copy Recipe + Favorite buttons into hero

### Out of scope

- Sticky navigation for mobile (revisit after these features ship)
- Step photos inline with instructions
- Recipe swipe/prev-next navigation (tracked in TODO.md)
- Passport mobile layout (tracked in TODO.md)
- Related recipes section

---

## Page Structure

Container: `max-w-5xl` (~1024px), centered, horizontal padding.

### 1. Header Bar

- Left: "← All Recipes" back link (unchanged)
- Right: empty — Copy Recipe and Favorite buttons move to the hero

### 2. Hero Image

- Current height and styling unchanged
- Gradient overlay with title, country, fusion badge, "inspired by" at bottom-left
- **New:** Copy Recipe button and Favorite heart button at bottom-right of the overlay, semi-transparent background pills for legibility

### 3. Quote

Unchanged — italic Literata caption below the hero.

### 4. Quick Stats Bar

**New section.** Replaces the sidebar's quick stats. A horizontal strip below the quote.

- Pills in a flex row: Prep time | Cook time | **Total time (new)** | Difficulty
- Same pill styling as current sidebar stats (`bg-parchment`, rounded-full, icon + text)
- Servings moves to the ingredients header (see below), not in this bar

### 5. Two-Column Zone

The main cooking content area. Columns are **flipped** from the previous layout — ingredients/instructions take the main (left, wider) column.

**Left column (main, flex-1):**

1. **Ingredients section**
   - Header row: "Ingredients" heading (left), servings adjuster + unit toggle (right)
   - Unit toggle: small segmented control — "US | Metric" — using localStorage for persistence. Always visible, one tap to switch.
   - Checkable ingredient list: each row has a checkbox on the left. Checked items get `opacity-50` and `line-through` on the text. Checkbox state stored in sessionStorage keyed by recipe slug.
   - "Copy ingredients" link below the list (unchanged)

2. **Instructions section** (flows below ingredients in the same column)
   - Heading: "Instructions"
   - Checkable steps: checkbox to the left of the numbered terracotta circle. Visual order: ☐ ① Step text. Checked steps get the same dim treatment as ingredients.
   - Centered readable width (`max-w-prose`) with generous step spacing
   - Checkbox state shares the same sessionStorage entry as ingredients

**Right column (~300px, sticky):**

- Nutrition grid (2×2, unchanged)
- Tags (pills, unchanged)
- Flavor compass — **reduced size** (roughly `h-28`), no "Flavor Profile" heading, just the radar chart with axis labels. Must remain readable.

The right column uses `position: sticky` with top offset for the navbar.

### 6. Supplementary Sections

Below the two-column zone. Full content width.

**Two-column grid on desktop (single column on mobile):**

- **Substitutions** (left card) — rendered only if `recipe.substitutions` exists and is non-empty. Card with `bg-surface` background, rounded corners. Heading with a swap/refresh icon. Each substitution as a text line separated by thin rules (same style as Tips).
- **Storage & Reheating** (right card) — rendered only if `recipe.storage` exists. Card with `bg-surface` background. Heading with a container/snowflake icon. Single paragraph of text.

**Below the grid:**

- **Tips** (full-width card) — unchanged from current implementation. Only renders if tips exist.

### 7. "I Cooked This" Button

Placed at the natural end of the cooking journey, after all supplementary sections.

**Layout:** Centered, `max-w-md` width.

**Resting state:**
- Dashed border with slightly rounded corners — postal/stamp aesthetic
- `font-stamp` (Cutive) for the button text
- Warm background — subtle turmeric tint
- ChefHat icon (unchanged)

**Click animation:**
- Scale down briefly (stamp press feel: `scale(0.95)` → `scale(1)`)
- Shadow compresses on press, restores on release
- Text transitions to "Stamped!" (replacing current "Logged!") to match passport language

**Supporting text:** Small muted line below the button: "Add this to your culinary passport" — context for new users.

**Confetti + toast behavior:** Unchanged — already well-implemented in `CookedButton.tsx`.

### Mobile Layout (<768px)

Single column, content order:
1. Header → Hero → Quote
2. Quick Stats Bar
3. Ingredients (with servings + unit toggle)
4. Instructions
5. Nutrition, Tags, Flavor Compass (inline, no longer sticky)
6. Substitutions → Storage → Tips
7. "I Cooked This" button

---

## Data Changes

### New fields on `Ingredient`

```typescript
interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  metricAmount?: number;   // metric equivalent quantity
  metricUnit?: string;     // metric unit (g, ml, kg, L, etc.)
}
```

Both `metricAmount` and `metricUnit` are optional. When absent, the ingredient displays in its original unit only (no toggle effect for that ingredient). This allows gradual population — not every ingredient needs metric data on day one.

### New fields on `Recipe` / `DbRecipe`

```typescript
// Recipe (camelCase, frontend)
substitutions?: string[];
storage?: string;

// DbRecipe (snake_case, database)
substitutions: string[] | null;
storage: string | null;
```

Update `dbToRecipe`:
```typescript
substitutions: db.substitutions ?? undefined,
storage: db.storage ?? undefined,
```

### Database migration

```sql
ALTER TABLE public.recipes
  ADD COLUMN substitutions text[] DEFAULT NULL,
  ADD COLUMN storage text DEFAULT NULL;
```

No migration needed for metric ingredient data — `ingredients` is already a JSONB column, so the new optional fields are added at the application level.

---

## State Management

### Checkbox state (sessionStorage)

Key: `nieves-cook-progress-{slug}`

Value:
```typescript
{
  ingredients: number[];  // indices of checked ingredients
  steps: number[];        // indices of checked steps
}
```

Stored as JSON in sessionStorage. Read on component mount, written on each toggle. Clears automatically when the tab closes.

### Unit preference (localStorage)

Key: `nieves-unit-pref`

Value: `"us"` or `"metric"` (default: `"us"`)

Toggle is always visible in the ingredients header. Changing it immediately re-renders all ingredient quantities that have metric data.

---

## Files to Change

| File | Change |
|------|--------|
| `lib/types.ts` | Add `metricAmount?`, `metricUnit?` to `Ingredient`. Add `substitutions`, `storage` to `Recipe` and `DbRecipe`. Update `dbToRecipe`. |
| `components/RecipeDetail.tsx` | Layout restructure — quick stats bar, flipped columns, supplementary grid, hero button placement |
| `components/CookedButton.tsx` | Stamp-themed styling, animation, "Stamped!" text, subtitle |
| `components/FlavorCompass.tsx` | Reduce height, remove heading (heading removal is in RecipeDetail) |
| `app/globals.css` | Stamp button styles, checkbox styling if needed |
| `hooks/useCookProgress.ts` | **New** — sessionStorage hook for checkbox state |
| `hooks/useUnitPref.ts` | **New** — localStorage hook for metric/imperial preference |
| `scripts/schema.sql` | Add `substitutions` and `storage` columns |
| Supabase migration | ALTER TABLE for new columns |

---

## Future Enhancements (out of scope)

- Sticky navigation for mobile (revisit after these features ship)
- Recipe swipe/prev-next navigation (see TODO.md)
- Step photos inline with instructions
- Related recipes from the same region
