# Passport Onboarding & Back Cover — Design Spec

**Date:** 2026-04-19
**Branch suggestion:** `passport-onboarding-back-cover`
**Status:** Spec — awaiting implementation plan.

---

## Goal

Fix two UX gaps on `/passport`:

1. **Onboarding.** New users don't know how the passport works. Add a short "how this works" explanation on the inside-front cover *and* a persistent `?` help button in the page indicator so returning users who land mid-booklet can still reach it.
2. **Back cover.** The current back cover (`Recent stamps` list + quote + "Browse more recipes") is sparse and doesn't earn a whole page. Replace it with a **journey recap** (left half) and **next-chapter recommendations** (right half).

Both changes ship together in one PR since they share typography, scale tokens, and overall feel.

---

## Inside-front cover — onboarding block

Append a third block to the **left half** of `InsideFrontSpread.tsx`, below the existing next-tier line. No layout change to the right half (contents TOC).

Content:

```
HOW THIS WORKS
① Cook a recipe from anywhere in the app
② Earn a dated country stamp
③ Fill your passport, unlock traveler titles
```

- Label "HOW THIS WORKS" matches existing labels (`uppercase tracking-[0.3em] text-brown-medium`, same font size as "Traveler profile" / "Contents").
- Three rows; each row has a circled numeral glyph (`①②③` inline, or a small SVG — pick whatever matches Tailwind v4 tokens cleanly) and one line of body copy in `font-body`.
- Row spacing: `gap` driven by `calc(var(--stamp-size) * 0.2)` so it scales with the booklet.
- No links inside the block — it's read-only text.

Fallback: if the user's viewport is below the tight 375×667 threshold and content overflows, the block is allowed to drop below the fold of the left half since the booklet already allows vertical flow within each half in `BookletShell`. Don't add internal scroll.

---

## Help modal — `?` in page indicator

New component `components/passport/PassportHelpModal.tsx`:

- Controlled by a boolean `open` prop + `onClose` handler. No portal needed beyond what the existing `StampedRecipesModal` uses (reuse its fixed backdrop + card pattern for visual consistency).
- Title: **"How your passport works"**.
- Body (in order):
  1. Same three numbered steps as the inside-front block (DRY the copy through a shared module or duplicate — duplication is acceptable given the content is 3 lines).
  2. A short **legend** section:
     - `←` / `→` and the chevrons flip one spread at a time.
     - Continuation spreads have slugs like `west-europe-2`, `west-europe-3` for long regions.
     - A stamp is awarded the first time you cook any recipe from a country; subsequent cooks increase the ×count on the stamp.
- Dismiss: backdrop click, `Esc`, close button.
- No "don't show again" preference — the modal only opens when the user clicks `?`.

Modify `components/passport/PageIndicator.tsx`:

- Add a `?` button to the left of the existing dots (same row).
- Size: matches the dot's visual weight — use a `24px`-ish circular button with a `?` glyph, same palette as the dots (`text-brown-medium`, hover `text-terracotta`).
- Click → toggles local state that mounts the `PassportHelpModal`.
- Accessibility: `aria-label="How your passport works"`, keyboard reachable, focus returns to the `?` on close.

No auto-open behavior.

---

## Back cover — layout

Rewrite `components/passport/BackCoverSpread.tsx`. Keep it inside a `Spread withSpine={false}` wrapper (that's already how `SpreadView` renders back cover — unchanged).

Two halves via the same `grid-cols-2` used by region spreads. Spine is off for back cover (already true).

### Left half — "Your journey"

```
YOUR JOURNEY                      ← small uppercase label
{tier.title}                      ← huge font-heading, e.g. "Wayfarer"

First stamp      {country · date} ← oldest cooked_at
Most recent      {country · date} ← newest cooked_at
Top region       {region · N}     ← region with most total stamps
Reach            {C countries · R regions}

{X stamps and Y regions from {nextTier.title}}   ← only if nextTier != null
```

Rows use the dotted-underline style from the existing `InsideFrontSpread` TOC for rhythm.

Date format: `12 Apr` (day-month-shortmonth) for consistency with the current Recent-stamps style. If `cooked_at` is today, render `today`.

If the user has **zero stamps**, replace the stats with:

> "Your passport is blank. The journey starts with a single recipe."

…and keep the next-tier line on its own row below (it will be "Wayfarer" distance).

### Right half — "Next chapter"

```
NEXT CHAPTER                                ← small uppercase label
Three places to cook toward your next tier. ← one line of intro

┌ MOROCCO · NORTH AFRICA         ┐
│ Chicken Tagine                  │  ← Link to /recipes/[slug]
└─────────────────────────────────┘
┌ VIETNAM · SOUTHEAST ASIA        ┐
│ Pho Ga                          │
└─────────────────────────────────┘
┌ PERU · CARIBBEAN & AMERICAS     ┐
│ Lomo Saltado                    │
└─────────────────────────────────┘

Browse all recipes →    ← small secondary link at bottom, muted style
```

Each card:
- Outer `<Link href={`/recipes/${recipe.id}`}>`. `Recipe.id` is the slug at the app layer (`dbToRecipe` in `lib/types.ts` maps `db.slug → id`), so this matches the existing `[slug]` route.
- Top row: `COUNTRY · REGION`, small uppercase `font-body` in `text-brown-medium`.
- Bottom row: recipe title, `font-heading` bold, `text-brown-dark`.
- Card styling: dotted border or soft `bg-brown-dark/5` rounded block, hover raises to `bg-brown-dark/10` and `text-terracotta` on the title.
- Card height/padding scaled from `--stamp-size`.

Empty state (user has zero stamps): the right half's label becomes **"Start here"** and the intro becomes "Three places to start your passport." Card selection algorithm still runs — there are always eligible recipes when nothing has been cooked.

Fallback (fewer than 3 eligible recipes exist): render whatever exists, and change the label to **"Keep exploring"** with intro "You've cooked nearly everything. Revisit a favorite." Cards are drawn from already-cooked countries (see algorithm below).

---

## What's-next selection algorithm

Pure function `recommendNextRecipes(recipes, summary)` in new file `lib/passport-recommend.ts`:

```ts
import type { Recipe, CulinaryRegion } from './types';
import type { PassportSummary } from './passport';

export interface Recommendation {
  recipe: Recipe;
  reason: 'new-region' | 'new-country' | 'revisit';
}

export function recommendNextRecipes(
  recipes: Recipe[],
  summary: PassportSummary,
  limit = 3,
): Recommendation[];
```

Algorithm:

1. **Identify cooked countries.** `cooked = { country | summary.stampsPerCountry.get(country)?.length > 0 }`.
2. **Pool A — new regions.** Recipes whose `region` is NOT in `summary.regionsTouched`. Sort by `(region asc, country asc, recipe.title asc)`. Pick one recipe per unique region, up to `limit`.
3. **Pool B — new countries (same or touched regions).** If more are needed: recipes whose `country` is not in `cooked` and whose `region` IS already touched. Sort same way, pick one recipe per unique country, up to remaining.
4. **Pool C — revisit.** If still under `limit`: recipes whose country IS cooked, ordered by fewest stamps first (`stampsPerCountry.get(country).length` ascending), then by `(country asc, recipe.title asc)`. Pick one recipe per country until full.

`reason` is set from the pool the recipe came from. Deterministic — same inputs always produce the same output, so reloads don't shuffle recommendations.

When all three come from **Pool C**, the display layer renders the "Keep exploring" label instead of "Next chapter".

---

## Files

**New:**
- `components/passport/PassportHelpModal.tsx` — modal, ~60 lines.
- `lib/passport-recommend.ts` — pure function, ~60 lines.

**Modified:**
- `components/passport/InsideFrontSpread.tsx` — add onboarding block in left half.
- `components/passport/PageIndicator.tsx` — add `?` button + local modal-open state.
- `components/passport/BackCoverSpread.tsx` — full rewrite for journey recap + recommendations.

**Untouched:**
- `components/passport/BookletShell.tsx`
- `components/passport/PassportBooklet.tsx`
- `components/passport/SpreadView.tsx`
- `components/passport/CoverPage.tsx`
- `components/passport/{Spread,RegionHalf,CountryStampSlot}.tsx`
- All hooks, `lib/passport.ts`, `lib/regions.ts`, `lib/passport-pack.ts`.

---

## Verification checklist (manual QA)

- [ ] Inside-front cover shows the three-step "How this works" block below the next-tier line; layout does not break the Contents TOC.
- [ ] `?` button appears in `PageIndicator`, keyboard-reachable, opens the help modal; `Esc` and backdrop click close it.
- [ ] Help modal renders the 3 steps + legend, and the copy stays readable on 375×667.
- [ ] Back cover left half shows correct "First stamp", "Most recent", "Top region", "Reach", and next-tier line against a user with a handful of stamps.
- [ ] Back cover right half shows three recommendation cards. Clicking a card navigates to `/recipes/[slug]`.
- [ ] Empty-state user (no stamps): left half shows blank-passport copy; right half label says "Start here"; three cards still render.
- [ ] Near-complete user (everything cooked once): label switches to "Keep exploring" and cards come from Pool C.
- [ ] `npx tsc --noEmit` and `npm run build` both pass.
- [ ] The rest of the booklet (cover, region spreads, deep links, chevrons, reduce-motion) is unaffected.

---

## Out of scope

- OG-image / screenshot share for the back cover.
- Auto-opening the help modal on first visit.
- Per-user preference storage (localStorage) for "seen the intro".
- Streak or day-by-day stats — would require a stamps-per-day breakdown that's not currently precomputed.
- A mini world-map visualization on the back cover.
