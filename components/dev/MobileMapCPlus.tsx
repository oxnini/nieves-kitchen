'use client';

/**
 * Spike shell for Option C+ — pan-first mobile map.
 *
 * Composition:
 * - MobileMapCPlusCanvas: landscape viewBox, triple-render wrap.
 * - Thin bottom region rail: ambient accessibility/escape valve.
 *   Auto-scrolls active region into view as you pan.
 * - First-visit coachmark: "Swipe to wander · double-tap to dive in".
 *   Auto-dismisses on first pan or after 3s.
 * - Recipe sheet: minimal port from WorldMapMobile. Tap → recipes.
 *
 * Not wired into production routing. Lives at /dev/mobile-map-c-plus.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, X } from 'lucide-react';

import type { Recipe, CulinaryRegion } from '@/lib/types';
import { CULINARY_REGION_ORDER } from '@/lib/types';
import { REGION_CENTERS } from '@/lib/regions';
import { useMapTopology } from '@/hooks/useMapTopology';
import { useChoroplethFill } from '@/hooks/useChoroplethFill';
import { useIsSepia } from '@/hooks/useTheme';
import { useCookedStamps } from '@/hooks/useCookedStamps';

import MobileMapCPlusCanvas, {
  C_DEFAULT_CENTER, C_DEFAULT_ZOOM, C_ZOOM, findClosestRegion,
} from './MobileMapCPlusCanvas';

const COACH_KEY = 'nieves-mobile-map-c-plus-coach-seen';
const COACH_AUTO_DISMISS_MS = 3000;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Position { coordinates: [number, number]; zoom: number }

interface Props {
  recipes: Recipe[];
}

export default function MobileMapCPlus({ recipes }: Props) {
  const { topology } = useMapTopology();
  const isSepia = useIsSepia();
  const { summary } = useCookedStamps();

  /* ── Pan state (inline; spike doesn't need useMobileMapPosition) ── */
  const [controlledPos, setControlledPos] = useState<Position>({
    coordinates: C_DEFAULT_CENTER,
    zoom: C_DEFAULT_ZOOM,
  });
  const [liveZoom, setLiveZoom] = useState(C_DEFAULT_ZOOM);
  const [liveCenter, setLiveCenter] = useState<[number, number]>(C_DEFAULT_CENTER);
  const animFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const rafThrottleRef = useRef(0);

  const handleMove = useCallback(({ zoom }: { x: number; y: number; zoom: number }) => {
    if (isAnimatingRef.current) return;
    const now = performance.now();
    if (now - rafThrottleRef.current < 16) return;
    rafThrottleRef.current = now;
    setLiveZoom(Math.round(zoom * 100) / 100);
  }, []);

  const handleMoveEnd = useCallback(({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => {
    if (isAnimatingRef.current) return;
    // East/west wrap: normalise lng back into [-180, 180]. Visual position
    // is identical because the triple-rendered copies cover the seam.
    let [lng, lat] = coordinates;
    if (lng > 180) lng -= 360;
    else if (lng < -180) lng += 360;
    setControlledPos({ coordinates: [lng, lat], zoom });
    setLiveCenter([lng, lat]);
    setLiveZoom(zoom);
  }, []);

  const zoomTo = useCallback((target: Position, duration = 700) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const startCenter: [number, number] = [...liveCenter];
    const startZoom = liveZoom;
    const startTime = performance.now();
    isAnimatingRef.current = true;

    // Wrap-aware delta: pick shorter direction around the globe
    let dLng = target.coordinates[0] - startCenter[0];
    if (dLng > 180) dLng -= 360;
    else if (dLng < -180) dLng += 360;
    const dLat = target.coordinates[1] - startCenter[1];
    const dZoom = target.zoom - startZoom;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const e = easeInOutCubic(t);
      let lng = startCenter[0] + dLng * e;
      if (lng > 180) lng -= 360;
      else if (lng < -180) lng += 360;
      const pos: Position = {
        coordinates: [lng, startCenter[1] + dLat * e],
        zoom: startZoom + dZoom * e,
      };
      setControlledPos(pos);
      setLiveCenter(pos.coordinates);
      setLiveZoom(pos.zoom);
      if (t < 1) animFrameRef.current = requestAnimationFrame(tick);
      else { animFrameRef.current = null; isAnimatingRef.current = false; }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [liveCenter, liveZoom]);

  useEffect(() => () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  /* ── Recipe groupings ────────────────────────────────────────────── */
  const recipesByCountry = useMemo(() => {
    const m = new Map<string, Recipe[]>();
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

  const maxRegionCount = useMemo(() => Math.max(1, ...recipesByRegion.values()), [recipesByRegion]);
  const maxContinentCount = useMemo(() => Math.max(1, ...recipesByContinent.values()), [recipesByContinent]);
  const maxCountryCount = useMemo(() => Math.max(1, ...recipesPerCountry.values()), [recipesPerCountry]);

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

  const choroplethZoomBand = Math.round(liveZoom * 4) / 4;
  const fillByCountry = useChoroplethFill({
    zoomBand: choroplethZoomBand,
    bands: { continentFade: 1.5, regionFull: C_ZOOM.REGION_FULL, regionFadeOut: C_ZOOM.REGION_FADE_OUT, countryFull: C_ZOOM.COUNTRY_FULL },
    isSepia,
    recipesByContinent, maxContinentCount,
    recipesByRegion, maxRegionCount,
    recipesPerCountry, maxCountryCount,
    countryNames, countryIsoById,
  });

  /* ── Country selection ──────────────────────────────────────────── */
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const onCountryTap = useCallback((countryName: string) => {
    // Gate behind dot-visible zoom — at world view, fingers are too fat.
    if (liveZoom < C_ZOOM.DOT_FULL) return;
    if (recipesByCountry.has(countryName)) setSelectedCountry(countryName);
  }, [liveZoom, recipesByCountry]);

  /* ── Region rail: active region tracks current pan centre ───────── */
  const activeRegion = useMemo(
    () => findClosestRegion(liveCenter, REGION_CENTERS),
    [liveCenter],
  );

  const railRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (!activeRegion) return;
    const el = chipRefs.current[activeRegion];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeRegion]);

  // Mobile-tuned zoom per region (portrait phone slice on a 16:9 viewBox
  // shows ~33° of longitude at zoom 3.5, which is way too tight).
  // Targeting ~60–70° of visible longitude per region for breathing room.
  const REGION_TAP_ZOOM: Record<CulinaryRegion, number> = useMemo(() => ({
    'Western Europe':    2.4,
    'Eastern Europe':    2.0,
    'East Asia':         1.8,
    'Southeast Asia':    2.2,
    'South Asia':        2.2,
    'Middle East':       2.2,
    'North Africa':      1.8,
    'Sub-Saharan Africa':1.6,
    'North America':     1.5,
    'South America':     1.8,
    'Oceania':           1.8,
  }), []);

  const onRegionTap = useCallback((region: CulinaryRegion) => {
    const target = REGION_CENTERS[region];
    if (!target) return;
    zoomTo({ coordinates: target.center, zoom: REGION_TAP_ZOOM[region] });
    setSelectedCountry(null);
  }, [zoomTo, REGION_TAP_ZOOM]);

  /* ── First-visit coachmark ──────────────────────────────────────── */
  const [showCoach, setShowCoach] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(COACH_KEY) === '1') return;
    } catch { /* private browsing */ }
    setShowCoach(true);
    const id = window.setTimeout(() => dismissCoach(), COACH_AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dismissCoach = useCallback(() => {
    setShowCoach(false);
    try { localStorage.setItem(COACH_KEY, '1'); } catch { /* ignore */ }
  }, []);
  // Dismiss on first pan
  useEffect(() => {
    if (!showCoach) return;
    if (liveCenter[0] !== C_DEFAULT_CENTER[0] || liveCenter[1] !== C_DEFAULT_CENTER[1]) {
      dismissCoach();
    }
  }, [liveCenter, showCoach, dismissCoach]);

  const sortedRegions = CULINARY_REGION_ORDER;

  return (
    <div className="fixed inset-0 bg-map-base">
      {/* Map canvas — full bleed under all chrome */}
      <div className="absolute inset-0">
        <MobileMapCPlusCanvas
          recipes={recipes}
          topology={topology}
          controlledPos={controlledPos}
          liveZoom={liveZoom}
          onMove={handleMove}
          onMoveEnd={handleMoveEnd}
          fillByCountry={fillByCountry}
          onCountryTap={onCountryTap}
          uniqueCookedCountries={summary.uniqueCountries}
        />
      </div>

      {/* Vignette — keeps focus on centre, hides hard edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 140% 140% at 50% 50%, transparent 38%, var(--map-vignette) 100%)' }}
      />

      {/* Accessibility nav — hidden visually, reachable by screen reader/keyboard.
          Provides one-tap region nav that doesn't depend on the rail being focussable. */}
      <nav aria-label="Jump to culinary region" className="sr-only">
        <ul>
          {sortedRegions.map(region => (
            <li key={region}>
              <button onClick={() => onRegionTap(region)}>
                {region}, {recipesByRegion.get(region) ?? 0} recipes
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Continent breadcrumb in top-left corner — orients the user as they pan. */}
      <div
        aria-hidden="true"
        className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-parchment/80 backdrop-blur-md border border-brown-light/25 shadow-sm"
      >
        <span className="font-heading text-xs font-medium text-brown-dark tracking-wide">
          {activeRegion ?? 'World'}
        </span>
      </div>

      {/* First-visit coachmark */}
      {showCoach && (
        <button
          onClick={dismissCoach}
          aria-label="Dismiss hint"
          className="absolute left-1/2 -translate-x-1/2 bottom-[88px] z-30 px-4 py-2.5 rounded-full bg-parchment/95 backdrop-blur-md border border-brown-light/30 shadow-lg flex items-center gap-2 animate-pulse"
          style={{ animationDuration: '2.4s' }}
        >
          <span className="text-xs font-body text-brown-medium" aria-hidden="true">👆</span>
          <span className="font-body text-sm text-brown-dark">
            Swipe to wander, double-tap to dive in
          </span>
        </button>
      )}

      {/* Thin region rail — bottom, ambient, escape valve.
          Sized small enough not to fight the map. */}
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
              onClick={() => setSelectedCountry(null)}
              aria-label="Close recipe panel"
              className="p-1.5 -mr-1.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-y-auto px-4 pb-3 space-y-3">
            {recipesByCountry.get(selectedCountry)!.map(recipe => (
              <Link
                key={recipe.id}
                href={`/recipes/${encodeURIComponent(recipe.id)}`}
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
