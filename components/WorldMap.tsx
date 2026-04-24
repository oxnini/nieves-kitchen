'use client';

import { useState, useMemo, useCallback, useRef, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ComposableMap, Geographies, Geography,
  Marker, ZoomableGroup,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import type { Recipe, CulinaryRegion } from '@/lib/types';
import ChoroplethLegend from './ChoroplethLegend';
import {
  COUNTRY_TO_REGION, REGION_CENTERS, REGION_LABEL_POSITIONS,
  CHOROPLETH_BASE, CHOROPLETH_LIGHT, CHOROPLETH_EMPTY,
} from '@/lib/regions';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { useMapTopology } from '@/hooks/useMapTopology';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const HIDDEN_COUNTRIES = new Set([
  'ATA', '010',                // Antarctica
  'GRL', '304', 'Greenland',   // Greenland
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
  { name: 'Europe',        position: [15, 50]    as [number, number], zoom: 2.8 },
  { name: 'Asia',          position: [80, 35]    as [number, number], zoom: 2.5 },
  { name: 'Africa',        position: [20, 2]     as [number, number], zoom: 2.8 },
  { name: 'North America', position: [-100, 45]  as [number, number], zoom: 2.8 },
  { name: 'South America', position: [-60, -15]  as [number, number], zoom: 2.8 },
  { name: 'Oceania',       position: [140, -25]  as [number, number], zoom: 3.5 },
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
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
interface Position { coordinates: [number, number]; zoom: number }

const SEPIA_CHOROPLETH = {
  base: { r: 94, g: 176, b: 200 },
  light: '#2E3638',
  empty: '#2A3133',
};

function getChoroplethColor(recipeCount: number, maxCount: number, isSepia: boolean): string {
  const base = isSepia ? SEPIA_CHOROPLETH.base : CHOROPLETH_BASE;
  const light = isSepia ? SEPIA_CHOROPLETH.light : CHOROPLETH_LIGHT;
  if (recipeCount === 0) return light;
  const t = recipeCount / maxCount;
  const intensity = 0.35 + 0.65 * t;
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
function getContinent(isoCode: string): string | null {
  const region = COUNTRY_TO_REGION[isoCode];
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

const SIDEBAR_VARIANTS = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};
const SIDEBAR_TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

/* ================================================================== */
/*  Component                                                         */
/* ================================================================== */
export default function WorldMap({ recipes, isLoading = false, flyTo }: { recipes: Recipe[]; isLoading?: boolean; flyTo?: { lng: number; lat: number; zoom?: number } }) {
  const router = useRouter();
  const { summary: passportSummary } = useCookedStamps();
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
    : { coordinates: [-4, 30], zoom: 1 };
  const [controlledPos, setControlledPos] = useState<Position>(defaultPos);
  const liveCenterRef = useRef<[number, number]>(defaultPos.coordinates);
  const liveZoomRef   = useRef(defaultPos.zoom);
  const [, rerender]  = useReducer((x: number) => x + 1, 0);
  const throttleRef   = useRef(0);

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

  /* Use live values for all display logic */
  const zoom   = liveZoomRef.current;
  const center = liveCenterRef.current;

  /* ── Real-time move handler (throttled ~20fps) ──
     onMove only gives {x, y, zoom} (SVG coords), not geo coordinates.
     We track zoom in real-time (drives opacity transitions) and update
     center on moveEnd when geo coordinates are available. */
  const handleMove = useCallback(({ zoom: z }: { x: number; y: number; zoom: number }) => {
    liveZoomRef.current = z;
    const now = performance.now();
    if (now - throttleRef.current < 50) return;
    throttleRef.current = now;
    rerender();
  }, [rerender]);

  const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
    liveCenterRef.current = coordinates;
    liveZoomRef.current = z;
    setControlledPos({ coordinates, zoom: z });
  }, []);

  /** Programmatic zoom — updates both controlled and live */
  function zoomTo(pos: Position) {
    liveCenterRef.current = pos.coordinates;
    liveZoomRef.current = pos.zoom;
    setControlledPos(pos);
  }

  /* ── Derived opacities — sequential, no overlap ── */
  const continentOpacity = crossfadeOpacity(zoom, 0.5, ZOOM.CONTINENT_FULL, ZOOM.CONTINENT_FADE, ZOOM.CONTINENT_GONE);
  const regionOpacity    = crossfadeOpacity(zoom, ZOOM.REGION_FADE_IN, ZOOM.REGION_FULL, ZOOM.REGION_FADE_OUT, ZOOM.REGION_GONE);
  const countryOpacity   = crossfadeOpacity(zoom, ZOOM.COUNTRY_FADE_IN, ZOOM.COUNTRY_FULL);

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

  /* Viewport-filtered — only render what's in view */
  const visibleCountryMarkers = useMemo(
    () => countryOpacity > 0
      ? countryMarkers.filter(r => isInViewport([r.coordinates.lng, r.coordinates.lat], center, zoom))
      : [],
    [countryMarkers, countryOpacity, center, zoom],
  );

  const visibleRegions = useMemo(
    () => regionOpacity > 0
      ? activeRegions.filter(({ position: pos }) => isInViewport(pos, center, zoom))
      : [],
    [activeRegions, regionOpacity, center, zoom],
  );

  /* Choropleth — adaptive: continent → region → country based on zoom */
  const getFill = useCallback(
    (geo: { properties: { name: string }; id?: string }) => {
      const isoCode = (geo.id as string) ?? '';
      const region = COUNTRY_TO_REGION[isoCode];
      if (!region) return isSepia ? SEPIA_CHOROPLETH.empty : CHOROPLETH_EMPTY;

      const continent = getContinent(isoCode);
      const countryName = geo.properties.name;

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
      const t1 = blendFactor(zoom, ZOOM.CONTINENT_FADE, ZOOM.REGION_FULL);
      // Transition band: meso → micro (REGION_FADE_OUT to COUNTRY_FULL)
      const t2 = blendFactor(zoom, ZOOM.REGION_FADE_OUT, ZOOM.COUNTRY_FULL);

      if (t1 < 1) return lerpColor(macroColor, mesoColor, t1);
      if (t2 < 1) return lerpColor(mesoColor, microColor, t2);
      return microColor;
    },
    [recipesByContinent, maxContinentCount, recipesByRegion, maxRegionCount,
     recipesPerCountry, maxCountryCount, isSepia, zoom],
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
    const region = COUNTRY_TO_REGION[isoCode];

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
    zoomTo({ coordinates: [-4, 30], zoom: 1 });
    setSelectedCountry(null);
  }

  const countryRecipes = selectedCountry ? recipesByCountry.get(selectedCountry) ?? [] : [];

  /* Breadcrumb visibility */
  const showContinent = zoom >= 1.5 && detectedContinent;
  const showRegion    = zoom >= ZOOM.REGION_FULL && detectedRegion;

  return (
    <div className="relative w-full h-full">
      {/* ── Breadcrumb — bottom on mobile (thumb reach), top on desktop ── */}
      <nav
        aria-label="Map navigation"
        className="absolute bottom-3 left-3 sm:top-4 sm:left-4 sm:bottom-auto z-10 flex items-center gap-1 bg-parchment/92 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md text-xs sm:text-sm max-w-[calc(100vw-6rem)]"
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
      <div className="w-full h-full map-bg" style={{ touchAction: 'none' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 160 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            center={controlledPos.coordinates}
            zoom={controlledPos.zoom}
            onMove={handleMove}
            onMoveEnd={handleMoveEnd}
            maxZoom={12}
            filterZoomEvent={(e: unknown) => {
              const evt = e as MouseEvent;
              if (evt.type === 'wheel') return true;
              return !evt.button;
            }}
          >
            {/* Geography shapes */}
            <Geographies geography={topology ?? GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
                geographies
                  .filter(geo => !HIDDEN_COUNTRIES.has(geo.id ?? '') && !HIDDEN_COUNTRIES.has(geo.properties.name))
                  .map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        // Continent-level hover: highlight entire continent
                        (hoveredContinent && zoom < ZOOM.CONTINENT_GONE && getContinent((geo.id as string) ?? '') === hoveredContinent)
                          ? SVG_COLORS.hoverFill
                          // Country-level hover (at deeper zoom): highlight individual country
                          : (zoom >= ZOOM.CONTINENT_GONE && hoveredCountry === geo.properties.name)
                            ? SVG_COLORS.hoverFill
                            : getFill(geo)
                      }
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
                  ))
              }
            </Geographies>

            {/* Continent outlines — visible at continent zoom, fade out at region zoom */}
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

            {/* Region outlines — visible at region zoom, fade into country zoom */}
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
                    dominantBaseline="central"
                    style={{
                      fontFamily: SVG_FONT_DISPLAY,
                      fontSize: '14px',
                      fontWeight: 600,
                      fill: SVG_COLORS.brownDark,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {continent.name.toUpperCase()}
                  </text>
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
                    x={12} y={-11}
                    width={region.length * 5.5 + 30} height={18} rx={9}
                    fill={SVG_COLORS.parchment} fillOpacity={0.94}
                    stroke={SVG_COLORS.stroke} strokeWidth={0.5}
                  />
                  <text x={18} y={2} style={{ fontFamily: SVG_FONT_BODY, fontSize: '9px', fontWeight: 500, fill: SVG_COLORS.brownDark }}>
                    {region}
                  </text>
                  <text x={18 + region.length * 5.5 + 4} y={2} style={{ fontFamily: SVG_FONT_BODY, fontSize: '9px', fontWeight: 700, fill: SVG_COLORS.terracotta }}>
                    ({count})
                  </text>
                </g>
              </Marker>
            ))}

            {/* ── Level 3: Country markers (viewport-filtered) ── */}
            {countryOpacity > 0 && visibleCountryMarkers.map(recipe => {
              const count = recipesByCountry.get(recipe.country)?.length ?? 0;
              return (
                <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${recipe.country}, ${count} recipe${count !== 1 ? 's' : ''}`}
                    style={{ cursor: 'pointer', outline: 'none', opacity: countryOpacity }}
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
                      style={{ fontFamily: SVG_FONT_BODY, fontSize: '11px', fontWeight: 600, fill: SVG_COLORS.brownDark }}
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

      {/* ── Hover tooltip (desktop) ── */}
      {hoveredCountry && !selectedCountry && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-parchment/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-medium text-brown-dark pointer-events-none z-10 hidden sm:block"
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
        {tappedCountry && !selectedCountry && !hoveredCountry && (
          <motion.div
            key={tappedCountry}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-parchment/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-medium text-brown-dark pointer-events-none z-10 sm:hidden"
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
            className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-brown-dark/90 backdrop-blur-sm text-parchment px-5 py-2.5 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-2 pointer-events-auto"
          >
            <span>Click a continent to explore its recipes</span>
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
        <div className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 bg-parchment/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md text-center z-10 max-w-xs">
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
            className="absolute top-14 left-3 bottom-3 sm:top-16 sm:left-4 sm:bottom-4 w-[calc(100vw-1.5rem)] max-w-72 bg-parchment/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto z-10"
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
                    </div>
                    <div className="p-3">
                      <h4 className="font-heading text-sm font-semibold text-brown-dark mb-1">{recipe.name}</h4>
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
