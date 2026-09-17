# Home polish: hero density, collections treatment, collection-as-shelf

**Date:** 2026-07-03
**Status:** approved (verbal, post-checklist feedback session)
**Branch:** lands pre-merge on `revamp/phase-1-pivot`
**Parent spec:** `2026-07-03-table-pantry-atlas-revamp-design.md` (this refines its phase 1 home, which shipped as a deliberate first pass)

## Motivation (user's checklist feedback)

1. The masthead headline and intro occupy only ~half the container width; the
   top-right of the page is empty, and the vertical rhythm pushes the Table
   spread photo below the fold ("you can barely see the lasagna").
2. The collection banners read as plain labeled boxes ("boring, not appealing").
3. Landing on `/recipes?collection=high-protein` feels off: the Filters button
   badge counts the collection, but the opened panel shows all defaults (badge
   and panel disagree), and the panel's protein slider overlaps the
   collection's own 25g rule (redundant systems).

## 1. Hero: tighter and wider (no structural change)

- `components/home/Masthead.tsx`: remove the `max-w-3xl` cap on the header and
  the `max-w-[58ch]` cap on the intro paragraph.
- Headline sized so "A well-travelled table, cooked with care" sits on ONE
  line at desktop widths (reduce the type step if needed, e.g. `lg:text-5xl`
  range; verify empirically). Mobile wraps naturally — the one-line rule is
  desktop-only.
- Intro sentence sits on one line at desktop.
- `app/page.tsx`: the uniform `space-y-14 sm:space-y-20` gap must NOT apply
  between Masthead and TableSpreadHero; group them (or use a small explicit
  margin, ~`mt-6/8`) so masthead + the full spread (photo included) fit a
  typical laptop viewport on load.
- The photo's size and crop stay exactly as shipped. Do not enlarge it.

## 2. Collections: pick a treatment via /dev preview

- Create `app/dev/home-collections/page.tsx` (existing `app/dev/*` sandbox
  convention: shares `app/dev/layout.tsx`, not in shipped navigation).
- It renders the CURRENT `CollectionsRow` plus three variants, all fed by the
  real `COLLECTIONS` and live `useRecipes()` data:
  - **A — accent tones:** each banner keyed to one palette token
    (terracotta, turmeric, sage, teal) as a wash/edge/heading tint.
  - **B — food imagery:** each banner shows a thumbnail (or small cluster)
    from that collection's actual member recipes. NOTE: today only
    high-protein has members (sides and sunnah are empty; travels has no
    `includes`), so this variant MUST look intentional with zero members —
    e.g. travels shows a placed recipe's photo, empty shelves get a quiet
    editorial fallback, never a broken or placeholder-looking box.
  - **C — cookbook chapter:** small-caps chapter marks, ruled lines, recipe
    counts ("6 recipes"), serif-led; no color washes or photos.
- The user picks a winner (or hybrid) in the browser; the winning treatment
  then replaces the internals of `components/home/CollectionsRow.tsx`
  (same props: none; same data source). The /dev route stays as sandbox.
- Sunnah collection remains LAST in every variant (parent spec §3).

## 3. Collection-as-shelf on /recipes

When `?collection=` is active in `app/recipes/page.tsx`:

- Render an editorial **shelf header** above the grid: collection `title`,
  its one-line `description`, and an X control that clears the `collection`
  param (router.replace, keep other params).
- REMOVE the collection from `activeFilterCount` (the `+ (activeCollection ? 1 : 0)`
  term) and REMOVE its chip from the active-chips list — the panel and badge
  must always agree; the panel's role is narrowing within the shelf.
- Keep as-is: the membership filtering itself, `emptyCopy` rendering, and the
  "loosen your filters" suppression when the collection is the only narrowing.
- Side effect (intended): the parked "?collection=travels is a truthy no-op
  chip/badge" finding is retired — collections no longer touch chips/badge.

## Constraints (inherited, binding)

- Gates: `npm run typecheck` then `npm run build` only.
- No em dashes in user-facing strings; ﷺ preserved; halal-consistent copy;
  design tokens only; `sizes` on every `next/image` (thumbnails in variant B);
  no new dependencies.
- Commit trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## Order of work

1. Hero tightening + shelf header (deterministic, no user gate).
2. /dev variants route → **user browser pick** (gate) → apply winner to
   `CollectionsRow`.
3. Re-run gates, quick re-review of the polish diff, then
   finishing-a-development-branch for the whole branch.
