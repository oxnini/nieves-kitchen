# Passport Booklet — Fit-to-Viewport & Two-Half Packing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the passport booklet so it fits the viewport without scrolling, splits each spread into two independent halves packed by sub-region, shrinks stamps to ~25% of current size (4×4 per half), and renders the cover/back cover as a single-panel closed passport.

**Architecture:** Introduce `SpreadDescriptor` (one spread = 1 or 2 halves) produced by a new `usePassportSpreads` hook that packs sub-regions with small/medium/large rules. `BookletShell` gains an `openState` prop and publishes a `--stamp-size` CSS custom property driven by `min()` viewport fit. A new `RegionHalf` component replaces `SubRegionSpread` and a `SpreadView` dispatcher replaces the inline `renderPage` function.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, framer-motion, Supabase, TanStack Query.

---

## Testing Note

This repo **has no test suite** (per `CLAUDE.md`). Each task ends with a manual verification step using `npm run dev` and visual inspection. All changes must also pass `npm run lint` and `npm run build` before the final commit. Do not introduce a test framework as part of this plan.

## Files

**Create:**
- `lib/passport-pack.ts` — pure packing algorithm (deterministic, easy to eyeball).
- `components/passport/hooks/usePassportSpreads.ts` — replaces `usePassportPages.ts`.
- `components/passport/RegionHalf.tsx` — replaces `SubRegionSpread.tsx`.
- `components/passport/SpreadView.tsx` — extracted from `renderPage` in `PassportBooklet.tsx`.

**Modify:**
- `components/passport/BookletShell.tsx` — `openState` prop, viewport fit, `--stamp-size` var.
- `components/passport/CountryStampSlot.tsx` — drop breakpoints, scale via `--stamp-size`, reduce rotation.
- `components/passport/Spread.tsx` — spine is always on for region spreads; spine visible without `md:` breakpoint.
- `components/passport/InsideFrontSpread.tsx` — consume `SpreadDescriptor[]` for TOC; keep internal two-column layout.
- `components/passport/hooks/useBookletNav.ts` — retype to `SpreadDescriptor[]`; URL slug uses first region in a spread.
- `components/passport/PassportBooklet.tsx` — wire new hook, new dispatcher, closed/open state.

**Delete:**
- `components/passport/SubRegionSpread.tsx`
- `components/passport/hooks/usePassportPages.ts`

---

### Task 1: Add viewport-fit sizing and `--stamp-size` to `BookletShell`

**Files:**
- Modify: `components/passport/BookletShell.tsx`

- [ ] **Step 1: Replace `BookletShell` with viewport-fit + openState**

Overwrite `components/passport/BookletShell.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  openState: 'open' | 'closed';
}

const OPEN_ASPECT = 1.4;          // open spread width / height
const HALF_ASPECT = OPEN_ASPECT / 2; // single-half aspect (0.7)
const MARGIN_PX = 24;
const NAVBAR_ALLOWANCE_PX = 96;    // navbar + safe-area gap
const INDICATOR_ALLOWANCE_PX = 64; // page indicator footer
const COLS_PER_HALF = 4;

export default function BookletShell({ children, openState }: Props) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth - MARGIN_PX * 2;
      const vh =
        window.innerHeight -
        NAVBAR_ALLOWANCE_PX -
        INDICATOR_ALLOWANCE_PX -
        MARGIN_PX * 2;

      // Always size against the OPEN spread so switching open/closed
      // never resizes the half.
      const byWidth = { w: vw, h: vw / OPEN_ASPECT };
      const byHeight = { w: vh * OPEN_ASPECT, h: vh };
      const open = byWidth.h <= vh ? byWidth : byHeight;
      setSize(open);
    };

    const onResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!size) {
    return <div className="relative w-full max-w-5xl mx-auto aspect-[1.4/1]" />;
  }

  const openWidth = size.w;
  const openHeight = size.h;
  const halfWidth = openWidth / 2;
  const visibleWidth = openState === 'open' ? openWidth : halfWidth;

  // One stamp slot fills a quarter of a half, minus column gaps.
  // Gap is proportional; pick 3% of half-width.
  const gapPx = halfWidth * 0.03;
  const stampSize = (halfWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;

  return (
    <div className="relative mx-auto" style={{ width: visibleWidth }}>
      <div
        className="relative rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(60,30,15,0.5)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={
          {
            width: visibleWidth,
            height: openHeight,
            '--stamp-size': `${stampSize}px`,
            '--stamp-gap': `${gapPx}px`,
            '--half-width': `${halfWidth}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Temporarily update `PassportBooklet.tsx` to pass `openState="open"`**

Locate the single `<BookletShell>` call in `components/passport/PassportBooklet.tsx` and add the prop so the existing code still compiles:

```tsx
<BookletShell openState="open">
```

- [ ] **Step 3: Verify booklet fits viewport**

Run: `npm run dev`
- Open `/passport` in a browser.
- Expected: booklet no longer overflows. Resize window; booklet scales to fit.
- Open devtools → Elements → inspect the shell div. Confirm `--stamp-size`, `--stamp-gap`, `--half-width` custom properties are set and non-zero.
- `npm run lint` → no new errors.

- [ ] **Step 4: Commit**

```bash
git add components/passport/BookletShell.tsx components/passport/PassportBooklet.tsx
git commit -m "refactor(passport): viewport-fit sizing and CSS vars in BookletShell"
```

---

### Task 2: Make `CountryStampSlot` scale from `--stamp-size`

**Files:**
- Modify: `components/passport/CountryStampSlot.tsx`

- [ ] **Step 1: Replace responsive sizing with `--stamp-size` scaling**

Overwrite `components/passport/CountryStampSlot.tsx`:

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
  // ±3 degrees — tighter than the previous ±6 so the stamp doesn't clip
  // outside its grid cell at 25% scale.
  return ((Math.abs(h) % 61) - 30) / 10;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const cooked = stamps.length > 0;
  const angle = angleForCountry(country);
  const firstDate = stamps[0]?.cooked_at;

  const base =
    'relative aspect-square flex items-center justify-center rounded-full ' +
    'transition-transform focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-terracotta cursor-pointer';

  // Size lives in a single source of truth: the shell's --stamp-size var.
  const sizeStyle: React.CSSProperties = {
    width: 'var(--stamp-size)',
    height: 'var(--stamp-size)',
    fontSize: 'calc(var(--stamp-size) * 0.11)',
  };

  if (!cooked) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${country} — not cooked yet. Browse recipes from ${country}`}
        className={
          base +
          ' border-2 border-dashed border-brown-light/60 text-brown-light ' +
          'hover:border-brown-medium hover:text-brown-medium'
        }
        style={sizeStyle}
      >
        <span className="font-body uppercase tracking-wide text-center px-[0.4em] leading-tight">
          {country}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={
        base +
        ' text-paprika/90 [filter:url(#stamp-ink)] hover:scale-[1.03] mix-blend-multiply'
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
            ×{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
```

- [ ] **Step 2: Verify stamps scale with booklet**

Run: `npm run dev`
- Navigate through the booklet. Stamps should be roughly 25% of their previous area.
- Resize window — stamps shrink/grow in lockstep with the booklet.
- No horizontal scrolling inside a sub-region page.
- `npm run lint` → no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/passport/CountryStampSlot.tsx
git commit -m "refactor(passport): stamp sizing driven by --stamp-size CSS var"
```

---

### Task 3: Add packing algorithm in a pure module

**Files:**
- Create: `lib/passport-pack.ts`

- [ ] **Step 1: Write the packer**

Create `lib/passport-pack.ts`:

```ts
import type { SubCulinaryRegion } from './types';

export const HALF_CAPACITY = 16;
export const SMALL_THRESHOLD = 8;

export interface RegionBlock {
  subRegion: SubCulinaryRegion;
  countries: string[];
  isContinuation: boolean;
}

export interface RegionHalfDescriptor {
  kind: 'region-half';
  blocks: RegionBlock[];
}

export interface BlankHalfDescriptor {
  kind: 'blank';
}

export type HalfDescriptor = RegionHalfDescriptor | BlankHalfDescriptor;

export interface RegionSpread {
  kind: 'region';
  left: HalfDescriptor;
  right: HalfDescriptor;
}

export interface RegionInput {
  subRegion: SubCulinaryRegion;
  countries: string[];
}

export function packRegions(regions: RegionInput[]): RegionSpread[] {
  const halves: HalfDescriptor[] = [];

  let i = 0;
  while (i < regions.length) {
    const r = regions[i];
    const n = r.countries.length;

    if (n === 0) {
      i += 1;
      continue;
    }

    // Large: overflow across halves.
    if (n > HALF_CAPACITY) {
      let remaining = r.countries;
      let isContinuation = false;
      while (remaining.length > 0) {
        const slice = remaining.slice(0, HALF_CAPACITY);
        halves.push({
          kind: 'region-half',
          blocks: [{ subRegion: r.subRegion, countries: slice, isContinuation }],
        });
        remaining = remaining.slice(HALF_CAPACITY);
        isContinuation = true;
      }
      i += 1;
      continue;
    }

    // Small: try to pair with the next small region.
    if (n <= SMALL_THRESHOLD) {
      const next = regions[i + 1];
      if (
        next &&
        next.countries.length > 0 &&
        next.countries.length <= SMALL_THRESHOLD &&
        n + next.countries.length <= HALF_CAPACITY
      ) {
        halves.push({
          kind: 'region-half',
          blocks: [
            { subRegion: r.subRegion, countries: r.countries, isContinuation: false },
            { subRegion: next.subRegion, countries: next.countries, isContinuation: false },
          ],
        });
        i += 2;
        continue;
      }
    }

    // Medium (or lonely small): own half.
    halves.push({
      kind: 'region-half',
      blocks: [{ subRegion: r.subRegion, countries: r.countries, isContinuation: false }],
    });
    i += 1;
  }

  // Ensure even number of halves so every spread has two.
  if (halves.length % 2 === 1) halves.push({ kind: 'blank' });

  const spreads: RegionSpread[] = [];
  for (let j = 0; j < halves.length; j += 2) {
    spreads.push({ kind: 'region', left: halves[j], right: halves[j + 1] });
  }
  return spreads;
}
```

- [ ] **Step 2: Sanity-check the packer at the REPL**

Run: `npx tsx -e "$(cat <<'EOF'
import { packRegions } from './lib/passport-pack';
const result = packRegions([
  { subRegion: 'A' as any, countries: Array(3).fill('x') },
  { subRegion: 'B' as any, countries: Array(5).fill('x') },
  { subRegion: 'C' as any, countries: Array(12).fill('x') },
  { subRegion: 'D' as any, countries: Array(30).fill('x') },
]);
console.log(JSON.stringify(result, null, 2));
EOF
)"`

If `tsx` is not available, run `npx --yes tsx ...`. Expected output: 3 spreads.
- Spread 1 left: A+B paired. Right: C alone.
- Spread 2 left: D (16, isContinuation false). Right: D (14, isContinuation true).

If the output doesn't match, fix the packer before moving on.

- [ ] **Step 3: Commit**

```bash
git add lib/passport-pack.ts
git commit -m "feat(passport): add sub-region packing algorithm"
```

---

### Task 4: Introduce `usePassportSpreads` hook

**Files:**
- Create: `components/passport/hooks/usePassportSpreads.ts`

- [ ] **Step 1: Build the hook**

Create `components/passport/hooks/usePassportSpreads.ts`:

```ts
'use client';

import { useMemo } from 'react';
import {
  COUNTRY_TO_SUBREGION,
  SUB_REGION_ORDER,
  SUB_REGION_PARENT,
} from '@/lib/regions';
import type { SubCulinaryRegion, CulinaryRegion, Recipe } from '@/lib/types';
import type { PassportSummary } from '@/lib/passport';
import { packRegions, type RegionSpread } from '@/lib/passport-pack';

export type SpreadDescriptor =
  | { kind: 'cover' }
  | { kind: 'inside-front' }
  | RegionSpread
  | { kind: 'back-cover' };

interface Input {
  recipes: Recipe[];
  summary: PassportSummary;
}

export function usePassportSpreads({ recipes, summary }: Input): SpreadDescriptor[] {
  return useMemo(() => {
    const countriesBySubRegion = new Map<SubCulinaryRegion, Set<string>>();
    const recipesPerParentRegion = new Map<CulinaryRegion, number>();

    for (const r of recipes) {
      const sub = COUNTRY_TO_SUBREGION[r.country];
      if (sub) {
        const set = countriesBySubRegion.get(sub) ?? new Set<string>();
        set.add(r.country);
        countriesBySubRegion.set(sub, set);
      }
      recipesPerParentRegion.set(
        r.region,
        (recipesPerParentRegion.get(r.region) ?? 0) + 1,
      );
    }

    const countriesForSubRegion = (sub: SubCulinaryRegion): string[] => {
      const parent = SUB_REGION_PARENT[sub];
      const parentCount = recipesPerParentRegion.get(parent) ?? 0;
      if (parentCount === 0) return [];

      const all = new Set<string>();
      for (const [country, s] of Object.entries(COUNTRY_TO_SUBREGION)) {
        if (s === sub) all.add(country);
      }
      const fromRecipes = countriesBySubRegion.get(sub);
      if (fromRecipes) for (const c of fromRecipes) all.add(c);
      return [...all].sort((a, b) => a.localeCompare(b));
    };

    const regionInputs = SUB_REGION_ORDER.map(sub => ({
      subRegion: sub,
      countries: countriesForSubRegion(sub),
    })).filter(r => r.countries.length > 0);

    const regionSpreads = packRegions(regionInputs);

    return [
      { kind: 'cover' },
      { kind: 'inside-front' },
      ...regionSpreads,
      { kind: 'back-cover' },
    ];
    // summary is included so the hook recomputes if tiers/stamps change —
    // safe even if not directly used.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, summary]);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/passport/hooks/usePassportSpreads.ts
git commit -m "feat(passport): usePassportSpreads hook with packed sub-regions"
```

---

### Task 5: Build the `RegionHalf` component

**Files:**
- Create: `components/passport/RegionHalf.tsx`

- [ ] **Step 1: Write the component**

Create `components/passport/RegionHalf.tsx`:

```tsx
'use client';

import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import type { HalfDescriptor, RegionBlock } from '@/lib/passport-pack';
import CountryStampSlot from './CountryStampSlot';

interface Props {
  half: HalfDescriptor;
  stampsPerCountry: Map<string, StampRow[]>;
  recipesByCountry: Map<string, Recipe[]>;
  onCookedClick: (country: string) => void;
  onUncookedClick: (country: string) => void;
}

export default function RegionHalf({
  half, stampsPerCountry, onCookedClick, onUncookedClick,
}: Props) {
  if (half.kind === 'blank') {
    return <div className="h-full w-full" aria-hidden />;
  }

  return (
    <div className="h-full w-full flex flex-col gap-[calc(var(--stamp-size)*0.25)] p-[calc(var(--stamp-size)*0.35)]">
      {half.blocks.map((block, idx) => (
        <RegionBlockView
          key={`${block.subRegion}-${idx}`}
          block={block}
          stampsPerCountry={stampsPerCountry}
          onCookedClick={onCookedClick}
          onUncookedClick={onUncookedClick}
        />
      ))}
    </div>
  );
}

function RegionBlockView({
  block, stampsPerCountry, onCookedClick, onUncookedClick,
}: {
  block: RegionBlock;
  stampsPerCountry: Map<string, StampRow[]>;
  onCookedClick: (country: string) => void;
  onUncookedClick: (country: string) => void;
}) {
  const cookedCount = block.countries.filter(
    c => (stampsPerCountry.get(c)?.length ?? 0) > 0,
  ).length;
  const cleanName = block.subRegion.replace(' (sub)', '');

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-end justify-between mb-[calc(var(--stamp-size)*0.2)]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-brown-medium font-body mb-1">
            Region{block.isContinuation ? ' · cont\u2019d' : ''}
          </div>
          <h2 className="font-heading text-2xl font-bold text-brown-dark leading-tight">
            {cleanName}
          </h2>
        </div>
        <div className="font-body text-sm text-brown-medium">
          <span className="font-semibold text-brown-dark">{cookedCount}</span>
          <span className="opacity-70">{' / '}{block.countries.length} cooked</span>
        </div>
      </div>

      <div
        className="grid content-start"
        style={{
          gridTemplateColumns: 'repeat(4, var(--stamp-size))',
          gap: 'var(--stamp-gap)',
          justifyContent: 'space-between',
        }}
      >
        {block.countries.map(country => {
          const stamps = stampsPerCountry.get(country) ?? [];
          const isCooked = stamps.length > 0;
          return (
            <CountryStampSlot
              key={country}
              country={country}
              stamps={stamps}
              onClick={() =>
                isCooked ? onCookedClick(country) : onUncookedClick(country)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/passport/RegionHalf.tsx
git commit -m "feat(passport): RegionHalf component for two-block halves"
```

---

### Task 6: Update `Spread.tsx` to always show the spine

**Files:**
- Modify: `components/passport/Spread.tsx`

- [ ] **Step 1: Make the spine the default and visible without a breakpoint**

Replace `components/passport/Spread.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  withSpine?: boolean;
}

export default function Spread({ children, withSpine = true }: Props) {
  return (
    <div className="relative w-full h-full bg-parchment overflow-hidden">
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-40 pointer-events-none" />
      <div className="relative h-full w-full overflow-hidden">{children}</div>
      {withSpine && (
        <div
          aria-hidden
          className="absolute top-[2%] bottom-[2%] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brown-dark/10 via-brown-dark/40 to-brown-dark/10 pointer-events-none"
        />
      )}
    </div>
  );
}
```

Note: padding moved out of `Spread` because `RegionHalf` owns its own padding now.

- [ ] **Step 2: Commit**

```bash
git add components/passport/Spread.tsx
git commit -m "refactor(passport): spine always visible, padding moves to halves"
```

---

### Task 7: Build the `SpreadView` dispatcher

**Files:**
- Create: `components/passport/SpreadView.tsx`

- [ ] **Step 1: Write the dispatcher**

Create `components/passport/SpreadView.tsx`:

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
  onUncooked: (country: string) => void;
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
              half={spread.left}
              stampsPerCountry={props.stampsPerCountry}
              recipesByCountry={props.recipesByCountry}
              onCookedClick={props.onCooked}
              onUncookedClick={props.onUncooked}
            />
            <RegionHalf
              half={spread.right}
              stampsPerCountry={props.stampsPerCountry}
              recipesByCountry={props.recipesByCountry}
              onCookedClick={props.onCooked}
              onUncookedClick={props.onUncooked}
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

- [ ] **Step 2: Don't compile yet — `InsideFrontSpread` signature changes in the next task.** Continue.

---

### Task 8: Rework `InsideFrontSpread` to consume `SpreadDescriptor[]`

**Files:**
- Modify: `components/passport/InsideFrontSpread.tsx`

- [ ] **Step 1: Update the TOC to iterate spreads and list regions**

Overwrite `components/passport/InsideFrontSpread.tsx`:

```tsx
'use client';

import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import type { RegionBlock } from '@/lib/passport-pack';

interface Props {
  summary: PassportSummary;
  spreads: SpreadDescriptor[];
  stampsPerCountry: Map<string, StampRow[]>;
  onJumpToSpread: (spreadIndex: number) => void;
}

interface TocEntry {
  spreadIndex: number;
  block: RegionBlock;
}

export default function InsideFrontSpread({
  summary, spreads, onJumpToSpread, stampsPerCountry,
}: Props) {
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;

  const entries: TocEntry[] = [];
  spreads.forEach((s, spreadIndex) => {
    if (s.kind !== 'region') return;
    for (const half of [s.left, s.right]) {
      if (half.kind !== 'region-half') continue;
      for (const block of half.blocks) {
        if (block.isContinuation) continue;
        entries.push({ spreadIndex, block });
      }
    }
  });

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
          {entries.map(({ spreadIndex, block }) => {
            const cooked = block.countries.filter(
              c => (stampsPerCountry.get(c)?.length ?? 0) > 0,
            ).length;
            return (
              <li key={`${spreadIndex}-${block.subRegion}`}>
                <button
                  type="button"
                  onClick={() => onJumpToSpread(spreadIndex)}
                  className="w-full flex items-baseline justify-between gap-3 py-1.5 border-b border-dotted border-brown-light/50 hover:text-terracotta text-left"
                >
                  <span className="font-heading text-sm text-brown-dark truncate">
                    {block.subRegion.replace(' (sub)', '')}
                  </span>
                  <span className="font-body text-xs text-brown-medium whitespace-nowrap">
                    {cooked}{' / '}{block.countries.length}
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

- [ ] **Step 2: Commit (still not compiling until nav hook is updated)**

```bash
git add components/passport/SpreadView.tsx components/passport/InsideFrontSpread.tsx
git commit -m "feat(passport): SpreadView dispatcher and spread-based TOC"
```

---

### Task 9: Update `useBookletNav` to spread-indexed navigation

**Files:**
- Modify: `components/passport/hooks/useBookletNav.ts`

- [ ] **Step 1: Retype and update slug logic**

Overwrite `components/passport/hooks/useBookletNav.ts`:

```ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SLUG_TO_SUB_REGION, SUB_REGION_SLUG } from '@/lib/regions';
import type { SpreadDescriptor } from './usePassportSpreads';
import type { SubCulinaryRegion } from '@/lib/types';

const FLIP_MS = 600;
const COVER_FLIP_MS = 900;
const SWIPE_THRESHOLD = 50;

export interface BookletNav {
  index: number;
  isFlipping: boolean;
  direction: 1 | -1;
  canPrev: boolean;
  canNext: boolean;
  flipNext: () => void;
  flipPrev: () => void;
  jumpTo: (index: number) => void;
  bindSwipe: React.HTMLAttributes<HTMLDivElement>;
}

function firstRegionOfSpread(s: SpreadDescriptor): SubCulinaryRegion | null {
  if (s.kind !== 'region') return null;
  const left = s.left.kind === 'region-half' ? s.left.blocks[0] : null;
  if (left && !left.isContinuation) return left.subRegion;
  const right = s.right.kind === 'region-half' ? s.right.blocks[0] : null;
  if (right && !right.isContinuation) return right.subRegion;
  // Both halves are continuations — fall back to left's subRegion for slug stability.
  return left?.subRegion ?? right?.subRegion ?? null;
}

export function useBookletNav(spreads: SpreadDescriptor[]): BookletNav {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [index, setIndex] = useState(0);
  const [isFlipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const lockRef = useRef(false);

  useEffect(() => {
    const slug = params.get('spread');
    if (!slug) return;
    const sub = SLUG_TO_SUB_REGION[slug];
    if (!sub) return;
    const targetIdx = spreads.findIndex(s => firstRegionOfSpread(s) === sub);
    if (targetIdx >= 0) setIndex(targetIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads.length]);

  const syncUrl = useCallback(
    (nextIdx: number) => {
      const s = spreads[nextIdx];
      const first = s ? firstRegionOfSpread(s) : null;
      const next = new URLSearchParams(params.toString());
      if (first) {
        next.set('spread', SUB_REGION_SLUG[first]);
      } else {
        next.delete('spread');
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [spreads, params, router, pathname],
  );

  const flipTo = useCallback(
    (nextIdx: number) => {
      if (lockRef.current) return;
      if (nextIdx < 0 || nextIdx >= spreads.length) return;
      if (nextIdx === index) return;

      lockRef.current = true;
      setFlipping(true);
      setDirection(nextIdx > index ? 1 : -1);

      const duration =
        spreads[index]?.kind === 'cover' ||
        spreads[nextIdx]?.kind === 'cover' ||
        spreads[index]?.kind === 'back-cover' ||
        spreads[nextIdx]?.kind === 'back-cover'
          ? COVER_FLIP_MS
          : FLIP_MS;

      setIndex(nextIdx);
      syncUrl(nextIdx);

      window.setTimeout(() => {
        lockRef.current = false;
        setFlipping(false);
      }, duration);
    },
    [index, spreads, syncUrl],
  );

  const flipNext = useCallback(() => flipTo(index + 1), [flipTo, index]);
  const flipPrev = useCallback(() => flipTo(index - 1), [flipTo, index]);
  const jumpTo = useCallback((i: number) => flipTo(i), [flipTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"], [role="dialog"]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); flipNext(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); flipPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipNext, flipPrev]);

  const touchStart = useRef<number | null>(null);
  const bindSwipe: React.HTMLAttributes<HTMLDivElement> = {
    onTouchStart: e => { touchStart.current = e.touches[0].clientX; },
    onTouchEnd: e => {
      if (touchStart.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStart.current;
      touchStart.current = null;
      if (dx <= -SWIPE_THRESHOLD) flipNext();
      else if (dx >= SWIPE_THRESHOLD) flipPrev();
    },
  };

  return {
    index,
    isFlipping,
    direction,
    canPrev: index > 0,
    canNext: index < spreads.length - 1,
    flipNext,
    flipPrev,
    jumpTo,
    bindSwipe,
  };
}
```

- [ ] **Step 2: Commit (compile fails until Task 10 lands; that's intentional)**

```bash
git add components/passport/hooks/useBookletNav.ts
git commit -m "refactor(passport): nav hook uses SpreadDescriptor with first-region slug"
```

---

### Task 10: Wire `PassportBooklet.tsx` to new hooks, dispatcher, and open/closed state

**Files:**
- Modify: `components/passport/PassportBooklet.tsx`

- [ ] **Step 1: Replace the component**

Overwrite `components/passport/PassportBooklet.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';

import BookletShell from './BookletShell';
import PaperTexture from './PaperTexture';
import NavChevrons from './NavChevrons';
import PageIndicator from './PageIndicator';
import StampedRecipesModal from './StampedRecipesModal';
import SpreadView from './SpreadView';
import { usePassportSpreads } from './hooks/usePassportSpreads';
import { useBookletNav } from './hooks/useBookletNav';

export default function PassportBooklet() {
  const router = useRouter();
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { summary, isLoading: stampsLoading } = useCookedStamps();
  const reduced = useReducedMotion();

  const spreads = usePassportSpreads({ recipes, summary });
  const nav = useBookletNav(spreads);
  const [modalCountry, setModalCountry] = useState<string | null>(null);

  const recipesByCountry = useMemo(() => {
    const m = new Map<string, Recipe[]>();
    for (const r of recipes) {
      const a = m.get(r.country) ?? [];
      a.push(r);
      m.set(r.country, a);
    }
    return m;
  }, [recipes]);

  const modalRecipes: Recipe[] = useMemo(() => {
    if (!modalCountry) return [];
    const stamps = summary.stampsPerCountry.get(modalCountry) ?? [];
    const cookedSlugs = new Set(stamps.map(s => s.recipe_slug));
    return (recipesByCountry.get(modalCountry) ?? []).filter(r => cookedSlugs.has(r.id));
  }, [modalCountry, summary.stampsPerCountry, recipesByCountry]);

  const modalStampsByRecipe = useMemo(() => {
    const m = new Map<string, StampRow[]>();
    if (!modalCountry) return m;
    const stamps = summary.stampsPerCountry.get(modalCountry) ?? [];
    for (const s of stamps) {
      const a = m.get(s.recipe_slug) ?? [];
      a.push(s);
      m.set(s.recipe_slug, a);
    }
    return m;
  }, [modalCountry, summary.stampsPerCountry]);

  if (recipesLoading || stampsLoading) {
    return (
      <div className="max-w-5xl mx-auto text-brown-medium py-20 text-center">
        Loading your passport…
      </div>
    );
  }

  const currentSpread = spreads[nav.index];
  const isClosed =
    currentSpread?.kind === 'cover' || currentSpread?.kind === 'back-cover';

  const onCooked = (country: string) => setModalCountry(country);
  const onUncooked = (country: string) => {
    router.push(`/recipes?country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="relative">
      <PaperTexture />
      <div {...nav.bindSwipe}>
        <BookletShell openState={isClosed ? 'closed' : 'open'}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={nav.index}
              className="absolute inset-0"
              initial={reduced
                ? { opacity: 0 }
                : { rotateY: nav.direction === 1 ? -90 : 90, opacity: 0 }}
              animate={reduced
                ? { opacity: 1 }
                : { rotateY: 0, opacity: 1 }}
              exit={reduced
                ? { opacity: 0 }
                : { rotateY: nav.direction === 1 ? 90 : -90, opacity: 0 }}
              transition={{
                duration: reduced ? 0.2 : (isClosed ? 0.9 : 0.6),
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: nav.direction === 1 ? 'left center' : 'right center',
                perspective: 2000,
              }}
            >
              {currentSpread && (
                <SpreadView
                  spread={currentSpread}
                  spreads={spreads}
                  summary={summary}
                  stampsPerCountry={summary.stampsPerCountry}
                  recipesByCountry={recipesByCountry}
                  onCooked={onCooked}
                  onUncooked={onUncooked}
                  onJump={nav.jumpTo}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <NavChevrons
            canPrev={nav.canPrev}
            canNext={nav.canNext}
            onPrev={nav.flipPrev}
            onNext={nav.flipNext}
            disabled={nav.isFlipping}
          />
        </BookletShell>
      </div>

      <PageIndicator count={spreads.length} index={nav.index} onJump={nav.jumpTo} />

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
}
```

- [ ] **Step 2: Verify the booklet compiles and runs**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run dev` and open `/passport`. Expected:
- Cover page loads centered at half-width.
- Arrow key / chevron → flips to inside-front (full spread).
- Forward through region spreads — each shows two halves with spine divider.
- Deep link `/passport?spread=west-europe` (or whichever slug exists) lands on the correct spread.
- Clicking an uncooked stamp navigates to `/recipes?country=...`.
- Clicking a cooked stamp opens the modal.
- Back cover appears as a single half-width panel.

- [ ] **Step 3: Commit**

```bash
git add components/passport/PassportBooklet.tsx
git commit -m "feat(passport): booklet uses spread-based hooks and closed/open shell"
```

---

### Task 11: Delete legacy files

**Files:**
- Delete: `components/passport/SubRegionSpread.tsx`
- Delete: `components/passport/hooks/usePassportPages.ts`

- [ ] **Step 1: Confirm no remaining references**

Run: `npx grep -RIn "SubRegionSpread\|usePassportPages" components app lib hooks`
Expected: no matches.

If any match exists, fix the reference before deleting.

- [ ] **Step 2: Delete the files**

```bash
rm components/passport/SubRegionSpread.tsx
rm components/passport/hooks/usePassportPages.ts
```

- [ ] **Step 3: Final build check**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(passport): remove legacy SubRegionSpread and usePassportPages"
```

---

### Task 12: Manual QA pass

- [ ] **Step 1: Run through the verification checklist from the spec**

Run: `npm run dev`. For each item below, confirm visually:

- [ ] Booklet fits viewport at 1920×1080, 1440×900, 1280×720, 768×1024, 375×667 with no scroll.
- [ ] Stamps render at 4 per row × 4 per half, consistent scaling across viewports.
- [ ] Cover appears as a single centered panel at `/passport`.
- [ ] Pressing → on cover widens the booklet to full spread and lands on inside-front.
- [ ] Region spreads show the spine divider.
- [ ] A small region (e.g. `East Asia` — 3 countries) pairs with the next small region on the same half, each with its own header.
- [ ] A large region (e.g. `Sub-Saharan Africa` or equivalent with >16 countries) overflows across halves; continuation halves show `· cont'd` next to the "Region" label.
- [ ] `(cont'd)` spreads are ordered correctly and their stamp slices are contiguous.
- [ ] Keyboard `← →` and chevrons flip by spread (not by half).
- [ ] `/passport?spread=<slug>` deep link lands on the correct spread.
- [ ] Cooked stamp → modal; uncooked stamp → `/recipes?country=...`.
- [ ] Back cover appears as a single half-width panel.
- [ ] Enable "Reduce motion" in OS settings; flips become cross-fades.

- [ ] **Step 2: If any item fails, file a follow-up** (do not block this task; note it in commit or PR description).

- [ ] **Step 3: No new commit needed if no fixes.** Otherwise commit fixes with descriptive messages.

---

## Self-Review Notes

- Task 6 (`Spread.tsx`) removes inner padding — `RegionHalf` and `InsideFrontSpread` now own their own padding via `--stamp-size`. `CoverPage` and `BackCoverSpread` set their own padding already and are not wrapped in `Spread` or are unaffected (BackCover is wrapped but already has absolute positioning).
- Continuation halves will never be paired with a second block (the packer guarantees one block per half when `n > HALF_CAPACITY`); `RegionHalf` doesn't need special-case logic for that.
- `BookletShell`'s intermediate compile between Task 7 and Task 10 is known; that's why Tasks 7–9 are grouped and only Task 10 runs `tsc`. This is intentional — keeps each commit focused without demanding mid-refactor shims.
- `useBookletNav`'s slug re-routing after the page tree changes (e.g. user used to be on spread 5, tree shrank) is still best-effort via `findIndex` on first render; no change in behavior.
