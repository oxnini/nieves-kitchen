# Cook's Journal — Edition 2 (Traveler's Log) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring editorial progression to `/journal` — a type-first rank block, a "Journey so far" recap, and one "where next?" card — on top of the already-shipped wide-ledger layout.

**Architecture:** Three new presentational components (`JournalRank`, `JournalJourney`, `JournalWhereNext`) plus one derivation helper (`buildJourneyRecap` in `lib/journal.ts`). Data stays layered: `useCookedStamps` (real) and the `/dev/journal` fixtures (sandbox) compute the recap and a single recommendation and pass them into the presentational `JournalScrollView`, which is reordered to the Edition 2 section sequence. `JournalRank` replaces the old `TravelIdentity`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind v4, TanStack Query. Reuses existing `PassportSummary`, `EXPLORER_TITLES`, and `recommendNextRecipes()`.

## Global Constraints

- Verification is `npm run typecheck` (the real gate — no jest/pytest in this repo) plus a visual render on `/dev/journal`. There is no unit-test framework; do NOT add one.
- Use design tokens (`text-brown-dark`, `bg-terracotta`, `font-stamp`, etc.), never raw hex.
- No em dashes in user-facing strings (use "—" only in code/comments; copy uses commas or "to").
- `/dev/journal` must make ZERO Supabase calls / never import `useCookedStamps`. It is fixture-fed only.
- Everything in `components/` is a Client Component; add `'use client'` only where a component uses hooks/interactivity. Pure presentational components here need it only if they use state — `JournalWhereNext` uses `next/link` (fine in a server or client tree); keep these files free of `'use client'` unless a hook is added, matching neighbours (`JournalEntryRow` has none; `JournalScrollView` has it).
- `Recipe.id` IS the route slug (`dbToRecipe` maps `id: db.slug`); recipe links are `/recipes/${encodeURIComponent(recipe.id)}`.
- Tier requirements are two-dimensional: `EXPLORER_TITLES` = New Explorer (0,0) · Curious Cook (1,1) · Wanderer (5,2) · Globetrotter (10,4) · Culinary Diplomat (20,10), keyed on (unique countries, regions touched).

---

### Task 1: `buildJourneyRecap` derivation in `lib/journal.ts`

**Files:**
- Modify: `lib/journal.ts` (add types + function; update the `CulinaryRegion` import to also bring `CULINARY_REGION_ORDER`)

**Interfaces:**
- Consumes: `JournalEntry` (already in this file: `{ id, slug, title, country, region, cookedAt, isReCook, marginNote }`).
- Produces: `RecapItem`, `JourneyRecap`, `buildJourneyRecap(entries: JournalEntry[]): JourneyRecap | null`.

- [ ] **Step 1: Update the types import at the top of `lib/journal.ts`**

Replace:
```ts
import type { CulinaryRegion } from './types';
```
with:
```ts
import { CULINARY_REGION_ORDER, type CulinaryRegion } from './types';
```

- [ ] **Step 2: Append the recap types and builder to `lib/journal.ts`**

```ts
export interface RecapItem {
  title: string;
  /** ISO timestamp of the cook. */
  cookedAt: string;
}

export interface JourneyRecap {
  firstCook: RecapItem;
  /** Null when there is only one cook (would duplicate `firstCook`). */
  mostRecent: RecapItem | null;
  /** Null when no cook has a region. */
  topRegion: { region: CulinaryRegion; count: number } | null;
  /** Null when no dish has been cooked more than once (no repeat to celebrate). */
  mostCooked: { title: string; count: number } | null;
}

/**
 * A retrospective recap of the cook's history for the journal's "Journey so
 * far" section. `entries` arrive newest-first (from `buildJournalEntries`),
 * so the most recent is first and the earliest is last. Returns null for an
 * empty log so the section can be omitted entirely.
 */
export function buildJourneyRecap(entries: JournalEntry[]): JourneyRecap | null {
  if (entries.length === 0) return null;

  const mostRecentEntry = entries[0];
  const firstEntry = entries[entries.length - 1];

  // Top region by cook count. Iterate CULINARY_REGION_ORDER so ties resolve
  // deterministically to the earliest region in canonical order.
  const regionCounts = new Map<CulinaryRegion, number>();
  for (const e of entries) {
    if (e.region) regionCounts.set(e.region, (regionCounts.get(e.region) ?? 0) + 1);
  }
  let topRegion: { region: CulinaryRegion; count: number } | null = null;
  for (const region of CULINARY_REGION_ORDER) {
    const count = regionCounts.get(region);
    if (count && (!topRegion || count > topRegion.count)) {
      topRegion = { region, count };
    }
  }

  // Most-cooked dish by slug; null unless something was cooked 2+ times.
  const slugCounts = new Map<string, { title: string; count: number }>();
  for (const e of entries) {
    const cur = slugCounts.get(e.slug);
    if (cur) cur.count += 1;
    else slugCounts.set(e.slug, { title: e.title, count: 1 });
  }
  let mostCooked: { title: string; count: number } | null = null;
  for (const v of slugCounts.values()) {
    if (!mostCooked || v.count > mostCooked.count) {
      mostCooked = { title: v.title, count: v.count };
    }
  }
  if (mostCooked && mostCooked.count < 2) mostCooked = null;

  const onlyOneCook = mostRecentEntry.id === firstEntry.id;

  return {
    firstCook: { title: firstEntry.title, cookedAt: firstEntry.cookedAt },
    mostRecent: onlyOneCook
      ? null
      : { title: mostRecentEntry.title, cookedAt: mostRecentEntry.cookedAt },
    topRegion,
    mostCooked,
  };
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/journal.ts
git commit -m "feat(journal): buildJourneyRecap derivation for the Journey-so-far recap"
```

---

### Task 2: `JournalRank` component (replaces `TravelIdentity`)

**Files:**
- Create: `components/journal/JournalRank.tsx`

**Interfaces:**
- Consumes: `PassportSummary` from `@/lib/passport` (`{ title, nextTier, totalStamps, regionsTouched, ... }`), `EXPLORER_TITLES`.
- Produces: default export `JournalRank({ summary }: { summary: PassportSummary })`.

- [ ] **Step 1: Create `components/journal/JournalRank.tsx`**

```tsx
import { EXPLORER_TITLES, type PassportSummary } from '@/lib/passport';

export interface JournalRankProps {
  summary: PassportSummary;
}

/**
 * The journal's rank block (Edition 2, "type-first"): the earned title set in
 * the stamped mono face, two progress meters toward the next title (countries
 * and regions — tiers are two-dimensional, so a single bar would lie), a
 * plain-language "toward" line, and the full title ladder as a trail of
 * passed -> current -> ahead. No badge art (the flat tier WebPs were dropped).
 * At the highest tier the meters and toward-line give way to a closing line.
 */
export default function JournalRank({ summary }: JournalRankProps) {
  const { title, nextTier, totalStamps, regionsTouched } = summary;
  const countries = totalStamps;
  const regions = regionsTouched.size;
  const currentIndex = EXPLORER_TITLES.findIndex((t) => t.title === title);

  return (
    <section className="flex flex-col gap-5 border-t border-b border-brown-light/40 py-6">
      <div>
        <div className="font-stamp text-[10px] uppercase tracking-[0.24em] text-brown-medium/80">
          Your title
        </div>
        <div className="mt-1.5 font-stamp uppercase tracking-[0.16em] text-2xl sm:text-3xl text-brown-dark">
          {title}
        </div>
      </div>

      {nextTier ? (
        <>
          <div className="flex flex-wrap gap-6">
            <Meter label="Countries" value={countries} min={nextTier.minStamps} tone="terracotta" />
            <Meter label="Regions" value={regions} min={nextTier.minRegions} tone="teal" />
          </div>
          <p className="font-body text-sm text-brown-medium">
            {nextTierPhrase(countries, regions, nextTier.minStamps, nextTier.minRegions)} to{' '}
            <span className="font-semibold text-brown-dark">{nextTier.title}</span>.
          </p>
        </>
      ) : (
        <p className="font-body text-sm text-brown-medium">
          You&rsquo;ve reached the highest title. The world is yours.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-stamp text-[10px] uppercase tracking-[0.08em]">
        {EXPLORER_TITLES.map((tier, i) => (
          <span key={tier.title} className="flex items-center gap-2">
            {i > 0 && <span className="text-brown-light/60" aria-hidden>—</span>}
            <span
              className={
                i < currentIndex
                  ? 'text-brown-medium'
                  : i === currentIndex
                    ? 'rounded border border-brown-light/50 px-2 py-[3px] tracking-[0.12em] text-brown-dark'
                    : 'text-brown-light'
              }
            >
              {tier.title}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function Meter({
  label, value, min, tone,
}: {
  label: string; value: number; min: number; tone: 'terracotta' | 'teal';
}) {
  const filled = Math.min(value, min);
  const onClass = tone === 'terracotta' ? 'bg-terracotta border-terracotta' : 'bg-teal border-teal';
  return (
    <div className="min-w-[8.5rem] flex-1">
      <div className="mb-1.5 flex items-baseline justify-between font-stamp text-[10px] uppercase tracking-wider text-brown-medium">
        <span>{label}</span>
        <span className="nums-tabular text-brown-dark">
          {value} / {min}
        </span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: min }).map((_, i) => (
          <span
            key={i}
            className={`h-[7px] flex-1 rounded-[1px] border ${
              i < filled ? onClass : 'border-brown-light/30 bg-surface-alt'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** "3 more countries and 1 region", singular-aware; "One more cook" when both met. */
function nextTierPhrase(
  countries: number, regions: number, minCountries: number, minRegions: number,
): string {
  const c = Math.max(0, minCountries - countries);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (c > 0) parts.push(`${c} more ${c === 1 ? 'country' : 'countries'}`);
  if (r > 0) parts.push(`${r} ${r === 1 ? 'region' : 'regions'}`);
  if (parts.length === 0) return 'One more cook';
  return parts.join(' and ');
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/journal/JournalRank.tsx
git commit -m "feat(journal): JournalRank — type-first rank block with two-axis progress"
```

---

### Task 3: `JournalJourney` component

**Files:**
- Create: `components/journal/JournalJourney.tsx`

**Interfaces:**
- Consumes: `JourneyRecap` from `@/lib/journal` (Task 1).
- Produces: default export `JournalJourney({ recap }: { recap: JourneyRecap })`.

- [ ] **Step 1: Create `components/journal/JournalJourney.tsx`**

```tsx
import type { JourneyRecap } from '@/lib/journal';

export interface JournalJourneyProps {
  recap: JourneyRecap;
}

/**
 * "Journey so far": a small retrospective recap ledger. Each row is a
 * LABEL … value pair. Rows that would be empty or redundant (most-recent when
 * there is only one cook, most-cooked when nothing has been repeated) are
 * omitted upstream by `buildJourneyRecap` returning null for them.
 */
export default function JournalJourney({ recap }: JournalJourneyProps) {
  const rows: { k: string; v: string }[] = [
    { k: 'First cook', v: `${recap.firstCook.title} · ${formatDay(recap.firstCook.cookedAt)}` },
  ];
  if (recap.mostRecent) {
    rows.push({ k: 'Most recent', v: `${recap.mostRecent.title} · ${formatDay(recap.mostRecent.cookedAt)}` });
  }
  if (recap.topRegion) {
    rows.push({
      k: 'Top region',
      v: `${recap.topRegion.region} · ${recap.topRegion.count} ${recap.topRegion.count === 1 ? 'dish' : 'dishes'}`,
    });
  }
  if (recap.mostCooked) {
    rows.push({ k: 'Most cooked', v: `${recap.mostCooked.title} · ${recap.mostCooked.count}×` });
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">
        Journey so far
      </h2>
      <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.k}
            className="flex items-baseline justify-between gap-4 border-b border-dotted border-brown-light/40 py-2"
          >
            <dt className="font-stamp text-[10px] uppercase tracking-wider text-brown-medium">
              {row.k}
            </dt>
            <dd className="font-heading text-sm text-brown-dark text-right">{row.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** "18 Apr" — short retrospective day. */
function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/journal/JournalJourney.tsx
git commit -m "feat(journal): JournalJourney — the Journey-so-far recap ledger"
```

---

### Task 4: `JournalWhereNext` component

**Files:**
- Create: `components/journal/JournalWhereNext.tsx`

**Interfaces:**
- Consumes: `Recommendation` from `@/lib/passport-recommend` (`{ recipe: Recipe; reason: 'new-region' | 'new-country' | 'revisit' }`).
- Produces: default export `JournalWhereNext({ recommendation }: { recommendation: Recommendation | null })`.

- [ ] **Step 1: Create `components/journal/JournalWhereNext.tsx`**

```tsx
import Link from 'next/link';
import type { Recommendation } from '@/lib/passport-recommend';

export interface JournalWhereNextProps {
  recommendation: Recommendation | null;
}

/**
 * One "where next?" invitation card at the foot of the journal, sampled from
 * `recommendNextRecipes(..., 1)`. Renders nothing when there is no
 * recommendation (nothing left to suggest, or the dev route passed no recipe
 * pool) — never a placeholder. This is the Atlas's forward pull, tasted once.
 */
export default function JournalWhereNext({ recommendation }: JournalWhereNextProps) {
  if (!recommendation) return null;
  const { recipe } = recommendation;

  return (
    <section className="flex flex-wrap items-center gap-5 rounded-lg border border-dashed border-brown-light/50 p-5 sm:p-6">
      <div className="min-w-[15rem] flex-1">
        <div className="font-stamp text-[9px] uppercase tracking-[0.2em] text-terracotta">
          Where next?
        </div>
        <div className="mt-1 font-heading text-xl text-brown-dark">{recipe.name}</div>
        <p className="mt-1 font-body text-sm text-brown-medium">{reasonCopy(recommendation)}</p>
      </div>
      <Link
        href={`/recipes/${encodeURIComponent(recipe.id)}`}
        className="whitespace-nowrap rounded-full border border-terracotta px-4 py-2 font-stamp text-[10px] uppercase tracking-wider text-terracotta transition-colors hover:bg-terracotta hover:text-parchment"
      >
        Open recipe →
      </Link>
    </section>
  );
}

function reasonCopy(rec: Recommendation): string {
  const { recipe, reason } = rec;
  switch (reason) {
    case 'new-region':
      return `A new region for you${recipe.region ? `, ${recipe.region}` : ''}. One dish opens a whole corner of the map.`;
    case 'new-country':
      return `Your first from ${recipe.country ?? 'somewhere new'}.`;
    case 'revisit':
      return `Back to ${recipe.country ?? 'a favorite'}, with a dish you haven${'’'}t tried yet.`;
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/journal/JournalWhereNext.tsx
git commit -m "feat(journal): JournalWhereNext — single where-next recommendation card"
```

---

### Task 5: Compute recap + recommendation in `useCookedStamps`

**Files:**
- Modify: `hooks/useCookedStamps.ts`

**Interfaces:**
- Consumes: `buildJourneyRecap` (Task 1), `recommendNextRecipes` (`@/lib/passport-recommend`), the existing `entries`, `summary`, `recipesQuery.data`.
- Produces: two new return fields — `recap: JourneyRecap | null`, `recommendation: Recommendation | null`.

- [ ] **Step 1: Extend the imports in `hooks/useCookedStamps.ts`**

Change:
```ts
import { buildDishCount, buildJournalEntries, type JournalRecipeMeta } from '@/lib/journal';
```
to:
```ts
import {
  buildDishCount,
  buildJournalEntries,
  buildJourneyRecap,
  type JournalRecipeMeta,
} from '@/lib/journal';
import { recommendNextRecipes } from '@/lib/passport-recommend';
```

- [ ] **Step 2: Add the two memos after the existing `entries` memo (after the `const entries = useMemo(...)` block)**

```ts
  const recap = useMemo(() => buildJourneyRecap(entries), [entries]);

  const recommendation = useMemo(
    () => recommendNextRecipes(recipesQuery.data ?? [], summary, 1)[0] ?? null,
    [recipesQuery.data, summary],
  );
```

- [ ] **Step 3: Add `recap` and `recommendation` to the hook's returned object**

In the final `return { ... }`, add the two fields (e.g. right after `entries,`):
```ts
    entries,
    recap,
    recommendation,
    stats,
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add hooks/useCookedStamps.ts
git commit -m "feat(journal): surface recap + one recommendation from useCookedStamps"
```

---

### Task 6: Reorder `JournalScrollView`, wire `JournalScroll`, delete `TravelIdentity`

**Files:**
- Modify: `components/journal/JournalScrollView.tsx`
- Modify: `components/journal/JournalScroll.tsx`
- Delete: `components/journal/TravelIdentity.tsx`

**Interfaces:**
- Consumes: `JournalRank` (Task 2), `JournalJourney` (Task 3), `JournalWhereNext` (Task 4), `JourneyRecap` (Task 1), `Recommendation`, and the hook's new `recap`/`recommendation` (Task 5).
- Produces: `JournalScrollViewProps` gains `recap: JourneyRecap | null` and `recommendation: Recommendation | null`.

- [ ] **Step 1: Update imports in `JournalScrollView.tsx`**

Remove:
```ts
import TravelIdentity from './TravelIdentity';
```
Add:
```ts
import JournalRank from './JournalRank';
import JournalJourney from './JournalJourney';
import JournalWhereNext from './JournalWhereNext';
import type { JourneyRecap } from '@/lib/journal';
import type { Recommendation } from '@/lib/passport-recommend';
```

- [ ] **Step 2: Add the two props to `JournalScrollViewProps`**

After the `entries: JournalEntry[];` line, add:
```ts
  recap: JourneyRecap | null;
  recommendation: Recommendation | null;
```
And add `recap` and `recommendation` to the destructured params of the component signature.

- [ ] **Step 3: Replace the populated `return (...)` block**

Replace the entire populated-state JSX (the `return` that starts `<div className="max-w-4xl mx-auto ...">` and holds the masthead + Log + Stamps section + modal) with:

```tsx
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16">
      <JournalMasthead stats={stats} keptSince={keptSince(entries)} />

      {entries.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">
            The Log
          </h2>
          <JournalLog entries={entries} />
        </section>
      )}

      <JournalRank summary={summary} />

      {recap && <JournalJourney recap={recap} />}

      {summary.totalStamps > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">
            Stamps collected
          </h2>
          <JournalStamps
            summary={summary}
            cancellationsByCountry={cancellationsByCountry}
            regionOfCountry={regionOfCountry}
            onStampClick={setModalCountry}
          />
        </section>
      )}

      <JournalWhereNext recommendation={recommendation} />

      {modalCountry && (
        <StampedRecipesModal
          country={modalCountry}
          recipes={modalRecipes}
          stampsByRecipe={modalStampsByRecipe}
          onClose={() => setModalCountry(null)}
        />
      )}
    </div>
  );
```

Note: `JournalRank` is rendered unconditionally here because this block only runs when `stats.meals > 0` (the empty/nascent state returns earlier). An origin-less-only cook correctly still sees the rank (New Explorer, meters at 0 / min) — a horizon, not a reprimand.

- [ ] **Step 4: Update `JournalScroll.tsx` to pass the new fields**

In the `useCookedStamps()` destructure, add `recap` and `recommendation`:
```ts
  const {
    summary,
    cancellationsByCountry,
    countryToRegion,
    entries,
    recap,
    recommendation,
    stats,
    isLoading,
  } = useCookedStamps();
```
And pass them to `<JournalScrollView ... />`:
```tsx
      entries={entries}
      recap={recap}
      recommendation={recommendation}
      summary={summary}
```

- [ ] **Step 5: Delete the retired component**

```bash
git rm components/journal/TravelIdentity.tsx
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors. (If it flags a still-present `TravelIdentity` import in `app/dev/journal/page.tsx`, that is fixed in Task 7 — you may run Task 7 before typechecking clean. Commit this task and Task 7 together if so.)

- [ ] **Step 7: Commit**

```bash
git add components/journal/JournalScrollView.tsx components/journal/JournalScroll.tsx
git commit -m "feat(journal): Edition 2 section order; JournalRank replaces TravelIdentity"
```

---

### Task 7: `/dev/journal` fixtures + page wiring

**Files:**
- Modify: `app/dev/journal/fixtures.ts` (add a fixture recipe pool)
- Modify: `app/dev/journal/page.tsx`

**Interfaces:**
- Consumes: `buildJourneyRecap`, `recommendNextRecipes`, `summarizeStamps`, `JournalRank`, and the new `JournalScrollView` props.
- Produces: `FIXTURE_RECIPES: Recipe[]` in fixtures.

- [ ] **Step 1: Add a fixture recipe pool to `app/dev/journal/fixtures.ts`**

Add `Recipe` to the type imports:
```ts
import type { CulinaryRegion, Recipe } from '@/lib/types';
```
Then append a factory + pool at the end of the file. The pool includes the cooked fixture countries (Turkey, Iraq, Brazil) plus untouched ones so `recommendNextRecipes` has new-region and new-country candidates:
```ts
/**
 * Minimal-but-complete `Recipe` objects for the fixture route. Only
 * id/name/country/region matter to `recommendNextRecipes`; the rest are
 * inert defaults so the shape typechecks without a Supabase row.
 */
function fixtureRecipe(
  id: string, name: string, country: string | null, region: CulinaryRegion | null,
): Recipe {
  return {
    id, name, country, region,
    coordinates: null,
    influences: [],
    isSunnah: false,
    featuredIngredients: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    category: 'main',
    tags: [],
    isFusion: false,
    quote: '',
    image: '',
    time: { active: 0, total: 0 },
    servings: 2,
    difficulty: 'Easy',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    flavorProfile: { sweet: 0, salty: 0, sour: 0, bitter: 0, umami: 0, spicy: 0 },
  };
}

/** A small catalogue for the where-next card: cooked countries + untouched ones. */
export const FIXTURE_RECIPES: Recipe[] = [
  fixtureRecipe('shakshuka', 'Shakshuka', 'Turkey', 'Middle East'),
  fixtureRecipe('masgouf', 'Masgouf', 'Iraq', 'Middle East'),
  fixtureRecipe('feijoada', 'Feijoada', 'Brazil', 'South America'),
  fixtureRecipe('bibimbap', 'Bibimbap', 'South Korea', 'East Asia'),
  fixtureRecipe('pho', 'Pho', 'Vietnam', 'Southeast Asia'),
  fixtureRecipe('injera', 'Injera & Doro Wat', 'Ethiopia', 'Sub-Saharan Africa'),
];
```

- [ ] **Step 2: Rewire `app/dev/journal/page.tsx`**

Update the fixtures import to include `FIXTURE_RECIPES`:
```ts
import { EMPTY, ONE, THREE, MANY, metaBySlug, countryToRegion, buildFixtureCancellations, FIXTURE_RECIPES } from './fixtures';
```
Replace the `TravelIdentity` import with `JournalRank`:
```ts
import JournalRank from '@/components/journal/JournalRank';
```
Add the recap + recommendation imports:
```ts
import { buildDishCount, buildJournalEntries, buildJourneyRecap } from '@/lib/journal';
import { recommendNextRecipes } from '@/lib/passport-recommend';
```
(Keep `summarizeStamps` import as-is.)

- [ ] **Step 3: Derive recap + recommendation in the dev component**

After the existing `const summary = useMemo(...)` block, add:
```ts
  const recap = useMemo(() => buildJourneyRecap(journalEntries), [journalEntries]);

  const recommendation = useMemo(
    () => recommendNextRecipes(FIXTURE_RECIPES, summary, 1)[0] ?? null,
    [summary],
  );
```

- [ ] **Step 4: Point the "Identity (earned)" preview at `JournalRank`**

In the Identity section, replace the earned branch:
```tsx
        {identity === 'earned' ? (
          <TravelIdentity title={summary.title} />
        ) : (
```
with:
```tsx
        {identity === 'earned' ? (
          <JournalRank summary={summary} />
        ) : (
```

- [ ] **Step 5: Pass `recap` + `recommendation` into the Full-scroll-assembly `JournalScrollView`**

In the `<JournalScrollView ... />` at the bottom of the page, add:
```tsx
            entries={journalEntries}
            recap={recap}
            recommendation={recommendation}
            summary={summary}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors (this also clears any `TravelIdentity` reference left from Task 6).

- [ ] **Step 7: Visual check on `/dev/journal`**

Run: `npm run dev`, open `/dev/journal`. Flip scenarios EMPTY → ONE → THREE → MANY and scroll to "Full scroll assembly". Confirm:
- Section order: masthead → The Log → rank block → Journey so far → Stamps collected → Where next.
- Rank: title + two meters (Countries terracotta, Regions teal) + "N more countries and M region(s) to {next}" + ladder with the current tier boxed.
- ONE scenario: "Most recent" row is hidden; where-next card renders (recommends a new region, e.g. Bibimbap/Injera).
- No `TravelIdentity` anywhere.

- [ ] **Step 8: Commit**

```bash
git add app/dev/journal/fixtures.ts app/dev/journal/page.tsx
git commit -m "feat(journal): wire Edition 2 recap + where-next into /dev/journal fixtures"
```

---

## Self-Review

**Spec coverage:**
- Rank block (type-first, meters, toward line, ladder, max-tier, zero-country) → Task 2 + rendered in Task 6. ✓
- Journey so far (4 rows, dedupe rules) → Task 1 (derivation) + Task 3 (render). ✓
- Where next (one card, reason copy, null-hides) → Task 4 + wired Tasks 5/7. ✓
- Data stays layered (hook + fixtures compute, view presentational) → Tasks 5, 7; view only receives props → Task 6. ✓
- `/dev/journal` zero Supabase, renders card → Task 7. ✓
- Section order Masthead→Log→Rank→Journey→Stamps→WhereNext → Task 6 Step 3. ✓
- `TravelIdentity` retired → Task 6 Step 5, Task 7 Step 4. ✓
- Preserved rejections (no badges, no per-collection meters, one card) → honored across components. ✓
- `computeTopRegion` "lift from InsideFrontSpread and share": the spec suggested lifting it, but the journal has `region` on each `JournalEntry`, so Task 1 computes top region directly from entries without needing the country→region lookup. `InsideFrontSpread` is left untouched. This is simpler and avoids a shared-helper refactor — a deliberate deviation from the spec's suggestion, same result.

**Placeholder scan:** No TBD/TODO; every code step carries full code. ✓

**Type consistency:** `JourneyRecap`/`RecapItem` defined Task 1, consumed Tasks 3/5/6 with matching field names (`firstCook`, `mostRecent`, `topRegion`, `mostCooked`). `Recommendation` used Tasks 4/5/6 from `@/lib/passport-recommend`. `JournalRank` prop `summary: PassportSummary` consistent Tasks 2/6/7. `FIXTURE_RECIPES` defined Task 7 Step 1, used Step 3. ✓
