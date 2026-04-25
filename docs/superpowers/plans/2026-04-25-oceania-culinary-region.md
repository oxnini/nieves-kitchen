# Oceania as a Standalone CulinaryRegion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate Oceania from Southeast Asia into its own `CulinaryRegion` so the map, choropleth, filter panel, and passport all treat it as a distinct region with its own continent.

**Architecture:** Add `'Oceania'` to the `CulinaryRegion` union type and all downstream mappings (country codes, region centers, continent lookups, filter lists). Oceania countries (Australia `036`, New Zealand `554`, Papua New Guinea `598`, Fiji `242`, Vanuatu `548`, New Caledonia `540`, Solomon Islands `090`) move from the `'Southeast Asia'` bucket to `'Oceania'`. The `REGION_TO_CONTINENT` maps in both `WorldMap.tsx` and `useMapTopology.ts` gain an `'Oceania': 'Oceania'` entry so the merged continent outline and hit area work correctly.

**Tech Stack:** TypeScript types, plain object mappings — no new dependencies.

---

### Task 1: Add `'Oceania'` to the type system

**Files:**
- Modify: `lib/types.ts:50-75`

- [ ] **Step 1: Add `'Oceania'` to the `CulinaryRegion` union**

```ts
export type CulinaryRegion =
  | 'Western Europe'
  | 'Eastern Europe'
  | 'East Asia'
  | 'Southeast Asia'
  | 'South Asia'
  | 'Middle East'
  | 'North Africa'
  | 'Sub-Saharan Africa'
  | 'North America'
  | 'South America'
  | 'Oceania';
```

- [ ] **Step 2: Add `'Oceania'` to `CULINARY_REGION_ORDER`**

```ts
export const CULINARY_REGION_ORDER: CulinaryRegion[] = [
  'Western Europe',
  'Eastern Europe',
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Middle East',
  'North Africa',
  'Sub-Saharan Africa',
  'North America',
  'South America',
  'Oceania',
];
```

- [ ] **Step 3: Run `npm run build` to confirm no type errors**

Expected: Build succeeds. Any file that exhaustively switches on `CulinaryRegion` will fail here, telling us if we missed something.

---

### Task 2: Move Oceania country codes and add region centers

**Files:**
- Modify: `lib/regions.ts:14-99` (COUNTRY_TO_REGION)
- Modify: `lib/regions.ts:101-112` (REGION_CENTERS)
- Modify: `lib/regions.ts:114-125` (REGION_LABEL_POSITIONS)
- Modify: `lib/regions.ts:215-235` (SUB_REGION_PARENT)

- [ ] **Step 1: Move Oceania country codes from Southeast Asia to Oceania**

In `COUNTRY_TO_REGION`, remove these lines from the `// Oceania (mapped to Southeast Asia)` block:

```ts
  // Oceania (mapped to Southeast Asia — closest existing CulinaryRegion)
  '036': 'Southeast Asia', '554': 'Southeast Asia', // Australia, New Zealand
  '598': 'Southeast Asia', '242': 'Southeast Asia', // Papua New Guinea, Fiji
  '548': 'Southeast Asia', '540': 'Southeast Asia', // Vanuatu, New Caledonia
  '090': 'Southeast Asia', // Solomon Islands
```

And add a new Oceania block:

```ts
  // Oceania
  '036': 'Oceania', '554': 'Oceania', // Australia, New Zealand
  '598': 'Oceania', '242': 'Oceania', // Papua New Guinea, Fiji
  '548': 'Oceania', '540': 'Oceania', // Vanuatu, New Caledonia
  '090': 'Oceania', // Solomon Islands
```

- [ ] **Step 2: Add Oceania to `REGION_CENTERS`**

```ts
  'Oceania':              { center: [145, -25], zoom: 3.5 },
```

- [ ] **Step 3: Add Oceania to `REGION_LABEL_POSITIONS`**

```ts
  'Oceania':              [145, -25],
```

- [ ] **Step 4: Update `SUB_REGION_PARENT` to map `'Oceania'` sub-region to `'Oceania'` parent**

Change:

```ts
  'Oceania':                      'South America',
```

To:

```ts
  'Oceania':                      'Oceania',
```

- [ ] **Step 5: Run `npm run build` to confirm no type errors**

---

### Task 3: Update `REGION_TO_CONTINENT` in WorldMap and useMapTopology

**Files:**
- Modify: `components/WorldMap.tsx:80-91` (REGION_TO_CONTINENT)
- Modify: `hooks/useMapTopology.ts:11-22` (REGION_TO_CONTINENT)

- [ ] **Step 1: Add Oceania to `REGION_TO_CONTINENT` in `WorldMap.tsx`**

```ts
const REGION_TO_CONTINENT: Record<CulinaryRegion, string> = {
  'Western Europe':       'Europe',
  'Eastern Europe':       'Europe',
  'East Asia':            'Asia',
  'Southeast Asia':       'Asia',
  'South Asia':           'Asia',
  'Middle East':          'Asia',
  'North Africa':         'Africa',
  'Sub-Saharan Africa':   'Africa',
  'North America':        'North America',
  'South America':        'South America',
  'Oceania':              'Oceania',
};
```

- [ ] **Step 2: Add Oceania to `REGION_TO_CONTINENT` in `useMapTopology.ts`**

```ts
const REGION_TO_CONTINENT: Record<string, string> = {
  'Western Europe': 'Europe',
  'Eastern Europe': 'Europe',
  'East Asia': 'Asia',
  'Southeast Asia': 'Asia',
  'South Asia': 'Asia',
  'Middle East': 'Asia',
  'North Africa': 'Africa',
  'Sub-Saharan Africa': 'Africa',
  'North America': 'North America',
  'South America': 'South America',
  'Oceania': 'Oceania',
};
```

- [ ] **Step 3: Run `npm run build`**

Expected: Build succeeds. The `REGION_TO_CONTINENT` in `WorldMap.tsx` is typed as `Record<CulinaryRegion, string>`, so it will fail if `'Oceania'` is missing.

---

### Task 4: Add Oceania to the filter panel

**Files:**
- Modify: `components/FilterPanel.tsx:26-29`

- [ ] **Step 1: Add `'Oceania'` to the `REGIONS` array**

```ts
const REGIONS: CulinaryRegion[] = [
  'Western Europe', 'Eastern Europe', 'East Asia', 'Southeast Asia',
  'South Asia', 'Middle East', 'North Africa', 'Sub-Saharan Africa',
  'North America', 'South America', 'Oceania',
];
```

---

### Task 5: Build and verify

- [ ] **Step 1: Run `npm run build`**

Expected: Clean build, no type errors.

- [ ] **Step 2: Run `npm run dev` and verify in browser**

Check:
- World map: hover over Australia — Oceania continent highlights separately from Asia
- Choropleth: Oceania shows its own (empty/low) density, not Southeast Asia's
- Filter panel: "Oceania" appears as a region filter option
- Zoom into Oceania: region label shows "Oceania" with correct count

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/regions.ts components/WorldMap.tsx hooks/useMapTopology.ts components/FilterPanel.tsx
git commit -m "feat: add Oceania as standalone CulinaryRegion, separate from Southeast Asia"
```
