---
name: Postmarks — seeded perimeter placement + dedupe by recipe
description: Passport cancellation postmarks are seeded by (country, slug), placed on a visa's perimeter, and dedupe to one-per-unique-recipe
type: feedback
originSessionId: 8ecd9749-9282-4cea-9b5e-cba6f55ae656
---
Three combined rules for the passport cancellation postmark layer:

1. **One postmark per unique recipe per country**, not one per
   `passport_stamps` row. Recooking the same dish does not add a new
   postmark. Repetition is expressed elsewhere (inside-front
   `mealsCooked`, the §5 frequent-visitor seal at 10 total cooks).

2. **Postmarks live around the visa perimeter.** Centres are placed
   in a `[36%, 44%]` radial band from the visa centre, with the
   postmark half-width of ~23% letting them clip past the visa edge
   in places. The middle of the visa stays clear for the authored art.

3. **Placement is seeded per-recipe, not by ordinal.** Each
   postmark's angle, radius, and rotation are deterministic functions
   of `(country.toLowerCase(), recipe_slug.toLowerCase())` — three
   independent FNV-1a hashes of one seed string. Adding, undoing, or
   recooking a recipe never shifts any other postmark. Two countries
   with the same recipe slug get different positions; the same
   country always stamps the same recipe in the same spot.

**Why:** earlier drafts put one postmark per cook row, clustered
toward the centre (~28% from centre), then a fixed 5-slot model at
the corners. The cluster looked messy; the fixed slots looked
geometric (three recipes formed a perfect triangle, four a perfect
rectangle — designed, not earned). User explicitly asked for
deduplication + perimeter placement on 2026-05-13, then preferred
seeded-polar over fixed slots in the follow-up critique.

**How to apply:**
- All derivation lives in `useCookedStamps#placementFor(country, slug)`.
  The hook returns `cancellationsByCountry: Map<string, CancellationInput[]>`
  where each entry already has `center: {x, y}` (% of visa box) and
  `rotation` (±12°) computed.
- `CountryStampSlot.tsx` is purely a renderer: it consumes `center`
  and converts to CSS `top/left` (subtracting the 23% half-width).
  A `fallbackCenter(i)` exists for the `/dev/cancellation` scratch
  route's hand-crafted data, which has no seed.
- SPEC §3, §3.1, §4 are the source of truth.
- Do **not** reintroduce a `recipe_index` or any list-position-based
  seed — it couples postmarks to each other in a way that violates
  stability when the recipe set changes.
