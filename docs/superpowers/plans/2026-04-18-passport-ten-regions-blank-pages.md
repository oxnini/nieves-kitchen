# Passport: Ten Regions, Blank Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the passport booklet to 10 fixed top-level region spreads with blank-until-cooked pages, stamps ordered by `cooked_at`, 3×4 grid per half (+15% stamp size), and a region-level "Browse recipes" discovery link.

**Architecture:** Rewrite the `passport-pack` packer to the simpler shape `(region, orderedCountries) → RegionSpread[]` of 24-slot chunks; rewrite `usePassportSpreads` to emit all 10 regions from `Recipe.region` + first-cook timestamps; simplify the display layer (`RegionHalf`, `CountryStampSlot`, `SpreadView`, `PassportBooklet`, `InsideFrontSpread`) to match; update `BookletShell` sizing math for 3 columns so stamps render ~15% larger while the open spread still fits the viewport. The world map and all sub-region data/typings stay intact.

**Tech Stack:** Next.js 15 (App Router), React 19 client components, TypeScript, Tailwind v4 theme tokens, Supabase (already wired via `useCookedStamps`), Framer Motion (untouched).

**Reference spec:** `docs/superpowers/specs/2026-04-18-passport-ten-regions-blank-pages-design.md`

**Branch:** work on `passport-ten-regions-blank-pages` (already created, spec committed).

**Test strategy:** This repo has no test suite (see `CLAUDE.md`). Verification for each task uses `npx tsc --noEmit` (type check) and `npm run build` (Next.js production build). `npm run lint` is deprecated in this repo and prompts an interactive migration that hangs non-interactive shells — do **not** run it. Manual QA (Task 3) is the final acceptance gate.

---

## File structure

**Rewrite:**
- `lib/passport-pack.ts`
- `components/passport/hooks/usePassportSpreads.ts`
- `components/passport/RegionHalf.tsx`
- `components/passport/InsideFrontSpread.tsx`

**Edit:**
- `components/passport/CountryStampSlot.tsx` — delete uncooked-placeholder branch.
- `components/passport/SpreadView.tsx` — new region spread props.
- `components/passport/PassportBooklet.tsx` — drop `onUncooked` country handler.
- `components/passport/BookletShell.tsx` — 3 columns per half + gap tuning for +15% stamp size.
- `lib/types.ts` — add `CULINARY_REGION_ORDER` exported const.

**Untouched:**
- `components/WorldMap.tsx`
- `lib/regions.ts` (sub-region constants remain for the map)
- `hooks/useCookedStamps.ts`, `lib/passport.ts` (`PassportSummary`, `summarizeStamps`)
- `components/passport/BookletShell.tsx` structural logic (only the `COLS_PER_HALF` constant and `gapPx` formula change)
- `components/passport/{Spread,CoverPage,BackCoverSpread,NavChevrons,PageIndicator,PaperTexture,StampedRecipesModal}.tsx`
- `components/passport/hooks/useBookletNav.ts`

---

## Task 1: Atomic region-model rewrite

This task touches eight files together because the passport's data and display layers are interlocked through the `SpreadDescriptor` union — splitting the rewrite mid-cluster would leave the tree non-compiling for intermediate steps. Completion gate: `npx tsc --noEmit` and `npm run build` both pass.

**Files:**
- Modify: `lib/types.ts` (add ordered region array)
- Rewrite: `lib/passport-pack.ts`
- Rewrite: `components/passport/hooks/usePassportSpreads.ts`
- Rewrite: `components/passport/RegionHalf.tsx`
- Modify: `components/passport/CountryStampSlot.tsx` (remove uncooked branch)
- Modify: `components/passport/SpreadView.tsx`
- Modify: `components/passport/PassportBooklet.tsx`
- Rewrite: `components/passport/InsideFrontSpread.tsx`

- [ ] **Step 1.1: Add `CULINARY_REGION_ORDER` in `lib/types.ts`**

Append to `lib/types.ts` (after the `CulinaryRegion` type declaration around line 55):

```ts
// Ordered list for iteration where stable display order matters (passport booklet).
// Matches the declaration order of the CulinaryRegion union above.
export const CULINARY_REGION_ORDER: CulinaryRegion[] = [
  'Western Europe',
  'Eastern Europe',
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Japan & Korea',
  'Middle East',
  'North Africa',
  'Sub-Saharan Africa',
  'Caribbean & Americas',
];
```

Leave `SubCulinaryRegion` exactly as is — the world map still uses it.

- [ ] **Step 1.2: Rewrite `lib/passport-pack.ts` entirely**

Replace the file contents with:

```ts
import type { CulinaryRegion } from './types';

// Grid is 3 columns × 4 rows per half; two halves per spread.
export const COLS_PER_HALF = 3;
export const ROWS_PER_HALF = 4;
export const HALF_CAPACITY = COLS_PER_HALF * ROWS_PER_HALF; // 12
export const SPREAD_CAPACITY = HALF_CAPACITY * 2;           // 24

export interface RegionSpread {
  kind: 'region';
  region: CulinaryRegion;
  /** Stable slug for deep-linking. First spread = region slug; continuations append `-2`, `-3`, ... */
  slug: string;
  /** 0 for the first (primary) spread in a region, 1+ for continuations. */
  continuationIndex: number;
  /** Up to HALF_CAPACITY countries, in cooked order. May be empty on an empty primary spread. */
  leftCountries: string[];
  /** Up to HALF_CAPACITY countries, in cooked order. May be empty. */
  rightCountries: string[];
}

export function regionSlug(region: CulinaryRegion): string {
  return region
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Pack an ordered list of cooked countries for a single top-level region
 * into one or more spreads of 24 slots (12 per half).
 *
 * An empty list still produces a single primary spread (empty) — the booklet
 * always shows all 10 regions.
 */
export function packRegion(
  region: CulinaryRegion,
  orderedCountries: string[],
): RegionSpread[] {
  const base = regionSlug(region);
  if (orderedCountries.length === 0) {
    return [{
      kind: 'region',
      region,
      slug: base,
      continuationIndex: 0,
      leftCountries: [],
      rightCountries: [],
    }];
  }

  const spreads: RegionSpread[] = [];
  let offset = 0;
  let continuationIndex = 0;
  while (offset < orderedCountries.length) {
    const leftCountries = orderedCountries.slice(offset, offset + HALF_CAPACITY);
    const rightCountries = orderedCountries.slice(
      offset + HALF_CAPACITY,
      offset + SPREAD_CAPACITY,
    );
    spreads.push({
      kind: 'region',
      region,
      slug: continuationIndex === 0 ? base : `${base}-${continuationIndex + 1}`,
      continuationIndex,
      leftCountries,
      rightCountries,
    });
    offset += SPREAD_CAPACITY;
    continuationIndex += 1;
  }
  return spreads;
}
```

- [ ] **Step 1.3: Rewrite `components/passport/hooks/usePassportSpreads.ts` entirely**

Replace the file contents with:

```ts
'use client';

import { useMemo } from 'react';
import { CULINARY_REGION_ORDER, type CulinaryRegion, type Recipe } from '@/lib/types';
import type { PassportSummary } from '@/lib/passport';
import { packRegion, type RegionSpread } from '@/lib/passport-pack';

export type SpreadDescriptor =
  | { kind: 'cover' }
  | { kind: 'inside-front' }
  | RegionSpread
  | { kind: 'back-cover' };

interface Input {
  recipes: Recipe[];
  summary: PassportSummary;
}

/**
 * Build the passport's spread sequence:
 *   cover → inside-front → one or more spreads per region (all 10 always present)
 *   → back-cover.
 *
 * Stamp ordering within a region is by each country's first cooked_at
 * timestamp ascending, with country-name alphabetical as a tiebreak.
 */
export function usePassportSpreads({ recipes, summary }: Input): SpreadDescriptor[] {
  return useMemo(() => {
    // country → top-level region (derived from the recipe list — every cooked
    // country has at least one recipe, so this lookup is total for our inputs).
    const countryToRegion = new Map<string, CulinaryRegion>();
    for (const r of recipes) {
      if (!countryToRegion.has(r.country)) {
        countryToRegion.set(r.country, r.region);
      }
    }

    // For each region, collect cooked countries and their first cooked_at.
    const perRegion = new Map<CulinaryRegion, { country: string; firstAt: string }[]>();
    for (const region of CULINARY_REGION_ORDER) perRegion.set(region, []);

    for (const [country, stamps] of summary.stampsPerCountry) {
      if (stamps.length === 0) continue;
      const region = countryToRegion.get(country);
      if (!region) continue;
      // Stamps arrive ordered ascending by cooked_at from useCookedStamps.
      const firstAt = stamps[0].cooked_at;
      perRegion.get(region)!.push({ country, firstAt });
    }

    // Order: first cooked_at ascending, country name ascending as tiebreak.
    const orderedPerRegion = new Map<CulinaryRegion, string[]>();
    for (const region of CULINARY_REGION_ORDER) {
      const arr = perRegion.get(region)!;
      arr.sort((a, b) => {
        if (a.firstAt !== b.firstAt) return a.firstAt < b.firstAt ? -1 : 1;
        return a.country.localeCompare(b.country);
      });
      orderedPerRegion.set(region, arr.map(x => x.country));
    }

    const regionSpreads: RegionSpread[] = [];
    for (const region of CULINARY_REGION_ORDER) {
      regionSpreads.push(...packRegion(region, orderedPerRegion.get(region)!));
    }

    return [
      { kind: 'cover' as const },
      { kind: 'inside-front' as const },
      ...regionSpreads,
      { kind: 'back-cover' as const },
    ];
  }, [recipes, summary]);
}
```

- [ ] **Step 1.4: Rewrite `components/passport/RegionHalf.tsx` entirely**

Replace the file contents with:

```tsx
'use client';

import Link from 'next/link';
import type { Stamp as StampRow } from '@/lib/passport';
import type { CulinaryRegion } from '@/lib/types';
import CountryStampSlot from './CountryStampSlot';

interface Props {
  region: CulinaryRegion;
  /** Up to 12 country names in cooked order. May be empty. */
  countries: string[];
  /** If true, show the region header on this half (first spread's left half only). */
  showHeader: boolean;
  /** Continuation index of the owning spread; 0 = primary spread. */
  continuationIndex: number;
  stampsPerCountry: Map<string, StampRow[]>;
  onCookedClick: (country: string) => void;
}

export default function RegionHalf({
  region, countries, showHeader, continuationIndex, stampsPerCountry, onCookedClick,
}: Props) {
  return (
    <div className="h-full w-full flex flex-col gap-[calc(var(--stamp-size)*0.3)] p-[var(--stamp-gap)]">
      {showHeader && (
        <RegionHeader region={region} continuationIndex={continuationIndex} />
      )}
      <div
        className="grid content-start"
        style={{
          gridTemplateColumns: 'repeat(3, var(--stamp-size))',
          gap: 'var(--stamp-gap)',
          justifyContent: 'center',
        }}
      >
        {countries.map(country => {
          const stamps = stampsPerCountry.get(country) ?? [];
          return (
            <CountryStampSlot
              key={country}
              country={country}
              stamps={stamps}
              onClick={() => onCookedClick(country)}
            />
          );
        })}
      </div>
    </div>
  );
}

function RegionHeader({
  region, continuationIndex,
}: { region: CulinaryRegion; continuationIndex: number }) {
  const isContinuation = continuationIndex > 0;
  const browseHref = `/recipes?region=${encodeURIComponent(region)}`;
  return (
    <div className="mb-[calc(var(--stamp-size)*0.2)] px-[calc(var(--stamp-gap)*0.5)]">
      <div
        className="uppercase tracking-[0.3em] text-brown-medium font-body mb-[calc(var(--stamp-size)*0.04)]"
        style={{ fontSize: 'calc(var(--stamp-size) * 0.12)' }}
      >
        Region{isContinuation ? ' \u00b7 cont\u2019d' : ''}
      </div>
      <h2
        className="font-heading font-bold text-brown-dark leading-[1.1]"
        style={{ fontSize: 'calc(var(--stamp-size) * 0.3)' }}
      >
        {region}
      </h2>
      {!isContinuation && (
        <Link
          href={browseHref}
          className="inline-block mt-[calc(var(--stamp-size)*0.08)] font-body text-terracotta hover:underline"
          style={{ fontSize: 'calc(var(--stamp-size) * 0.13)' }}
        >
          Browse {region} recipes &rarr;
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 1.5: Simplify `components/passport/CountryStampSlot.tsx`**

Replace the file contents with (removes the uncooked branch and its prop/aria wiring — empty slots are never rendered now):

```tsx
'use client';

import type { Stamp as StampRow } from '@/lib/passport';

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

function angleForCountry(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 61) - 30) / 10;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const angle = angleForCountry(country);
  const firstDate = stamps[0]?.cooked_at;

  const sizeStyle: React.CSSProperties = {
    width: 'var(--stamp-size)',
    height: 'var(--stamp-size)',
    fontSize: 'calc(var(--stamp-size) * 0.11)',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={
        'relative aspect-square flex items-center justify-center rounded-full ' +
        'transition-transform focus:outline-none focus-visible:ring-2 ' +
        'focus-visible:ring-terracotta cursor-pointer ' +
        'text-paprika/90 [filter:url(#stamp-ink)] hover:scale-[1.03] mix-blend-multiply'
      }
      style={{ ...sizeStyle, transform: `rotate(${angle}deg)` }}
    >
      <span className="absolute inset-0 rounded-full border-[0.16em] border-current" />
      <span className="absolute inset-[6%] rounded-full border-[0.06em] border-current/70" />

      <span className="flex flex-col items-center justify-center px-[0.4em]">
        <span className="font-heading font-bold uppercase tracking-[0.15em] leading-none">
          {country}
        </span>
        {firstDate && (
          <span
            className="mt-[0.4em] font-body uppercase tracking-wider opacity-80"
            style={{ fontSize: '0.75em' }}
          >
            {formatMonth(firstDate)}
          </span>
        )}
        {stamps.length > 1 && (
          <span
            className="mt-[0.2em] font-body opacity-70"
            style={{ fontSize: '0.65em' }}
          >
            &times;{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
```

- [ ] **Step 1.6: Update `components/passport/SpreadView.tsx`**

Replace the entire `case 'region':` block (and tighten the Props interface — we no longer need `onUncooked` or `recipesByCountry` for the region case). Full replacement for the file:

```tsx
'use client';

import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow, PassportSummary } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import Spread from './Spread';
import CoverPage from './CoverPage';
import InsideFrontSpread from './InsideFrontSpread';
import BackCoverSpread from './BackCoverSpread';
import RegionHalf from './RegionHalf';

interface Props {
  spread: SpreadDescriptor;
  spreads: SpreadDescriptor[];
  summary: PassportSummary;
  stampsPerCountry: Map<string, StampRow[]>;
  recipesByCountry: Map<string, Recipe[]>;
  onCooked: (country: string) => void;
  onJump: (spreadIndex: number) => void;
}

export default function SpreadView(props: Props) {
  const { spread } = props;

  switch (spread.kind) {
    case 'cover':
      return <CoverPage summary={props.summary} />;

    case 'inside-front':
      return (
        <Spread>
          <InsideFrontSpread
            summary={props.summary}
            spreads={props.spreads}
            stampsPerCountry={props.stampsPerCountry}
            onJumpToSpread={props.onJump}
          />
        </Spread>
      );

    case 'region':
      return (
        <Spread>
          <div
            className="h-full w-full grid"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <RegionHalf
              region={spread.region}
              countries={spread.leftCountries}
              showHeader
              continuationIndex={spread.continuationIndex}
              stampsPerCountry={props.stampsPerCountry}
              onCookedClick={props.onCooked}
            />
            <RegionHalf
              region={spread.region}
              countries={spread.rightCountries}
              showHeader={false}
              continuationIndex={spread.continuationIndex}
              stampsPerCountry={props.stampsPerCountry}
              onCookedClick={props.onCooked}
            />
          </div>
        </Spread>
      );

    case 'back-cover':
      return (
        <Spread withSpine={false}>
          <BackCoverSpread summary={props.summary} />
        </Spread>
      );
  }
}
```

Note: `recipesByCountry` is retained as a prop only because other callers may still pass it; it's unused here but keeping it type-compatible avoids rippling the caller. The `onUncooked` prop is removed.

- [ ] **Step 1.7: Update `components/passport/PassportBooklet.tsx`**

Remove the `onUncooked` handler and its wiring. Specific edits:

1. Delete the import of `useRouter` (no longer needed in this file):
   - Remove `import { useRouter } from 'next/navigation';`
   - Remove `const router = useRouter();` inside the component.
2. Delete `const onUncooked = (country: string) => { router.push(...); };`.
3. Remove the `onUncooked={onUncooked}` prop from `<SpreadView …/>`.

After these edits the relevant portion of `PassportBooklet.tsx` should read:

```tsx
  const onCooked = (country: string) => setModalCountry(country);

  return (
    <div className="relative">
      {/* ... */}
              {currentSpread && (
                <SpreadView
                  spread={currentSpread}
                  spreads={spreads}
                  summary={summary}
                  stampsPerCountry={summary.stampsPerCountry}
                  recipesByCountry={recipesByCountry}
                  onCooked={onCooked}
                  onJump={nav.jumpTo}
                />
              )}
      {/* ... */}
```

- [ ] **Step 1.8: Rewrite `components/passport/InsideFrontSpread.tsx` entirely**

Replace the file contents with:

```tsx
'use client';

import { CULINARY_REGION_ORDER, type CulinaryRegion } from '@/lib/types';
import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';

interface Props {
  summary: PassportSummary;
  spreads: SpreadDescriptor[];
  stampsPerCountry: Map<string, StampRow[]>;
  onJumpToSpread: (spreadIndex: number) => void;
}

export default function InsideFrontSpread({
  summary, spreads, onJumpToSpread, stampsPerCountry,
}: Props) {
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;

  // For each top-level region, find the spread index of its primary (continuationIndex 0) spread.
  const primaryIndexByRegion = new Map<CulinaryRegion, number>();
  spreads.forEach((s, idx) => {
    if (s.kind === 'region' && s.continuationIndex === 0) {
      if (!primaryIndexByRegion.has(s.region)) {
        primaryIndexByRegion.set(s.region, idx);
      }
    }
  });

  // Count cooked countries per region from summary.stampsPerCountry.
  // We re-derive the country → region lookup via each spread's countries lists.
  const cookedByRegion = new Map<CulinaryRegion, number>();
  for (const region of CULINARY_REGION_ORDER) cookedByRegion.set(region, 0);
  for (const s of spreads) {
    if (s.kind !== 'region') continue;
    const n = s.leftCountries.length + s.rightCountries.length;
    cookedByRegion.set(s.region, (cookedByRegion.get(s.region) ?? 0) + n);
  }

  return (
    <div
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: '1fr 1fr',
        padding: 'calc(var(--stamp-size) * 0.35)',
        columnGap: 'calc(var(--stamp-size) * 0.6)',
      }}
    >
      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Traveler profile
        </div>
        <h2 className="font-heading text-3xl font-bold text-brown-dark mb-4">
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Stamps" value={totalStamps} />
          <Stat label="Countries" value={uniqueCountries.size} />
          <Stat label="Regions" value={regionsTouched.size} />
        </div>
        {nextTier ? (
          <div className="text-sm text-brown-medium font-body">
            Next: <span className="font-semibold text-brown-dark">{nextTier.title}</span> —{' '}
            <ProgressHint
              stamps={totalStamps}
              regions={regionsTouched.size}
              minStamps={nextTier.minStamps}
              minRegions={nextTier.minRegions}
            />
          </div>
        ) : (
          <div className="text-sm text-brown-medium font-body">
            You&apos;ve reached the highest title. The world is yours.
          </div>
        )}
      </div>

      <div className="flex flex-col min-h-0">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Contents
        </div>
        <ul className="space-y-1.5 overflow-y-auto pr-1">
          {CULINARY_REGION_ORDER.map(region => {
            const cooked = cookedByRegion.get(region) ?? 0;
            const idx = primaryIndexByRegion.get(region);
            return (
              <li key={region}>
                <button
                  type="button"
                  onClick={() => { if (idx !== undefined) onJumpToSpread(idx); }}
                  className="w-full flex items-baseline justify-between gap-3 py-1.5 border-b border-dotted border-brown-light/50 hover:text-terracotta text-left"
                >
                  <span className="font-heading text-sm text-brown-dark truncate">
                    {region}
                  </span>
                  <span className="font-body text-xs text-brown-medium whitespace-nowrap">
                    {cooked} cooked
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-brown-dark/5 rounded-xl px-3 py-2">
      <div className="font-heading text-2xl font-bold text-brown-dark leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-brown-medium mt-1 font-body">{label}</div>
    </div>
  );
}

function ProgressHint({
  stamps, regions, minStamps, minRegions,
}: { stamps: number; regions: number; minStamps: number; minRegions: number }) {
  const s = Math.max(0, minStamps - stamps);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (s > 0) parts.push(`${s} stamp${s === 1 ? '' : 's'}`);
  if (r > 0) parts.push(`${r} region${r === 1 ? '' : 's'}`);
  return <>{parts.length ? `${parts.join(' and ')} to go` : 'unlocked on next cook'}</>;
}
```

The `stampsPerCountry` prop stays in the interface (passed from `SpreadView`), unused in the body — keeping the shape stable for this task; it can be removed in a follow-up if desired.

- [ ] **Step 1.9: Type check**

Run: `npx tsc --noEmit`
Expected: no output (clean exit).

If any errors reference the old `RegionBlock` / `HalfDescriptor` / `BlankHalfDescriptor` / `packRegions` / `RegionInput` types or `onUncookedClick` props, fix them in-place — those names are removed by this task.

- [ ] **Step 1.10: Production build**

Run: `npm run build`
Expected: `✓ Compiled successfully` and `Generating static pages (8/8)` (or similar green result).

If the build warns about unused imports in the touched files, remove them. Do not run `npm run lint` (deprecated, hangs interactively in this repo).

- [ ] **Step 1.11: Commit**

```bash
git add lib/types.ts lib/passport-pack.ts \
        components/passport/hooks/usePassportSpreads.ts \
        components/passport/RegionHalf.tsx \
        components/passport/CountryStampSlot.tsx \
        components/passport/SpreadView.tsx \
        components/passport/PassportBooklet.tsx \
        components/passport/InsideFrontSpread.tsx
git commit -m "feat(passport): collapse to 10 top-level regions with blank pages and cooked-order stamps"
```

---

## Task 2: Stamp sizing — 3 columns per half at +15% linear

**Files:**
- Modify: `components/passport/BookletShell.tsx`

After Task 1 the grid renders with 3 columns per half, but `BookletShell` still computes `--stamp-size` assuming 4 columns. This task tunes the sizing math so stamps end up roughly 15% larger (linear) than the previous 4-column size while the open spread still fits the viewport-fit envelope.

The relevant numbers from the existing file (see `components/passport/BookletShell.tsx:16,63-64`):

```ts
const COLS_PER_HALF = 4;
// ...
const gapPx = halfWidth * 0.03;
const stampSize = (halfWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;
```

Under the old math, `stampSize ≈ 0.2125 × halfWidth`. Target for the new layout: `stampSize ≈ 1.15 × 0.2125 × halfWidth = 0.2444 × halfWidth`.

Solving `stampSize = (halfWidth − g·halfWidth·4) / 3 = 0.2444·halfWidth` gives `g ≈ 0.0667`. We use `0.067` for legibility. Vertical budget: 4 rows × 0.2444 + 5 × 0.067 = 0.978 + 0.335 = 1.313 of half-width units, vs half height = halfWidth / 0.7 ≈ 1.43 of half-width units, leaving headroom of ≈ 0.12 of half-width units for the header + padding — tight but sufficient for the smallest supported viewport (375×667). If the build or visual QA later shows clipping at 375×667, gap can be nudged down to 0.060 (which yields stampSize ≈ 0.253 × halfWidth, +19% — still within the "≈ +15%" intent, since the spec calls out 15% as target rather than a hard contract).

- [ ] **Step 2.1: Edit `components/passport/BookletShell.tsx`**

Change the `COLS_PER_HALF` constant and the `gapPx` coefficient:

Replace this block (around lines 16–17):

```ts
const COLS_PER_HALF = 4;
```

with:

```ts
const COLS_PER_HALF = 3;
```

Replace this block (around lines 62–64):

```ts
  // One stamp slot fills a quarter of a half, minus column gaps.
  // Gap is proportional; pick 3% of half-width.
  const gapPx = halfWidth * 0.03;
  const stampSize = (halfWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;
```

with:

```ts
  // 3×4 grid per half. Gap set so stamp size is ~15% larger than the old
  // 4-column layout while the open spread still fits the viewport envelope
  // (see plan Task 2 for the derivation).
  const gapPx = halfWidth * 0.067;
  const stampSize = (halfWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;
```

Leave every other constant (`OPEN_ASPECT`, `HALF_ASPECT`, `MARGIN_PX`, `NAVBAR_ALLOWANCE_PX`, `INDICATOR_ALLOWANCE_PX`) unchanged.

- [ ] **Step 2.2: Type check**

Run: `npx tsc --noEmit`
Expected: clean (no output).

- [ ] **Step 2.3: Production build**

Run: `npm run build`
Expected: green build, 8/8 static pages generated.

- [ ] **Step 2.4: Commit**

```bash
git add components/passport/BookletShell.tsx
git commit -m "feat(passport): 3 columns per half with stamps ~15% larger"
```

---

## Task 3: Manual QA against the verification checklist

This task is human-in-the-loop. No code changes unless a failure is found.

**Preconditions:** Task 1 and Task 2 commits are in place. The `cooked_stamps` table in Supabase has at least a handful of rows across multiple regions (or seed some via the app).

- [ ] **Step 3.1: Start the dev server**

Run: `npm run dev`
Open: `http://localhost:3000/passport` (or whichever port Next.js reports — port 3001 if 3000 is busy).

- [ ] **Step 3.2: Walk the checklist**

Confirm each:

- [ ] New user (zero cooked) view — if possible, log in as a user with no stamps (or temporarily empty the cooked stamps table): cover is a single centered half panel; inside-front TOC shows 10 rows each reading `0 cooked`; every region spread has only a header + browse link on the left half; right half is blank paper texture; back cover is a single half panel.
- [ ] Cooking the first recipe (e.g., any Japanese dish) puts a single stamp in the first slot of the left half of the `Japan & Korea` spread. TOC updates to `1 cooked` on that row.
- [ ] Cooking a second country in the same region fills slot 2 in cooked order (first cooked_at ascending).
- [ ] Cooking another recipe from an already-stamped country does not add a second stamp or move the stamp.
- [ ] For a region with >24 cooked countries, a `· cont'd` continuation spread appears and its header omits the Browse link. Slicing is contiguous across primary → continuation.
- [ ] Clicking the `Browse <Region> recipes →` link on a region spread navigates to `/recipes?region=<Region>` with the filter applied.
- [ ] Fits viewport without scrollbars at 1920×1080, 1440×900, 1280×720, 768×1024, 375×667. Use browser devtools responsive mode.
- [ ] Stamps are visibly larger than before the Task 2 commit (compare against commit `HEAD~1` by checking out briefly if needed — or just eyeball that stamps look generous).
- [ ] Spine visible on all region spreads and fixed during flips; no inter-region divider anywhere.
- [ ] `/passport?spread=<slug>` deep-links work for both primary slugs (e.g., `?spread=japan-and-korea`) and continuation slugs (e.g., `?spread=western-europe-2`) when they exist.
- [ ] Keyboard `←`/`→` and chevron buttons flip one spread at a time; modifier keys are not required.
- [ ] Tapping any visible stamp opens `StampedRecipesModal` with that country's cooked recipes.
- [ ] There is no way to tap an uncooked slot (because none are rendered).
- [ ] `/` (map page) and `/recipes` are unaffected — map drill-down still uses 20 sub-regions; recipe grid/filters behave as before.
- [ ] Enabling OS "Reduce motion" turns spread flips into cross-fades (no 3D rotate).

- [ ] **Step 3.3: If any item fails**

File a follow-up commit per failure on this branch with a descriptive message, e.g.:

```bash
git commit -m "fix(passport): <what you fixed and why it regressed>"
```

For a failure that requires real design rework, stop and escalate rather than papering over.

- [ ] **Step 3.4: If all items pass, no commit is needed.**

Task 3 is complete when the checklist passes end-to-end.

---

## Rollback note

If the new booklet is worse than the prior version for any reason, revert Tasks 1–2 with:

```bash
git revert HEAD HEAD~1
```

(or revert individual commits by SHA). The spec commit on this branch is pure docs and can stay.
