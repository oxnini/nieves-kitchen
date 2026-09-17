# The Cook's Journal — Edition 2 ("Traveler's Log")

**Date:** 2026-07-06
**Status:** design approved, pending implementation plan
**Supersedes in part:** `2026-07-05-cooks-journal-design.md` (the phase-3a "additive mirror, not scoreboard" framing — see the memory note `feedback_journal_additive_not_scoreboard.md` for the amendment)
**Branch:** `journal-phase-3a`

## Why

Phase 3a shipped a deliberately austere journal: a masthead, the Log, an earned title, and the stamp gallery, with **all forward-progression stripped out** (the tier ladder, "N to next title", and recommendations were kept off the journal and left to the passport / Atlas). In use, that pure-mirror version felt hollow — the earned title (e.g. "Curious Cook") floated with no context, because the ladder that gives it meaning had been removed. The cook could not see the progression they were on.

The user chose to **bring progression back onto the journal**, editorially, not as a dashboard. This is "Edition 2 — Traveler's Log."

This reverses the phase-3a clauses "reject 'N from next tier' lines" and "explore-pull lives only on the Atlas." What is preserved: no empty region spreads, no grid-of-blanks, and no **per-collection** completion ladders (Sunnah / Sides / high-protein "you're incomplete" meters remain rejected). The *universal* linear title ladder is acceptable because it is not "parts that aren't yours."

## Page composition (populated state)

`JournalScrollView` renders these sections, in order, in a `max-w-4xl` column:

1. **Masthead** *(shipped)* — kicker "Nieves' Kitchen", title "The Cook's Journal", "Kept since {month year}", right-aligned stats **Meals · Dishes · Countries**.
2. **The Log** *(shipped)* — wide-ledger rows (date · dish mark · title · note-gated dotted leader · margin note), month-grouped, under a "The Log" heading.
3. **Rank block** *(NEW — `JournalRank`)* — Treatment A, type-first. See below.
4. **Journey so far** *(NEW — `JournalJourney`)* — a compact recap ledger. See below.
5. **Stamps collected** *(shipped — `JournalStamps`)* — the region-grouped country-stamp gallery, stamps trimmed to `clamp(76px, 20vw, 112px)`. The travel identity is no longer nested here; it has moved up into the rank block.
6. **Where next?** *(NEW — `JournalWhereNext`)* — one recommendation card at the foot.

## Components

### `JournalRank` (replaces `TravelIdentity`)

Treatment A ("type-first"). No badge graphic — the flat tier-badge WebPs were explicitly rejected.

**Renders:**
- Eyebrow "Your title" + the current title in the stamped mono face.
- Two progress **meters**: `Countries {uniqueCountries} / {nextTier.minStamps}` and `Regions {regionsTouched} / {nextTier.minRegions}`, each a segmented rule. Countries uses terracotta ink, Regions uses teal, so the two axes read apart.
- A "toward" line: "N more countries and M region(s) to **{nextTier.title}**." Only name the dimensions that are actually short (if regions are already met, say only countries, and vice-versa). Never a negative/"debt" tone — it is an invitation.
- The **ladder**: every `EXPLORER_TITLES` tier rendered inline, styled by state — *passed* (dim), *current* (boxed), *ahead* (faint).

**Data:** `summary.title`, `summary.nextTier`, `summary.totalStamps` (== unique countries), `summary.regionsTouched.size`, and `EXPLORER_TITLES`. All already on `PassportSummary`.

**States:**
- **Max tier** (`nextTier == null`): hide both meters and the "toward" line; show the ladder with the final tier as current, plus "You've reached the highest title." No progress gauge to a nonexistent next.
- **New Explorer / origin-less-only cook** (0 countries): the block still renders the title and ladder; meters read `0 / min`. It is a horizon, not a reprimand.

### `JournalJourney` (new)

A four-row recap ledger under a "Journey so far" heading, two columns on desktop, one on mobile. Rows (each `LABEL … value`, dotted rule between):
- **First cook** — dish title · day.
- **Most recent** — dish title · day. *Hidden when it would duplicate First cook* (i.e. only one cook so far), mirroring `InsideFrontSpread`'s dedupe.
- **Top region** — region · dish count.
- **Most cooked** — dish title · `N×`. *Hidden when every dish has been cooked exactly once* (no repeat to celebrate).

**Data:** derived in the data layer (a `buildJourneyRecap` helper in `lib/journal.ts`) from the enriched stamps + recipe meta, so `JournalScrollView` stays presentational. `computeTopRegion` already exists in `InsideFrontSpread` — lift it into `lib/journal.ts` and share it rather than duplicating.

### `JournalWhereNext` (new)

One recommendation card (dashed rule, "Where next?" kicker, recipe title, an editorial reason line, a link to `/recipes/{slug}`).

**Data:** `recommendNextRecipes(recipes, summary, 1)[0]`. Reason copy maps from `RecommendationReason`:
- `new-region` → "A new region for you — {region}. One dish opens a whole corner of the map."
- `new-country` → "Your first from {country}."
- `revisit` → a warm "return to {country}" line.

**States:**
- **No recommendation** (nothing left to suggest, or the dev route passes an empty recipe list): render nothing. Never a placeholder.
- **Rotation:** v1 ships the deterministic top pick. Optional later: rotate among the top ~3 by day-of-year so the card feels alive without reshuffling within a session.

## Data-layer plumbing

- `JournalScrollView` gains what it needs to render the three new sections. Keep it **presentational**: the recap and the single recommendation are computed upstream (`useCookedStamps` for the real route; the `/dev/journal` fixtures for the sandbox) and passed in, exactly as `stats`/`entries` already are. The rank block reads straight from the `summary` prop it already receives.
- `/dev/journal` must continue to make **zero Supabase calls**; it feeds every new section from fixtures. Where-next needs a recipe pool — the dev route should pass a small fixture recipe list so the card renders (today it passes an empty `recipesByCountry` only).

## States summary

| State | Rank | Journey | Stamps | Where next |
|---|---|---|---|---|
| Empty (0 meals) | hidden (masthead-only nascent line) | hidden | hidden | hidden |
| 1–3 cooks | shown (early tier, meters low) | shown, dedupe rules apply | shown if any country cook | shown if a rec exists |
| Origin-less only | shown (New Explorer/Curious) | shown | hidden (no country stamps) | shown (recommends countries) |
| Max tier | shown, meters hidden, "highest title" | shown | shown | shown if a rec exists |

## Non-goals / preserved rejections

- No badge / medallion art in the rank block (type-first only; a single evolving wax-seal, Treatment C, was considered and deferred — it would need commissioned art).
- No per-collection completion meters (Sunnah / Sides / protein). No grid-of-blanks. No empty region spreads.
- No wall of recommendations — exactly one "where next?" card.

## Already shipped on the branch (this session, pre-spec)

Wide-ledger Log row, masthead with right-aligned stats + "Kept since", widened container, the third stat changed from "Corners" (regions) to **Countries**, `TravelIdentity` reduced to type-only (to be superseded by `JournalRank`), and the stamp gallery trimmed. Typecheck green.
