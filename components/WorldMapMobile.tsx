'use client';

/**
 * Mobile shell (Option C+).
 *
 * - Landscape MobileMapCanvas with east-west wrap.
 * - Thin bottom region rail: ambient escape valve. Auto-scrolls active
 *   region into view as you pan.
 * - Top-left breadcrumb: "you are here" name.
 * - First-visit coachmark: "Swipe to wander, double-tap to dive in".
 *   Auto-dismisses on first pan or after 3s.
 * - Recipe sheet floats above the rail with an 8px map-gap.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Clock, X } from 'lucide-react';

import type { CulinaryRegion, Filters } from '@/lib/types';
import type { AtlasRecipe } from '@/lib/atlas';
import { CULINARY_REGION_ORDER } from '@/lib/types';
import { REGION_CENTERS } from '@/lib/regions';
import { useMapTopology } from '@/hooks/useMapTopology';
import { useChoroplethFill, getChoroplethColor } from '@/hooks/useChoroplethFill';
import { useIsSepia } from '@/hooks/useTheme';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { useMobileMapPosition } from '@/hooks/useMobileMapPosition';

import MobileMapCanvas, {
  M_DEFAULT_CENTER, M_DEFAULT_ZOOM, M_ZOOM,
  M_VIEWBOX_WIDTH, M_VIEWBOX_HEIGHT, M_PROJ_SCALE, M_PAN_EXTENT,
  findClosestRegion,
} from './map/MobileMapCanvas';
import MapCoachmark from './map/MapCoachmark';
import MapSearch from './MapSearch';
import ChoroplethLegend from './ChoroplethLegend';

// FilterPanel pulls in rc-slider (plus its CSS); split it into its own chunk so
// it loads alongside (not blocking) the initial map render.
const FilterPanel = dynamic(() => import('./FilterPanel'), { ssr: false, loading: () => null });

const COACH_KEY = 'nieves-mobile-map-coach-seen';

// Mirror of the desktop getChoroplethLevel, but pinned to the MOBILE zoom
// bands the fill actually uses (continentFade 1.5 + M_ZOOM.REGION_FADE_OUT),
// so the legend caption ("per continent/region/country") stays in lockstep
// with how the map is coloured at the current zoom.
function getMobileChoroplethLevel(zoom: number): 'continent' | 'region' | 'country' {
  if (zoom < 1.5) return 'continent';
  if (zoom < M_ZOOM.REGION_FADE_OUT) return 'region';
  return 'country';
}

// Mobile-tuned zoom per region (portrait phone slice on a 16:9 viewBox
// shows ~33° of longitude at zoom 3.5, which is too tight). Targets
// ~50–70° of visible longitude per region for breathing room. All values
// sit at or above MobileMapCanvas LABEL_FULL (1.7) so a region tap always
// produces fully opaque country labels.
const REGION_TAP_ZOOM: Record<CulinaryRegion, number> = {
  'Western Europe':    2.8,
  'Eastern Europe':    2.8,
  'East Asia':         1.7,
  'Southeast Asia':    2.2,
  'South Asia':        2.2,
  'Middle East':       2.2,
  'North Africa':      1.8,
  'Sub-Saharan Africa':2.0,
  'North America':     1.7,
  'South America':     1.7,
  'Oceania':           1.7,
};

// Mobile-only centre overrides for region taps. REGION_CENTERS is shared
// with desktop; these tweaks keep specific regions framed nicely on a
// portrait phone slice without disturbing the desktop centres.
const REGION_TAP_CENTER: Partial<Record<CulinaryRegion, [number, number]>> = {
  // Western Europe shifts WEST so UK/Iberia/France/Germany dominate; the
  // eastern Balkans deliberately fall off so Eastern Europe looks visibly
  // different on tap.
  'Western Europe': [0, 48],
  // Eastern Europe shifts EAST (and slightly north) so Poland/Ukraine/
  // Romania/Balkans/western Russia dominate. UK no longer in frame here,
  // by design — that was the price of telling WE and EE apart on the rail.
  'Eastern Europe': [25, 52],
  // Shift south so Tierra del Fuego clears the bottom rail. The northern
  // frame clips at southern Mexico, which is fine for a "South America" view.
  'South America':  [-58, -20],
};

interface Props {
  recipes: AtlasRecipe[];
  /** Full unfiltered set — used by MapSearch so search ignores active filters. */
  allRecipes: AtlasRecipe[];
  isLoading?: boolean;
  flyTo?: { lng: number; lat: number; zoom?: number };
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount: number;
}

export default function WorldMapMobile({ recipes, allRecipes, isLoading, flyTo, filters, onFiltersChange, activeFilterCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isModalOpen = pathname?.startsWith('/recipes/') ?? false;

  const { topology } = useMapTopology();
  const isSepia = useIsSepia();
  const { summary } = useCookedStamps();

  const {
    controlledPos, zoom, center, handleMove, handleMoveEnd, zoomTo,
  } = useMobileMapPosition({
    initialPosition: flyTo
      ? { coordinates: [flyTo.lng, flyTo.lat], zoom: flyTo.zoom ?? M_ZOOM.REGION_FULL }
      : { coordinates: M_DEFAULT_CENTER, zoom: M_DEFAULT_ZOOM },
    projection: {
      viewBoxWidth: M_VIEWBOX_WIDTH,
      viewBoxHeight: M_VIEWBOX_HEIGHT,
      projScale: M_PROJ_SCALE,
      worldExtent: M_PAN_EXTENT,
    },
    wrapLongitude: true,
  });

  /* ── Recipe groupings ────────────────────────────────────────────── */
  const recipesByCountry = useMemo(() => {
    const m = new Map<string, AtlasRecipe[]>();
    for (const r of recipes) {
      const list = m.get(r.country) ?? [];
      list.push(r);
      m.set(r.country, list);
    }
    return m;
  }, [recipes]);

  const recipesByRegion = useMemo(() => {
    const m = new Map<CulinaryRegion, number>();
    for (const r of recipes) m.set(r.region, (m.get(r.region) ?? 0) + 1);
    return m;
  }, [recipes]);

  const recipesByContinent = useMemo(() => {
    const REGION_TO_CONT: Record<string, string> = {
      'Western Europe':'Europe','Eastern Europe':'Europe',
      'East Asia':'Asia','Southeast Asia':'Asia','South Asia':'Asia','Middle East':'Asia',
      'North Africa':'Africa','Sub-Saharan Africa':'Africa',
      'North America':'North America','South America':'South America','Oceania':'Oceania',
    };
    const m = new Map<string, number>();
    for (const [region, count] of recipesByRegion.entries()) {
      const c = REGION_TO_CONT[region];
      if (c) m.set(c, (m.get(c) ?? 0) + count);
    }
    return m;
  }, [recipesByRegion]);

  const recipesPerCountry = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of recipes) m.set(r.country, (m.get(r.country) ?? 0) + 1);
    return m;
  }, [recipes]);

  const maxRegionCount    = useMemo(() => Math.max(1, ...recipesByRegion.values()),    [recipesByRegion]);
  const maxContinentCount = useMemo(() => Math.max(1, ...recipesByContinent.values()), [recipesByContinent]);
  const maxCountryCount   = useMemo(() => Math.max(1, ...recipesPerCountry.values()),  [recipesPerCountry]);

  const countryNames = useMemo(() => {
    if (!topology) return [] as string[];
    const countries = (topology.objects.countries as unknown as { geometries: Array<{ properties: { name: string } }> }).geometries;
    return countries.map(c => c.properties.name);
  }, [topology]);

  const countryIsoById = useMemo(() => {
    if (!topology) return new Map<string, string>();
    const countries = (topology.objects.countries as unknown as { geometries: Array<{ id?: string; properties: { name: string } }> }).geometries;
    const m = new Map<string, string>();
    for (const c of countries) m.set(c.properties.name, c.id ?? '');
    return m;
  }, [topology]);

  const choroplethZoomBand = Math.round(zoom * 4) / 4;
  const fillByCountry = useChoroplethFill({
    zoomBand: choroplethZoomBand,
    bands: { continentFade: 1.5, regionFull: M_ZOOM.REGION_FULL, regionFadeOut: M_ZOOM.REGION_FADE_OUT, countryFull: M_ZOOM.COUNTRY_FULL },
    isSepia,
    recipesByContinent, maxContinentCount,
    recipesByRegion, maxRegionCount,
    recipesPerCountry, maxCountryCount,
    countryNames, countryIsoById,
  });

  /* ── Legend data (mirrors desktop) ───────────────────────────────── */
  const choroplethLevel = getMobileChoroplethLevel(zoom);
  const legendMaxCount = choroplethLevel === 'continent'
    ? maxContinentCount
    : choroplethLevel === 'region'
      ? maxRegionCount
      : maxCountryCount;
  const legendGetColor = useCallback(
    (count: number, max: number) => getChoroplethColor(count, max, isSepia),
    [isSepia],
  );

  /* ── Country selection ──────────────────────────────────────────── */
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const onCountryTap = useCallback((countryName: string) => {
    // Gate behind dot-visible zoom — at world view, fingers are too fat.
    if (zoom < M_ZOOM.DOT_FULL) return;
    if (recipesByCountry.has(countryName)) setSelectedCountry(countryName);
  }, [zoom, recipesByCountry]);

  const sheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const preSheetFocusRef = useRef<HTMLElement | null>(null);

  /* ── Region rail: active region tracks current pan centre ───────── */
  const activeRegion = useMemo(
    () => findClosestRegion(center, REGION_CENTERS),
    [center],
  );

  const railRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (!activeRegion) return;
    const el = chipRefs.current[activeRegion];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeRegion]);

  /* Focus management for the recipe sheet. Country markers are SVG circles
     with no tabindex, so we can't focus them back on close; we restore to
     whatever was focused before opening (typically a rail chip), and fall
     back to the active region chip if the original element is gone. */
  useEffect(() => {
    if (selectedCountry) {
      preSheetFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const id = requestAnimationFrame(() => sheetCloseRef.current?.focus());
      return () => cancelAnimationFrame(id);
    } else if (preSheetFocusRef.current) {
      const prev = preSheetFocusRef.current;
      preSheetFocusRef.current = null;
      if (document.body.contains(prev)) {
        prev.focus();
      } else {
        const fallback = activeRegion ? chipRefs.current[activeRegion] : null;
        fallback?.focus();
      }
    }
  }, [selectedCountry, activeRegion]);

  const onSearchSelect = useCallback((result: { country: string; coordinates: { lng: number; lat: number }; recipeId?: string }) => {
    // Every result type (country / recipe / ingredient) lands the user on the
    // country sheet — same behaviour as tapping a country marker on the map.
    // The user picks the recipe from there. Keeps the map as the hero and
    // makes search a "fly to a place", not a teleport into a single recipe.
    const target: [number, number] = [result.coordinates.lng, result.coordinates.lat];
    zoomTo({ coordinates: target, zoom: Math.max(zoom, M_ZOOM.LABEL_FULL) });
    setSelectedCountry(result.country);
  }, [zoom, zoomTo]);

  const onRegionTap = useCallback((region: CulinaryRegion) => {
    const target = REGION_CENTERS[region];
    if (!target) return;
    const coordinates = REGION_TAP_CENTER[region] ?? target.center;
    zoomTo({ coordinates, zoom: REGION_TAP_ZOOM[region] });
    setSelectedCountry(null);
  }, [zoomTo]);

  // Double-tap: a 1.5x step zoom centred on the tap point, unless we'd still
  // be below region-level zoom — then fly to the nearest region instead so
  // the user doesn't end up zoomed slightly into open ocean.
  const onDoubleTap = useCallback((coords: [number, number]) => {
    const nextZoom = Math.min(zoom * 1.5, 12);
    if (nextZoom < M_ZOOM.REGION_FULL) {
      const closest = findClosestRegion(coords, REGION_CENTERS);
      if (closest) {
        const target = REGION_TAP_CENTER[closest] ?? REGION_CENTERS[closest].center;
        zoomTo({ coordinates: target, zoom: REGION_TAP_ZOOM[closest] });
        return;
      }
    }
    zoomTo({ coordinates: coords, zoom: nextZoom });
  }, [zoom, zoomTo]);

  /* ── First-visit coachmark ──────────────────────────────────────── */
  const [showCoach, setShowCoach] = useState(false);
  const dismissCoach = useCallback(() => {
    setShowCoach(false);
    try { localStorage.setItem(COACH_KEY, '1'); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try {
      if (localStorage.getItem(COACH_KEY) === '1') return;
    } catch { /* private browsing */ }
    setShowCoach(true);
  }, []);
  // Dismiss on first pan
  useEffect(() => {
    if (!showCoach) return;
    if (center[0] !== M_DEFAULT_CENTER[0] || center[1] !== M_DEFAULT_CENTER[1]) {
      dismissCoach();
    }
  }, [center, showCoach, dismissCoach]);

  const sortedRegions = CULINARY_REGION_ORDER;

  return (
    <div className="fixed inset-0 z-0 bg-map-base" inert={isModalOpen}>
      {/* Map canvas — full bleed under all chrome */}
      <div className="absolute inset-0">
        <MobileMapCanvas
          recipes={recipes}
          topology={topology}
          controlledPos={controlledPos}
          liveZoom={zoom}
          onMove={handleMove}
          onMoveEnd={handleMoveEnd}
          fillByCountry={fillByCountry}
          onCountryTap={onCountryTap}
          onDoubleTap={onDoubleTap}
          uniqueCookedCountries={summary.uniqueCountries}
        />
      </div>

      {/* Vignette — keeps focus on centre, hides hard edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 140% 140% at 50% 50%, transparent 38%, var(--map-vignette) 100%)' }}
      />

      {/* Choropleth legend — mounts once (entrance plays on load), then fades
          out while a recipe sheet is open so it never sits behind the sheet.
          Opacity-only so the staggered entrance doesn't replay on every close. */}
      <motion.div
        animate={{ opacity: selectedCountry ? 0 : 1 }}
        transition={{ duration: 0.25, ease: [0.45, 0, 0.25, 1] }}
        aria-hidden={selectedCountry ? true : undefined}
      >
        <ChoroplethLegend
          level={choroplethLevel}
          maxCount={legendMaxCount}
          getColor={legendGetColor}
        />
      </motion.div>

      {/* Accessibility nav — hidden visually, reachable by screen reader/keyboard.
          Provides one-tap region nav that doesn't depend on the rail being focussable. */}
      <nav aria-label="Jump to culinary region" className="sr-only">
        <ul>
          {sortedRegions.map(region => {
            const count = recipesByRegion.get(region) ?? 0;
            return (
              <li key={region}>
                <button
                  onClick={() => onRegionTap(region)}
                  aria-disabled={count === 0 || undefined}
                  disabled={count === 0}
                >
                  {region}, {count} {count === 1 ? 'recipe' : 'recipes'}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Floating search pill — top-center, in the same chrome band as the
          breadcrumb (top-left) and filter FAB (top-right). When focused,
          MapSearch sets data-map-search-focused on <body>; globals.css
          fades the filter FAB out underneath the expanding pill so they
          never visually clash. */}
      <MapSearch
        recipes={allRecipes}
        onSelect={onSearchSelect}
        compact
        containerClassName="absolute top-[calc(4.5rem+env(safe-area-inset-top))] right-16 z-10"
      />

      {/* Filter FAB — top-right of the chrome band, beside the search icon. Its
          own fixed positioning (variant="fab") and data-filter-fab fade are
          unchanged from when this lived in the page; only its home moved here so
          filter state threads through the map shell. */}
      <FilterPanel
        variant="fab"
        filters={filters}
        onChange={onFiltersChange}
        activeFilterCount={activeFilterCount}
      />

      {/* Continent breadcrumb in top-left corner — orients the user as they pan.
          Tagged so it can fade while the mobile search expands leftward. */}
      <div
        data-map-breadcrumb
        aria-hidden="true"
        className="absolute top-[calc(4.5rem+env(safe-area-inset-top))] left-3 z-10 px-3 py-1.5 rounded-full bg-parchment/80 backdrop-blur-md border border-brown-light/25 shadow-sm transition-opacity duration-200"
      >
        <span className="font-heading text-xs font-medium text-brown-dark tracking-wide">
          {activeRegion ?? 'World'}
        </span>
      </div>

      {/* First-visit coachmark — animated finger demos the gesture */}
      {showCoach && <MapCoachmark onDismiss={dismissCoach} />}

      {/* Empty-filter-state banner — floats above the rail, leaving the sheet
          area clear. Only shown when filters exclude every recipe. */}
      {recipes.length === 0 && !isLoading && (
        <div
          role="status"
          className="absolute bottom-[60px] left-1/2 -translate-x-1/2 z-20 bg-parchment border border-brown-light/25 px-5 py-3 rounded-2xl shadow-sm text-center max-w-[calc(100vw-2rem)] w-[min(20rem,calc(100vw-2rem))]"
        >
          <p className="text-sm font-medium text-brown-dark">No recipes match your filters</p>
          <p className="text-xs text-brown-medium mt-0.5">Try adjusting your filters to see dishes on the map.</p>
        </div>
      )}

      {/* Thin region rail — bottom, ambient, escape valve. */}
      <div
        ref={railRef}
        role="tablist"
        aria-label="Regions"
        className="absolute bottom-0 inset-x-0 z-20 bg-parchment/75 backdrop-blur-md border-t border-brown-light/25"
        style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
      >
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-0 px-3 py-1.5 min-w-max">
            {sortedRegions.map(region => {
              const count = recipesByRegion.get(region) ?? 0;
              const isActive = activeRegion === region;
              return (
                <button
                  key={region}
                  ref={el => { chipRefs.current[region] = el; }}
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={count === 0 || undefined}
                  onClick={() => onRegionTap(region)}
                  className={`relative shrink-0 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    isActive ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'
                  } ${count === 0 ? 'opacity-50' : ''}`}
                >
                  {region}
                  {isActive && (
                    <span aria-hidden="true" className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-terracotta rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recipe sheet — floats above the rail with a small map-gap. Reads as a
          card lifted off the page. Rail stays accessible underneath. */}
      {selectedCountry && recipesByCountry.has(selectedCountry) && (
        <div
          role="dialog"
          aria-label={`Recipes from ${selectedCountry}`}
          className="absolute bottom-[52px] left-3 right-3 z-30 bg-parchment border border-brown-light/30 rounded-2xl shadow-[0_18px_40px_-12px_rgba(60,40,20,0.32)] flex flex-col max-h-[55dvh] overflow-hidden"
          style={{ paddingBottom: '0.5rem' }}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
            <div className="flex items-baseline gap-2 min-w-0">
              <h3 className="font-heading text-lg font-bold text-brown-dark leading-snug pb-0.5">
                {selectedCountry}
              </h3>
              <span className="text-xs text-brown-medium shrink-0">
                {recipesByCountry.get(selectedCountry)!.length} recipe{recipesByCountry.get(selectedCountry)!.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              ref={sheetCloseRef}
              onClick={() => setSelectedCountry(null)}
              aria-label="Close recipe panel"
              className="p-1.5 -mr-1.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-y-auto px-4 pb-3 space-y-3">
            {recipesByCountry.get(selectedCountry)!.map(recipe => (
              <Link
                key={recipe.id}
                href={`/recipes/${encodeURIComponent(recipe.id)}`}
                onPointerEnter={() => router.prefetch(`/recipes/${encodeURIComponent(recipe.id)}`)}
                className="flex gap-3 bg-parchment rounded-xl overflow-hidden hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                  <Image src={recipe.image} alt={recipe.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 py-1 pr-1">
                  <h4 className="font-heading text-sm font-semibold text-brown-dark leading-tight mb-1 line-clamp-2">{recipe.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-brown-medium">
                    <span className="inline-flex items-center gap-0.5">
                      <Clock size={11} className="shrink-0" />
                      {recipe.time.total}m
                    </span>
                    <span className={`font-semibold px-1.5 py-0.5 rounded-full ${
                      recipe.difficulty === 'Easy' ? 'bg-sage text-brown-dark' :
                      recipe.difficulty === 'Medium' ? 'bg-turmeric text-brown-dark' :
                      'bg-paprika text-parchment'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
