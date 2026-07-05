# Cook's Journal — Phase 3a Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/journal` — a vertical editorial scroll that mirrors what the cook has actually cooked (an additive Log of every cook plus the re-homed stamp craft), replacing the passport-booklet open path, deriving everything from existing `passport_stamps` with zero new writes.

**Architecture:** A new client route `/journal` renders a `JournalScroll` composed of three conditional sections (Masthead + counts-up stats · the Log · Stamps collected). All data derives from `useCookedStamps`, which we extend with a reverse-chronological `entries` list and per-entry margin notes computed by a new pure module `lib/journal.ts`. The passport's stamp components (`CountryStampSlot`, `StampedRecipesModal`, `TierLedger`, `PaperTexture`, stamp designs) are reused verbatim; the booklet paging engine and overlay-open path are left dormant (staged retirement). Visual iteration happens on a `/dev/journal` scratch route driven by fixtures before the real route is wired.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · TanStack Query · existing Supabase `passport_stamps` + `recipes`. No new dependencies.

## Global Constraints

Every task's requirements implicitly include this section. Values copied from the brief (`docs/superpowers/specs/2026-07-05-cooks-journal-design.md`) and project memory:

- **Additive mirror, never a scoreboard.** Never render an empty slot, a locked/greyed future badge, a completion meter, a "next tier" / "N from the next title" line, or a collection-seal ladder. A section renders only when the cook has content in it. (Brief §2, §4.)
- **Zero new writes / tables / migration.** Everything derives from `passport_stamps` (already null-`recipe_country` tolerant) joined to `recipes`. The app's only write stays the cooked stamp. (Brief §5, §9.)
- **No em dashes (—) in any user-facing website string.** Em dashes are fine in code comments/commits/this doc.
- **ﷺ convention** respected in all user-facing copy. Use the exact form `Prophet’s ﷺ table` (curly apostrophe, as in `lib/collections.ts`).
- **Never fabricate a narration or ruling.** Derived lines make factual claims about the cook's *own* history only.
- **The passport is a physical object.** Any surface bearing stamp craft (`mix-blend-multiply` + `[filter:url(#stamp-ink)]`) must sit on locked parchment via the `passport-paper` / `passport-light` classes, so it renders identically and multiplies correctly in both themes.
- **Two warm themes** (parchment default + sepia); verify every deliverable in both.
- **iOS:** any text input ≥ 16 px (none are planned here; the rule stands).
- **Verification gate:** `npx tsc --noEmit` AND `npm run build` (CI parity). `npm run lint` is broken; do not rely on it. There is no unit-test runner; correctness is enforced by `tsc`, `build`, and browser verification on `/dev/journal` in both themes.
- **Branch discipline:** all work on a new branch off `main`; do not push or touch `main` without asking. `main` is 8 commits ahead of origin and unpushed.

---

## Scope

**In (Phase 3a — the scroll, brief §4.1, §4.2, §4.4, §4.6, §5.1, §8, §10):**
- `/journal` route: a vertical editorial scroll (not overlay, not booklet).
- Masthead with only-counts-up stats (meals · dishes · corners of the world). No next-tier line.
- The Log: reverse-chronological feed of every cook including re-cooks; each entry = Cutive Mono date · dish mark (country mini-stamp for travel cooks, a quiet non-country dish mark for origin-less cooks) · title linking to the recipe · one derived per-entry margin note.
- Stamps collected: inline gallery grouped only by regions actually touched; tap a stamp → existing `StampedRecipesModal`; relocate the five explorer titles + tier ledger here as earned travel identity (no next-tier debt line).
- Designed empty/nascent state (0–3 cooks looks intentional).
- Navbar `PassportAffordance` becomes a plain link to `/journal` (keeps prefetch-on-idle/hover); overlay open path retired.

**Out (later phases / other tracks — do NOT build):**
- Reflections / pull-quotes and milestone marks (Phase 3b, brief §4.3, §4.5, §5.2, §6).
- Atlas personal layer + "where next?" callout (Phase 3c, brief §7).
- Editable/persisted personal notes (out of scope, brief §11).
- Deleting the retired booklet files (optional later cleanup, brief §8, §11) — leave dormant.
- Lazy-load/windowing of the Log. YAGNI at current data scale (tiny audience, few cooks); render all entries with month dividers. Add windowing only when the list actually grows. (Brief §4.2 mentions lazy-load "as it lengthens"; not needed now.)

---

## Two judgment calls (recommended defaults, veto at sign-off; both cheap to flip on `/dev/journal`)

1. **"Corners of the world" stat = regions touched** (not countries). Rationale: it gives the masthead a descending-uniqueness triad (meals ≥ dishes ≥ corners) and stays consistent with the Phase 3b reflection copy "You've cooked in {N} corners of the world" (brief §5.2), which is region-gated. The `/dev/journal` route exposes a toggle so the pick is verifiable visually.
2. **Relocated travel identity defaults to an earned-identity treatment, not `TierLedger` unchanged.** Brief §4.4 is explicit: "No 'next tier' debt line; the title is shown as earned identity only." `TierLedger` as-built renders all five tiers including locked future ones with their requirements ("20 stamps · 10 regions") — that is a debt ladder and conflicts with §2/§4.4. So production uses a new `TravelIdentity` component (current earned title + completed rungs only, no locked requirements, no next-tier line). The unmodified `TierLedger` is kept mounted on `/dev/journal` as a visual reference variant only; `TierLedger` itself is not edited (staged). This is additive and spec-compliant, not a deviation, so no SPEC patch is required.

---

## File Structure

**Create:**
- `lib/journal.ts` — pure derivation: `JournalEntry` type, `buildJournalEntries()`, `deriveMarginNote()`, `journalStats()`, and Phase-3a tunables. No React, no Supabase; unit-reasoned in isolation and exercised by fixtures on `/dev/journal`.
- `components/journal/JournalScroll.tsx` — top-level client composer; reads `useCookedStamps`, renders masthead + Log + Stamps, handles empty/nascent + loading, owns the `StampedRecipesModal` open state.
- `components/journal/JournalMasthead.tsx` — title, optional handle, counts-up stats row.
- `components/journal/JournalStat.tsx` — one stat (big number + label); renders only when count > 0.
- `components/journal/JournalLog.tsx` — the reverse-chron feed with month dividers.
- `components/journal/JournalEntryRow.tsx` — one Log entry (date · dish mark · title link · margin note).
- `components/journal/JournalDishMark.tsx` — small country mini-stamp (custom WebP or procedural design) OR quiet non-country dish mark, on a locked parchment tile.
- `components/journal/JournalStamps.tsx` — Stamps-collected gallery grouped by touched regions + the "see your world on the atlas →" link; owns nothing (stamp clicks bubble up to `JournalScroll`).
- `components/journal/TravelIdentity.tsx` — relocated explorer titles as earned identity (no debt line).
- `app/journal/page.tsx` — client route shell: parchment container, `PaperTexture`, Suspense skeleton, renders `JournalScroll`.
- `app/journal/loading.tsx` — route-level parchment skeleton (mirrors `app/passport/page.tsx`'s skeleton tone).
- `app/dev/journal/page.tsx` — scratch route: fixture-driven previews with a state selector (0 / 1 / 3 / many cooks, incl. re-cooks + origin-less) and the two A/B toggles above.
- `app/dev/journal/fixtures.ts` — hand-authored `Stamp[]` + minimal recipe-meta fixtures covering every margin-note branch.

**Modify:**
- `hooks/useCookedStamps.ts` — add `entries: JournalEntry[]` (reverse-chron) and `stats` to the return value, computed via `lib/journal.ts`. Existing return fields untouched.
- `components/passport/PassportAffordance.tsx` — convert from overlay-open button to a `next/link` to `/journal`; keep the stamp-count badge and prefetch-on-idle/hover; add `router.prefetch('/journal')`; drop `usePassportOverlay`/`setPassportOrigin` usage; active state from `usePathname()`.

**Reuse verbatim (do NOT modify):**
- `components/passport/CountryStampSlot.tsx` (+ its `CancellationInput` type), `components/passport/stamps/*`, `components/passport/CancellationMark.tsx`, `components/passport/PaperTexture.tsx`, `components/passport/InkMark.tsx`, `components/passport/StampedRecipesModal.tsx`, `components/passport/TierLedger.tsx`.
- `lib/passport.ts`, `lib/passport-stamps.ts`, `lib/stamp-traits.ts`, `lib/cancellation-traits.ts`.

**Leave dormant (staged retirement — do NOT delete):**
- `BookletShell`, `SpreadView`, `PassportBooklet`, `usePassportSpreads`, `useBookletNav`, `packRegion` (`lib/passport-pack`), `EmptyRegionSpread`, `RegionMotif`, `lib/passport-empty-copy`, `RegionChipStrip`/`RegionChip`, `CoverPage`, `ContentsSpread`, `InsideFrontSpread`, `BackCoverSpread`, `PageTurnInkMark`, `PassportOverlay`/`PassportModal`, `lib/passport-origin`, `app/passport/page.tsx`. `PassportOverlayProvider` stays mounted in `Providers` (harmless, dormant) so nothing else breaks.

---

## Reference facts (verified against the codebase)

- `useCookedStamps` already fetches `passport_stamps` ordered by `cooked_at` **ascending**, enriches each row with `recipe_title`, and exposes `summary` (`PassportSummary`) + `cancellationsByCountry` (`Map<string, CancellationInput[]>`). It is gated on `useSessionReady()`; `isLoading` covers both stamps and recipes. (`hooks/useCookedStamps.ts`.)
- `Stamp` = `{ id, recipe_slug, recipe_country: string | null, cooked_at, recipe_title? }` (`lib/passport.ts`).
- `PassportSummary` = `{ totalStamps (unique countries), mealsCooked (all rows), uniqueCountries, regionsTouched, stampsPerCountry, title, nextTier }` (`lib/passport.ts`).
- `Recipe` has `isSunnah: boolean`, `region: CulinaryRegion | null`, `country: string | null`, `name`, `id` (= slug) (`lib/types.ts`).
- Stamp rendering requires the `#stamp-ink` SVG filter, which is provided by mounting `<PaperTexture />` once on the page, and requires parchment beneath for `mix-blend-multiply`. `CountryStampSlot` and stamp designs are sized off the `--stamp-size` (and `--stamp-gap`) CSS variables set on an ancestor.
- `StampedRecipesModal` props: `{ country, recipes: Recipe[], stampsByRecipe: Map<slug, Stamp[]>, onClose }`. The exact `recipesByCountry` / `modalStampsByRecipe` construction is in `PassportBooklet.tsx:61-87` — copy that pattern.
- `TierLedger` props: `{ currentTitle: ExplorerTitle, totalStamps: number }`; it renders the full five-tier journey incl. locked tiers (reference-only on dev route).
- The cook-log write path invalidates `['passport-stamps']`; `useCookedStamps` reads that same key, so the Journal reflects a new cook automatically. No new query wiring.
- `PassportAffordance` is the only caller of `usePassportOverlay().open()`. Converting it to a link fully retires the open path without touching the overlay provider.

---

## Task 1: Derivation core (`lib/journal.ts` + extend `useCookedStamps`)

**Files:**
- Create: `lib/journal.ts`
- Modify: `hooks/useCookedStamps.ts`

**Interfaces:**
- Consumes: `Stamp` (`lib/passport`), `PassportSummary` (`lib/passport`), `CulinaryRegion` (`lib/types`).
- Produces (used by all later UI tasks):
  - `JournalEntry = { id: string; slug: string; title: string; country: string | null; region: CulinaryRegion | null; cookedAt: string; isReCook: boolean; marginNote: string }`
  - `JournalRecipeMeta = { title: string; isSunnah: boolean; region: CulinaryRegion | null }`
  - `buildJournalEntries(ascendingStamps: Stamp[], metaBySlug: Map<string, JournalRecipeMeta>): JournalEntry[]` (returns reverse-chronological, i.e. newest first)
  - `journalStats(summary: PassportSummary): { meals: number; dishes: number; corners: number }`
  - `useCookedStamps()` return gains: `entries: JournalEntry[]`, `stats: { meals; dishes; corners }`.

- [ ] **Step 1: Write `lib/journal.ts` with the margin-note grammar (brief §5.1).**

Walk stamps in ascending time order, accumulating counters, compute each note by the highest-priority applicable rule, then reverse for display. `dishes` = count of distinct `recipe_slug`. `corners` = `summary.regionsTouched.size` (see judgment call 1).

```ts
import type { Stamp } from './passport';
import type { PassportSummary } from './passport';
import type { CulinaryRegion } from './types';

export interface JournalRecipeMeta {
  title: string;
  isSunnah: boolean;
  region: CulinaryRegion | null;
}

export interface JournalEntry {
  /** passport_stamps.id */
  id: string;
  slug: string;
  title: string;
  country: string | null;
  region: CulinaryRegion | null;
  cookedAt: string;
  /** True when this is the 2nd+ cook of the same recipe. Styles lightly. */
  isReCook: boolean;
  /** Derived per-entry note in the author's voice; '' means render nothing. */
  marginNote: string;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

/**
 * One derived line per entry. Highest-priority applicable rule wins
 * (brief §5.1). Claims are about the cook's own history only.
 */
export function buildJournalEntries(
  ascendingStamps: Stamp[],
  metaBySlug: Map<string, JournalRecipeMeta>,
): JournalEntry[] {
  const seenCountries = new Set<string>();
  const recipeCount = new Map<string, number>();
  const regionCount = new Map<CulinaryRegion, number>();
  let anySunnahYet = false;
  let anyCookYet = false;

  const out: JournalEntry[] = [];

  for (const s of ascendingStamps) {
    const meta = metaBySlug.get(s.recipe_slug);
    const title = meta?.title ?? s.recipe_title ?? s.recipe_slug;
    const region = meta?.region ?? null;
    const isSunnah = meta?.isSunnah ?? false;

    const priorTimes = recipeCount.get(s.recipe_slug) ?? 0;
    const nthTime = priorTimes + 1;
    const isReCook = priorTimes >= 1;

    const isFirstEver = !anyCookYet;
    const isFirstCountry =
      s.recipe_country !== null && !seenCountries.has(s.recipe_country);
    const isFirstSunnah = isSunnah && !anySunnahYet;

    const regionN = region ? (regionCount.get(region) ?? 0) + 1 : 0;

    let marginNote = '';
    if (isFirstEver) {
      marginNote = 'your first dish.';
    } else if (isFirstCountry) {
      marginNote = `your first from ${s.recipe_country}.`;
    } else if (isFirstSunnah) {
      marginNote = 'your first from the Prophet’s ﷺ table.';
    } else if (nthTime >= 2) {
      marginNote =
        nthTime === 2 ? 'cooked again.' : `your ${ordinal(nthTime)} time at this dish.`;
    } else if (region && regionN >= 2) {
      marginNote = `your ${ordinal(regionN)} from ${region}.`;
    }

    out.push({
      id: s.id,
      slug: s.recipe_slug,
      title,
      country: s.recipe_country,
      region,
      cookedAt: s.cooked_at,
      isReCook,
      marginNote,
    });

    // advance accumulators AFTER deriving this entry
    anyCookYet = true;
    if (s.recipe_country !== null) seenCountries.add(s.recipe_country);
    if (isSunnah) anySunnahYet = true;
    recipeCount.set(s.recipe_slug, nthTime);
    if (region) regionCount.set(region, regionN);
  }

  return out.reverse(); // newest first for display
}

export function journalStats(summary: PassportSummary): {
  meals: number;
  dishes: number;
  corners: number;
} {
  const dishes = new Set<string>();
  for (const [, stamps] of summary.stampsPerCountry) {
    for (const s of stamps) dishes.add(s.recipe_slug);
  }
  // stampsPerCountry only holds country-bearing cooks; origin-less dishes
  // must also count. Recompute dishes from the full meal count is wrong;
  // instead derive dishes in the hook where the full stamp list is in scope.
  return {
    meals: summary.mealsCooked,
    dishes: dishes.size, // NOTE: replaced by hook-side computation, see Step 2
    corners: summary.regionsTouched.size,
  };
}
```

> Note: `dishes` (unique recipes incl. origin-less) cannot be computed from `summary.stampsPerCountry` alone (that map excludes null-country cooks). Compute `dishes` in the hook from the full enriched stamp list (Step 2) and pass it in, OR expose `buildDishCount(stamps)` here. Implement `buildDishCount(stamps: Stamp[]): number` in `lib/journal.ts` and have the hook combine it with `journalStats` for `meals`/`corners`. Do not leave the placeholder above.

- [ ] **Step 2: Extend `useCookedStamps` to expose `entries` and `stats`.**

After the existing `summary` memo, add a `metaBySlug` memo from `recipesQuery.data` (`{ title, isSunnah, region }` per slug) and an `entries` memo calling `buildJournalEntries(enrichedStamps, metaBySlug)` (enrichedStamps is already ascending). Add a `stats` memo: `{ meals: summary.mealsCooked, dishes: buildDishCount(enrichedStamps), corners: summary.regionsTouched.size }`. Append `entries` and `stats` to the returned object. Leave every existing field intact.

- [ ] **Step 3: Typecheck.**

Run: `npx tsc --noEmit`
Expected: exits 0 (no errors).

- [ ] **Step 4: Commit.**

```bash
git add lib/journal.ts hooks/useCookedStamps.ts
git commit -m "feat(journal): derive reverse-chron entries + counts-up stats"
```

---

## Task 2: Presentational primitives — `JournalDishMark` + `JournalStat`

**Files:**
- Create: `components/journal/JournalDishMark.tsx`, `components/journal/JournalStat.tsx`
- Create: `app/dev/journal/fixtures.ts`, `app/dev/journal/page.tsx` (scaffold, expanded in later tasks)

**Interfaces:**
- Produces:
  - `JournalDishMark({ country, title, size? }: { country: string | null; title: string; size?: number })` — renders on a locked `passport-light` tile.
  - `JournalStat({ value, label }: { value: number; label: string })`.

- [ ] **Step 1: Build `JournalDishMark`.**

- Wrap in a small square tile with `passport-light` + `bg-parchment` so `mix-blend-multiply` has parchment beneath in both themes. Set `--stamp-size` on the tile (default ~56 px inline mark; accept a `size` prop, default 56).
- If `country` is non-null and `getCustomStampMeta(country)` returns meta → render the WebP via `next/image` (`unoptimized`, `object-contain`, `sizes` set) wrapped in `[filter:url(#stamp-ink)] motion-reduce:[filter:none] mix-blend-multiply`. Else if `country` non-null → `renderStampDesign(getDesign(country), { country, date: null, count: 1, color: stampColorValue(getStampTraits(country).color), subtitle: getSubtitle(country) })` inside the same filter/blend wrapper (mirror `CountryStampSlot`'s non-image branch).
- If `country` is null → the quiet non-country dish mark: a small circular ink seal using `ForkKnife` from `components/passport/stamps/shared` (or a simple inked ring + fork/knife glyph), in `--stamp-ink-charcoal`, same filter wrapper. Deliberately plainer and quieter than a country stamp so weeknight cooking sits with equal dignity but reads as non-country.
- `alt`/`aria`: the mark is decorative next to the title link; mark it `aria-hidden` (the title carries the accessible name).

- [ ] **Step 2: Build `JournalStat`** — big Literata number + small Cutive-Mono uppercase label; `nums-tabular`. Purely presentational; the caller decides whether to render it (only-counts-up: caller omits when value is 0).

- [ ] **Step 3: Author `app/dev/journal/fixtures.ts`.**

Export `Stamp[]` fixtures (ascending) plus a `metaBySlug` map covering every margin-note branch: first-ever, first-from-country, first-sunnah, re-cook (2nd → "cooked again", 4th → "your 4th time"), Nth-from-region, and origin-less (null country). Export a few named scenarios: `EMPTY` (`[]`), `ONE`, `THREE`, `MANY`.

- [ ] **Step 4: Scaffold `app/dev/journal/page.tsx`** under `app/dev/layout.tsx`. Render a swatch grid of `JournalDishMark` for: a custom-stamp country (e.g. Turkey), a procedural country (a country with no custom WebP), and origin-less (null). Render a `JournalStat` row. Mount `<PaperTexture />` once and wrap in a parchment container. Add the scenario selector (EMPTY/ONE/THREE/MANY) and the two A/B toggles (corners=regions|countries; identity=earned|ledger) as local state now, even if unused until later tasks.

- [ ] **Step 5: Typecheck + visual check.**

Run: `npx tsc --noEmit` → exits 0.
Then `npm run dev`, open `/dev/journal` in **both themes**; confirm marks multiply onto parchment (no white box), custom vs procedural vs origin-less all read at equal visual mass, nothing pops.

- [ ] **Step 6: Commit.**

```bash
git add components/journal/JournalDishMark.tsx components/journal/JournalStat.tsx app/dev/journal/
git commit -m "feat(journal): dish mark + stat primitives on /dev/journal"
```

---

## Task 3: The Log (`JournalLog` + `JournalEntryRow`)

**Files:**
- Create: `components/journal/JournalLog.tsx`, `components/journal/JournalEntryRow.tsx`
- Modify: `app/dev/journal/page.tsx` (render the Log from fixtures)

**Interfaces:**
- Consumes: `JournalEntry` (`lib/journal`).
- Produces: `JournalLog({ entries }: { entries: JournalEntry[] })`; `JournalEntryRow({ entry }: { entry: JournalEntry })`.

- [ ] **Step 1: Build `JournalEntryRow`.**

Layout: Cutive-Mono date (`font-stamp`, uppercase, `nums-tabular`, e.g. `APR 18 2026`) · `<JournalDishMark country={entry.country} title={entry.title} />` · title as `next/link` to `/recipes/${encodeURIComponent(entry.slug)}` (`font-heading`, hover `text-terracotta`; client nav intercepts into the modal as usual) · margin note (`font-body`, `text-brown-medium`, italic optional) rendered only when `entry.marginNote !== ''`. Re-cooks (`entry.isReCook`) styled lightly (e.g. slightly dimmer date or a small "cooked again" already carried by the note) — keep it quiet, still full-dignity. Use a ledger-rule row treatment consistent with `StampedRecipesModal`'s dotted rules. No em dashes in any string.

- [ ] **Step 2: Build `JournalLog`** — group `entries` by month (`YYYY-MM` from `cookedAt`), render a Cutive-Mono month divider (e.g. `APRIL 2026`) before each group, then the rows. Entries already arrive newest-first; months therefore descend. Render all entries (no windowing — see scope). If `entries.length === 0`, render nothing (the empty state is the masthead's job, Task 5).

- [ ] **Step 3: Wire on `/dev/journal`** — drive `JournalLog` from the selected fixture scenario; verify ONE, THREE, MANY, and the re-cook / origin-less / first-* branches all read correctly and the derived notes match the intended grammar.

- [ ] **Step 4: Typecheck + visual check (both themes).**

Run: `npx tsc --noEmit` → 0. Confirm on `/dev/journal`: month dividers correct, origin-less entries sit equally beside travel entries, links point at `/recipes/[slug]`, margin notes read warm and never smug, no em dashes.

- [ ] **Step 5: Commit.**

```bash
git add components/journal/JournalLog.tsx components/journal/JournalEntryRow.tsx app/dev/journal/page.tsx
git commit -m "feat(journal): the Log feed with month dividers"
```

---

## Task 4: Stamps collected (`JournalStamps` + `TravelIdentity`)

**Files:**
- Create: `components/journal/JournalStamps.tsx`, `components/journal/TravelIdentity.tsx`
- Modify: `app/dev/journal/page.tsx`

**Interfaces:**
- Consumes: `PassportSummary`, `CancellationInput` (`components/passport/CountryStampSlot`), `EXPLORER_TITLES`/`TIER_BADGES`/`ExplorerTitle` (`lib/passport`), `CULINARY_REGION_ORDER` (`lib/types`).
- Produces:
  - `JournalStamps({ summary, cancellationsByCountry, onStampClick }: { summary: PassportSummary; cancellationsByCountry: Map<string, CancellationInput[]>; onStampClick: (country: string) => void })`
  - `TravelIdentity({ title }: { title: ExplorerTitle })`

- [ ] **Step 1: Build `TravelIdentity` (earned-identity, no debt line — judgment call 2).**

Show the current earned title as identity: the tier badge (`TIER_BADGES[title]` via `next/image unoptimized` on a `passport-light` tile) + the title in `font-stamp`, and the completed lower rungs as a quiet completed trail. Do NOT render locked future tiers, their requirements, a "next tier" line, or any "N to go" copy. Keep copy warm and retrospective. (`TierLedger` stays untouched and is shown only as the reference variant on `/dev/journal`.)

- [ ] **Step 2: Build `JournalStamps`.**

- Compute, from `summary.stampsPerCountry`, the set of touched regions using the country→region mapping already implicit in `summary.regionsTouched`; group countries by their region. Iterate `CULINARY_REGION_ORDER` but **render a region group only if it has at least one cooked country** (never an empty region group). Under a small-caps region heading, render each country via `CountryStampSlot` (`country`, `stamps={summary.stampsPerCountry.get(country)!}`, `cancellations={cancellationsByCountry.get(country)}`, `onClick={() => onStampClick(country)}`). Set `--stamp-size`/`--stamp-gap` on the gallery container and wrap in `passport-light` (parchment beneath, both themes).
- To map country → region without recomputing: derive a `Map<CulinaryRegion, string[]>` locally by reading each country's stamps is insufficient (stamps lack region). Instead accept the country→region relationship by passing it in: extend the prop to `regionOfCountry: Map<string, CulinaryRegion>` (build it in `JournalScroll` from `useRecipes`, same as `useCookedStamps` does internally) OR expose `countryToRegion` from `useCookedStamps`. **Chosen:** expose the existing `countryToRegion` map from `useCookedStamps` (it is already computed there) and pass it as a `regionOfCountry` prop. Add this to Task 1's hook return if not already exposed. Countries whose region is unknown (mapping miss) render under a final "Elsewhere" group so no earned stamp is ever dropped.
- Append the quiet `see your world on the atlas →` link (to `/atlas`).
- If `summary.totalStamps === 0`, render nothing (origin-less-only cooks have no stamps section — correct, not a gap).

> Back-reference to Task 1: add `countryToRegion` (already computed inside `useCookedStamps`) to the hook's returned object so `JournalStamps` can group without duplicating the recipes join.

- [ ] **Step 3: Wire on `/dev/journal`** using the MANY fixture. Show `TravelIdentity` as the default and, behind the identity A/B toggle, the unmodified `TierLedger` for reference. Verify region groups only appear for touched regions; tapping a stamp fires `onStampClick` (log to console on the dev route).

- [ ] **Step 4: Typecheck + visual check (both themes).**

Run: `npx tsc --noEmit` → 0. Confirm stamps multiply correctly on parchment in sepia, no empty region groups, cancellations render, `TravelIdentity` shows no locked tiers / no next-tier line.

- [ ] **Step 5: Commit.**

```bash
git add components/journal/JournalStamps.tsx components/journal/TravelIdentity.tsx hooks/useCookedStamps.ts app/dev/journal/page.tsx
git commit -m "feat(journal): stamps-collected gallery + earned travel identity"
```

---

## Task 5: Masthead, empty/nascent state, and assembly (`JournalMasthead` + `JournalScroll`)

**Files:**
- Create: `components/journal/JournalMasthead.tsx`, `components/journal/JournalScroll.tsx`
- Modify: `app/dev/journal/page.tsx`

**Interfaces:**
- Consumes: `useCookedStamps()` (`entries`, `stats`, `summary`, `cancellationsByCountry`, `countryToRegion`, `isLoading`), `useRecipes()`.
- Produces: `JournalScroll()` (no props; self-fetches), `JournalMasthead({ stats }: { stats: { meals; dishes; corners } })`.

- [ ] **Step 1: Build `JournalMasthead`.**

`The Cook's Journal` title (`font-heading`), optional handle line if available (skip if none — no placeholder), and a stats row of `JournalStat`s. Only-counts-up: render `meals` and `dishes` only when > 0, `corners` only when > 0 (brief §4.1). No "next tier" / "N from the next title" line anywhere. Labels: `MEALS COOKED`, `DISHES`, `CORNERS OF THE WORLD`.

- [ ] **Step 2: Build `JournalScroll` (composer + states).**

- Read `useCookedStamps()`; build `recipesByCountry` and the `onStampClick`→`StampedRecipesModal` wiring exactly as `PassportBooklet.tsx:61-87,145-152` (recipesByCountry, modalStampsByRecipe from `summary.stampsPerCountry`).
- **Loading:** while `isLoading`, render a parchment skeleton (masthead shape + a few ledger rows).
- **Empty/nascent (brief §4.6):** when `stats.meals === 0`, render only the masthead title + one warm line ("Your journal is blank. It fills one dish at a time.") and nothing else. No empty sections.
- Otherwise render, in order: `JournalMasthead` · `JournalLog` (if `entries.length > 0`) · `JournalStamps` (if `summary.totalStamps > 0`, with `TravelIdentity`). Each section is independently conditional so 1–3 cooks look intentional.
- Render `StampedRecipesModal` when a country is selected.

- [ ] **Step 3: Drive `/dev/journal` end-to-end** from fixtures across EMPTY / ONE / THREE / MANY (the dev route can render `JournalScroll`'s subtree with fixture-injected props via a thin fixture provider, or mount the presentational sections directly with fixture data — do NOT hit Supabase on the dev route). Verify each scenario reads as intentional, especially EMPTY and ONE.

- [ ] **Step 4: Typecheck + build + visual check (both themes).**

Run: `npx tsc --noEmit` → 0, then `npm run build` → succeeds. Walk EMPTY/ONE/THREE/MANY on `/dev/journal` in both themes.

- [ ] **Step 5: Commit.**

```bash
git add components/journal/JournalMasthead.tsx components/journal/JournalScroll.tsx app/dev/journal/page.tsx
git commit -m "feat(journal): masthead, nascent state, and scroll assembly"
```

---

## Task 6: The real route (`app/journal/page.tsx`)

**Files:**
- Create: `app/journal/page.tsx`, `app/journal/loading.tsx`

- [ ] **Step 1: Build `app/journal/page.tsx`** — a `'use client'` page: a theme-aware parchment page container, mount `<PaperTexture />` once, `<Suspense>` with a parchment skeleton fallback, render `<JournalScroll />`. Keep stamp-bearing subsections on locked parchment (handled inside `JournalStamps`/`JournalDishMark`); the surrounding scroll is theme-aware (parchment/sepia). Mirror the container conventions of `app/passport/page.tsx` and the home page's `max-w` + padding rhythm.

- [ ] **Step 2: Build `app/journal/loading.tsx`** — route-level skeleton (parchment, fixed dimensions, zero layout shift).

- [ ] **Step 3: Typecheck + real-app verification (both themes).**

Run: `npx tsc --noEmit` → 0. `npm run dev`, navigate to `/journal` with the real anonymous session: confirm the Log reflects real `passport_stamps`, stamps tap into `StampedRecipesModal`, a freshly logged cook (cook a recipe elsewhere) appears after `['passport-stamps']` invalidation, and both themes render correctly. If the local session has zero cooks, verify the nascent state; optionally log a cook to see a populated state.

- [ ] **Step 4: Commit.**

```bash
git add app/journal/page.tsx app/journal/loading.tsx
git commit -m "feat(journal): /journal route"
```

---

## Task 7: Navbar affordance → `/journal` link (retire the overlay open path)

**Files:**
- Modify: `components/passport/PassportAffordance.tsx`

- [ ] **Step 1: Convert `PassportAffordance` to a link.**

Replace the `<button onClick={handleClick}>` with `next/link` `href="/journal"`. Keep: the stamp icon, the stamp-count badge (`summary.totalStamps`), the `compact` variant sizing, and the idle/hover asset prefetch (`prefetchPassportAssets` on `requestIdleCallback`, `prefetchNow` on `onPointerEnter`/`onFocus`). Add `useRouter().prefetch('/journal')` to `prefetchNow` (route-chunk warm) and drop the dynamic `import('./PassportBooklet')` warm. Remove `usePassportOverlay`, `setPassportOrigin`, and the `isOpen` underline; derive active state from `usePathname()` (underline when `pathname.startsWith('/journal')`), matching `Navbar` convention. Update `aria-label`/`title` to "Cook's Journal". Do not touch `PassportOverlayProvider` in `Providers` (stays mounted, dormant).

- [ ] **Step 2: Typecheck + full build.**

Run: `npx tsc --noEmit` → 0, then `npm run build` → succeeds (confirms no remaining importers of the removed overlay-open symbols break the build).

- [ ] **Step 3: Real-app verification (both themes, desktop + mobile widths).**

Confirm the navbar mark now navigates to `/journal` (client nav, not an overlay), the badge count is correct, active underline shows on `/journal`, prefetch fires on hover, and the mobile navbar affordance behaves. Confirm the old passport overlay no longer opens from anywhere in shipped navigation.

- [ ] **Step 4: Commit.**

```bash
git add components/passport/PassportAffordance.tsx
git commit -m "feat(journal): navbar affordance links to /journal, retire overlay open path"
```

---

## Task 8: Final gate + branch wrap

- [ ] **Step 1: Full CI-parity gate.**

Run: `npx tsc --noEmit` → 0, then `npm run build` → succeeds.

- [ ] **Step 2: Full-app walkthrough in both themes.** Home → navbar mark → `/journal` → tap a stamp → modal → recipe link. Verify nascent state (if reachable), Log, Stamps, TravelIdentity, no em dashes, ﷺ rendering, no empty sections/badges, no next-tier line. Confirm `/atlas`, `/recipes`, cook-logging still work (regression sweep — the overlay change touched shared nav).

- [ ] **Step 3: Report status to the user for review** (do not merge to `main`, do not push). Summarize what shipped, the two judgment-call defaults as chosen, and offer the `/dev/journal` A/B toggles for a final aesthetic pass before merge.

---

## Self-Review (checked against the brief)

**Spec coverage:**
- §4.1 Masthead + counts-up stats, no next-tier line → Task 5 (`JournalMasthead`), Task 1 (`journalStats`).
- §4.2 The Log (every cook incl. re-cooks; date · mark · title link · margin note; month dividers) → Tasks 1, 3.
- §4.4 Stamps collected grouped by touched regions only; tap → `StampedRecipesModal`; relocated titles/tier as earned identity; atlas link → Task 4.
- §4.6 Empty/nascent state → Task 5.
- §5.1 Per-entry margin-note grammar → Task 1 (`buildJournalEntries`).
- §8 Reuse craft / retire booklet (staged) / affordance→link → reuse across Tasks 2–5, retirement staged (file list), Task 7.
- §10 Phase 3a boundary, `/dev/journal` visual iteration, tsc+build gate → whole plan.
- §9/§10 voice rules (ﷺ, no em dashes, own-history claims), physical-object theme lock, both themes → Global Constraints + per-task visual checks.

**Explicitly deferred (correct):** §4.3 reflections, §4.5 + §6 milestones, §7 Atlas layer, §11 editable notes — all Phase 3b/3c/out.

**Placeholder scan:** the only inline placeholder is the `dishes` field in `journalStats`, flagged with an explicit note in Task 1 Step 1 to compute it hook-side via `buildDishCount` — resolved, not left as a placeholder.

**Type consistency:** `JournalEntry`, `JournalRecipeMeta`, `buildJournalEntries`, `journalStats`, `buildDishCount`, and the added `useCookedStamps` returns (`entries`, `stats`, `countryToRegion`) are named consistently across Tasks 1, 4, 5. `StampedRecipesModal`/`CountryStampSlot`/`TierLedger` prop shapes match the verified codebase signatures.
