# Passport Onboarding & Back Cover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-step "How this works" onboarding block to the inside-front cover and a `?`-button help modal accessible from every spread, and rewrite the back cover as a journey recap (left) plus three next-chapter recipe recommendations (right).

**Architecture:** Onboarding copy is inlined directly in `InsideFrontSpread` and duplicated in a new `PassportHelpModal` (3 lines — DRY is not worth a shared module here). The `?` trigger lives inside `PageIndicator` (already on every spread) and owns the modal-open state locally. Back cover adds a pure ranking function `recommendNextRecipes` in `lib/passport-recommend.ts` that chooses from three pools in order — new regions → new countries → revisit. `BackCoverSpread` calls `useRecipes` directly (TanStack Query cache is already populated, no extra fetch).

**Tech Stack:** Next.js 15 (App Router), React 19 client components, TypeScript, Tailwind v4 theme tokens, `next/link`, `next/navigation`, TanStack Query (`useRecipes`).

**Reference spec:** `docs/superpowers/specs/2026-04-19-passport-onboarding-and-back-cover-design.md`

**Branch:** continue on `passport-ten-regions-blank-pages` (current PR branch so this ships before the ten-region work lands on main).

**Test strategy:** This repo has no test suite (see `CLAUDE.md`). Verification for each task uses `npx tsc --noEmit` and `npm run build`. `npm run lint` is deprecated in this repo and hangs interactively — do **not** run it. Manual QA (Task 6) is the final gate.

---

## File structure

**Create:**
- `lib/passport-recommend.ts` — pure `recommendNextRecipes(recipes, summary, limit)` function.
- `components/passport/PassportHelpModal.tsx` — dismissible modal with onboarding steps + legend.

**Modify:**
- `components/passport/InsideFrontSpread.tsx` — append "How this works" block to left half.
- `components/passport/PageIndicator.tsx` — add `?` button + modal-open state.
- `components/passport/BackCoverSpread.tsx` — full rewrite for recap + recommendations.

**Untouched:**
- `components/passport/{BookletShell,PassportBooklet,SpreadView,CoverPage,Spread,RegionHalf,CountryStampSlot,StampedRecipesModal,NavChevrons,PaperTexture}.tsx`
- `components/passport/hooks/{usePassportSpreads,useBookletNav}.ts`
- `lib/{passport,passport-pack,regions,types}.ts`

---

## Task 1: Inside-front onboarding block

**Files:**
- Modify: `components/passport/InsideFrontSpread.tsx`

- [ ] **Step 1.1: Append onboarding block to the left half**

Open `components/passport/InsideFrontSpread.tsx`. The left-half column currently ends with the next-tier / highest-title conditional (the block wrapping the `Next: ...` line, around the file's first `</div>` at the end of the left column). Add a new sibling block **after** that conditional and **before** the `</div>` that closes the left column.

Insert:

```tsx
        <div className="mt-6">
          <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
            How this works
          </div>
          <ol className="space-y-1.5">
            <OnboardStep numeral="①" text="Cook a recipe from anywhere in the app." />
            <OnboardStep numeral="②" text="Earn a dated country stamp." />
            <OnboardStep numeral="③" text="Fill your passport, unlock traveler titles." />
          </ol>
        </div>
```

Add the `OnboardStep` helper at the bottom of the file (next to `Stat` and `ProgressHint`):

```tsx
function OnboardStep({ numeral, text }: { numeral: string; text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-brown-dark font-body">
      <span
        aria-hidden
        className="font-heading text-brown-medium leading-none mt-0.5"
      >
        {numeral}
      </span>
      <span className="leading-snug">{text}</span>
    </li>
  );
}
```

- [ ] **Step 1.2: Type check and build**

Run:
```bash
npx tsc --noEmit
npm run build
```
Expected: both green, 8/8 static pages generated.

- [ ] **Step 1.3: Commit**

```bash
git add components/passport/InsideFrontSpread.tsx
git commit -m "feat(passport): add 'How this works' onboarding block to inside-front cover"
```

---

## Task 2: Help modal component

**Files:**
- Create: `components/passport/PassportHelpModal.tsx`

- [ ] **Step 2.1: Write the modal**

Create `components/passport/PassportHelpModal.tsx` with the same fixed-backdrop + panel pattern used in `StampedRecipesModal.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PassportHelpModal({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown-dark/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How your passport works"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className="bg-parchment rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-light/40">
          <h2 className="font-heading text-xl font-bold text-brown-dark">
            How your passport works
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded hover:bg-brown-light/20 text-brown-medium"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-5 text-sm text-brown-dark font-body">
          <section>
            <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] mb-2">
              Getting started
            </div>
            <ol className="space-y-2">
              <HelpStep numeral="①" text="Cook a recipe from anywhere in the app." />
              <HelpStep numeral="②" text="Earn a dated country stamp." />
              <HelpStep numeral="③" text="Fill your passport, unlock traveler titles." />
            </ol>
          </section>

          <section>
            <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] mb-2">
              Reading the booklet
            </div>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                Use the <kbd className="font-body px-1.5 py-0.5 rounded bg-brown-dark/5 border border-brown-light/40">←</kbd>{' '}
                and <kbd className="font-body px-1.5 py-0.5 rounded bg-brown-dark/5 border border-brown-light/40">→</kbd>{' '}
                keys or the chevron buttons to flip one spread at a time.
              </li>
              <li>
                Long regions continue onto extra spreads labeled <span className="font-semibold">· cont&rsquo;d</span>; their
                URL slugs end in <code>-2</code>, <code>-3</code>, and so on.
              </li>
              <li>
                A stamp appears the first time you cook any recipe from a country; cooking more recipes from the same
                country raises the <span className="font-semibold">×count</span> on the stamp.
              </li>
              <li>
                Tap any stamp to open the recipes you&rsquo;ve cooked from that country.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function HelpStep({ numeral, text }: { numeral: string; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span aria-hidden className="font-heading text-brown-medium leading-none mt-0.5">
        {numeral}
      </span>
      <span className="leading-snug">{text}</span>
    </li>
  );
}
```

- [ ] **Step 2.2: Type check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 2.3: Commit**

```bash
git add components/passport/PassportHelpModal.tsx
git commit -m "feat(passport): add PassportHelpModal with onboarding + legend"
```

---

## Task 3: `?` help button in `PageIndicator`

**Files:**
- Modify: `components/passport/PageIndicator.tsx`

The indicator owns the modal-open state locally so no prop drilling is needed. The button sits to the left of the dots.

- [ ] **Step 3.1: Replace `PageIndicator.tsx`**

Overwrite `components/passport/PageIndicator.tsx` with:

```tsx
'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import PassportHelpModal from './PassportHelpModal';

interface Props {
  count: number;
  index: number;
  onJump: (i: number) => void;
}

export default function PageIndicator({ count, index, onJump }: Props) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-wrap items-center justify-center gap-1.5 mt-6"
        role="tablist"
        aria-label="Passport pages"
      >
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="How your passport works"
          className="mr-1 w-6 h-6 flex items-center justify-center rounded-full text-brown-medium hover:text-terracotta hover:bg-brown-light/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <HelpCircle size={16} aria-hidden />
        </button>

        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => onJump(i)}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? 'w-6 bg-terracotta'
                : 'w-2 bg-brown-light/60 hover:bg-brown-medium'
            }`}
          />
        ))}
      </div>

      <PassportHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
```

Notes:
- `HelpCircle` from `lucide-react` matches the existing icon source (`X` in `StampedRecipesModal`).
- The button is outside the `role="tablist"` semantically by being a sibling-ish element, but inside the flex row. If that lints as a role violation in the future, move the tablist role to a nested `<div>`; it isn't today.

- [ ] **Step 3.2: Type check and build**

Run:
```bash
npx tsc --noEmit
npm run build
```
Expected: both green.

- [ ] **Step 3.3: Commit**

```bash
git add components/passport/PageIndicator.tsx
git commit -m "feat(passport): add help button with onboarding modal to page indicator"
```

---

## Task 4: Recommendation algorithm

**Files:**
- Create: `lib/passport-recommend.ts`

This is a pure function. No tests in this repo — we sanity-check by eyeballing output with `npx tsx` (Step 4.2).

- [ ] **Step 4.1: Write the module**

Create `lib/passport-recommend.ts`:

```ts
import type { Recipe } from './types';
import type { PassportSummary } from './passport';

export type RecommendationReason = 'new-region' | 'new-country' | 'revisit';

export interface Recommendation {
  recipe: Recipe;
  reason: RecommendationReason;
}

/**
 * Pick up to `limit` recipes to suggest on the back cover.
 *
 * Selection tiers (in order):
 *   1. "new-region"  — recipes from regions the user has not touched; one per region.
 *   2. "new-country" — recipes from countries the user has not cooked, in regions they've already touched; one per country.
 *   3. "revisit"     — recipes from already-cooked countries, countries with the fewest stamps first.
 *
 * Deterministic: sorted by region → country → recipe title so reloads don't reshuffle.
 */
export function recommendNextRecipes(
  recipes: Recipe[],
  summary: PassportSummary,
  limit = 3,
): Recommendation[] {
  const cooked = new Set<string>(
    [...summary.stampsPerCountry.entries()]
      .filter(([, stamps]) => stamps.length > 0)
      .map(([country]) => country),
  );
  const touchedRegions = summary.regionsTouched;

  const sortRecipes = (a: Recipe, b: Recipe) => {
    if (a.region !== b.region) return a.region.localeCompare(b.region);
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return a.name.localeCompare(b.name);
  };

  const sorted = [...recipes].sort(sortRecipes);

  const picked: Recommendation[] = [];
  const pickedCountries = new Set<string>();
  const pickedRegions = new Set<string>();

  // Pool 1: new regions — one recipe per untouched region.
  for (const r of sorted) {
    if (picked.length >= limit) break;
    if (touchedRegions.has(r.region)) continue;
    if (pickedRegions.has(r.region)) continue;
    picked.push({ recipe: r, reason: 'new-region' });
    pickedRegions.add(r.region);
    pickedCountries.add(r.country);
  }

  // Pool 2: new countries in already-touched regions — one per country.
  if (picked.length < limit) {
    for (const r of sorted) {
      if (picked.length >= limit) break;
      if (cooked.has(r.country)) continue;
      if (pickedCountries.has(r.country)) continue;
      if (!touchedRegions.has(r.region)) continue; // would belong to Pool 1 but we already ran it
      picked.push({ recipe: r, reason: 'new-country' });
      pickedCountries.add(r.country);
    }
  }

  // Pool 3: revisit — cooked countries, fewest stamps first, then by region/country/name.
  if (picked.length < limit) {
    const stampsFor = (country: string) =>
      summary.stampsPerCountry.get(country)?.length ?? 0;

    const revisitPool = sorted
      .filter(r => cooked.has(r.country) && !pickedCountries.has(r.country))
      .sort((a, b) => {
        const da = stampsFor(a.country);
        const db = stampsFor(b.country);
        if (da !== db) return da - db;
        return sortRecipes(a, b);
      });

    for (const r of revisitPool) {
      if (picked.length >= limit) break;
      if (pickedCountries.has(r.country)) continue;
      picked.push({ recipe: r, reason: 'revisit' });
      pickedCountries.add(r.country);
    }
  }

  return picked;
}
```

- [ ] **Step 4.2: Sanity-check with `tsx`**

Run:
```bash
npx --yes tsx -e "$(cat <<'EOF'
import { recommendNextRecipes } from './lib/passport-recommend';

const mkRecipe = (over: any) => ({
  id: over.id, name: over.name, country: over.country, region: over.region,
  slug: over.id, description: '', image: '', ingredients: [], steps: [],
  tags: [], category: 'main', difficulty: 'easy', time: 30, servings: 2,
  source: '', author: '', notes: '',
});

const recipes = [
  mkRecipe({ id: 'a', name: 'Chicken Tagine', country: 'Morocco', region: 'North Africa' }),
  mkRecipe({ id: 'b', name: 'Pho Ga', country: 'Vietnam', region: 'Southeast Asia' }),
  mkRecipe({ id: 'c', name: 'Lomo Saltado', country: 'Peru', region: 'Caribbean & Americas' }),
  mkRecipe({ id: 'd', name: 'Ramen', country: 'Japan', region: 'Japan & Korea' }),
  mkRecipe({ id: 'e', name: 'Sushi', country: 'Japan', region: 'Japan & Korea' }),
];

const summary = {
  totalStamps: 1,
  uniqueCountries: new Set(['Japan']),
  regionsTouched: new Set(['Japan & Korea'] as any),
  stampsPerCountry: new Map([['Japan', [{ id: '1', recipe_slug: 'd', recipe_country: 'Japan', cooked_at: '2026-04-10' }]]]),
  title: 'Curious Cook' as const,
  nextTier: null,
};

console.log(JSON.stringify(recommendNextRecipes(recipes as any, summary as any, 3).map(r => ({ id: r.recipe.id, reason: r.reason })), null, 2));
EOF
)"
```

Expected output (exactly):
```json
[
  { "id": "c", "reason": "new-region" },
  { "id": "a", "reason": "new-region" },
  { "id": "b", "reason": "new-region" }
]
```
Why: all three untouched regions get one recipe each, sorted alphabetically by region (`Caribbean & Americas` → `North Africa` → `Southeast Asia`). Pools 2 and 3 never run because Pool 1 already filled 3 slots.

If the output differs, fix the algorithm before continuing.

- [ ] **Step 4.3: Type check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4.4: Commit**

```bash
git add lib/passport-recommend.ts
git commit -m "feat(passport): add recommendNextRecipes pure selection algorithm"
```

---

## Task 5: Back cover rewrite — recap + recommendations

**Files:**
- Modify: `components/passport/BackCoverSpread.tsx` (full rewrite)

- [ ] **Step 5.1: Overwrite `BackCoverSpread.tsx`**

Replace the entire file contents with:

```tsx
'use client';

import Link from 'next/link';
import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';
import { useRecipes } from '@/hooks/useRecipes';
import {
  recommendNextRecipes,
  type Recommendation,
} from '@/lib/passport-recommend';

interface Props {
  summary: PassportSummary;
}

export default function BackCoverSpread({ summary }: Props) {
  const { data: recipes = [] } = useRecipes();
  const recs = recommendNextRecipes(recipes, summary, 3);
  const hasStamps = summary.totalStamps > 0;
  const topRegion = computeTopRegion(summary.stampsPerCountry, recipes);

  return (
    <div
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: '1fr 1fr',
        padding: 'calc(var(--stamp-size) * 0.35)',
        columnGap: 'calc(var(--stamp-size) * 0.6)',
      }}
    >
      <JourneyRecap summary={summary} hasStamps={hasStamps} topRegion={topRegion} />
      <NextChapter recs={recs} hasStamps={hasStamps} />
    </div>
  );
}

function JourneyRecap({
  summary, hasStamps, topRegion,
}: {
  summary: PassportSummary;
  hasStamps: boolean;
  topRegion: { region: string; count: number } | null;
}) {
  const { title, nextTier, stampsPerCountry, totalStamps, uniqueCountries, regionsTouched } = summary;

  const flat = flattenStamps(stampsPerCountry);
  const first = flat[0];
  const latest = flat[flat.length - 1];

  return (
    <div className="flex flex-col min-h-0">
      <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
        Your journey
      </div>
      <h2 className="font-heading text-3xl font-bold text-brown-dark mb-5 leading-tight">
        {title}
      </h2>

      {!hasStamps ? (
        <p className="text-sm text-brown-dark font-body leading-relaxed mb-4">
          Your passport is blank. The journey starts with a single recipe.
        </p>
      ) : (
        <ul className="space-y-1.5 mb-4">
          {first && (
            <RecapRow
              label="First stamp"
              value={`${first.country} \u00b7 ${formatDay(first.cooked_at)}`}
            />
          )}
          {latest && first && latest.cooked_at !== first.cooked_at && (
            <RecapRow
              label="Most recent"
              value={`${latest.country} \u00b7 ${formatDay(latest.cooked_at)}`}
            />
          )}
          {topRegion && (
            <RecapRow
              label="Top region"
              value={`${topRegion.region} \u00b7 ${topRegion.count}`}
            />
          )}
          <RecapRow
            label="Reach"
            value={`${uniqueCountries.size} ${uniqueCountries.size === 1 ? 'country' : 'countries'} \u00b7 ${regionsTouched.size} ${regionsTouched.size === 1 ? 'region' : 'regions'}`}
          />
          {/* keep totalStamps readable even if unused in the rows above */}
          {totalStamps > 0 && (
            <RecapRow
              label="Stamps"
              value={`${totalStamps}`}
            />
          )}
        </ul>
      )}

      {nextTier ? (
        <div className="text-sm text-brown-medium font-body">
          <span className="font-semibold text-brown-dark">
            {progressToNextTier(totalStamps, regionsTouched.size, nextTier.minStamps, nextTier.minRegions)}
          </span>{' '}
          from <span className="font-semibold text-brown-dark">{nextTier.title}</span>.
        </div>
      ) : (
        <div className="text-sm text-brown-medium font-body">
          You&apos;ve reached the highest title. The world is yours.
        </div>
      )}
    </div>
  );
}

function NextChapter({
  recs, hasStamps,
}: { recs: Recommendation[]; hasStamps: boolean }) {
  const allRevisit = recs.length > 0 && recs.every(r => r.reason === 'revisit');
  const label = !hasStamps
    ? 'Start here'
    : allRevisit
      ? 'Keep exploring'
      : 'Next chapter';
  const intro = !hasStamps
    ? 'Three places to start your passport.'
    : allRevisit
      ? 'You\u2019ve cooked nearly everything. Revisit a favorite.'
      : 'Three places to cook toward your next tier.';

  return (
    <div className="flex flex-col min-h-0">
      <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
        {label}
      </div>
      <p className="text-sm text-brown-dark font-body mb-4 leading-snug">
        {intro}
      </p>

      <ul className="space-y-3 flex-1">
        {recs.map(({ recipe }) => (
          <li key={recipe.id}>
            <Link
              href={`/recipes/${recipe.id}`}
              className="block rounded-xl bg-brown-dark/5 hover:bg-brown-dark/10 transition-colors p-3 border border-brown-light/30"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-brown-medium font-body mb-1">
                {recipe.country} {'\u00b7'} {recipe.region}
              </div>
              <div className="font-heading text-base font-bold text-brown-dark leading-snug">
                {recipe.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/recipes"
        className="mt-4 inline-block self-start text-sm text-brown-medium hover:text-terracotta font-body"
      >
        Browse all recipes &rarr;
      </Link>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-dotted border-brown-light/50 pb-1.5">
      <span className="text-xs uppercase tracking-wider text-brown-medium font-body">
        {label}
      </span>
      <span className="font-heading text-sm text-brown-dark text-right">
        {value}
      </span>
    </li>
  );
}

function flattenStamps(
  stampsPerCountry: Map<string, StampRow[]>,
): Array<{ country: string; cooked_at: string }> {
  const flat: Array<{ country: string; cooked_at: string }> = [];
  for (const [country, stamps] of stampsPerCountry) {
    for (const s of stamps) flat.push({ country, cooked_at: s.cooked_at });
  }
  flat.sort((a, b) => a.cooked_at.localeCompare(b.cooked_at));
  return flat;
}

function computeTopRegion(
  stampsPerCountry: Map<string, StampRow[]>,
  recipes: { country: string; region: string }[],
): { region: string; count: number } | null {
  const countryToRegion = new Map<string, string>();
  for (const r of recipes) {
    if (!countryToRegion.has(r.country)) {
      countryToRegion.set(r.country, r.region);
    }
  }
  const totals = new Map<string, number>();
  for (const [country, stamps] of stampsPerCountry) {
    const region = countryToRegion.get(country);
    if (!region) continue;
    totals.set(region, (totals.get(region) ?? 0) + stamps.length);
  }
  let best: { region: string; count: number } | null = null;
  for (const [region, count] of totals) {
    if (!best || count > best.count) best = { region, count };
  }
  return best;
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (sameDay) return 'today';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function progressToNextTier(
  stamps: number,
  regions: number,
  minStamps: number,
  minRegions: number,
): string {
  const s = Math.max(0, minStamps - stamps);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (s > 0) parts.push(`${s} stamp${s === 1 ? '' : 's'}`);
  if (r > 0) parts.push(`${r} region${r === 1 ? '' : 's'}`);
  return parts.length ? `${parts.join(' and ')}` : 'one cook';
}
```

- [ ] **Step 5.2: Type check and build**

Run:
```bash
npx tsc --noEmit
npm run build
```
Expected: both green. If `tsc` complains about `country/region` shape mismatch on `recipes`, leave the `Recipe` import out (we only need `{ country, region }`) — the function signature uses a structural type.

- [ ] **Step 5.3: Commit**

```bash
git add components/passport/BackCoverSpread.tsx
git commit -m "feat(passport): rewrite back cover as journey recap plus next-chapter recs"
```

---

## Task 6: Manual QA

This task is human-in-the-loop. No code changes unless a failure is found.

**Preconditions:** Tasks 1–5 committed. The `cooked_stamps` table has a handful of rows spanning at least two regions (or seed some by cooking recipes).

- [ ] **Step 6.1: Run the dev server**

Run: `npm run dev`
Open: `http://localhost:3000/passport`

- [ ] **Step 6.2: Walk the checklist**

Inside-front cover:
- [ ] Left half shows "Traveler profile" title/stats/next-tier AND a new "HOW THIS WORKS" block with three numbered rows beneath. No layout overlap with the right-half TOC.
- [ ] Right-half TOC still lists all 10 regions with cooked counts.

Help modal (`?` button in page indicator):
- [ ] A `?` circle appears to the left of the page dots on every spread.
- [ ] Clicking opens a modal titled "How your passport works" with Getting-started + Reading-the-booklet sections.
- [ ] `Esc`, backdrop click, and the `×` button all close the modal.
- [ ] Modal reads cleanly at 375×667 viewport.

Back cover:
- [ ] Left half header is "YOUR JOURNEY" + tier title.
- [ ] Rows show First stamp / Most recent / Top region / Reach / Stamps for a user with stamps.
- [ ] "First stamp" and "Most recent" read correctly (first = oldest `cooked_at`, most recent = newest).
- [ ] "Top region" is a region label (e.g., "East Asia"), not a country name.
- [ ] Next-tier progress line reads e.g. "5 stamps and 2 regions from Pathfinder." or, at highest tier, "You've reached the highest title. The world is yours."
- [ ] Right half header is "NEXT CHAPTER" for normal users, "START HERE" for zero-stamps users, and "KEEP EXPLORING" if every recommendation is from Pool C (revisit).
- [ ] Three recipe cards render, each links to `/recipes/<slug>` and the link works.
- [ ] "Browse all recipes →" link navigates to `/recipes`.

Cross-checks:
- [ ] The rest of the booklet (cover, region spreads, continuation spreads, chevrons, deep links, keyboard flip, reduce-motion) is unaffected.

- [ ] **Step 6.3: If any item fails**

File a follow-up commit per failure on this branch with a descriptive message, e.g.:

```bash
git commit -m "fix(passport): <what regressed and how it was fixed>"
```

- [ ] **Step 6.4: If all items pass, no commit needed.**

Task 6 is complete when the checklist passes end-to-end.

---

## Self-Review Notes

- The spec asks for the help modal's stamp behavior copy to say "first cook gives a stamp; more cooks raise ×count". Task 2's legend covers this.
- The spec allows inline duplication of the 3 onboarding steps between `InsideFrontSpread` and `PassportHelpModal`. Tasks 1 and 2 do exactly that — no shared module.
- `BackCoverSpread.tsx` previously received only `summary`; it now additionally calls `useRecipes()`. No `SpreadView` or `PassportBooklet` signature changes required.
- `computeTopRegion` is passed `recipes` (the full list from `useRecipes`) so it can build a country→region map on the fly rather than depending on prop drilling.
