# Recipe Detail Page Redesign

## Summary

Redesign the recipe detail page (`/recipes/[slug]`) from a flat single-column layout to an editorial two-column magazine spread. Fix the broken quote formatting, add a new tips section backed by a DB column, and create visual rhythm through background differentiation and varied spacing.

## Motivation

The current page stacks everything in a narrow `max-w-2xl` column with uniform `space-y-6` gaps. Every section has equal visual weight, making it read like a form rather than the cookbook/editorial experience the brand targets. The decorative quotation marks on the blockquote break text flow with uneven spacing. There is no tips section despite tips being one of the most practical things a cookbook offers.

## Scope

### In scope
- Two-column layout with sticky sidebar (ingredients/metadata)
- Hero image height increase (~420px)
- Quote formatting fix (remove broken decorative marks, add terracotta rule)
- Visual differentiation between sections via background colors and spacing
- New `tips` DB column (`text[]`, nullable) and UI section
- Type updates (`Recipe`, `DbRecipe`, `dbToRecipe`)
- Responsive collapse to single-column on mobile (<768px)

### Out of scope
- Recipe swipe/prev-next navigation (tracked in TODO.md)
- Collapsible/expandable sections
- Related recipes section
- Changes to FlavorCompass or CookedButton components (reused as-is)

---

## Design

### Page Structure

Container: `max-w-5xl` (~1024px), centered, generous horizontal padding.

#### Hero
- Height: ~420px (`h-[420px]`), full container width, rounded corners
- Gradient overlay: subtle, enough for title legibility
- Overlaid content (bottom-left): country, fusion badge, "inspired by", recipe title
- Above hero: back link (left) + favorite button (right), unchanged

#### Quote / Epigraph
- Position: below the hero, centered, in its own breathing space
- Typography: italic Literata, `text-brown-medium`, `max-w-prose` (~65ch)
- Decoration: thin centered terracotta horizontal rule (~48px) above the quote text
- Fix: remove absolute-positioned `&ldquo;` and inline `&rdquo;` marks entirely

#### Two-Column Layout (desktop 768px+)

**Left Column — Sidebar (~340px, sticky)**
1. Quick stats: prep time, cook time, difficulty — compact horizontal row
2. Servings scaler: +/- controls with current count
3. Ingredients list: name + scaled amount, copy button below
4. Tags: small pills
5. Nutrition: 2x2 grid (calories, protein, carbs, fat)

Sticky behavior: `position: sticky` with top offset accounting for navbar height. Sticks while user scrolls through instructions.

**Right Column — Main content (remaining width)**
1. Instructions: numbered steps with terracotta circles, `max-w-prose` line length
2. Flavor profile: radar chart on `bg-surface-alt` panel with rounded corners
3. Tips: new section on `bg-surface` panel (see Tips section below)
4. Action buttons: Copy Recipe + I Cooked This, horizontal pair

#### Mobile (<768px) — Single Column
Content order: hero → quote → quick stats → servings + ingredients → instructions → flavor profile → tips → nutrition → action buttons. Sidebar loses sticky behavior, flows naturally. Nutrition can display as 4-across or 2x2 depending on width.

### Visual Differentiation

Sections are distinguished by background color shifts rather than cards or borders:

| Section | Background |
|---------|-----------|
| Page base | `bg-parchment` |
| Sidebar | `bg-surface` (#FFF8F1) with subtle `border-right` in `brown-light/20` |
| Instructions | `bg-parchment` (base) |
| Flavor profile | `bg-surface-alt` panel, rounded corners |
| Tips | `bg-surface` panel, rounded corners |

Spacing varies for hierarchy: tight within related content (ingredient list items), generous between major sections. Thin horizontal rules (`brown-light/15`) used sparingly as dividers, not uniformly.

### Typography

No changes to font pairing (Literata + Figtree). Hierarchy:

| Element | Font | Size/Weight |
|---------|------|-------------|
| Recipe title (hero) | Literata | bold, `text-2xl sm:text-3xl` |
| Section headings | Literata | semibold, `text-lg` |
| Quick stats labels | Figtree | uppercase, tiny tracking, `text-brown-medium` |
| Ingredient names | Figtree | regular, `text-sm` |
| Instruction body | Figtree | regular, `text-sm leading-relaxed`, max ~65ch |
| Tips text | Figtree | regular, `text-sm` |
| Quote | Literata | italic, `text-base`, `text-brown-medium` |

### Tips Section

**Database**: Add `tips text[]` column to `public.recipes`, nullable, defaults to null.

**Types**: Add `tips?: string[]` to `Recipe` interface. Add `tips: string[] | null` to `DbRecipe`. Map in `dbToRecipe`: `tips: db.tips ?? undefined`.

**UI**: Renders in the right column after flavor profile, before action buttons. Only renders when tips array is non-empty. Heading: "Tips" in Literata semibold. Each tip is a line of text on a `bg-surface` panel, separated by thin `brown-light/15` horizontal rules. No bullets — clean stacked text, like margin notes in a cookbook.

**Population**: Tips are added per recipe over time. Section is invisible when no data exists.

### Existing Components

- **FlavorCompass**: Reused as-is, placed inside a `bg-surface-alt` panel in the right column
- **CookedButton**: Reused as-is in the action buttons row
- **useFavorites**: No changes, favorite button stays in the header area

---

## Files to Change

| File | Change |
|------|--------|
| `scripts/schema.sql` | Add `tips text[]` column |
| `lib/types.ts` | Add `tips` to `Recipe` and `DbRecipe`, update `dbToRecipe` |
| `components/RecipeDetail.tsx` | Full rewrite — two-column layout, quote fix, tips section, visual differentiation |
| `app/globals.css` | Any new utility styles if needed (minimal expected) |
| Supabase migration | ALTER TABLE to add `tips` column |

---

## Future Enhancements (out of scope)

- Recipe swipe/prev-next navigation between recipes (see TODO.md)
- Collapsible "story behind the recipe" section
- Related recipes from the same region
