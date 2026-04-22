# Passport: Tier Ledger & Stamp Variation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the traveler profile's onboarding section with a visual tier ledger, and give each country stamp a unique deterministic shape/size/border.

**Architecture:** Two independent features sharing no new state. Feature 1 adds a `TierLedger` component to the inside front spread. Feature 2 introduces a `stamp-traits` utility that `CountryStampSlot` consumes, and switches `RegionHalf` from grid to flexbox.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind v4 with custom theme tokens.

**Spec:** `docs/superpowers/specs/2026-04-22-passport-tier-ledger-and-stamp-variation-design.md`

---

## File Structure

| File | Role |
|------|------|
| `lib/passport.ts` | Export `TitleTier` interface (currently unexported) |
| `components/passport/TierLedger.tsx` | **New** — vertical tier ledger component |
| `components/passport/InsideFrontSpread.tsx` | Remove onboarding, wire in `TierLedger` |
| `lib/stamp-traits.ts` | **New** — deterministic hash → stamp traits |
| `components/passport/CountryStampSlot.tsx` | Rework to render varied shapes/sizes/borders |
| `components/passport/RegionHalf.tsx` | Grid → flexbox layout |

---

### Task 1: Export `TitleTier` from `lib/passport.ts`

**Files:**
- Modify: `lib/passport.ts:17`

- [ ] **Step 1: Export the TitleTier interface**

In `lib/passport.ts`, change line 17 from:

```typescript
interface TitleTier {
```

to:

```typescript
export interface TitleTier {
```

- [ ] **Step 2: Verify the build**

Run: `npx tsc --noEmit`
Expected: No new errors. All existing consumers of `EXPLORER_TITLES` and `nextTitleTier` still work since they already access `TitleTier` through those exports.

- [ ] **Step 3: Commit**

```bash
git add lib/passport.ts
git commit -m "feat(passport): export TitleTier interface"
```

---

### Task 2: Create `TierLedger` component

**Files:**
- Create: `components/passport/TierLedger.tsx`

- [ ] **Step 1: Create the TierLedger component**

Create `components/passport/TierLedger.tsx` with the following content:

```tsx
'use client';

import { EXPLORER_TITLES, type ExplorerTitle, type TitleTier } from '@/lib/passport';

interface Props {
  currentTitle: ExplorerTitle;
}

type TierState = 'completed' | 'current' | 'locked';

function getTierState(
  tier: TitleTier,
  currentTitle: ExplorerTitle,
  titles: TitleTier[],
): TierState {
  const currentIdx = titles.findIndex(t => t.title === currentTitle);
  const tierIdx = titles.findIndex(t => t.title === tier.title);
  if (tierIdx < currentIdx) return 'completed';
  if (tierIdx === currentIdx) return 'current';
  return 'locked';
}

function formatRequirements(tier: TitleTier): string {
  if (tier.minStamps === 0 && tier.minRegions === 0) return 'Starting tier';
  const parts: string[] = [];
  parts.push(`${tier.minStamps} stamp${tier.minStamps === 1 ? '' : 's'}`);
  parts.push(`${tier.minRegions} region${tier.minRegions === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

export default function TierLedger({ currentTitle }: Props) {
  return (
    <div className="flex flex-col gap-0 mt-6">
      <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-3">
        Journey
      </div>
      <ol className="relative flex flex-col gap-4 pl-4">
        {EXPLORER_TITLES.map((tier, i) => {
          const state = getTierState(tier, currentTitle, EXPLORER_TITLES);
          const isLast = i === EXPLORER_TITLES.length - 1;

          return (
            <li key={tier.title} className="relative flex items-start gap-3">
              {/* Dotted connector line */}
              {!isLast && (
                <span
                  aria-hidden
                  className={`absolute left-[7px] top-[20px] w-px h-[calc(100%+0.25rem)] border-l border-dotted ${
                    state === 'locked'
                      ? 'border-brown-light/30'
                      : 'border-terracotta/40'
                  }`}
                />
              )}

              {/* Seal indicator */}
              <span
                aria-hidden
                className={`relative z-10 flex-shrink-0 w-[15px] h-[15px] rounded-full mt-[3px] border-[1.5px] ${
                  state === 'completed'
                    ? 'bg-terracotta border-terracotta'
                    : state === 'current'
                      ? 'bg-terracotta border-terracotta ring-2 ring-terracotta/20'
                      : 'bg-transparent border-brown-light/50'
                }`}
              />

              {/* Tier content */}
              <div
                className={`flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 -mt-0.5 ${
                  state === 'current' ? 'bg-terracotta/[0.07]' : ''
                }`}
              >
                <span
                  className={`font-stamp uppercase tracking-[0.15em] text-xs leading-tight ${
                    state === 'locked'
                      ? 'text-brown-medium/50'
                      : 'text-brown-dark'
                  }`}
                >
                  {tier.title}
                </span>
                <span
                  className={`font-body text-[10px] leading-tight ${
                    state === 'locked'
                      ? 'text-brown-medium/40'
                      : 'text-brown-medium'
                  }`}
                >
                  {formatRequirements(tier)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npx tsc --noEmit`
Expected: No errors. The component imports `EXPLORER_TITLES`, `ExplorerTitle`, and `TitleTier` from `lib/passport.ts` (which was exported in Task 1).

- [ ] **Step 3: Commit**

```bash
git add components/passport/TierLedger.tsx
git commit -m "feat(passport): add TierLedger component"
```

---

### Task 3: Wire `TierLedger` into `InsideFrontSpread`

**Files:**
- Modify: `components/passport/InsideFrontSpread.tsx:1-153`

- [ ] **Step 1: Replace the onboarding section with TierLedger**

In `InsideFrontSpread.tsx`:

1. Add an import at the top (after the existing imports):

```tsx
import TierLedger from './TierLedger';
```

2. Replace the "How this works" block (lines 75–84) — the entire `<div className="mt-6">` through its closing `</div>` — with:

```tsx
        <TierLedger currentTitle={title} />
```

3. Remove the `OnboardStep` function (lines 141–153) since it's no longer used.

After the edit, the left column of the spread should contain: "Traveler profile" header → title heading → 3-stat row → next-tier hint → `TierLedger`.

- [ ] **Step 2: Verify the build**

Run: `npx tsc --noEmit`
Expected: No errors. No unused imports or functions.

- [ ] **Step 3: Visual check**

Run: `npm run dev`
Open the passport booklet in the browser. Navigate to the inside front spread (page after cover). Verify:
- The "How this works" section is gone.
- The tier ledger appears below the next-tier hint.
- Completed tiers have filled terracotta seals with dotted connectors.
- The current tier has a subtle warm background tint.
- Locked tiers are muted.
- There is generous breathing room — the ledger doesn't feel cramped.
- The right half (Contents) is unaffected.
- Check mobile layout as well (resize browser or use devtools).

- [ ] **Step 4: Commit**

```bash
git add components/passport/InsideFrontSpread.tsx
git commit -m "feat(passport): replace onboarding section with tier ledger"
```

---

### Task 4: Create `lib/stamp-traits.ts`

**Files:**
- Create: `lib/stamp-traits.ts`

- [ ] **Step 1: Create the stamp traits utility**

Create `lib/stamp-traits.ts` with the following content:

```typescript
export type StampShape =
  | 'circle'
  | 'rect-landscape'
  | 'rect-portrait'
  | 'oval-landscape'
  | 'oval-portrait'
  | 'hexagon'
  | 'triangle'
  | 'diamond'
  | 'pill';

export type StampSizeBucket = 'sm' | 'md' | 'lg';
export type StampBorderStyle = 'solid' | 'dashed' | 'dotted';
export type StampBorderWeight = 'thin' | 'medium';
export type StampInnerDetail = 'none' | 'double-ring' | 'corner-ticks' | 'inner-frame';

export interface StampTraits {
  shape: StampShape;
  sizeBucket: StampSizeBucket;
  borderStyle: StampBorderStyle;
  borderWeight: StampBorderWeight;
  innerDetail: StampInnerDetail;
}

/** Stable 32-bit hash from a country name string. */
function hashCountry(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const SHAPES: StampShape[] = [
  'circle', 'rect-landscape', 'rect-portrait',
  'oval-landscape', 'oval-portrait', 'hexagon',
  'triangle', 'diamond', 'pill',
];

const SIZE_BUCKETS: StampSizeBucket[] = ['sm', 'md', 'lg'];
const BORDER_STYLES: StampBorderStyle[] = ['solid', 'dashed', 'dotted'];
const BORDER_WEIGHTS: StampBorderWeight[] = ['thin', 'medium'];
const INNER_DETAILS: StampInnerDetail[] = ['none', 'double-ring', 'corner-ticks', 'inner-frame'];

/**
 * Deterministic stamp traits for a country.
 * Uses successive slices of the hash to pick each trait independently.
 */
export function getStampTraits(country: string): StampTraits {
  const h = hashCountry(country);
  return {
    shape: SHAPES[h % SHAPES.length],
    sizeBucket: SIZE_BUCKETS[Math.floor(h / SHAPES.length) % SIZE_BUCKETS.length],
    borderStyle: BORDER_STYLES[Math.floor(h / (SHAPES.length * SIZE_BUCKETS.length)) % BORDER_STYLES.length],
    borderWeight: BORDER_WEIGHTS[Math.floor(h / (SHAPES.length * SIZE_BUCKETS.length * BORDER_STYLES.length)) % BORDER_WEIGHTS.length],
    innerDetail: INNER_DETAILS[Math.floor(h / (SHAPES.length * SIZE_BUCKETS.length * BORDER_STYLES.length * BORDER_WEIGHTS.length)) % INNER_DETAILS.length],
  };
}

/** Size multiplier relative to base --stamp-size. Range is intentionally subtle. */
export function sizeMultiplier(bucket: StampSizeBucket): number {
  switch (bucket) {
    case 'sm': return 0.85;
    case 'md': return 1.0;
    case 'lg': return 1.15;
  }
}

/** Aspect ratio [width, height] relative to the stamp's computed size. */
export function shapeAspect(shape: StampShape): [number, number] {
  switch (shape) {
    case 'circle':         return [1, 1];
    case 'rect-landscape': return [1.3, 1];
    case 'rect-portrait':  return [1, 1.3];
    case 'oval-landscape': return [1.3, 1];
    case 'oval-portrait':  return [1, 1.3];
    case 'hexagon':        return [1, 1];
    case 'triangle':       return [1.1, 1];
    case 'diamond':        return [1, 1.15];
    case 'pill':           return [1.5, 0.85];
  }
}

/** Rotation angle in degrees, deterministic per country. Same logic as the old angleForCountry. */
export function stampAngle(country: string): number {
  const h = hashCountry(country);
  return ((h % 61) - 30) / 10;
}
```

- [ ] **Step 2: Verify the build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/stamp-traits.ts
git commit -m "feat(passport): add deterministic stamp traits utility"
```

---

### Task 5: Rework `CountryStampSlot` for varied shapes

**Files:**
- Modify: `components/passport/CountryStampSlot.tsx:1-77`

- [ ] **Step 1: Rewrite CountryStampSlot**

Replace the entire contents of `components/passport/CountryStampSlot.tsx` with:

```tsx
'use client';

import type { Stamp as StampRow } from '@/lib/passport';
import {
  getStampTraits,
  sizeMultiplier,
  shapeAspect,
  stampAngle,
  type StampShape,
  type StampBorderStyle,
  type StampBorderWeight,
  type StampInnerDetail,
} from '@/lib/stamp-traits';

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

/** CSS border-radius for each shape. */
function shapeRadius(shape: StampShape): string {
  switch (shape) {
    case 'circle':         return '50%';
    case 'oval-landscape': return '50%';
    case 'oval-portrait':  return '50%';
    case 'rect-landscape': return '12%';
    case 'rect-portrait':  return '12%';
    case 'hexagon':        return '0';    // uses clip-path
    case 'triangle':       return '0';    // uses clip-path
    case 'diamond':        return '6%';   // uses clip-path
    case 'pill':           return '999px';
  }
}

/** CSS clip-path for shapes that need it; null for border-radius-only shapes. */
function shapeClipPath(shape: StampShape): string | null {
  switch (shape) {
    case 'hexagon':  return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
    case 'triangle': return 'polygon(50% 5%, 95% 90%, 5% 90%)';
    case 'diamond':  return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    default:         return null;
  }
}

function borderWidthEm(weight: StampBorderWeight): string {
  return weight === 'thin' ? '0.1em' : '0.16em';
}

function borderStyleCss(style: StampBorderStyle): string {
  return style; // 'solid' | 'dashed' | 'dotted' map directly to CSS values
}

function InnerDetail({
  detail, shape, borderStyle,
}: { detail: StampInnerDetail; shape: StampShape; borderStyle: StampBorderStyle }) {
  const clip = shapeClipPath(shape);
  const radius = shapeRadius(shape);

  switch (detail) {
    case 'none':
      return null;
    case 'double-ring':
      return (
        <span
          className="absolute inset-[8%] border-[0.06em] border-current/60"
          style={{
            borderRadius: radius,
            borderStyle: borderStyleCss(borderStyle),
            ...(clip ? { clipPath: clip } : {}),
          }}
        />
      );
    case 'corner-ticks':
      return (
        <>
          {/* Four corner tick marks */}
          <span className="absolute top-[10%] left-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute top-[10%] left-[10%] w-px h-[12%] bg-current/50" />
          <span className="absolute top-[10%] right-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute top-[10%] right-[10%] w-px h-[12%] bg-current/50" />
          <span className="absolute bottom-[10%] left-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute bottom-[10%] left-[10%] w-px h-[12%] bg-current/50" />
          <span className="absolute bottom-[10%] right-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute bottom-[10%] right-[10%] w-px h-[12%] bg-current/50" />
        </>
      );
    case 'inner-frame':
      return (
        <span
          className="absolute inset-[12%] border-[0.04em] border-current/40"
          style={{
            borderRadius: radius,
            borderStyle: 'solid',
            ...(clip ? { clipPath: clip } : {}),
          }}
        />
      );
  }
}

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const traits = getStampTraits(country);
  const angle = stampAngle(country);
  const firstDate = stamps[0]?.cooked_at;
  const mult = sizeMultiplier(traits.sizeBucket);
  const [aw, ah] = shapeAspect(traits.shape);
  const clip = shapeClipPath(traits.shape);
  const radius = shapeRadius(traits.shape);

  const sizeStyle: React.CSSProperties = {
    width: `calc(var(--stamp-size) * ${mult * aw})`,
    height: `calc(var(--stamp-size) * ${mult * ah})`,
    fontSize: `calc(var(--stamp-size) * ${mult} * 0.11)`,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={
        'relative flex items-center justify-center ' +
        'transition-transform focus:outline-none focus-visible:ring-2 ' +
        'focus-visible:ring-terracotta cursor-pointer ' +
        'text-paprika/90 [filter:url(#stamp-ink)] motion-reduce:[filter:none] ' +
        'hover:scale-[1.03] mix-blend-multiply [contain:layout_style_paint]'
      }
      style={{
        ...sizeStyle,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {/* Outer border */}
      <span
        className="absolute inset-0 border-current"
        style={{
          borderWidth: borderWidthEm(traits.borderWeight),
          borderStyle: borderStyleCss(traits.borderStyle),
          borderRadius: radius,
          ...(clip ? { clipPath: clip } : {}),
        }}
      />

      {/* Inner detail */}
      <InnerDetail
        detail={traits.innerDetail}
        shape={traits.shape}
        borderStyle={traits.borderStyle}
      />

      {/* Text content */}
      <span className="flex flex-col items-center justify-center px-[0.4em] relative z-[1]">
        <span className="font-heading font-bold uppercase tracking-[0.15em] leading-none text-center">
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

- [ ] **Step 2: Verify the build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/passport/CountryStampSlot.tsx
git commit -m "feat(passport): rework CountryStampSlot for varied shapes and sizes"
```

---

### Task 6: Switch `RegionHalf` from grid to flexbox

**Files:**
- Modify: `components/passport/RegionHalf.tsx:30-36`

- [ ] **Step 1: Replace the grid layout with flexbox**

In `RegionHalf.tsx`, replace the stamp container `<div>` (lines 30–36):

```tsx
      <div
        className="grid content-start"
        style={{
          gridTemplateColumns: 'repeat(3, var(--stamp-size))',
          gap: 'var(--stamp-gap)',
          justifyContent: 'center',
        }}
      >
```

with:

```tsx
      <div
        className="flex flex-wrap content-start items-center"
        style={{
          gap: 'var(--stamp-gap)',
          justifyContent: 'center',
        }}
      >
```

- [ ] **Step 2: Verify the build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Visual check — full passport walkthrough**

Run: `npm run dev`
Open the passport booklet in the browser. Check every region spread:

1. **Shape variety**: Stamps across a region should show different shapes (circles, rectangles, ovals, hexagons, triangles, diamonds, pills). No two adjacent stamps should look identical (unless very few countries are cooked).
2. **Size subtlety**: Stamps should vary slightly in size but the differences should feel organic, not jarring. The smallest stamp should still be clearly legible.
3. **Border variety**: Look for a mix of solid, dashed, and dotted borders across stamps. Some thin, some medium weight.
4. **Inner details**: Some stamps should have double rings, some corner ticks, some inner frames, some none.
5. **Flexbox flow**: Stamps should wrap naturally, roughly 3 across, with centered alignment. No stamps should overflow or clip.
6. **Rotation**: Stamps still have their pseudo-random rotation angles.
7. **Ink filter**: All stamps still render with the paprika ink color and `stamp-ink` SVG filter.
8. **Click behavior**: Clicking any stamp should still open the cooked recipes modal.
9. **Mobile**: Resize browser to check mobile layout. Stamps should still flow and wrap correctly.

- [ ] **Step 4: Commit**

```bash
git add components/passport/RegionHalf.tsx
git commit -m "feat(passport): switch stamp layout from grid to flexbox"
```

---

### Task 7: Final visual polish and review

- [ ] **Step 1: Full passport walkthrough**

With `npm run dev` running, do a complete passport walkthrough:

1. Cover page → inside front spread: tier ledger visible, breathing room, no "How this works".
2. Navigate through all 10 region spreads: stamp variety is visible, layout is clean.
3. Test with 0 stamps (clear localStorage `nieves-stamps`): inside front spread shows "New Explorer" as current tier, all others locked.
4. Test with many stamps: verify stamps wrap correctly when a region has many countries.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit any polish fixes**

If any visual adjustments were needed during the walkthrough, commit them:

```bash
git add -A
git commit -m "fix(passport): visual polish for tier ledger and stamp variation"
```

Skip this step if no fixes were needed.
