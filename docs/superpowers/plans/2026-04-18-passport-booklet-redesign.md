# Passport Booklet Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat stacked-card passport at `/passport` with a booklet UI: two-page spreads that flip via chevrons/keyboard/swipe, sub-region taxonomy, ink-stamp visuals for cooked countries, dashed placeholders for uncooked.

**Architecture:** Framer Motion DIY. New `components/passport/*` directory housing a `PassportBooklet` root that owns page state, URL sync, and input handling; composed of presentational sub-components (cover, spreads, stamps, modal, chevrons, indicator). Sub-region taxonomy added to `lib/regions.ts` as a plain code-level map. `/recipes` gains `useSearchParams`-driven filter hydration so uncooked-stamp clicks can deep-link with `?country=X`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind v4, `framer-motion` (already installed), TanStack Query (already installed, used by `useCookedStamps`).

**Reference spec:** `docs/superpowers/specs/2026-04-18-passport-booklet-redesign-design.md`

**Project has no test suite** (confirmed in `CLAUDE.md`). Verification on every task: `npm run lint`, `npm run build`, and a described manual smoke-check. Treat these as the test gate.

**Open-item defaults locked (user approved):**
- Sub-region mapping drafted in Task 1 (user will review).
- Back-cover "Highlights" shows 5 most-recent stamps.
- Cover omits user name/handle (no auth).

---

## File structure (created or modified)

```
New:
  components/passport/PassportBooklet.tsx
  components/passport/BookletShell.tsx
  components/passport/Page.tsx
  components/passport/Spread.tsx
  components/passport/CoverPage.tsx
  components/passport/InsideFrontSpread.tsx
  components/passport/SubRegionSpread.tsx
  components/passport/BackCoverSpread.tsx
  components/passport/CountryStampSlot.tsx
  components/passport/StampedRecipesModal.tsx
  components/passport/NavChevrons.tsx
  components/passport/PageIndicator.tsx
  components/passport/PaperTexture.tsx
  components/passport/hooks/usePassportPages.ts
  components/passport/hooks/useBookletNav.ts

Modified:
  lib/regions.ts                     — add sub-region taxonomy
  lib/types.ts                       — add SubCulinaryRegion type
  app/passport/page.tsx              — render <PassportBooklet /> only
  app/recipes/page.tsx               — hydrate Filters from searchParams

Deleted:
  components/PassportCover.tsx
  components/PassportRegionSection.tsx
  components/CountryStamp.tsx
  components/PassportRecipeCard.tsx
```

---

## Task 1 — Sub-region taxonomy in `lib/regions.ts` and `lib/types.ts`

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/regions.ts`

**Why:** Every downstream component keys off sub-regions. Hardcoded, code-only, no DB migration. Keyed by country-name string (matching `recipe.country`), not numeric ISO — the existing numeric-ISO map is solely for the WorldMap choropleth.

- [ ] **Step 1.1: Add `SubCulinaryRegion` to `lib/types.ts`**

Append the type after the existing `CulinaryRegion` block:

```ts
export type SubCulinaryRegion =
  | 'Northern Europe'
  | 'Western Europe (sub)'
  | 'Mediterranean'
  | 'Eastern Europe (sub)'
  | 'East Asia (sub)'
  | 'Japan & Korea (sub)'
  | 'Southeast Asia (sub)'
  | 'South Asia (sub)'
  | 'Central Asia'
  | 'West Asia / Levant'
  | 'Arabian Peninsula'
  | 'North Africa (sub)'
  | 'West Africa'
  | 'East Africa'
  | 'Central Africa'
  | 'Southern Africa'
  | 'North America'
  | 'Central America & Caribbean'
  | 'South America'
  | 'Oceania';
```

(The `(sub)` suffixes differentiate from the top-level `CulinaryRegion` values — avoids ambiguous naming and keeps TypeScript happy when both types appear in the same file.)

- [ ] **Step 1.2: Add sub-region tables to `lib/regions.ts`**

Append at the bottom of `lib/regions.ts` (do not remove existing exports):

```ts
import type { SubCulinaryRegion } from './types';

/**
 * Sub-region taxonomy for the passport booklet.
 * Keyed by recipe.country (display name string), not numeric ISO code.
 * Only countries that have recipes in the DB need entries — unmapped
 * countries fall through to the region-level fallback and won't appear
 * on any spread.
 */
export const COUNTRY_TO_SUBREGION: Record<string, SubCulinaryRegion> = {
  // Northern Europe
  'Sweden': 'Northern Europe', 'Norway': 'Northern Europe', 'Denmark': 'Northern Europe',
  'Finland': 'Northern Europe', 'Iceland': 'Northern Europe',
  // Western Europe (sub)
  'France': 'Western Europe (sub)', 'Germany': 'Western Europe (sub)',
  'Netherlands': 'Western Europe (sub)', 'Belgium': 'Western Europe (sub)',
  'Austria': 'Western Europe (sub)', 'Switzerland': 'Western Europe (sub)',
  'Ireland': 'Western Europe (sub)', 'United Kingdom': 'Western Europe (sub)',
  'Luxembourg': 'Western Europe (sub)',
  // Mediterranean
  'Italy': 'Mediterranean', 'Spain': 'Mediterranean', 'Portugal': 'Mediterranean',
  'Greece': 'Mediterranean', 'Malta': 'Mediterranean',
  // Eastern Europe (sub)
  'Poland': 'Eastern Europe (sub)', 'Czech Republic': 'Eastern Europe (sub)',
  'Hungary': 'Eastern Europe (sub)', 'Romania': 'Eastern Europe (sub)',
  'Bulgaria': 'Eastern Europe (sub)', 'Ukraine': 'Eastern Europe (sub)',
  'Russia': 'Eastern Europe (sub)', 'Slovakia': 'Eastern Europe (sub)',
  'Croatia': 'Eastern Europe (sub)', 'Serbia': 'Eastern Europe (sub)',
  'Bosnia and Herzegovina': 'Eastern Europe (sub)', 'Albania': 'Eastern Europe (sub)',
  'Slovenia': 'Eastern Europe (sub)', 'Belarus': 'Eastern Europe (sub)',
  'Lithuania': 'Eastern Europe (sub)', 'Latvia': 'Eastern Europe (sub)',
  'Estonia': 'Eastern Europe (sub)', 'Moldova': 'Eastern Europe (sub)',
  // East Asia (sub)
  'China': 'East Asia (sub)', 'Mongolia': 'East Asia (sub)', 'Taiwan': 'East Asia (sub)',
  // Japan & Korea (sub)
  'Japan': 'Japan & Korea (sub)', 'South Korea': 'Japan & Korea (sub)',
  'North Korea': 'Japan & Korea (sub)',
  // Southeast Asia (sub)
  'Thailand': 'Southeast Asia (sub)', 'Vietnam': 'Southeast Asia (sub)',
  'Indonesia': 'Southeast Asia (sub)', 'Philippines': 'Southeast Asia (sub)',
  'Malaysia': 'Southeast Asia (sub)', 'Singapore': 'Southeast Asia (sub)',
  'Myanmar': 'Southeast Asia (sub)', 'Cambodia': 'Southeast Asia (sub)',
  'Laos': 'Southeast Asia (sub)',
  // South Asia (sub)
  'India': 'South Asia (sub)', 'Pakistan': 'South Asia (sub)',
  'Bangladesh': 'South Asia (sub)', 'Sri Lanka': 'South Asia (sub)',
  'Nepal': 'South Asia (sub)', 'Bhutan': 'South Asia (sub)',
  'Afghanistan': 'South Asia (sub)',
  // Central Asia
  'Kazakhstan': 'Central Asia', 'Uzbekistan': 'Central Asia',
  'Turkmenistan': 'Central Asia', 'Kyrgyzstan': 'Central Asia',
  'Tajikistan': 'Central Asia',
  // West Asia / Levant
  'Turkey': 'West Asia / Levant', 'Lebanon': 'West Asia / Levant',
  'Syria': 'West Asia / Levant', 'Israel': 'West Asia / Levant',
  'Palestine': 'West Asia / Levant', 'Jordan': 'West Asia / Levant',
  'Iran': 'West Asia / Levant', 'Iraq': 'West Asia / Levant',
  'Armenia': 'West Asia / Levant', 'Azerbaijan': 'West Asia / Levant',
  'Georgia': 'West Asia / Levant', 'Cyprus': 'West Asia / Levant',
  // Arabian Peninsula
  'Saudi Arabia': 'Arabian Peninsula', 'Yemen': 'Arabian Peninsula',
  'Oman': 'Arabian Peninsula', 'United Arab Emirates': 'Arabian Peninsula',
  'Qatar': 'Arabian Peninsula', 'Bahrain': 'Arabian Peninsula',
  'Kuwait': 'Arabian Peninsula',
  // North Africa (sub)
  'Egypt': 'North Africa (sub)', 'Morocco': 'North Africa (sub)',
  'Tunisia': 'North Africa (sub)', 'Algeria': 'North Africa (sub)',
  'Libya': 'North Africa (sub)', 'Sudan': 'North Africa (sub)',
  // West Africa
  'Nigeria': 'West Africa', 'Ghana': 'West Africa', 'Senegal': 'West Africa',
  'Mali': 'West Africa', 'Ivory Coast': 'West Africa', 'Guinea': 'West Africa',
  'Sierra Leone': 'West Africa', 'Liberia': 'West Africa', 'Burkina Faso': 'West Africa',
  'Benin': 'West Africa', 'Togo': 'West Africa', 'Mauritania': 'West Africa',
  'Gambia': 'West Africa', 'Cape Verde': 'West Africa', 'Niger': 'West Africa',
  // East Africa
  'Ethiopia': 'East Africa', 'Kenya': 'East Africa', 'Tanzania': 'East Africa',
  'Uganda': 'East Africa', 'Rwanda': 'East Africa', 'Burundi': 'East Africa',
  'Somalia': 'East Africa', 'Eritrea': 'East Africa', 'Djibouti': 'East Africa',
  'South Sudan': 'East Africa', 'Madagascar': 'East Africa',
  // Central Africa
  'Democratic Republic of the Congo': 'Central Africa',
  'Republic of the Congo': 'Central Africa', 'Cameroon': 'Central Africa',
  'Gabon': 'Central Africa', 'Chad': 'Central Africa',
  'Central African Republic': 'Central Africa', 'Angola': 'Central Africa',
  // Southern Africa
  'South Africa': 'Southern Africa', 'Zimbabwe': 'Southern Africa',
  'Zambia': 'Southern Africa', 'Mozambique': 'Southern Africa',
  'Botswana': 'Southern Africa', 'Namibia': 'Southern Africa',
  'Malawi': 'Southern Africa', 'Lesotho': 'Southern Africa',
  'Eswatini': 'Southern Africa',
  // North America
  'United States of America': 'North America', 'USA': 'North America',
  'Canada': 'North America', 'Mexico': 'North America',
  // Central America & Caribbean
  'Guatemala': 'Central America & Caribbean', 'Belize': 'Central America & Caribbean',
  'Honduras': 'Central America & Caribbean', 'El Salvador': 'Central America & Caribbean',
  'Nicaragua': 'Central America & Caribbean', 'Costa Rica': 'Central America & Caribbean',
  'Panama': 'Central America & Caribbean', 'Cuba': 'Central America & Caribbean',
  'Jamaica': 'Central America & Caribbean', 'Haiti': 'Central America & Caribbean',
  'Dominican Republic': 'Central America & Caribbean',
  'Puerto Rico': 'Central America & Caribbean',
  'Trinidad and Tobago': 'Central America & Caribbean',
  'Bahamas': 'Central America & Caribbean', 'Barbados': 'Central America & Caribbean',
  // South America
  'Brazil': 'South America', 'Argentina': 'South America', 'Chile': 'South America',
  'Peru': 'South America', 'Colombia': 'South America', 'Venezuela': 'South America',
  'Ecuador': 'South America', 'Bolivia': 'South America', 'Paraguay': 'South America',
  'Uruguay': 'South America', 'Guyana': 'South America', 'Suriname': 'South America',
  // Oceania
  'Australia': 'Oceania', 'New Zealand': 'Oceania', 'Fiji': 'Oceania',
  'Papua New Guinea': 'Oceania', 'Samoa': 'Oceania', 'Tonga': 'Oceania',
};

/** Which top-level CulinaryRegion a sub-region belongs to. */
export const SUB_REGION_PARENT: Record<SubCulinaryRegion, CulinaryRegion> = {
  'Northern Europe':              'Western Europe',
  'Western Europe (sub)':         'Western Europe',
  'Mediterranean':                'Western Europe',
  'Eastern Europe (sub)':         'Eastern Europe',
  'East Asia (sub)':              'East Asia',
  'Japan & Korea (sub)':          'Japan & Korea',
  'Southeast Asia (sub)':         'Southeast Asia',
  'South Asia (sub)':             'South Asia',
  'Central Asia':                 'South Asia',
  'West Asia / Levant':           'Middle East',
  'Arabian Peninsula':            'Middle East',
  'North Africa (sub)':           'North Africa',
  'West Africa':                  'Sub-Saharan Africa',
  'East Africa':                  'Sub-Saharan Africa',
  'Central Africa':               'Sub-Saharan Africa',
  'Southern Africa':              'Sub-Saharan Africa',
  'North America':                'Caribbean & Americas',
  'Central America & Caribbean':  'Caribbean & Americas',
  'South America':                'Caribbean & Americas',
  'Oceania':                      'Caribbean & Americas', // no dedicated top-level
};

/** Fixed "travel order" west → east, roughly matching a globe tour. */
export const SUB_REGION_ORDER: SubCulinaryRegion[] = [
  'North America',
  'Central America & Caribbean',
  'South America',
  'Northern Europe',
  'Western Europe (sub)',
  'Mediterranean',
  'Eastern Europe (sub)',
  'North Africa (sub)',
  'West Africa',
  'Central Africa',
  'East Africa',
  'Southern Africa',
  'West Asia / Levant',
  'Arabian Peninsula',
  'Central Asia',
  'South Asia (sub)',
  'Southeast Asia (sub)',
  'East Asia (sub)',
  'Japan & Korea (sub)',
  'Oceania',
];

/** URL-safe slug for deep-linking, e.g. /passport?spread=east-asia-sub */
export const SUB_REGION_SLUG: Record<SubCulinaryRegion, string> = {
  'Northern Europe':              'northern-europe',
  'Western Europe (sub)':         'western-europe',
  'Mediterranean':                'mediterranean',
  'Eastern Europe (sub)':         'eastern-europe',
  'East Asia (sub)':              'east-asia',
  'Japan & Korea (sub)':          'japan-korea',
  'Southeast Asia (sub)':         'southeast-asia',
  'South Asia (sub)':             'south-asia',
  'Central Asia':                 'central-asia',
  'West Asia / Levant':           'west-asia-levant',
  'Arabian Peninsula':            'arabian-peninsula',
  'North Africa (sub)':           'north-africa',
  'West Africa':                  'west-africa',
  'East Africa':                  'east-africa',
  'Central Africa':               'central-africa',
  'Southern Africa':              'southern-africa',
  'North America':                'north-america',
  'Central America & Caribbean':  'central-america-caribbean',
  'South America':                'south-america',
  'Oceania':                      'oceania',
};

/** Reverse lookup: slug → sub-region (for deep-link parsing). */
export const SLUG_TO_SUB_REGION: Record<string, SubCulinaryRegion> =
  Object.fromEntries(
    Object.entries(SUB_REGION_SLUG).map(([k, v]) => [v, k as SubCulinaryRegion]),
  );
```

- [ ] **Step 1.3: Verify**

Run:
```bash
npm run lint
npm run build
```
Expected: both pass with no new errors. If `build` fails, fix import paths and retry before committing.

- [ ] **Step 1.4: Commit**

```bash
git add lib/types.ts lib/regions.ts
git commit -m "feat(passport): add sub-region taxonomy"
```

---

## Task 2 — `usePassportPages` hook: compute the page list

**Files:**
- Create: `components/passport/hooks/usePassportPages.ts`

**Why:** The page sequence depends on recipes + stamps. Centralising this logic in a hook keeps `PassportBooklet` focused on state/nav. Returns a typed array of page descriptors the booklet renders.

- [ ] **Step 2.1: Create the hook**

Write `components/passport/hooks/usePassportPages.ts`:

```ts
'use client';

import { useMemo } from 'react';
import {
  COUNTRY_TO_SUBREGION,
  SUB_REGION_ORDER,
  SUB_REGION_PARENT,
} from '@/lib/regions';
import type { SubCulinaryRegion, CulinaryRegion, Recipe } from '@/lib/types';
import type { PassportSummary, Stamp } from '@/lib/passport';

export type PageDescriptor =
  | { kind: 'cover' }
  | { kind: 'inside-front' }
  | { kind: 'sub-region'; subRegion: SubCulinaryRegion; countries: string[] }
  | { kind: 'back-cover' };

interface Input {
  recipes: Recipe[];
  summary: PassportSummary;
}

export function usePassportPages({ recipes, summary }: Input): PageDescriptor[] {
  return useMemo(() => {
    // Group recipes by sub-region; also track parent-region populations
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

    // A sub-region is visible iff its PARENT region has ≥1 recipe.
    // When visible, its country list also pulls in any mapped country
    // whose parent-region is populated, even if that country itself has
    // no recipe yet — this gives users placeholder slots to aspire to.
    const countriesForSubRegion = (sub: SubCulinaryRegion): string[] => {
      const parent = SUB_REGION_PARENT[sub];
      const parentCount = recipesPerParentRegion.get(parent) ?? 0;
      if (parentCount === 0) return [];

      // All mapped countries in this sub-region, whether or not they have recipes.
      // We still gate total visibility on parent-region population so empty
      // parents (e.g. Oceania with no recipes) don't render.
      const all = new Set<string>();
      for (const [country, s] of Object.entries(COUNTRY_TO_SUBREGION)) {
        if (s === sub) all.add(country);
      }
      // Merge in any recipe countries already seen (covers unmapped edge cases).
      const fromRecipes = countriesBySubRegion.get(sub);
      if (fromRecipes) for (const c of fromRecipes) all.add(c);
      return [...all].sort((a, b) => a.localeCompare(b));
    };

    const pages: PageDescriptor[] = [
      { kind: 'cover' },
      { kind: 'inside-front' },
    ];

    for (const sub of SUB_REGION_ORDER) {
      const countries = countriesForSubRegion(sub);
      if (countries.length > 0) {
        pages.push({ kind: 'sub-region', subRegion: sub, countries });
      }
    }

    pages.push({ kind: 'back-cover' });
    return pages;
  }, [recipes, summary]);
}
```

- [ ] **Step 2.2: Verify**

Run:
```bash
npm run lint
```
Expected: no errors specific to this file. (Unused-hook warning is OK; it's consumed in later tasks.)

- [ ] **Step 2.3: Commit**

```bash
git add components/passport/hooks/usePassportPages.ts
git commit -m "feat(passport): add usePassportPages hook"
```

---

## Task 3 — `useBookletNav` hook: page state, URL sync, input

**Files:**
- Create: `components/passport/hooks/useBookletNav.ts`

**Why:** Owns all navigation concerns so `PassportBooklet` stays simple. Handles current index, flip guarding, keyboard, swipe, and `?spread=` URL sync.

- [ ] **Step 3.1: Create the hook**

Write `components/passport/hooks/useBookletNav.ts`:

```ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SLUG_TO_SUB_REGION, SUB_REGION_SLUG } from '@/lib/regions';
import type { PageDescriptor } from './usePassportPages';

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

export function useBookletNav(pages: PageDescriptor[]): BookletNav {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [index, setIndex] = useState(0);
  const [isFlipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const lockRef = useRef(false);

  // Deep-link: read ?spread=slug on mount & when pages change
  useEffect(() => {
    const slug = params.get('spread');
    if (!slug) return;
    const sub = SLUG_TO_SUB_REGION[slug];
    if (!sub) return;
    const targetIdx = pages.findIndex(
      p => p.kind === 'sub-region' && p.subRegion === sub,
    );
    if (targetIdx >= 0) setIndex(targetIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length]);

  // Keep URL in sync with current sub-region page
  const syncUrl = useCallback(
    (nextIdx: number) => {
      const p = pages[nextIdx];
      const next = new URLSearchParams(params.toString());
      if (p?.kind === 'sub-region') {
        next.set('spread', SUB_REGION_SLUG[p.subRegion]);
      } else {
        next.delete('spread');
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pages, params, router, pathname],
  );

  const flipTo = useCallback(
    (nextIdx: number) => {
      if (lockRef.current) return;
      if (nextIdx < 0 || nextIdx >= pages.length) return;
      if (nextIdx === index) return;

      lockRef.current = true;
      setFlipping(true);
      setDirection(nextIdx > index ? 1 : -1);

      const duration =
        pages[index]?.kind === 'cover' || pages[nextIdx]?.kind === 'cover'
          ? COVER_FLIP_MS
          : FLIP_MS;

      setIndex(nextIdx);
      syncUrl(nextIdx);

      window.setTimeout(() => {
        lockRef.current = false;
        setFlipping(false);
      }, duration);
    },
    [index, pages, syncUrl],
  );

  const flipNext = useCallback(() => flipTo(index + 1), [flipTo, index]);
  const flipPrev = useCallback(() => flipTo(index - 1), [flipTo, index]);
  const jumpTo = useCallback((i: number) => flipTo(i), [flipTo]);

  // Keyboard
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

  // Swipe
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
    canNext: index < pages.length - 1,
    flipNext,
    flipPrev,
    jumpTo,
    bindSwipe,
  };
}
```

- [ ] **Step 3.2: Verify**

Run:
```bash
npm run lint
```
Expected: no new errors.

- [ ] **Step 3.3: Commit**

```bash
git add components/passport/hooks/useBookletNav.ts
git commit -m "feat(passport): add useBookletNav hook"
```

---

## Task 4 — `PaperTexture` SVG filter component

**Files:**
- Create: `components/passport/PaperTexture.tsx`

**Why:** Reusable grain + deckle-edge SVG filters referenced by id from any page. Defining once avoids redefining filters on every render.

- [ ] **Step 4.1: Create the component**

Write `components/passport/PaperTexture.tsx`:

```tsx
'use client';

/**
 * Renders hidden SVG filters referenced by CSS/SVG `filter: url(#id)`.
 * Place once near the top of the booklet tree.
 */
export default function PaperTexture() {
  return (
    <svg aria-hidden="true" className="absolute w-0 h-0 pointer-events-none">
      <defs>
        {/* Fine paper grain */}
        <filter id="passport-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.28
                    0 0 0 0 0.20
                    0 0 0 0 0.12
                    0 0 0 0.08 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        {/* Deckle/torn edge */}
        <filter id="passport-deckle">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>

        {/* Ink smudge for stamps */}
        <filter id="stamp-ink">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.92 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
```

- [ ] **Step 4.2: Verify**

Run: `npm run lint`. Expected: pass.

- [ ] **Step 4.3: Commit**

```bash
git add components/passport/PaperTexture.tsx
git commit -m "feat(passport): add reusable SVG paper/grain filters"
```

---

## Task 5 — `CountryStampSlot` component (cooked + uncooked visuals)

**Files:**
- Create: `components/passport/CountryStampSlot.tsx`

**Why:** Single focused component for both cooked and uncooked states. Stable random rotation per country name.

- [ ] **Step 5.1: Create the component**

Write `components/passport/CountryStampSlot.tsx`:

```tsx
'use client';

import type { Stamp as StampRow } from '@/lib/passport';

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

/** Hash a string into a deterministic angle in [-6, 6]. */
function angleForCountry(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 121) - 60) / 10; // -6..+6
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

  const baseClasses =
    'relative aspect-square w-full flex items-center justify-center ' +
    'rounded-full transition-transform focus:outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-terracotta';

  if (!cooked) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${country} — not cooked yet. Browse recipes from ${country}`}
        className={
          baseClasses +
          ' border-2 border-dashed border-brown-light/60 text-brown-light ' +
          'hover:border-brown-medium hover:text-brown-medium cursor-pointer'
        }
      >
        <span className="text-[10px] sm:text-xs font-body uppercase tracking-wide text-center px-1 leading-tight">
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
        baseClasses +
        ' text-paprika/90 [filter:url(#stamp-ink)] ' +
        'hover:scale-[1.03] mix-blend-multiply cursor-pointer'
      }
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {/* Double ring */}
      <span className="absolute inset-0 rounded-full border-[2.5px] border-current" />
      <span className="absolute inset-[6%] rounded-full border border-current/70" />

      <span className="flex flex-col items-center justify-center px-1.5">
        <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] leading-none">
          {country}
        </span>
        {firstDate && (
          <span className="mt-1 font-body text-[9px] uppercase tracking-wider opacity-80">
            {formatMonth(firstDate)}
          </span>
        )}
        {stamps.length > 1 && (
          <span className="mt-0.5 font-body text-[8px] opacity-70">
            ×{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
```

- [ ] **Step 5.2: Verify**

Run: `npm run lint`. Expected: pass.

- [ ] **Step 5.3: Commit**

```bash
git add components/passport/CountryStampSlot.tsx
git commit -m "feat(passport): add CountryStampSlot with ink/placeholder states"
```

---

## Task 6 — `StampedRecipesModal` component

**Files:**
- Create: `components/passport/StampedRecipesModal.tsx`

**Why:** Modal shown on cooked-stamp click. Lists cooked recipes for a country with their stamp dates. Focus-trap + Esc close.

- [ ] **Step 6.1: Create the component**

Write `components/passport/StampedRecipesModal.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';

interface Props {
  country: string;
  recipes: Recipe[];          // cooked recipes for this country
  stampsByRecipe: Map<string, StampRow[]>;
  onClose: () => void;
}

export default function StampedRecipesModal({
  country,
  recipes,
  stampsByRecipe,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus on open, Esc to close
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown-dark/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Recipes cooked from ${country}`}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className="bg-parchment rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-light/40">
          <h2 className="font-heading text-xl font-bold text-brown-dark">
            Cooked from {country}
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

        <div className="overflow-y-auto px-5 py-4 space-y-3">
          {recipes.length === 0 && (
            <p className="text-sm text-brown-medium">No cooked recipes yet.</p>
          )}
          {recipes.map(r => {
            const rs = stampsByRecipe.get(r.id) ?? [];
            const lastDate = rs[rs.length - 1]?.cooked_at;
            return (
              <Link
                key={r.id}
                href={`/recipes/${r.id}`}
                onClick={onClose}
                className="block p-3 rounded-xl bg-white hover:bg-white/80 border border-brown-light/30 transition-colors"
              >
                <div className="font-heading text-base font-semibold text-brown-dark">
                  {r.name}
                </div>
                <div className="text-xs text-brown-medium mt-0.5">
                  Cooked {rs.length} time{rs.length === 1 ? '' : 's'}
                  {lastDate && (
                    <> — last {new Date(lastDate).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}</>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6.2: Verify**

Run: `npm run lint`. Expected: pass.

- [ ] **Step 6.3: Commit**

```bash
git add components/passport/StampedRecipesModal.tsx
git commit -m "feat(passport): add cooked-recipes modal"
```

---

## Task 7 — `Page` + `Spread` primitives (Framer Motion flip)

**Files:**
- Create: `components/passport/Page.tsx`
- Create: `components/passport/Spread.tsx`

**Why:** Core flip mechanics live in one small primitive. `Spread` composes two `Page`s for desktop two-page layout.

- [ ] **Step 7.1: Create `Page.tsx`**

Write `components/passport/Page.tsx`:

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 'left' pivots on the right edge (book left page); 'right' on the left edge. */
  side: 'left' | 'right';
  /** Whether this page is currently the one flipping. */
  isFlipping: boolean;
  /** +1 forward, -1 backward */
  direction: 1 | -1;
  /** true when this page should show its "after-flip" face */
  flipped: boolean;
  className?: string;
}

export default function Page({
  children, side, isFlipping, direction, flipped, className = '',
}: Props) {
  const reduced = useReducedMotion();
  const originClass = side === 'left' ? 'origin-right' : 'origin-left';

  if (reduced) {
    return (
      <motion.div
        className={`relative h-full w-full ${className}`}
        animate={{ opacity: isFlipping ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  // Rigid-hinge 3D flip. Target rotation depends on side + flipped state.
  const rotateY =
    side === 'right'
      ? (flipped ? -180 : 0)
      : (flipped ? 180 : 0);

  return (
    <motion.div
      className={`relative h-full w-full ${originClass} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      animate={{ rotateY }}
      transition={{
        duration: direction === 1 ? 0.6 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
      {/* Fold shadow overlay — deepens at the spine during flip */}
      {isFlipping && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-${side === 'left' ? 'l' : 'r'} from-black/30 via-transparent to-transparent rounded-lg`}
        />
      )}
    </motion.div>
  );
}
```

Note: in practice the flip animation is driven by the parent `PassportBooklet`'s stacked-pages approach in Task 8. `Page` here is the low-level primitive you can use for bespoke flips; for the booklet itself we'll use a simpler index-based cross-fade-plus-rotate described in Task 8. `Page` remains available for back-cover and cover open animations.

- [ ] **Step 7.2: Create `Spread.tsx`**

`Spread` is a presentational wrapper only: it applies the parchment background, grain filter, padding, and an optional vertical spine divider at the 50% mark. It does **not** impose a two-column grid — each spread-level component (InsideFrontSpread, SubRegionSpread, BackCoverSpread) manages its own `md:grid-cols-2` internally. This avoids grid-in-grid scrunching.

Write `components/passport/Spread.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Whether to draw the center spine divider (desktop only). */
  withSpine?: boolean;
}

export default function Spread({ children, withSpine = true }: Props) {
  return (
    <div className="relative w-full h-full bg-parchment overflow-hidden">
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-40 pointer-events-none" />
      <div className="relative h-full w-full p-6 sm:p-10 overflow-hidden">{children}</div>
      {withSpine && (
        <div
          aria-hidden
          className="hidden md:block absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brown-dark/10 via-brown-dark/40 to-brown-dark/10"
        />
      )}
    </div>
  );
}
```

- [ ] **Step 7.3: Verify**

Run: `npm run lint`. Expected: pass.

- [ ] **Step 7.4: Commit**

```bash
git add components/passport/Page.tsx components/passport/Spread.tsx
git commit -m "feat(passport): add Page and Spread primitives"
```

---

## Task 8 — `CoverPage`, `InsideFrontSpread`, `SubRegionSpread`, `BackCoverSpread`

**Files:**
- Create: `components/passport/CoverPage.tsx`
- Create: `components/passport/InsideFrontSpread.tsx`
- Create: `components/passport/SubRegionSpread.tsx`
- Create: `components/passport/BackCoverSpread.tsx`

- [ ] **Step 8.1: Create `CoverPage.tsx`**

```tsx
'use client';

import type { PassportSummary } from '@/lib/passport';

export default function CoverPage({ summary }: { summary: PassportSummary }) {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-brown-dark via-brown-medium to-brown-dark text-parchment overflow-hidden rounded-lg">
      <div className="absolute inset-0 [filter:url(#passport-grain)] opacity-30 mix-blend-overlay pointer-events-none" />

      <div className="relative h-full w-full flex flex-col items-center justify-center px-10 py-14 text-center">
        {/* Crest */}
        <svg viewBox="0 0 80 80" className="w-20 h-20 mb-6 text-turmeric" aria-hidden>
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="40" cy="40" r="27" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M40 18 L44 32 L58 32 L47 40 L51 54 L40 46 L29 54 L33 40 L22 32 L36 32 Z"
                fill="currentColor" opacity="0.9" />
        </svg>

        <div className="text-parchment/60 text-xs uppercase tracking-[0.35em] mb-3 font-body">
          Nieves Kitchen
        </div>
        <h1
          className="font-heading text-4xl sm:text-5xl font-bold tracking-wide"
          style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.08), -1px -1px 0 rgba(0,0,0,0.4)' }}
        >
          Culinary Passport
        </h1>
        <div className="mt-8 text-parchment/75 text-xs uppercase tracking-[0.3em] font-body">
          {summary.title}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8.2: Create `InsideFrontSpread.tsx`**

```tsx
'use client';

import type { PassportSummary } from '@/lib/passport';
import type { PageDescriptor } from './hooks/usePassportPages';

interface Props {
  summary: PassportSummary;
  pages: PageDescriptor[];
  onJumpToSubRegion: (pageIndex: number) => void;
  stampsPerCountry: PassportSummary['stampsPerCountry'];
}

export default function InsideFrontSpread({
  summary, pages, onJumpToSubRegion, stampsPerCountry,
}: Props) {
  const { totalStamps, uniqueCountries, regionsTouched, title, nextTier } = summary;
  return (
    <div className="grid md:grid-cols-2 h-full w-full gap-6">
      {/* Left: stats */}
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
        {nextTier && (
          <div className="text-sm text-brown-medium font-body">
            Next: <span className="font-semibold text-brown-dark">{nextTier.title}</span> —{' '}
            <ProgressHint
              stamps={totalStamps}
              regions={regionsTouched.size}
              minStamps={nextTier.minStamps}
              minRegions={nextTier.minRegions}
            />
          </div>
        )}
        {!nextTier && (
          <div className="text-sm text-brown-medium font-body">
            You&apos;ve reached the highest title. The world is yours.
          </div>
        )}
      </div>

      {/* Right: table of contents */}
      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Contents
        </div>
        <ul className="space-y-1.5 overflow-y-auto pr-1">
          {pages.map((p, i) =>
            p.kind === 'sub-region' ? (
              <li key={p.subRegion}>
                <button
                  type="button"
                  onClick={() => onJumpToSubRegion(i)}
                  className="w-full flex items-baseline justify-between gap-3 py-1.5 border-b border-dotted border-brown-light/50 hover:text-terracotta text-left"
                >
                  <span className="font-heading text-sm text-brown-dark truncate">
                    {p.subRegion.replace(' (sub)', '')}
                  </span>
                  <span className="font-body text-xs text-brown-medium whitespace-nowrap">
                    {p.countries.filter(c => (stampsPerCountry.get(c)?.length ?? 0) > 0).length}
                    {' / '}{p.countries.length}
                  </span>
                </button>
              </li>
            ) : null,
          )}
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

- [ ] **Step 8.3: Create `SubRegionSpread.tsx`**

```tsx
'use client';

import type { SubCulinaryRegion, Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import CountryStampSlot from './CountryStampSlot';

interface Props {
  subRegion: SubCulinaryRegion;
  countries: string[];
  stampsPerCountry: Map<string, StampRow[]>;
  recipesByCountry: Map<string, Recipe[]>;
  onCookedClick: (country: string) => void;
  onUncookedClick: (country: string) => void;
}

export default function SubRegionSpread({
  subRegion, countries, stampsPerCountry, onCookedClick, onUncookedClick,
}: Props) {
  const cookedCount = countries.filter(
    c => (stampsPerCountry.get(c)?.length ?? 0) > 0,
  ).length;

  const cleanName = subRegion.replace(' (sub)', '');

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-brown-medium font-body mb-1">
            Region
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brown-dark">
            {cleanName}
          </h2>
        </div>
        <div className="font-body text-sm text-brown-medium">
          <span className="font-semibold text-brown-dark">{cookedCount}</span>
          <span className="opacity-70">{' / '}{countries.length} cooked</span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 content-start">
        {countries.map(country => {
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

- [ ] **Step 8.4: Create `BackCoverSpread.tsx`**

```tsx
'use client';

import Link from 'next/link';
import type { PassportSummary } from '@/lib/passport';

interface Props {
  summary: PassportSummary;
}

const HIGHLIGHT_COUNT = 5;

export default function BackCoverSpread({ summary }: Props) {
  // Flatten and pick most-recent stamps
  const all: Array<{ country: string; slug: string; cookedAt: string }> = [];
  for (const [country, stamps] of summary.stampsPerCountry) {
    for (const s of stamps) {
      all.push({ country, slug: s.recipe_slug, cookedAt: s.cooked_at });
    }
  }
  all.sort((a, b) => b.cookedAt.localeCompare(a.cookedAt));
  const recent = all.slice(0, HIGHLIGHT_COUNT);

  return (
    <div className="grid md:grid-cols-2 h-full w-full gap-6">
      <div className="flex flex-col">
        <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] font-body mb-2">
          Highlights
        </div>
        <h2 className="font-heading text-2xl font-bold text-brown-dark mb-4">
          Recent stamps
        </h2>
        {recent.length === 0 && (
          <p className="text-sm text-brown-medium">No stamps yet. Your journey starts with a single recipe.</p>
        )}
        <ul className="space-y-2">
          {recent.map(r => (
            <li key={r.slug + r.cookedAt} className="flex items-baseline justify-between gap-3 border-b border-dotted border-brown-light/50 pb-1.5">
              <Link href={`/recipes/${r.slug}`} className="font-heading text-sm text-brown-dark hover:text-terracotta truncate">
                {r.country}
              </Link>
              <span className="text-xs text-brown-medium font-body whitespace-nowrap">
                {new Date(r.cookedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-start justify-center">
        <p className="font-heading italic text-lg text-brown-dark leading-relaxed mb-6">
          &ldquo;Every meal is a small expedition.&rdquo;
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 bg-terracotta text-parchment px-5 py-3 rounded-xl font-medium shadow hover:bg-terracotta/90 transition-colors"
        >
          Browse more recipes →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 8.5: Verify**

Run: `npm run lint`. Expected: pass.

- [ ] **Step 8.6: Commit**

```bash
git add components/passport/CoverPage.tsx components/passport/InsideFrontSpread.tsx components/passport/SubRegionSpread.tsx components/passport/BackCoverSpread.tsx
git commit -m "feat(passport): add cover, inside-front, sub-region, back-cover spreads"
```

---

## Task 9 — `NavChevrons` + `PageIndicator`

**Files:**
- Create: `components/passport/NavChevrons.tsx`
- Create: `components/passport/PageIndicator.tsx`

- [ ] **Step 9.1: Create `NavChevrons.tsx`**

```tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  disabled: boolean;
}

export default function NavChevrons({ canPrev, canNext, onPrev, onNext, disabled }: Props) {
  const base =
    'absolute top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full ' +
    'bg-parchment shadow-lg border border-brown-light/40 text-brown-dark ' +
    'flex items-center justify-center transition ' +
    'hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ' +
    'disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <>
      <button
        type="button"
        aria-label="Previous page"
        onClick={onPrev}
        disabled={!canPrev || disabled}
        className={`${base} -left-4 md:-left-8`}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Next page"
        onClick={onNext}
        disabled={!canNext || disabled}
        className={`${base} -right-4 md:-right-8`}
      >
        <ChevronRight size={22} />
      </button>
    </>
  );
}
```

- [ ] **Step 9.2: Create `PageIndicator.tsx`**

```tsx
'use client';

interface Props {
  count: number;
  index: number;
  onJump: (i: number) => void;
}

export default function PageIndicator({ count, index, onJump }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6" role="tablist" aria-label="Passport pages">
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
  );
}
```

- [ ] **Step 9.3: Verify**

Run: `npm run lint`. Expected: pass.

- [ ] **Step 9.4: Commit**

```bash
git add components/passport/NavChevrons.tsx components/passport/PageIndicator.tsx
git commit -m "feat(passport): add nav chevrons and page indicator"
```

---

## Task 10 — `BookletShell` and `PassportBooklet` (the root)

**Files:**
- Create: `components/passport/BookletShell.tsx`
- Create: `components/passport/PassportBooklet.tsx`

**Why:** Compose everything. `BookletShell` gives the booklet its physical frame (aspect ratio, shadow, rounded corners); `PassportBooklet` wires state, animation, and modal together.

- [ ] **Step 10.1: Create `BookletShell.tsx`**

```tsx
'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Gives the booklet its outer physical frame (shadow, rounding, aspect).
 * Size is driven by viewport; child pages assume 100% width/height.
 */
export default function BookletShell({ children }: Props) {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(60,30,15,0.5)]"
        style={{ aspectRatio: '3/2' }}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 10.2: Create `PassportBooklet.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import type { Recipe } from '@/lib/types';
import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';

import BookletShell from './BookletShell';
import PaperTexture from './PaperTexture';
import Spread from './Spread';
import CoverPage from './CoverPage';
import InsideFrontSpread from './InsideFrontSpread';
import SubRegionSpread from './SubRegionSpread';
import BackCoverSpread from './BackCoverSpread';
import NavChevrons from './NavChevrons';
import PageIndicator from './PageIndicator';
import StampedRecipesModal from './StampedRecipesModal';
import { usePassportPages, type PageDescriptor } from './hooks/usePassportPages';
import { useBookletNav } from './hooks/useBookletNav';

export default function PassportBooklet() {
  const router = useRouter();
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { summary, isLoading: stampsLoading } = useCookedStamps();
  const reduced = useReducedMotion();

  const pages = usePassportPages({ recipes, summary });
  const nav = useBookletNav(pages);
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

  const currentPage = pages[nav.index];
  const onCooked = (country: string) => setModalCountry(country);
  const onUncooked = (country: string) => {
    router.push(`/recipes?country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="relative">
      <PaperTexture />
      <div {...nav.bindSwipe}>
        <BookletShell>
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
                duration: reduced ? 0.2 : (currentPage?.kind === 'cover' ? 0.9 : 0.6),
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: nav.direction === 1 ? 'left center' : 'right center',
                perspective: 2000,
              }}
            >
              {renderPage(currentPage, {
                summary,
                pages,
                recipesByCountry,
                onCooked,
                onUncooked,
                onJump: nav.jumpTo,
              })}
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

      <PageIndicator count={pages.length} index={nav.index} onJump={nav.jumpTo} />

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

interface RenderCtx {
  summary: PassportSummary;
  pages: PageDescriptor[];
  recipesByCountry: Map<string, Recipe[]>;
  onCooked: (country: string) => void;
  onUncooked: (country: string) => void;
  onJump: (i: number) => void;
}

function renderPage(page: PageDescriptor | undefined, ctx: RenderCtx) {
  if (!page) return null;
  switch (page.kind) {
    case 'cover':
      return <CoverPage summary={ctx.summary} />;
    case 'inside-front':
      return (
        <Spread>
          <InsideFrontSpread
            summary={ctx.summary}
            pages={ctx.pages}
            stampsPerCountry={ctx.summary.stampsPerCountry}
            onJumpToSubRegion={ctx.onJump}
          />
        </Spread>
      );
    case 'sub-region':
      return (
        <Spread withSpine={false}>
          <SubRegionSpread
            subRegion={page.subRegion}
            countries={page.countries}
            stampsPerCountry={ctx.summary.stampsPerCountry}
            recipesByCountry={ctx.recipesByCountry}
            onCookedClick={ctx.onCooked}
            onUncookedClick={ctx.onUncooked}
          />
        </Spread>
      );
    case 'back-cover':
      return (
        <Spread>
          <BackCoverSpread summary={ctx.summary} />
        </Spread>
      );
  }
}
```

Note: `InsideFrontSpread` and `BackCoverSpread` use their own internal `grid md:grid-cols-2`, which stacks vertically on mobile — this is the accepted mobile behaviour (see "Deviation from spec" below). `SubRegionSpread` is a single header + stamp grid (no inner two-column), so it gets `withSpine={false}` to avoid a spine cutting through its grid.

**Deviation from spec (Q6):** The spec called for true single-page mode on mobile, with chevrons flipping half-spreads. We're shipping stacked mobile instead: on mobile each spread component stacks its two halves vertically and the chevrons still flip whole spreads. Reason: true single-page mode would require doubling the page count on mobile (every desktop spread = two mobile pages), threading that into `usePassportPages`/`useBookletNav`, and reworking deep-link slugs per half. The pragmatic stacked version still kills the spine, still fits, and preserves the booklet feel. Flag this for the user during Task 13 verification; if they push back, we add the half-spread logic as a follow-up.

- [ ] **Step 10.3: Verify**

Run: `npm run lint` and `npm run build`. Expected: both pass.

- [ ] **Step 10.4: Commit**

```bash
git add components/passport/BookletShell.tsx components/passport/PassportBooklet.tsx
git commit -m "feat(passport): wire PassportBooklet root with flip + modal"
```

---

## Task 11 — Wire up `/passport` page and delete legacy components

**Files:**
- Modify: `app/passport/page.tsx`
- Delete: `components/PassportCover.tsx`
- Delete: `components/PassportRegionSection.tsx`
- Delete: `components/CountryStamp.tsx`
- Delete: `components/PassportRecipeCard.tsx`

- [ ] **Step 11.1: Replace `app/passport/page.tsx`**

Overwrite with:

```tsx
'use client';

import PassportBooklet from '@/components/passport/PassportBooklet';

export default function PassportPage() {
  return (
    <main className="min-h-screen bg-parchment py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <PassportBooklet />
      </div>
    </main>
  );
}
```

- [ ] **Step 11.2: Delete legacy components**

```bash
rm components/PassportCover.tsx components/PassportRegionSection.tsx components/CountryStamp.tsx components/PassportRecipeCard.tsx
```

- [ ] **Step 11.3: Verify no stray imports**

Run:
```bash
npx --no-install eslint components app --max-warnings=0 2>&1 | head -50
```
If any error references the deleted components, fix the importing file.

Also run:
```bash
npm run build
```
Expected: passes.

- [ ] **Step 11.4: Manual smoke check**

```bash
npm run dev
```
Open `http://localhost:3000/passport`. Confirm:
- Cover renders; "Culinary Passport" visible.
- Click right chevron → flips to inside-front spread with stats + TOC.
- Clicking a TOC entry jumps to that sub-region spread.
- Left chevron flips back; first-page chevron is disabled.
- Keyboard `←`/`→` also flip.

- [ ] **Step 11.5: Commit**

```bash
git add app/passport/page.tsx components/PassportCover.tsx components/PassportRegionSection.tsx components/CountryStamp.tsx components/PassportRecipeCard.tsx
git commit -m "feat(passport): replace legacy passport with booklet, delete old components"
```

---

## Task 12 — `/recipes` URL-driven filter hydration

**Files:**
- Modify: `app/recipes/page.tsx`

**Why:** Uncooked-stamp click deep-links to `/recipes?country=X`; the page must read that param and pre-set the filter.

- [ ] **Step 12.1: Modify `app/recipes/page.tsx`**

Replace the content with:

```tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import FilterPanel from '@/components/FilterPanel';
import { useRecipes } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS } from '@/lib/filters';
import type { Filters, Recipe } from '@/lib/types';

export default function RecipesPage() {
  const { data: recipes = [], isLoading } = useRecipes();
  const [favorites] = useFavorites();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Seed filters from URL once recipes have loaded (need recipes to resolve a
  // country string into its region, since the Filters type stores regions, not
  // countries). If we don't yet know the recipe's region for that country, we
  // skip the hydration silently.
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    if (recipes.length === 0) return;
    const country = params.get('country');
    if (country) {
      const match = recipes.find(r => r.country === country);
      if (match) {
        setFilters(prev => ({ ...prev, regions: [match.region] }));
      }
    }
    setHydrated(true);
  }, [recipes, params, hydrated]);

  const filteredRecipes = useMemo(() => {
    const country = params.get('country');
    const base = applyFilters(recipes, filters);
    return country ? base.filter(r => r.country === country) : base;
  }, [recipes, filters, params]);

  const activeFilterCount = useMemo(() => {
    const country = params.get('country');
    return countActiveFilters(filters) + (country ? 1 : 0);
  }, [filters, params]);

  const clearCountry = () => {
    const next = new URLSearchParams(params.toString());
    next.delete('country');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const activeCountry = params.get('country');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brown-dark mb-2">All Recipes</h1>
        <p className="text-brown-medium text-sm">
          {isLoading ? 'Loading…' : (
            <>
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              {activeCountry && (
                <>
                  {' '}in <span className="text-terracotta font-medium">{activeCountry}</span>
                  {' '}
                  <button
                    type="button"
                    onClick={clearCountry}
                    className="underline text-brown-medium hover:text-brown-dark"
                  >
                    clear
                  </button>
                </>
              )}
              {activeFilterCount > 0 && !activeCountry && (
                <span className="text-terracotta">
                  {' '}({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {!isLoading && filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown-medium text-lg mb-2">No recipes match your filters</p>
          <p className="text-brown-light text-sm">Try adjusting your filters to discover more dishes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.has(recipe.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
```

- [ ] **Step 12.2: Verify**

Run `npm run lint` and `npm run build`. Expected: both pass.

Manual smoke:
```bash
npm run dev
```
- Open `http://localhost:3000/recipes?country=Japan` — confirm only Japanese recipes render and a "clear" link appears.
- Click "clear" — URL loses the param, full list returns.
- From `/passport`, click any uncooked country stamp — confirm it lands on `/recipes?country=<that country>` with the country filter applied.
- Browser back from `/recipes` → returns to the same passport spread.

- [ ] **Step 12.3: Commit**

```bash
git add app/recipes/page.tsx
git commit -m "feat(recipes): hydrate country filter from ?country= URL param"
```

---

## Task 13 — Final integration pass: manual verification checklist

**Files:** None modified (this task is verification only).

- [ ] **Step 13.1: Full build + lint**

```bash
npm run lint
npm run build
```
Both must pass.

- [ ] **Step 13.2: Walk the spec's verification checklist**

Run `npm run dev` and confirm each item from `docs/superpowers/specs/2026-04-18-passport-booklet-redesign-design.md` "Verification" section:

- `/passport` renders cover; forward flip opens inside-front spread.
- Inside-front stats match `useCookedStamps().summary`; TOC lists only visible sub-regions and jumps on click.
- Each sub-region spread shows correct countries per `COUNTRY_TO_SUBREGION`; cooked slots are ink-stamped with date; uncooked are dashed placeholders.
- Empty-parent-region sub-regions hidden — verify by checking that if no Oceania recipes exist in the DB, no Oceania spread appears.
- Cooked-stamp click opens modal; each recipe link navigates to `/recipes/[slug]`.
- Uncooked-stamp click navigates to `/recipes?country=X` with the filter applied.
- Chevrons disable at ends; `←`/`→` flip; horizontal swipe flips on mobile; page indicator jumps.
- Deep link `/passport?spread=east-asia` opens that spread directly.
- URL updates on flip without polluting history (back button should skip back out of `/passport` eventually, not page-by-page).
- Mobile ≤768px (use DevTools responsive mode at 390px): single-page mode, no spine visible, flips show one half at a time.
- Toggle "Emulate prefers-reduced-motion: reduce" in DevTools → confirm flips become opacity fades with no rotate.
- Zero-stamps state (sign out of Supabase so `passport_stamps` returns empty): full booklet renders; all slots placeholders; inside-front shows zeros.
- Visual sanity at 1440, 1024, 768, 390 widths — no overflow or overlap.

- [ ] **Step 13.3: If any check fails**

File the failing item as a follow-up commit. If it requires structural change (e.g. spread layout breaks at 768px), fix inline and commit with an explanatory message.

- [ ] **Step 13.4: Final commit (if any post-verification tweaks)**

```bash
git add <whatever you touched>
git commit -m "fix(passport): <specific thing>"
```

No commit needed if all checks pass on the first run.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-18-passport-booklet-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
