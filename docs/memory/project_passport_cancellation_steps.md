---
name: Passport cancellation system implementation
description: Multi-step build of the cancellation overlay on passport visas per docs/stamps/SPEC.md; steps 1–4 done, step 6 deliberately cut, steps 5 + 7 remain
type: project
originSessionId: 89c88272-5249-4688-a697-8bab82438466
---
The passport cancellation system (visa = identity, cancellation = dated
postmark per unique recipe) is being built in 7 ordered steps. Source of
truth: `docs/stamps/SPEC.md`. One PR per step, no bundling.

**Status as of 2026-05-13:**

- ✅ **Step 1** — `CancellationMark.tsx` SVG + `/dev/cancellation`
  scratch route. Frozen.
- ✅ **Step 2** — `lib/cancellation-traits.ts` (per-country glyph +
  per-region ink). Frozen.
- ✅ **Step 3** — `CountryStampSlot` composites cancellations on top of
  the visa. Sibling-of-button layering so the visa's `mix-blend-multiply`
  doesn't trap the cancellation.
- ✅ **Step 4** — Real data wiring + model overhaul.
  - `useCookedStamps` exposes `cancellationsByCountry: Map<string, CancellationInput[]>`.
  - **Deduplicated by `recipe_slug`** — one postmark per unique recipe,
    not per cook (SPEC §3 revised). Earliest `cooked_at` wins.
  - **Seeded polar placement** — `placementFor(country, slug)` derives
    `{ center, rotation }` from three independent FNV-1a hashes of
    `country:slug`. Angle uniform in [0°, 360°), radius in [36%, 44%]
    of visa box, rotation ±12°. No ordinal index; no fixed slots
    (SPEC §4 revised, supersedes the original "5 rotation slots" plan
    that was part of step 5).
  - `Stamp.cook_index` was added then removed — not needed by the
    seeded model. `Stamp.recipe_title` (joined via `slugToTitle`) is
    kept and used by the postmark's top arc.
  - SPEC §3, §3.1, §4 rewritten to match.
- ⏳ **Step 5** — **Patina only** (the "rotation slots" half of step 5
  is now obsolete since slots no longer exist). Soft-cap to 5
  cancellations at full opacity; older first-cooks fade to ~40% and
  slide under newer ones (SPEC §5). Practically rare with the dedup
  model — a country needs 6+ unique recipes to hit the cap.
- ❌ **Step 6** — 10-cook gold corner seal. Built then **removed**
  2026-05-13 after visual review. Reasons recorded in SPEC §5: the
  gold star read as a video-game achievement badge (gamification —
  exactly the §1 anti-goal), and gold didn't fit the parchment /
  terracotta / sepia palette. Repetition is already shown via
  `mealsCooked` on the inside-front profile and via the explorer tier
  titles in `lib/passport.ts`; a third channel for the same data was
  overkill. **Do not revisit the gold star**; if a future repetition
  indicator is wanted, the editorial alternatives that stayed on the
  table were a thin warm border on the visa frame or a wax-seal-style
  mark in wine/terracotta.
- ⏳ **Step 7** — SPEC §9 layout change: `COLS_PER_HALF 3 → 2`,
  `ROWS_PER_HALF 4 → 3` in `lib/passport-pack.ts` AND
  `components/passport/BookletShell.tsx` (dedupe the constant). Add
  empty-region spread component (§9.3) if missing.

  **2026-05-13 attempt reverted.** Naively swapping the constants
  blew up everything (region header font, browse link, IMAGE_STAMP_SIDE,
  cancellation postmark size) because the entire booklet typography is
  scaled off `--stamp-size` via `calc(var(--stamp-size) * X)`. Result:
  enormous "North America" heading, single Mexico stamp filling the
  left half, postmarks running off the page, right half empty.

  Before re-attempting: the booklet typography (`RegionHeader` font
  sizes, IMAGE_STAMP_SIDE multiplier, the half's flex gap formula in
  `RegionHalf.tsx`) needs to be **decoupled from `--stamp-size`** —
  either anchored to page width/height directly, or governed by a
  separate `--ui-size` token that stays constant while `--stamp-size`
  grows. Until that decoupling is done, do not touch
  `COLS_PER_HALF` / `ROWS_PER_HALF`.

**Open SPEC inconsistency to address before step 5:**
SPEC §5 still describes a `mix-blend-multiply` patina (older
cancellations slide *under* newer ones). That language pre-dated the
seeded model; with no slot ordering, "under" needs to mean either
"earliest first-cook" or "by z-index by first-cook". Resolve in the
SPEC before implementing.

**Why:** Replaces the old "one stamp per country" model with a
two-layer visa + cancellation system so a second *recipe* from a
country leaves a visible mark instead of being indistinguishable from
the first.

**How to apply:** Treat the SPEC as authoritative — read end-to-end
before working on any step. The user has authored colourful visa
WebPs already; do not regenerate or swap them. The `passport_stamps`
schema is fixed; no migrations. No new dependencies.
