# Passport: Ten Regions, Blank Pages — Design

**Date:** 2026-04-18
**Branch base:** `passport-booklet-fit-pack` (to be continued on a new branch)
**Related prior specs:**
- `docs/superpowers/specs/2026-04-18-passport-booklet-redesign-design.md`
- `docs/superpowers/specs/2026-04-18-passport-booklet-fit-and-pack-design.md`

## Summary

Collapse the passport booklet from 20 sub-regions to the 10 existing top-level `CulinaryRegion` values. Each region gets its own spread (one region per two-page spread, always present, 10 fixed spreads). Pages start blank: no placeholder slots, no country names, no "uncooked" affordances at the country level. Stamps populate in cooked-order (Supabase `cooked_at` ascending) into a 3×4 grid per half (24 slots per spread), with continuation spreads (`· cont'd`) for overflow. Stamps render 15% larger (linear) than today to take advantage of the lower grid density. Each region spread exposes one `Browse <Region> recipes →` link in the header (first spread only) as the sole uncooked-cuisine discovery affordance. The world map is untouched; sub-region code remains for the map's use.

## Goals

- Simpler mental model for users: fewer, more recognizable regions.
- Blank-until-earned passport aesthetic — stamps are the only marks on the page.
- Preserve fit-to-viewport and existing navigation/flip/deep-link behavior from prior work.
- Retain a lightweight discovery path to uncooked cuisines (region-level browse link).
- Keep scope strictly inside the passport; the world map and recipe pages are not touched.

## Non-goals

- Changing the world map's two-level drill-down or its sub-region data.
- Changing Supabase schema, the `cooked_stamps` model, or `useCookedStamps`.
- Adding per-country uncooked discovery affordances inside the booklet.
- Changing cover, back-cover, or modal (`StampedRecipesModal`) behavior.

## Region model

- **Regions used:** the 10 values of `CulinaryRegion` from `lib/types.ts`, in their existing declaration order:
  1. Western Europe
  2. Eastern Europe
  3. East Asia
  4. Southeast Asia
  5. South Asia
  6. Japan & Korea
  7. Middle East
  8. North Africa
  9. Sub-Saharan Africa
  10. Caribbean & Americas
- **Source of truth per recipe:** `Recipe.region` (already populated).
- **Source of truth per stamp:** the country's region is `Recipe.region` for any cooked recipe from that country (all recipes for a given country share the same region, by data shape).

## Booklet structure

Spread sequence from front to back:

1. Cover (single centered half-width panel)
2. Inside-front TOC (full spread)
3. 10 region spreads, in the order above. Each region appears as at least one spread (even if empty), plus continuation spreads when overflow occurs.
4. Back cover (single half-width panel)

All existing chrome is retained: spine (in `BookletShell`), nav chevrons (in the `chrome` slot, outside the clip), page indicator, keyboard nav, deep-link via `?spread=<slug>`, reduced-motion cross-fade.

## Spread anatomy

### Region spreads

- **Header** lives at the top of the **left half** of the first spread for a region. Contains:
  - Region name (large, `font-heading`).
  - A small secondary link: `Browse <Region> recipes →`, navigating to `/recipes?region=<encoded region name>`.
- **Continuation spreads** (`· cont'd`) show the region name + `· cont'd` label in the header, and **omit** the browse link.
- **Stamp grid:** 3 columns × 4 rows per half = 12 slots per half, 24 slots per spread. Stamps are sized via the `--stamp-size` CSS variable, scaled to be **15% larger (linear)** than the previous 4×4 size while still fitting the half's content budget.
- **Inter-region divider:** removed. One region per spread means no intra-half division.
- **Spine** (vertical fold line between halves): retained as today, owned by `BookletShell`, fixed during flips.
- **Empty state:** a region with zero cooked countries shows only the header + browse link on the left half; the right half is blank paper texture. No "no stamps yet" hint.

### Inside-front TOC

- Full spread, same general treatment as today (layout, typography, chrome).
- One row per top-level region, 10 rows total.
- Each row shows:
  - Region name.
  - Count badge: `<N> cooked` — no denominator.
  - Chevron affordance that deep-links to the region's first spread (`?spread=<slug>`).
- No progress bars, no locked/empty row treatment — rows are always visible, counts update as stamps land.
- No sub-region rows.

### Cover / back-cover

Unchanged.

## Stamp fill order

- **Ordering key:** the ascending `cooked_at` of the **first** cooked recipe for a given country. Cooking additional recipes from an already-stamped country does not reorder or duplicate the stamp.
- **Tie-break:** for rare ties on `cooked_at`, sort by country name ascending.
- **Grid fill:** left half first, reading order (row 1 slots 1–3, row 2 slots 4–6, …), then right half (slots 13–24). Slot 25+ starts the next continuation spread for the same region.
- **Continuation slug pattern:** first spread uses the region slug (kebab-case of region name); continuation spreads append `-2`, `-3`, … as today.
- **Removal behavior:** if a country loses all its stamps (all underlying recipes become uncooked), its stamp vanishes and subsequent stamps shift left/up to keep the fill contiguous. (Rare in practice; mirrors today's derived-from-state behavior.)

## Data flow

1. `usePassportSpreads({ recipes, summary })` is rewritten:
   - Build an ordered list of cooked countries per top-level region from `summary.stampsPerCountry` (already keyed by country) — order by each country's first `cooked_at`.
   - For each of the 10 regions (always, even empty), emit one `RegionSpread` for the first 24 cooked countries, plus as many continuation `RegionSpread`s as needed.
   - Return `[cover, inside-front, …region spreads…, back-cover]`.
2. `lib/passport-pack.ts` is rewritten to a simpler chunker: `(orderedCountries: string[], region: CulinaryRegion) → RegionSpread[]`, each spread carrying `{ region, slug, continuationIndex, countries: string[] /* up to 24 */ }`.
3. `RegionHalf` renders its half's slice of the spread's countries into the 3×4 grid. The first spread's left half also renders the header + browse link.
4. `InsideFrontSpread` reads from `summary.stampsPerCountry` grouped by `CulinaryRegion` (either derived in the component or exposed by `summary` as a helper) to display counts.

## Stamp component

`CountryStampSlot` is simplified:

- Removes the uncooked/placeholder rendering path and the `onUncookedClick` prop.
- Always renders a cooked stamp; tapping opens `StampedRecipesModal` for that country.
- Consumers no longer pass a full region country list — they pass only the ordered list of cooked countries for their slice.

## Sizing

- `--stamp-size` (and any tokens feeding it in `app/globals.css` / `BookletShell`) are adjusted so that a 3×4 grid at the new size fits the half's content budget within the existing viewport-fit envelope (1920×1080 down to 375×667). Target increase: **+15% linear** over the previous 4×4 stamp size. The exact final value is whatever keeps 3×4 + header + padding inside the budget; 15% is the intent, not a hard pixel contract.
- All other viewport-fit math (half width, padding, header scaling via `--stamp-size`) continues to work as today; only the grid dimensions and stamp size change.

## Files impacted

**Rewrite:**
- `components/passport/hooks/usePassportSpreads.ts`
- `lib/passport-pack.ts`

**Edit:**
- `components/passport/RegionHalf.tsx` — drop the paired-block path, drop inter-region divider, add browse link in header (first spread only), render 3×4 over cooked-country slice.
- `components/passport/CountryStampSlot.tsx` — delete uncooked/placeholder path and `onUncookedClick`.
- `components/passport/InsideFrontSpread.tsx` — 10 rows of top-level regions, `N cooked` badge (no denominator).
- `app/globals.css` — update `--stamp-size` / related tokens for 3×4 at +15%.

**Keep untouched:**
- `components/WorldMap.tsx`
- `lib/regions.ts` (sub-region constants remain for the map)
- `lib/types.ts` (`SubCulinaryRegion` and `CulinaryRegion` both stay)
- `hooks/useCookedStamps.ts`, `lib/passport.ts` (`PassportSummary`)
- `components/passport/BookletShell.tsx`, `Spread.tsx`, `SpreadView.tsx`, `CoverPage.tsx`, `BackCoverSpread.tsx`, `NavChevrons.tsx`, `PageIndicator.tsx`, `PaperTexture.tsx`, `StampedRecipesModal.tsx`, `PassportBooklet.tsx` (only prop-shape changes if needed).

## Verification checklist (manual QA, post-implementation)

- [ ] New user (zero cooked) sees: cover, inside-front with 10 rows all at `0 cooked`, 10 empty region spreads (each with header + browse link on left half, right half blank), back cover.
- [ ] Cooking a first recipe (e.g., from Japan) places a single stamp in slot 1 of the left half of the `Japan & Korea` spread. Inside-front shows `1 cooked` on that row.
- [ ] Cooking a second country in the same region puts its stamp in slot 2, in cooked order.
- [ ] Cooking a second recipe from an already-stamped country does not add a second stamp or reorder existing stamps.
- [ ] A region with >24 unique cooked countries overflows into a `· cont'd` spread; continuation spread's header omits the browse link.
- [ ] Browse link on a region spread navigates to `/recipes?region=<Region>` with the filter applied.
- [ ] Fits viewport at 1920×1080, 1440×900, 1280×720, 768×1024, 375×667 with no scroll.
- [ ] Stamps are visibly larger than before (target ≈ +15% linear).
- [ ] Spine visible on all region spreads; no inter-region divider anywhere.
- [ ] `/passport?spread=<slug>` deep links work for both primary and continuation slugs.
- [ ] Keyboard `←`/`→` and chevrons flip by spread.
- [ ] Cooked stamp → opens `StampedRecipesModal`; no uncooked-stamp tap behavior exists.
- [ ] World map and `/recipes` pages unchanged.
- [ ] OS "Reduce motion" → flips become cross-fades.

## Out-of-scope follow-ups

- Simplifying the world map to a single-level drill-down over the same 10 regions (would let us delete `SUB_REGION_*` and `COUNTRY_TO_SUBREGION`).
- Per-country uncooked discovery inside the booklet (e.g., a "what's left in this region?" modal).
- Animated stamp-landing or "new stamp" highlight on first cook.
