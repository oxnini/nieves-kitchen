'use client';

import { useState, useMemo, useCallback, useRef, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ComposableMap, Geographies, Geography,
  Marker, ZoomableGroup, useMapContext,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Clock, ChefHat } from 'lucide-react';
import type { Recipe, CulinaryRegion } from '@/lib/types';
import ChoroplethLegend from './ChoroplethLegend';
import MapSearch from './MapSearch';
import {
  COUNTRY_TO_REGION, COUNTRY_NAME_TO_REGION, REGION_CENTERS, REGION_LABEL_POSITIONS,
  CHOROPLETH_BASE, CHOROPLETH_LIGHT, CHOROPLETH_EMPTY,
  SEPIA_CHOROPLETH_BASE, SEPIA_CHOROPLETH_LIGHT, SEPIA_CHOROPLETH_EMPTY,
} from '@/lib/regions';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { useMapTopology } from '@/hooks/useMapTopology';

const HIDDEN_COUNTRIES = new Set([
  'ATA', '010',                // Antarctica
  'SGS', '239',                // South Georgia & South Sandwich Islands
  'ATF', '260',                // French Southern Territories
  'HMD', '334',                // Heard Island & McDonald Islands
  'BVT', '074',                // Bouvet Island
  'FLK', '238',                // Falkland Islands
]);

/* ------------------------------------------------------------------ */
/*  Design tokens for SVG                                             */
/* ------------------------------------------------------------------ */
const SVG_COLORS = {
  parchment:  'var(--color-parchment)',
  brownDark:  'var(--color-brown-dark)',
  brownMedium:'var(--color-brown-medium)',
  terracotta: 'var(--color-terracotta)',
  stroke:     'var(--color-brown-light)',
  hoverFill:  'var(--color-sage)',
} as const;

const SVG_FONT_BODY    = 'var(--font-figtree), system-ui, sans-serif';
const SVG_FONT_DISPLAY = 'var(--font-literata), Georgia, serif';

/* ------------------------------------------------------------------ */
/*  Zoom thresholds — sequential, NO overlap between levels           */
/*  Continent ─fade─▶ gap ─fade─▶ Region ─fade─▶ gap ─fade─▶ Country */
/* ------------------------------------------------------------------ */
const ZOOM = {
  // Continent labels
  CONTINENT_FULL: 0.8,
  CONTINENT_FADE: 1.5,
  CONTINENT_GONE: 2.0,

  // Region labels — starts after continent is gone
  REGION_FADE_IN: 2.0,
  REGION_FULL:    2.5,
  REGION_FADE_OUT:3.5,
  REGION_GONE:    3.8,

  // Country markers — starts after region is gone
  COUNTRY_FADE_IN: 3.8,
  COUNTRY_FULL:    4.3,
} as const;

/* ------------------------------------------------------------------ */
/*  Continent definitions — Americas split into North & South         */
/* ------------------------------------------------------------------ */
const CONTINENTS = [
  { name: 'Europe',        position: [20, 50]    as [number, number], zoom: 2.8 },
  { name: 'Asia',          position: [80, 35]    as [number, number], zoom: 2.5 },
  { name: 'Africa',        position: [22, 7]     as [number, number], zoom: 2.8 },
  { name: 'North America', position: [-95, 45]   as [number, number], zoom: 2.8 },
  { name: 'South America', position: [-58, -15]  as [number, number], zoom: 2.8 },
  { name: 'Oceania',       position: [134, -26]  as [number, number], zoom: 3.5 },
];

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

/** Continents with only one CulinaryRegion — skip the redundant region label
 *  and zoom straight to country-marker level on click. */
const FLAT_CONTINENTS = new Set(
  Object.values(REGION_TO_CONTINENT)
    .filter(continent =>
      Object.values(REGION_TO_CONTINENT).filter(c => c === continent).length === 1,
    ),
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
interface Position { coordinates: [number, number]; zoom: number }

function getChoroplethColor(recipeCount: number, maxCount: number, isSepia: boolean): string {
  const base = isSepia ? SEPIA_CHOROPLETH_BASE : CHOROPLETH_BASE;
  const light = isSepia ? SEPIA_CHOROPLETH_LIGHT : CHOROPLETH_LIGHT;
  if (recipeCount === 0) return light;
  const t = recipeCount / maxCount;
  const maxIntensity = isSepia ? 0.55 : 0.65;
  const intensity = 0.35 + maxIntensity * t;
  const lightR = isSepia ? 58 : 235, lightG = isSepia ? 44 : 220, lightB = isSepia ? 34 : 205;
  const r = Math.round(base.r * intensity + lightR * (1 - intensity));
  const g = Math.round(base.g * intensity + lightG * (1 - intensity));
  const b = Math.round(base.b * intensity + lightB * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Parse "rgb(r, g, b)" or "#RRGGBB" → [r, g, b] */
function parseRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  const m = color.match(/(\d+)/g);
  return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0];
}

/** Linearly interpolate between two rgb() color strings */
function lerpColor(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const [ar, ag, ab] = parseRgb(a);
  const [br, bg, bb] = parseRgb(b);
  return `rgb(${Math.round(ar + (br - ar) * t)}, ${Math.round(ag + (bg - ag) * t)}, ${Math.round(ab + (bb - ab) * t)})`;
}

/** Compute choropleth blend factor for a transition band */
function blendFactor(zoom: number, start: number, end: number): number {
  if (zoom <= start) return 0;
  if (zoom >= end) return 1;
  return (zoom - start) / (end - start);
}

/** Derive continent from a country's ISO code */
/** Resolve CulinaryRegion from ISO code or country name (for disputed territories) */
function resolveRegion(isoCode: string, name?: string): CulinaryRegion | undefined {
  return COUNTRY_TO_REGION[isoCode] ?? (name ? COUNTRY_NAME_TO_REGION[name] : undefined);
}

function getContinent(isoCode: string, name?: string): string | null {
  const region = resolveRegion(isoCode, name);
  if (!region) return null;
  return REGION_TO_CONTINENT[region] ?? null;
}

/** Current choropleth level for legend labeling */
function getChoroplethLevel(zoom: number): 'continent' | 'region' | 'country' {
  if (zoom < ZOOM.CONTINENT_FADE) return 'continent';
  if (zoom < ZOOM.REGION_FADE_OUT) return 'region';
  return 'country';
}

/**
 * Sequential crossfade — ramps 0→1 between fadeIn…fullIn,
 * holds at 1 until fadeOut, then 1→0 by gone.
 * Infinity for fadeOut/gone = stays visible forever.
 */
function crossfadeOpacity(
  zoom: number,
  fadeIn: number,
  fullIn: number,
  fadeOut = Infinity,
  gone = Infinity,
): number {
  if (zoom < fadeIn || zoom > gone) return 0;
  if (zoom >= fullIn && zoom <= fadeOut) return 1;
  if (zoom < fullIn) return (zoom - fadeIn) / (fullIn - fadeIn);
  return 1 - (zoom - fadeOut) / (gone - fadeOut);
}

/** Approximate viewport bounds check */
function isInViewport(
  point: [number, number],
  center: [number, number],
  zoom: number,
): boolean {
  const halfW = 200 / zoom;
  const halfH = 120 / zoom;
  const dx = Math.abs(point[0] - center[0]);
  const dy = Math.abs(point[1] - center[1]);
  return Math.min(dx, 360 - dx) <= halfW && dy <= halfH;
}

/** Closest culinary region to a coordinate */
function findClosestRegion(coords: [number, number]): CulinaryRegion | null {
  let best: CulinaryRegion | null = null;
  let bestDist = Infinity;
  for (const [region, data] of Object.entries(REGION_CENTERS)) {
    const dx = coords[0] - data.center[0];
    const dy = coords[1] - data.center[1];
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) { bestDist = dist; best = region as CulinaryRegion; }
  }
  return best;
}

/** Closest continent to a coordinate */
function findClosestContinent(coords: [number, number]): typeof CONTINENTS[number] {
  let best = CONTINENTS[0];
  let bestDist = Infinity;
  for (const c of CONTINENTS) {
    const dx = coords[0] - c.position[0];
    const dy = coords[1] - c.position[1];
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** geoMercator config — viewBox is 2:1 (matches typical wide-screen aspect)
 *  and the projection is scaled so the projected world (full 360° longitude)
 *  is exactly the viewBox width. At zoom 1, lng=±180° lands flush against the
 *  left/right viewport edges with no horizontal gap. */
const VIEWBOX_WIDTH = 1600;
const VIEWBOX_HEIGHT = 800;
const PROJ_SCALE = VIEWBOX_WIDTH / (2 * Math.PI); // ≈ 254.65
const PROJ_CX = VIEWBOX_WIDTH / 2;                 // 800
const PROJ_CY = VIEWBOX_HEIGHT / 2;                // 400

/** Lowest zoom factor — allows ~15% zoom-out past world-fits-viewBox. */
const MIN_ZOOM = 0.85;
/** Default/reset zoom — slightly zoomed in so map edges aren't visible. */
const DEFAULT_ZOOM = 1.1;

/** SVG-coordinate bounding box used as d3-zoom's translateExtent. With Antarctica
 *  hidden and Greenland visible, content y spans roughly (-262 → 744). Padded so
 *  top/bottom overscroll is symmetric, and widened horizontally so the user can
 *  pan left/right at min zoom by at least the vertical amount. */
const WORLD_EXTENT: [[number, number], [number, number]] = [
  [-124, -459],
  [1724, 837],
];

/** Extra slack added to translateExtent so the user can drag past WORLD_EXTENT
 *  for a rubber-band overscroll effect. On pan-end we snap the map back to
 *  the WORLD_EXTENT-clamped position. */
const OVERSCROLL_MARGIN = 350;
const HARD_EXTENT: [[number, number], [number, number]] = [
  [WORLD_EXTENT[0][0] - OVERSCROLL_MARGIN, WORLD_EXTENT[0][1] - OVERSCROLL_MARGIN],
  [WORLD_EXTENT[1][0] + OVERSCROLL_MARGIN, WORLD_EXTENT[1][1] + OVERSCROLL_MARGIN],
];
const RAD_PER_DEG = Math.PI / 180;
const DEG_PER_RAD = 180 / Math.PI;

function lngLatToSvg(lng: number, lat: number): [number, number] {
  return [
    PROJ_CX + PROJ_SCALE * lng * RAD_PER_DEG,
    PROJ_CY - PROJ_SCALE * Math.log(Math.tan(Math.PI / 4 + (lat * RAD_PER_DEG) / 2)),
  ];
}

function svgToLngLat(x: number, y: number): [number, number] {
  return [
    ((x - PROJ_CX) / PROJ_SCALE) * DEG_PER_RAD,
    (2 * Math.atan(Math.exp((PROJ_CY - y) / PROJ_SCALE)) - Math.PI / 2) * DEG_PER_RAD,
  ];
}

const ZOOM_ANIMATION_DURATION = 700; // ms
const SNAP_BACK_DURATION = 320;      // ms — bounce-back from overscroll

const SIDEBAR_VARIANTS = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};
const SIDEBAR_TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

/* ------------------------------------------------------------------ */
/*  Merged outline renderer — uses map's own projection via context   */
/* ------------------------------------------------------------------ */
import type { MergedOutline } from '@/hooks/useMapTopology';

function MergedOutlines({
  outlines, prefix, zoom, fadeIn, fullIn, fadeOut, gone, strokeWidth, opacityScale,
  hoveredKey,
}: {
  outlines: MergedOutline[];
  prefix: string;
  zoom: number;
  fadeIn: number;
  fullIn: number;
  fadeOut: number;
  gone: number;
  strokeWidth: number;
  opacityScale: number;
  hoveredKey?: string | null;
}) {
  const { path } = useMapContext();
  const opacity = crossfadeOpacity(zoom, fadeIn, fullIn, fadeOut, gone);
  if (opacity <= 0) return null;
  return (
    <>
      {outlines.map(({ key, geometry }) => {
        const d = path(geometry);
        if (!d) return null;
        const isHovered = hoveredKey === key;
        return (
          <path
            key={`${prefix}-${key}`}
            d={d}
            fill="none"
            stroke={SVG_COLORS.terracotta}
            strokeWidth={strokeWidth / zoom}
            strokeLinejoin="round"
            opacity={opacity * opacityScale * (isHovered ? 0.8 : 0.2)}
            pointerEvents="none"
            style={{
              transition: 'opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Continent hit areas — invisible interactive layer for hover/click */
/* ------------------------------------------------------------------ */
function ContinentHitAreas({
  outlines,
  zoom,
  onHover,
  onClick,
}: {
  outlines: MergedOutline[];
  zoom: number;
  onHover: (continent: string | null) => void;
  onClick: (continent: string) => void;
}) {
  const { path } = useMapContext();
  if (zoom >= ZOOM.CONTINENT_GONE) return null;

  return (
    <>
      {outlines.map(({ key, geometry }) => {
        const d = path(geometry);
        if (!d) return null;
        return (
          <path
            key={`hit-${key}`}
            d={d}
            fill="transparent"
            stroke="none"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(key)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(key)}
          />
        );
      })}
    </>
  );
}

/* ================================================================== */
/*  Component                                                         */
/* ================================================================== */
export default function WorldMap({ recipes, isLoading = false, flyTo }: { recipes: Recipe[]; isLoading?: boolean; flyTo?: { lng: number; lat: number; zoom?: number } }) {
  const router = useRouter();
  const { summary: passportSummary } = useCookedStamps();
  const cookedRecipeSlugs = useMemo(() => {
    const slugs = new Set<string>();
    for (const stamps of passportSummary.stampsPerCountry.values()) {
      for (const stamp of stamps) {
        slugs.add(stamp.recipe_slug);
      }
    }
    return slugs;
  }, [passportSummary.stampsPerCountry]);
  const { topology, continentOutlines, regionOutlines } = useMapTopology();

  /* Theme detection for choropleth */
  const [isSepia, setIsSepia] = useState(false);
  useEffect(() => {
    const check = () => setIsSepia(document.documentElement.dataset.theme === 'sepia');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  /* ── Position state ──
     controlledPos   → drives ZoomableGroup props (only set on moveEnd / programmatic zoom)
     liveCenter/Zoom → tracks d3's real-time position during gestures (via onMove)
     renderTick      → forces re-render at throttled rate during zoom/pan */
  const defaultPos: Position = flyTo
    ? { coordinates: [flyTo.lng, flyTo.lat], zoom: flyTo.zoom ?? ZOOM.COUNTRY_FULL }
    : { coordinates: [0, 45], zoom: DEFAULT_ZOOM };
  const [controlledPos, setControlledPos] = useState<Position>(defaultPos);
  const liveCenterRef = useRef<[number, number]>(defaultPos.coordinates);
  const liveZoomRef   = useRef(defaultPos.zoom);
  const [, rerender]  = useReducer((x: number) => x + 1, 0);
  const throttleRef   = useRef(0);
  const animFrameRef  = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const zoomToRef = useRef<(target: Position, duration?: number) => void>(null);

  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [tappedCountry, setTappedCountry] = useState<string | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  /* ── First-visit hint ── */
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem('nieves-map-hint-v2')) return;
      const timer = setTimeout(() => setShowHint(true), 1200);
      return () => clearTimeout(timer);
    } catch { /* SSR / private browsing */ }
  }, []);

  function dismissHint() {
    setShowHint(false);
    try { localStorage.setItem('nieves-map-hint-v2', '1'); } catch {}
  }

  /* Clean up animation on unmount */
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  /* Use live values for all display logic */
  const zoom   = liveZoomRef.current;
  const center = liveCenterRef.current;
  // Quantized zoom for choropleth — only changes every 0.25 units, reducing getFill recreation
  const choroplethZoomBand = Math.round(zoom * 4) / 4;

  /* ── Real-time move handler (throttled ~20fps) ──
     onMove only gives {x, y, zoom} (SVG coords), not geo coordinates.
     We track zoom in real-time (drives opacity transitions) and update
     center on moveEnd when geo coordinates are available. */
  const handleMove = useCallback(({ zoom: z }: { x: number; y: number; zoom: number }) => {
    // Cancel programmatic animation on user interaction
    if (isAnimatingRef.current && animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
      isAnimatingRef.current = false;
    }
    liveZoomRef.current = Math.round(z * 100) / 100;
    const now = performance.now();
    if (now - throttleRef.current < 50) return;
    throttleRef.current = now;
    rerender();
  }, [rerender]);

  const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
    if (isAnimatingRef.current) return; // Don't override during animation

    // Overscroll snap-back: if the viewport center is past WORLD_EXTENT,
    // animate back to the clamped position. HARD_EXTENT (passed to d3-zoom)
    // already prevents dragging past WORLD_EXTENT + OVERSCROLL_MARGIN.
    const [svgX, svgY] = lngLatToSvg(coordinates[0], coordinates[1]);
    const halfW = PROJ_CX / z;
    const halfH = PROJ_CY / z;
    const minX = WORLD_EXTENT[0][0] + halfW;
    const maxX = WORLD_EXTENT[1][0] - halfW;
    const minY = WORLD_EXTENT[0][1] + halfH;
    const maxY = WORLD_EXTENT[1][1] - halfH;
    const fallbackX = (WORLD_EXTENT[0][0] + WORLD_EXTENT[1][0]) / 2;
    const fallbackY = (WORLD_EXTENT[0][1] + WORLD_EXTENT[1][1]) / 2;
    const clampedX = minX > maxX ? fallbackX : Math.max(minX, Math.min(maxX, svgX));
    const clampedY = minY > maxY ? fallbackY : Math.max(minY, Math.min(maxY, svgY));

    if (Math.abs(clampedX - svgX) > 0.5 || Math.abs(clampedY - svgY) > 0.5) {
      const [tlng, tlat] = svgToLngLat(clampedX, clampedY);
      liveCenterRef.current = coordinates;
      liveZoomRef.current = z;
      zoomToRef.current?.({ coordinates: [tlng, tlat], zoom: z }, SNAP_BACK_DURATION);
      return;
    }

    liveCenterRef.current = coordinates;
    liveZoomRef.current = z;
    setControlledPos({ coordinates, zoom: z });
  }, []);

  /** Programmatic zoom — animated with easeInOutCubic over `duration` ms */
  function zoomTo(target: Position, duration: number = ZOOM_ANIMATION_DURATION) {
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
      const t = Math.min(elapsed / duration, 1);
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
  zoomToRef.current = zoomTo;

  /* ── Derived opacities — sequential, no overlap ── */
  const continentOpacity = crossfadeOpacity(zoom, 0.3, 0.6, ZOOM.CONTINENT_FADE, ZOOM.CONTINENT_GONE);
  const regionOpacity    = crossfadeOpacity(zoom, ZOOM.REGION_FADE_IN, ZOOM.REGION_FULL, ZOOM.REGION_FADE_OUT, ZOOM.REGION_GONE);
  const countryOpacity   = crossfadeOpacity(zoom, ZOOM.COUNTRY_FADE_IN, ZOOM.COUNTRY_FULL);

  /* For flat continents, country markers appear earlier — at continent zoom level */
  const flatCountryOpacity = crossfadeOpacity(zoom, ZOOM.CONTINENT_FADE, ZOOM.CONTINENT_GONE);

  /* Inverse scaling — keeps markers at constant screen size */
  const markerScale    = 1 / zoom;
  const continentScale = 1 / Math.max(zoom, 0.8);

  /* Detected context for breadcrumb */
  const detectedRegion    = useMemo(() => findClosestRegion(center), [center]);
  const detectedContinent = detectedRegion ? REGION_TO_CONTINENT[detectedRegion] : null;

  /* ── Recipe data ── */
  const recipesByCountry = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    for (const r of recipes) {
      const list = map.get(r.country) ?? [];
      list.push(r);
      map.set(r.country, list);
    }
    return map;
  }, [recipes]);

  const recipesByRegion = useMemo(() => {
    const map = new Map<CulinaryRegion, number>();
    for (const r of recipes) map.set(r.region, (map.get(r.region) ?? 0) + 1);
    return map;
  }, [recipes]);

  const maxRegionCount = useMemo(
    () => Math.max(1, ...recipesByRegion.values()),
    [recipesByRegion],
  );

  /* Recipes per continent (macro level) */
  const recipesByContinent = useMemo(() => {
    const map = new Map<string, number>();
    for (const [region, count] of recipesByRegion.entries()) {
      const continent = REGION_TO_CONTINENT[region];
      if (continent) map.set(continent, (map.get(continent) ?? 0) + count);
    }
    return map;
  }, [recipesByRegion]);

  const maxContinentCount = useMemo(
    () => Math.max(1, ...recipesByContinent.values()),
    [recipesByContinent],
  );

  /* Recipes per individual country (micro level) */
  const recipesPerCountry = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of recipes) map.set(r.country, (map.get(r.country) ?? 0) + 1);
    return map;
  }, [recipes]);

  const maxCountryCount = useMemo(
    () => Math.max(1, ...recipesPerCountry.values()),
    [recipesPerCountry],
  );

  const countryMarkers = useMemo(() => {
    const seen = new Set<string>();
    return recipes.filter(r => {
      if (seen.has(r.country)) return false;
      seen.add(r.country);
      return true;
    });
  }, [recipes]);

  const activeRegions = useMemo(() => {
    const out: { region: CulinaryRegion; count: number; position: [number, number] }[] = [];
    for (const [region, count] of recipesByRegion.entries()) {
      const position = REGION_LABEL_POSITIONS[region];
      if (count > 0 && position) out.push({ region, count, position });
    }
    return out;
  }, [recipesByRegion]);

  /* Viewport-filtered — only render what's in view.
     For flat continents, markers appear at continent zoom (earlier than normal). */
  const visibleCountryMarkers = useMemo(
    () => {
      if (countryOpacity <= 0 && flatCountryOpacity <= 0) return [];
      return countryMarkers.filter(r => {
        if (!isInViewport([r.coordinates.lng, r.coordinates.lat], center, zoom)) return false;
        // Normal zoom: always visible
        if (countryOpacity > 0) return true;
        // Flat continent early visibility
        const region = r.region as CulinaryRegion;
        return flatCountryOpacity > 0 && FLAT_CONTINENTS.has(REGION_TO_CONTINENT[region]);
      });
    },
    [countryMarkers, countryOpacity, flatCountryOpacity, center, zoom],
  );

  const visibleRegions = useMemo(
    () => regionOpacity > 0
      ? activeRegions.filter(({ region, position: pos }) =>
          isInViewport(pos, center, zoom) &&
          // Hide redundant region labels for flat continents (e.g. North America → North America)
          !FLAT_CONTINENTS.has(REGION_TO_CONTINENT[region]),
        )
      : [],
    [activeRegions, regionOpacity, center, zoom],
  );

  /* Choropleth — adaptive: continent → region → country based on zoom */
  const getFill = useCallback(
    (geo: { properties: { name: string }; id?: string }) => {
      const isoCode = (geo.id as string) ?? '';
      const countryName = geo.properties.name;
      const region = resolveRegion(isoCode, countryName);
      if (!region) return isSepia ? SEPIA_CHOROPLETH_EMPTY : CHOROPLETH_EMPTY;

      const continent = getContinent(isoCode, countryName);

      const macroColor = getChoroplethColor(
        continent ? (recipesByContinent.get(continent) ?? 0) : 0, maxContinentCount, isSepia,
      );
      const mesoColor = getChoroplethColor(
        recipesByRegion.get(region) ?? 0, maxRegionCount, isSepia,
      );
      const microColor = getChoroplethColor(
        recipesPerCountry.get(countryName) ?? 0, maxCountryCount, isSepia,
      );

      // Transition band: macro → meso (CONTINENT_FADE to REGION_FULL)
      const t1 = blendFactor(choroplethZoomBand, ZOOM.CONTINENT_FADE, ZOOM.REGION_FULL);
      // Transition band: meso → micro (REGION_FADE_OUT to COUNTRY_FULL)
      const t2 = blendFactor(choroplethZoomBand, ZOOM.REGION_FADE_OUT, ZOOM.COUNTRY_FULL);

      if (t1 < 1) return lerpColor(macroColor, mesoColor, t1);
      if (t2 < 1) return lerpColor(mesoColor, microColor, t2);
      return microColor;
    },
    [recipesByContinent, maxContinentCount, recipesByRegion, maxRegionCount,
     recipesPerCountry, maxCountryCount, isSepia, choroplethZoomBand],
  );

  /* ── Legend data ── */
  const choroplethLevel = getChoroplethLevel(zoom);

  const legendMaxCount = choroplethLevel === 'continent'
    ? maxContinentCount
    : choroplethLevel === 'region'
      ? maxRegionCount
      : maxCountryCount;

  const legendGetColor = useCallback(
    (count: number, max: number) => getChoroplethColor(count, max, isSepia),
    [isSepia],
  );


  /** At continent zoom: hide internal borders. At region zoom: subtle. At country zoom: normal. */
  const geoStrokeWidth = zoom < ZOOM.CONTINENT_GONE ? 0 : zoom < ZOOM.REGION_GONE ? 0.35 : 0.6;

  /* ── Click handlers — zoom-level-exclusive ── */

  function showTapFeedback(name: string) {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    setTappedCountry(name);
    tapTimerRef.current = setTimeout(() => setTappedCountry(null), 2000);
  }

  function handleGeographyClick(geo: { properties: { name: string }; id?: string }) {
    const countryName = geo.properties.name;
    const isoCode = (geo.id as string) ?? '';
    const region = resolveRegion(isoCode, countryName);

    showTapFeedback(countryName);
    if (showHint) dismissHint();

    if (zoom < ZOOM.CONTINENT_GONE) {
      // Continent level → zoom to the continent this country is in
      if (region) {
        const regionCenter = REGION_CENTERS[region].center;
        const continent = findClosestContinent(regionCenter);
        zoomTo({ coordinates: continent.position, zoom: continent.zoom });
      }
    } else if (zoom < ZOOM.REGION_GONE && region) {
      // Region level → zoom to the region (past REGION_GONE so countries show)
      const data = REGION_CENTERS[region];
      zoomTo({ coordinates: data.center, zoom: ZOOM.COUNTRY_FULL });
    } else if (zoom >= ZOOM.COUNTRY_FADE_IN && recipesByCountry.has(countryName)) {
      // Country level → open sidebar
      setSelectedCountry(countryName);
    }
  }

  function handleContinentClick(continent: typeof CONTINENTS[number]) {
    zoomTo({ coordinates: continent.position, zoom: continent.zoom });
    setSelectedCountry(null);
    if (showHint) dismissHint();
  }

  function handleRegionClick(region: CulinaryRegion) {
    const data = REGION_CENTERS[region];
    // Zoom past REGION_GONE so region label disappears and countries appear
    zoomTo({ coordinates: data.center, zoom: ZOOM.COUNTRY_FULL });
    setSelectedCountry(null);
  }

  function handleCountryMarkerClick(recipe: Recipe) {
    if (selectedCountry === recipe.country) return;
    setSelectedCountry(recipe.country);
    zoomTo({
      coordinates: [recipe.coordinates.lng, recipe.coordinates.lat],
      zoom: Math.max(zoom, 5),
    });
  }

  function resetView() {
    zoomTo({ coordinates: [0, 45], zoom: DEFAULT_ZOOM });
    setSelectedCountry(null);
  }

  function handleSearchSelect(result: { country: string; coordinates: { lng: number; lat: number }; recipeId?: string }) {
    if (result.recipeId) {
      // Fly to country, then navigate to recipe detail
      zoomTo({
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        zoom: Math.max(zoom, ZOOM.COUNTRY_FULL),
      });
      router.push(`/recipes/${result.recipeId}`);
    } else {
      // Fly to country and open sidebar
      zoomTo({
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        zoom: Math.max(zoom, ZOOM.COUNTRY_FULL),
      });
      setSelectedCountry(result.country);
    }
  }

  const countryRecipes = selectedCountry ? recipesByCountry.get(selectedCountry) ?? [] : [];

  /* Breadcrumb visibility — hide redundant region for flat continents */
  const showContinent = zoom >= 1.5 && detectedContinent;
  const showRegion    = zoom >= ZOOM.REGION_FULL && detectedRegion
    && !(detectedContinent && FLAT_CONTINENTS.has(detectedContinent));

  return (
    <div className="relative w-full h-full">
      <MapSearch recipes={recipes} onSelect={handleSearchSelect} />
      {/* ── Breadcrumb — bottom on mobile (thumb reach), top on desktop ── */}
      <nav
        aria-label="Map navigation"
        className="absolute bottom-3 left-3 sm:top-4 sm:left-4 sm:bottom-auto z-10 flex items-center gap-1 bg-parchment border border-brown-light/20 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm max-w-[calc(100vw-6rem)]"
      >
        <button
          onClick={resetView}
          className={`font-medium transition-colors whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${!showContinent ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
        >
          World
        </button>
        {showContinent && (
          <>
            <ChevronRight size={14} className="text-brown-light shrink-0" aria-hidden="true" />
            <button
              onClick={() => {
                zoomTo({ coordinates: center, zoom: 2.8 });
                setSelectedCountry(null);
              }}
              className={`font-medium transition-colors whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${!showRegion ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
            >
              {detectedContinent}
            </button>
          </>
        )}
        {showRegion && (
          <>
            <ChevronRight size={14} className="text-brown-light shrink-0" aria-hidden="true" />
            <button
              onClick={() => {
                zoomTo({ coordinates: center, zoom: 4 });
                setSelectedCountry(null);
              }}
              className={`font-medium transition-colors whitespace-nowrap truncate max-w-32 sm:max-w-none rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${!selectedCountry ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
            >
              {detectedRegion}
            </button>
          </>
        )}
        {selectedCountry && (
          <>
            <ChevronRight size={14} className="text-brown-light shrink-0" aria-hidden="true" />
            <span className="font-medium text-terracotta whitespace-nowrap truncate max-w-28 sm:max-w-none">
              {selectedCountry}
            </span>
          </>
        )}
      </nav>

      {/* ── Map ── */}
      <div className="relative w-full h-full map-bg" style={{ touchAction: 'none' }}>
        {/* Vignette overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 130% 130% at 50% 50%, transparent 38%, rgba(110, 72, 32, 0.3) 100%)' }}
        />
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: PROJ_SCALE }}
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            center={controlledPos.coordinates}
            zoom={controlledPos.zoom}
            onMove={handleMove}
            onMoveEnd={handleMoveEnd}
            minZoom={MIN_ZOOM}
            maxZoom={12}
            translateExtent={HARD_EXTENT}
            filterZoomEvent={(e: unknown) => {
              const evt = e as MouseEvent;
              if (evt.type === 'wheel') return true;
              return !evt.button;
            }}
          >
            {/* Continent outlines — rendered first (behind countries) */}
            <MergedOutlines
              outlines={continentOutlines}
              prefix="continent"
              zoom={zoom}
              fadeIn={0.5}
              fullIn={ZOOM.CONTINENT_FULL}
              fadeOut={ZOOM.CONTINENT_FADE}
              gone={ZOOM.CONTINENT_GONE}
              strokeWidth={1.2}
              opacityScale={1}
              hoveredKey={hoveredContinent}
            />

            {/* Region outlines — rendered behind countries */}
            <MergedOutlines
              outlines={regionOutlines}
              prefix="region"
              zoom={zoom}
              fadeIn={ZOOM.REGION_FADE_IN}
              fullIn={ZOOM.REGION_FULL}
              fadeOut={ZOOM.REGION_FADE_OUT}
              gone={ZOOM.COUNTRY_FULL}
              strokeWidth={1}
              opacityScale={0.7}
            />

            {/* Geography shapes — on top for hover/click interaction */}
            {topology && <Geographies geography={topology}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
                geographies
                  .filter(geo => !HIDDEN_COUNTRIES.has(geo.id ?? '') && !HIDDEN_COUNTRIES.has(geo.properties.name))
                  .map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        // Continent-level hover: highlight entire continent
                        (hoveredContinent && zoom < ZOOM.CONTINENT_GONE && getContinent((geo.id as string) ?? '', geo.properties.name) === hoveredContinent)
                          ? SVG_COLORS.hoverFill
                          // Country-level hover (at deeper zoom): highlight individual country
                          : (zoom >= ZOOM.CONTINENT_GONE && hoveredCountry === geo.properties.name)
                            ? SVG_COLORS.hoverFill
                            : getFill(geo)
                      }
                      stroke={geoStrokeWidth > 0 ? SVG_COLORS.stroke : 'transparent'}
                      strokeWidth={geoStrokeWidth}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.25s cubic-bezier(0.25, 1, 0.5, 1), filter 0.25s cubic-bezier(0.25, 1, 0.5, 1)' },
                        hover:   { outline: 'none', cursor: 'pointer', filter: zoom < ZOOM.CONTINENT_GONE ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))' : 'none' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => {
                        setHoveredCountry(geo.properties.name);
                        if (zoom < ZOOM.CONTINENT_GONE) {
                          const iso = (geo.id as string) ?? '';
                          const continent = getContinent(iso, geo.properties.name);
                          // Only update if mapped — unmapped countries keep previous continent highlight
                          if (continent) setHoveredContinent(continent);
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
                  ))
              }
            </Geographies>}

            {/* Continent hit areas — transparent layer on top of Geography shapes
                at continent zoom so hover/click works across gaps between countries */}
            <ContinentHitAreas
              outlines={continentOutlines}
              zoom={zoom}
              onHover={setHoveredContinent}
              onClick={(continentName) => {
                const continent = CONTINENTS.find(c => c.name === continentName);
                if (continent) handleContinentClick(continent);
              }}
            />

            {/* ── Level 1: Continent labels ── */}
            {continentOpacity > 0 && CONTINENTS.map(continent => (
              <Marker key={continent.name} coordinates={continent.position}>
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`Zoom to ${continent.name}`}
                  style={{ cursor: 'pointer', outline: 'none', opacity: continentOpacity }}
                  transform={`scale(${continentScale})`}
                  onClick={() => handleContinentClick(continent)}
                  onMouseEnter={() => setHoveredContinent(continent.name)}
                  onMouseLeave={() => setHoveredContinent(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleContinentClick(continent);
                    }
                  }}
                >
                  <circle r={40} fill="transparent" />
                  <text
                    textAnchor="middle"
                    y={-3}
                    style={{
                      fontFamily: SVG_FONT_DISPLAY,
                      fontSize: '16px',
                      fontWeight: 600,
                      fill: SVG_COLORS.brownDark,
                      letterSpacing: '0.12em',
                    }}
                  >
                    {continent.name.toUpperCase()}
                  </text>
                  <circle r={4.5} cy={9.5} fill={SVG_COLORS.terracotta} stroke={SVG_COLORS.parchment} strokeWidth={1.5} opacity={0.9} />
                </g>
              </Marker>
            ))}

            {/* ── Level 2: Region labels (viewport-filtered) ── */}
            {regionOpacity > 0 && visibleRegions.map(({ region, count, position: pos }) => (
              <Marker key={region} coordinates={pos}>
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`${region}, ${count} recipe${count !== 1 ? 's' : ''}`}
                  style={{ cursor: 'pointer', outline: 'none', opacity: regionOpacity }}
                  transform={`scale(${markerScale})`}
                  onClick={() => handleRegionClick(region)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRegionClick(region);
                    }
                  }}
                >
                  <circle r={16} fill="transparent" />
                  <circle r={5} fill={SVG_COLORS.parchment} stroke={SVG_COLORS.brownMedium} strokeWidth={1.2} />
                  <circle r={2.5} fill={SVG_COLORS.brownMedium} />
                  <rect
                    x={12} y={-13}
                    width={region.length * 7 + 36} height={22} rx={11}
                    fill={SVG_COLORS.parchment} fillOpacity={0.94}
                    stroke={SVG_COLORS.stroke} strokeWidth={0.5}
                  />
                  <text x={20} y={3} style={{ fontFamily: SVG_FONT_BODY, fontSize: '11.5px', fontWeight: 500, fill: SVG_COLORS.brownDark }}>
                    {region}
                  </text>
                  <text x={20 + region.length * 7 + 4} y={3} style={{ fontFamily: SVG_FONT_BODY, fontSize: '11.5px', fontWeight: 700, fill: SVG_COLORS.terracotta }}>
                    ({count})
                  </text>
                </g>
              </Marker>
            ))}

            {/* ── Level 3: Country markers (viewport-filtered) ── */}
            {visibleCountryMarkers.length > 0 && visibleCountryMarkers.map(recipe => {
              const count = recipesByCountry.get(recipe.country)?.length ?? 0;
              const isFlat = FLAT_CONTINENTS.has(REGION_TO_CONTINENT[recipe.region as CulinaryRegion]);
              const markerOpacity = isFlat ? Math.max(countryOpacity, flatCountryOpacity) : countryOpacity;
              return (
                <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${recipe.country}, ${count} recipe${count !== 1 ? 's' : ''}`}
                    style={{ cursor: 'pointer', outline: 'none', opacity: markerOpacity }}
                    transform={`scale(${markerScale})`}
                    onClick={() => handleCountryMarkerClick(recipe)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCountryMarkerClick(recipe);
                      }
                    }}
                  >
                    <circle r={18} fill="transparent" />
                    <circle r={7} fill={SVG_COLORS.terracotta} stroke={SVG_COLORS.parchment} strokeWidth={1.5} opacity={0.9} />
                    <text
                      textAnchor="middle" y={-12}
                      style={{ fontFamily: SVG_FONT_BODY, fontSize: '13px', fontWeight: 600, fill: SVG_COLORS.brownDark }}
                    >
                      {recipe.country} ({count})
                    </text>
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* ── Choropleth legend ── */}
      <ChoroplethLegend
        level={choroplethLevel}
        maxCount={legendMaxCount}
        getColor={legendGetColor}
      />

      {/* ── Hover tooltip (desktop) — only at region/country zoom, not continent */}
      {hoveredCountry && !selectedCountry && zoom >= ZOOM.CONTINENT_GONE && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-brown-light/20 px-4 py-2 rounded-full shadow-sm text-sm font-medium text-brown-dark pointer-events-none z-10 hidden sm:block"
        >
          {hoveredCountry}
          {recipesByCountry.has(hoveredCountry) && (
            <span className="text-terracotta ml-1.5">
              ({recipesByCountry.get(hoveredCountry)!.length} recipe{recipesByCountry.get(hoveredCountry)!.length > 1 ? 's' : ''})
            </span>
          )}
          {passportSummary.uniqueCountries.has(hoveredCountry) && (
            <span className="ml-1.5 text-turmeric font-semibold">
              {passportSummary.stampsPerCountry.get(hoveredCountry)!.length} cooked
            </span>
          )}
        </div>
      )}

      {/* ── Tap feedback (mobile) ── */}
      <AnimatePresence>
        {tappedCountry && !selectedCountry && !hoveredCountry && zoom >= ZOOM.CONTINENT_GONE && (
          <motion.div
            key={tappedCountry}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-parchment border border-brown-light/20 px-4 py-2 rounded-full shadow-sm text-sm font-medium text-brown-dark pointer-events-none z-10 sm:hidden"
          >
            {tappedCountry}
            {recipesByCountry.has(tappedCountry) && (
              <span className="text-terracotta ml-1.5">
                ({recipesByCountry.get(tappedCountry)!.length} recipe{recipesByCountry.get(tappedCountry)!.length > 1 ? 's' : ''})
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── First-visit hint ── */}
      <AnimatePresence>
        {showHint && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-brown-dark text-parchment px-5 py-2.5 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-2 pointer-events-auto"
          >
            <span>Tap a continent to explore its recipes</span>
            <button
              onClick={dismissHint}
              aria-label="Dismiss hint"
              className="p-0.5 rounded-full hover:bg-white/15 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state when filters exclude all recipes ── */}
      {recipes.length === 0 && !isLoading && (
        <div className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-brown-light/20 px-5 py-3 rounded-2xl shadow-sm text-center z-10 max-w-xs">
          <p className="text-sm font-medium text-brown-dark">No recipes match your filters</p>
          <p className="text-xs text-brown-medium mt-0.5">Try adjusting your filters to see dishes on the map.</p>
        </div>
      )}

      {/* ── Recipe sidebar ── */}
      <AnimatePresence>
        {selectedCountry && countryRecipes.length > 0 && (
          <motion.aside
            variants={SIDEBAR_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={SIDEBAR_TRANSITION}
            aria-label={`Recipes from ${selectedCountry}`}
            className="absolute top-14 left-3 bottom-3 sm:top-16 sm:left-4 sm:bottom-4 w-[calc(100vw-1.5rem)] max-w-72 bg-parchment border border-brown-light/20 rounded-2xl shadow-xl overflow-y-auto z-10"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-heading text-lg font-bold text-brown-dark">{selectedCountry}</h3>
                <button
                  onClick={() => setSelectedCountry(null)}
                  aria-label="Close recipe panel"
                  className="p-1 -mr-1 -mt-0.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-brown-medium mb-4">
                {countryRecipes.length} recipe{countryRecipes.length > 1 ? 's' : ''}
              </p>
              <div className="space-y-3">
                {countryRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                    className="w-full bg-parchment rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        fill
                        sizes="(max-width: 640px) calc(100vw - 3rem), 256px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {cookedRecipeSlugs.has(recipe.id) && (
                        <div className="absolute top-1.5 right-1.5 bg-sage/90 text-white rounded-full p-1" title="Cooked!">
                          <ChefHat size={12} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-heading text-sm font-semibold text-brown-dark mb-1">{recipe.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-brown-medium mb-1.5">
                        <span className="flex items-center gap-0.5">
                          <Clock size={10} className="shrink-0" />
                          {recipe.prepTime + recipe.cookTime}m
                        </span>
                        <span className={`font-semibold px-1.5 py-0.5 rounded-full ${
                          recipe.difficulty === 'Easy' ? 'bg-sage/30 text-sage' :
                          recipe.difficulty === 'Medium' ? 'bg-turmeric/30 text-turmeric' :
                          'bg-paprika/20 text-paprika'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {recipe.isFusion && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-turmeric text-brown-dark">
                            FUSION
                          </span>
                        )}
                        {recipe.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-parchment-dark text-brown-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
