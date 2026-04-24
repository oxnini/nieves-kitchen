# Map Navigation & UI Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the world map with continent-only outlines at macro zoom, explicit region boundary overlays at meso zoom, continent-level hover highlighting, smooth animated zoom transitions, and proper Central Asian country classification.

**Architecture:** The existing `WorldMap.tsx` uses react-simple-maps v3 with a three-level drill-down (continent -> region -> country). We add a `useMapTopology` hook that fetches the TopoJSON data, merges country geometries into continent and region shapes via `topojson-client`, and provides a `geoPath` generator for rendering overlays. The map's stroke behavior becomes zoom-dependent (hidden at continent level, subtle at region level, normal at country level). Hover at continent level highlights all countries in the continent. Programmatic zoom uses `requestAnimationFrame` with cubic easing for smooth ~700ms transitions.

**Tech Stack:** Next.js 15, react-simple-maps v3, topojson-client (transitive dep), d3-geo (transitive dep), TypeScript

---

### Task 1: Add Central Asian country ISO codes to region mapping

**Files:**
- Modify: `lib/regions.ts:7-78` (COUNTRY_TO_REGION)

Central Asian countries (Kazakhstan 398, Uzbekistan 860, Turkmenistan 795, Kyrgyzstan 417, Tajikistan 762) are missing from `COUNTRY_TO_REGION`. They should be mapped to `'Middle East'` — the closest existing `CulinaryRegion` by culinary tradition (shared pilaf/plov, kebab, flatbread traditions with Iran/Turkey). This places them under Asia in `REGION_TO_CONTINENT`.

- [ ] **Step 1: Add Central Asian ISO codes**

In `lib/regions.ts`, add a Central Asia block inside `COUNTRY_TO_REGION` after the Middle East section (after line 44):

```typescript
  // Central Asia (mapped to Middle East — closest culinary fit)
  '398': 'Middle East', '860': 'Middle East', '795': 'Middle East',
  '417': 'Middle East', '762': 'Middle East',
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`

Open the map, zoom into Asia. Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, and Tajikistan should now be colored with the same choropleth tint as other Asian countries. They should no longer appear as the light gray "empty" color.

- [ ] **Step 3: Commit**

```bash
git add lib/regions.ts
git commit -m "fix: add Central Asian countries to COUNTRY_TO_REGION mapping"
```

---

### Task 2: Install type declarations for topology processing

**Files:**
- Modify: `package.json`

`topojson-client` and `d3-geo` are already installed as transitive dependencies of `react-simple-maps`. We need their TypeScript type declarations as direct dev dependencies.

- [ ] **Step 1: Install type packages**

```bash
npm install -D @types/topojson-client @types/d3-geo
```

- [ ] **Step 2: Verify types resolve**

Create a quick check (don't commit this — just verify):
```bash
npx tsc --noEmit 2>&1 | head -20
```

No new type errors related to topojson or d3-geo should appear.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add topojson-client and d3-geo type declarations"
```

---

### Task 3: Create useMapTopology hook

**Files:**
- Create: `hooks/useMapTopology.ts`

This hook fetches the TopoJSON data from the CDN, then uses `topojson.merge()` to compute merged continent and region GeoJSON geometries. It also creates a `d3-geo` path generator matching `ComposableMap`'s projection for rendering overlays.

- [ ] **Step 1: Create the hook file**

Create `hooks/useMapTopology.ts`:

```typescript
import { useState, useEffect, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { MultiPolygon, Polygon } from 'geojson';
import { COUNTRY_TO_REGION } from '@/lib/regions';
import type { CulinaryRegion } from '@/lib/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/** Continent assignment from COUNTRY_TO_REGION + REGION_TO_CONTINENT */
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
};

function getContinentForIso(id: string): string | null {
  const region = COUNTRY_TO_REGION[id];
  if (!region) return null;
  return REGION_TO_CONTINENT[region] ?? null;
}

export interface MergedOutline {
  key: string;
  path: string;
}

export interface MapTopologyData {
  /** Raw topology for passing to <Geographies geography={topology}> */
  topology: Topology | null;
  /** Merged continent outlines with pre-computed SVG path strings */
  continentOutlines: MergedOutline[];
  /** Merged region outlines with pre-computed SVG path strings */
  regionOutlines: MergedOutline[];
  /** Whether data is still loading */
  isLoading: boolean;
}

/**
 * Projection matching ComposableMap defaults:
 * projection="geoMercator", projectionConfig={{ scale: 160 }}, width=800, height=450
 */
const projection = geoMercator().scale(160).translate([400, 225]);
const pathGenerator = geoPath(projection);

export function useMapTopology(): MapTopologyData {
  const [topology, setTopology] = useState<Topology | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then(r => r.json())
      .then((topo: Topology) => {
        if (!cancelled) {
          setTopology(topo);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const continentOutlines = useMemo(() => {
    if (!topology) return [];
    const countries = (topology.objects.countries as GeometryCollection).geometries;

    // Group geometries by continent
    const groups = new Map<string, typeof countries>();
    for (const geo of countries) {
      const continent = getContinentForIso(geo.id as string);
      if (!continent) continue;
      const list = groups.get(continent) ?? [];
      list.push(geo);
      groups.set(continent, list);
    }

    // Merge each group into a single outline
    const outlines: MergedOutline[] = [];
    for (const [continent, geos] of groups.entries()) {
      const merged = topojson.merge(
        topology,
        geos as Array<Polygon | MultiPolygon>,
      );
      const d = pathGenerator(merged);
      if (d) outlines.push({ key: continent, path: d });
    }
    return outlines;
  }, [topology]);

  const regionOutlines = useMemo(() => {
    if (!topology) return [];
    const countries = (topology.objects.countries as GeometryCollection).geometries;

    // Group geometries by CulinaryRegion
    const groups = new Map<CulinaryRegion, typeof countries>();
    for (const geo of countries) {
      const region = COUNTRY_TO_REGION[geo.id as string];
      if (!region) continue;
      const list = groups.get(region) ?? [];
      list.push(geo);
      groups.set(region, list);
    }

    const outlines: MergedOutline[] = [];
    for (const [region, geos] of groups.entries()) {
      const merged = topojson.merge(
        topology,
        geos as Array<Polygon | MultiPolygon>,
      );
      const d = pathGenerator(merged);
      if (d) outlines.push({ key: region, path: d });
    }
    return outlines;
  }, [topology]);

  return { topology, continentOutlines, regionOutlines, isLoading };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit hooks/useMapTopology.ts 2>&1 | head -20
```

Fix any type errors. The `topojson.merge()` signature expects `(topology, objects)` where objects are geometry objects from the topology. The cast to `Array<Polygon | MultiPolygon>` may need adjustment depending on the exact types — if it fails, use `as any` for the second argument (topojson-client's types are sometimes loose).

- [ ] **Step 3: Commit**

```bash
git add hooks/useMapTopology.ts
git commit -m "feat: add useMapTopology hook for merged continent/region outlines"
```

---

### Task 4: Refactor WorldMap — topology integration, zoom-dependent strokes, continent hover

**Files:**
- Modify: `components/WorldMap.tsx`

This is the core task. We modify WorldMap to:
1. Use `useMapTopology` for data loading (pass topology to `Geographies` to avoid duplicate fetch)
2. Hide country strokes at continent zoom (only continent outlines visible)
3. Show subtle country strokes + explicit region outlines at region zoom
4. Highlight entire continent on hover at continent zoom level
5. Animate zoom transitions smoothly

- [ ] **Step 1: Add imports and new state**

At the top of `WorldMap.tsx`, add these imports:

```typescript
import { useMapTopology } from '@/hooks/useMapTopology';
```

- [ ] **Step 2: Integrate topology data and remove GEO_URL usage from Geographies**

Inside the component, after the existing hooks, add:

```typescript
const { topology, continentOutlines, regionOutlines } = useMapTopology();
```

Change the `<Geographies>` component to use the loaded topology instead of the URL. Replace:
```typescript
<Geographies geography={GEO_URL}>
```
with:
```typescript
<Geographies geography={topology ?? GEO_URL}>
```

This uses the pre-loaded topology when available (avoiding a duplicate fetch), and falls back to the URL while loading.

- [ ] **Step 3: Add continent-level hover state**

Add a new state variable next to `hoveredCountry`:

```typescript
const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
```

- [ ] **Step 4: Modify Geography stroke based on zoom level**

Replace the current `strokeWidth={0.6}` on Geography with a dynamic value. Create a helper above the return statement:

```typescript
/** At continent zoom: hide internal borders. At region zoom: subtle. At country zoom: normal. */
const geoStrokeWidth = zoom < ZOOM.CONTINENT_GONE ? 0 : zoom < ZOOM.REGION_GONE ? 0.35 : 0.6;
```

Update the `<Geography>` component:
```typescript
<Geography
  key={geo.rsmKey}
  geography={geo}
  fill={/* see step 5 */}
  stroke={geoStrokeWidth > 0 ? SVG_COLORS.stroke : 'transparent'}
  strokeWidth={geoStrokeWidth}
  style={{
    default: { outline: 'none', transition: 'fill 0.2s' },
    hover:   { outline: 'none', cursor: 'pointer' },
    pressed: { outline: 'none' },
  }}
  onMouseEnter={() => {
    setHoveredCountry(geo.properties.name);
    if (zoom < ZOOM.CONTINENT_GONE) {
      const iso = (geo.id as string) ?? '';
      setHoveredContinent(getContinent(iso));
    } else {
      setHoveredContinent(null);
    }
  }}
  onMouseLeave={() => {
    setHoveredCountry(null);
    setHoveredContinent(null);
  }}
  onClick={() => handleGeographyClick(geo)}
/>
```

- [ ] **Step 5: Update fill logic for continent-level hover**

Replace the existing fill expression in the Geography component:
```typescript
fill={hoveredCountry === geo.properties.name ? SVG_COLORS.hoverFill : getFill(geo)}
```

with:
```typescript
fill={
  // Continent-level hover: highlight entire continent
  (hoveredContinent && zoom < ZOOM.CONTINENT_GONE && getContinent((geo.id as string) ?? '') === hoveredContinent)
    ? SVG_COLORS.hoverFill
    // Country-level hover: highlight individual country
    : hoveredCountry === geo.properties.name
      ? SVG_COLORS.hoverFill
      : getFill(geo)
}
```

- [ ] **Step 6: Add continent outline overlay paths**

After the `</Geographies>` closing tag but still inside `<ZoomableGroup>`, add the continent outline layer:

```typescript
{/* Continent outlines — visible at continent zoom, hidden at region+ */}
{continentOutlines.map(({ key, path }) => {
  const opacity = crossfadeOpacity(zoom, 0.5, ZOOM.CONTINENT_FULL, ZOOM.CONTINENT_FADE, ZOOM.CONTINENT_GONE);
  if (opacity <= 0) return null;
  return (
    <path
      key={`continent-${key}`}
      d={path}
      fill="none"
      stroke={SVG_COLORS.brownMedium}
      strokeWidth={1.2 / zoom}
      strokeLinejoin="round"
      opacity={opacity}
      pointerEvents="none"
    />
  );
})}
```

- [ ] **Step 7: Add region outline overlay paths**

After the continent outlines, add the region outline layer:

```typescript
{/* Region outlines — visible at region zoom */}
{regionOutlines.map(({ key, path }) => {
  const opacity = crossfadeOpacity(zoom, ZOOM.REGION_FADE_IN, ZOOM.REGION_FULL, ZOOM.REGION_FADE_OUT, ZOOM.COUNTRY_FULL);
  if (opacity <= 0) return null;
  return (
    <path
      key={`region-${key}`}
      d={path}
      fill="none"
      stroke={SVG_COLORS.brownMedium}
      strokeWidth={1 / zoom}
      strokeLinejoin="round"
      opacity={opacity * 0.7}
      pointerEvents="none"
    />
  );
})}
```

- [ ] **Step 8: Verify visually — outlines and hover**

Run: `npm run dev`

Check:
- At world zoom (zoom ~1): no country borders visible, continent shapes are solid blocks of color, continent outlines visible as thin brown strokes. Hovering a country highlights the entire continent.
- Zoom into a continent (zoom ~2.5-3.5): region outlines appear as subtle brown strokes around each culinary region group. Individual country borders become faintly visible.
- Zoom into a region (zoom ~4+): normal country borders, region outlines fade out.

- [ ] **Step 9: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat: zoom-dependent strokes, continent/region outlines, continent hover"
```

---

### Task 5: Implement smooth animated zoom transitions

**Files:**
- Modify: `components/WorldMap.tsx`

Replace the instant `zoomTo()` function with an animated version using `requestAnimationFrame` and cubic easing. All programmatic zooms (continent click, region click, country click, breadcrumb navigation, reset) use this for smooth ~700ms transitions.

- [ ] **Step 1: Add easing function and animation refs**

Add this helper near the top of the file (after the existing helpers, before the component):

```typescript
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const ZOOM_ANIMATION_DURATION = 700; // ms
```

Inside the component, add animation refs after the existing refs:

```typescript
const animFrameRef = useRef<number | null>(null);
const isAnimatingRef = useRef(false);
```

- [ ] **Step 2: Replace zoomTo with animated version**

Replace the existing `zoomTo` function:

```typescript
function zoomTo(pos: Position) {
  liveCenterRef.current = pos.coordinates;
  liveZoomRef.current = pos.zoom;
  setControlledPos(pos);
}
```

with:

```typescript
function zoomTo(target: Position) {
  // Cancel any running animation
  if (animFrameRef.current) {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;
  }

  const startCenter: [number, number] = [...liveCenterRef.current];
  const startZoom = liveZoomRef.current;
  const startTime = performance.now();

  isAnimatingRef.current = true;

  function tick(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / ZOOM_ANIMATION_DURATION, 1);
    const e = easeInOutCubic(t);

    const pos: Position = {
      coordinates: [
        startCenter[0] + (target.coordinates[0] - startCenter[0]) * e,
        startCenter[1] + (target.coordinates[1] - startCenter[1]) * e,
      ],
      zoom: startZoom + (target.zoom - startZoom) * e,
    };

    liveCenterRef.current = pos.coordinates;
    liveZoomRef.current = pos.zoom;
    setControlledPos(pos);

    if (t < 1) {
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      animFrameRef.current = null;
      isAnimatingRef.current = false;
    }
  }

  animFrameRef.current = requestAnimationFrame(tick);
}
```

- [ ] **Step 3: Guard handleMoveEnd during animation**

Modify `handleMoveEnd` to skip during programmatic animation (prevents d3-zoom from fighting the animation):

```typescript
const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
  if (isAnimatingRef.current) return; // Don't override during animation
  liveCenterRef.current = coordinates;
  liveZoomRef.current = z;
  setControlledPos({ coordinates, zoom: z });
}, []);
```

- [ ] **Step 4: Cancel animation on user gesture**

Modify `handleMove` to cancel animation if the user starts scrolling/dragging:

```typescript
const handleMove = useCallback(({ zoom: z }: { x: number; y: number; zoom: number }) => {
  // Cancel programmatic animation on user interaction
  if (isAnimatingRef.current && animFrameRef.current) {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;
    isAnimatingRef.current = false;
  }
  liveZoomRef.current = z;
  const now = performance.now();
  if (now - throttleRef.current < 50) return;
  throttleRef.current = now;
  rerender();
}, [rerender]);
```

- [ ] **Step 5: Clean up animation on unmount**

Add cleanup effect in the component:

```typescript
useEffect(() => {
  return () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };
}, []);
```

- [ ] **Step 6: Verify smooth transitions**

Run: `npm run dev`

Test each transition path:
1. Click a continent label → smooth zoom from world to continent level
2. Click a region label → smooth zoom from continent to region level
3. Click a country marker → smooth zoom to country
4. Click "World" breadcrumb → smooth zoom out to world view
5. Click continent name in breadcrumb → smooth zoom out to continent level
6. Click region name in breadcrumb → smooth zoom to region level
7. Scroll wheel during animation → animation cancels cleanly, manual zoom takes over

Each transition should take ~700ms with a smooth ease-in-out curve — no jumps or snaps.

- [ ] **Step 7: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat: smooth animated zoom transitions for all map navigation"
```

---

### Task 6: Final integration testing and polish

**Files:** None (testing only)

- [ ] **Step 1: End-to-end flow test**

Test the complete flow on `npm run dev`:

1. **World view**: Only continent shapes visible (no country borders). Continent labels visible. Hovering a country highlights the entire continent in sage green.
2. **Click "Africa"**: Smooth 700ms zoom to Africa. Region labels appear (North Africa, Sub-Saharan Africa). Subtle region outlines visible. Country borders appear faintly.
3. **Click "Sub-Saharan Africa"**: Smooth zoom to sub-Saharan region. Country markers and borders visible. Region outline fades out.
4. **Click country marker (e.g. Kenya)**: Sidebar opens. Smooth zoom to country.
5. **Breadcrumb "Africa"**: Smooth zoom back to Africa continent level. Sidebar closes.
6. **Breadcrumb "World"**: Smooth zoom back to world view. Continent outlines re-appear.
7. **Central Asia**: Zoom to Asia. Kazakhstan and neighbors are colored teal, matching other Asian countries.

- [ ] **Step 2: Sepia theme test**

Toggle to sepia theme. Verify:
- Continent/region outlines render with appropriate contrast
- Hover highlighting works in sepia mode
- Choropleth colors look correct for Central Asian countries

- [ ] **Step 3: Mobile test**

Open in mobile viewport (DevTools device mode):
- Breadcrumb at bottom of screen still works
- Touch gestures still work (pinch zoom, pan)
- Tap feedback still shows
- Smooth transitions work on tap

- [ ] **Step 4: Run build check**

```bash
npm run build
```

Ensure no build errors. Check for any TypeScript or lint warnings related to the changed files.

- [ ] **Step 5: Final commit if any polish needed**

```bash
git add -u
git commit -m "fix: polish map navigation after integration testing"
```
