'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RotateCcw } from 'lucide-react';

import type { Recipe } from '@/lib/types';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { useMapTopology } from '@/hooks/useMapTopology';
import { useMobileMapPosition } from '@/hooks/useMobileMapPosition';
import { useChoroplethFill } from '@/hooks/useChoroplethFill';
import { useIsSepia } from '@/hooks/useTheme';

import MobileMapCanvas, {
  M_DEFAULT_CENTER, M_DEFAULT_ZOOM,
  M_VIEWBOX_WIDTH, M_VIEWBOX_HEIGHT, M_PROJ_SCALE, M_WORLD_EXTENT,
  M_ZOOM,
} from './map/MobileMapCanvas';

interface Props {
  recipes: Recipe[];
  isLoading?: boolean;
  flyTo?: { lng: number; lat: number; zoom?: number };
}

export default function WorldMapMobile({ recipes, flyTo }: Props) {
  const pathname = usePathname();
  const isModalOpen = pathname?.startsWith('/recipes/') ?? false;

  const { topology, continentOutlines } = useMapTopology();
  const isSepia = useIsSepia();
  const { summary } = useCookedStamps();

  const {
    controlledPos, zoom, center, handleMove, handleMoveEnd, zoomTo,
  } = useMobileMapPosition({
    initialPosition: flyTo
      ? { coordinates: [flyTo.lng, flyTo.lat], zoom: flyTo.zoom ?? M_ZOOM.COUNTRY_FULL }
      : { coordinates: M_DEFAULT_CENTER, zoom: M_DEFAULT_ZOOM },
    projection: {
      viewBoxWidth: M_VIEWBOX_WIDTH,
      viewBoxHeight: M_VIEWBOX_HEIGHT,
      projScale: M_PROJ_SCALE,
      worldExtent: M_WORLD_EXTENT,
    },
  });

  const choroplethZoomBand = Math.round(zoom * 4) / 4;
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  /* Recipes by country / region / continent counts */
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
    const m = new Map<Recipe['region'], number>();
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

  const fillByCountry = useChoroplethFill({
    zoomBand: choroplethZoomBand,
    bands: { continentFade: M_ZOOM.CONTINENT_FADE, regionFull: M_ZOOM.REGION_FULL, regionFadeOut: M_ZOOM.REGION_FADE_OUT, countryFull: M_ZOOM.COUNTRY_FULL },
    isSepia,
    recipesByContinent, maxContinentCount,
    recipesByRegion, maxRegionCount,
    recipesPerCountry, maxCountryCount,
    countryNames, countryIsoById,
  });

  const onCountryTap = useCallback((countryName: string) => {
    if (recipesByCountry.has(countryName)) {
      setSelectedCountry(countryName);
    }
  }, [recipesByCountry]);

  const resetView = useCallback(() => {
    zoomTo({ coordinates: M_DEFAULT_CENTER, zoom: M_DEFAULT_ZOOM });
    setSelectedCountry(null);
  }, [zoomTo]);

  return (
    <div className="fixed inset-0 z-0 bg-map-base" inert={isModalOpen}>
      <div className="absolute inset-0">
        <MobileMapCanvas
          recipes={recipes}
          topology={topology}
          continentOutlines={continentOutlines}
          controlledPos={controlledPos}
          zoom={zoom}
          center={center}
          handleMove={handleMove}
          handleMoveEnd={handleMoveEnd}
          fillByCountry={fillByCountry}
          onCountryTap={onCountryTap}
          uniqueCookedCountries={summary.uniqueCountries}
        />
      </div>

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 140% 140% at 50% 50%, transparent 36%, var(--map-vignette) 100%)' }}
      />

      {/* Zoom + reset controls — right side, vertically centred */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3 z-10 flex flex-col items-center gap-1.5">
        <button
          onClick={() => zoomTo({ coordinates: center, zoom: Math.min(zoom * 1.5, 12) })}
          aria-label="Zoom in"
          className="w-11 h-11 rounded-full bg-parchment/80 backdrop-blur border border-brown-medium/20 flex items-center justify-center font-heading text-xl text-brown-dark"
        >+</button>
        <button
          onClick={() => zoomTo({ coordinates: center, zoom: Math.max(zoom / 1.5, 0.85) })}
          aria-label="Zoom out"
          className="w-11 h-11 rounded-full bg-parchment/80 backdrop-blur border border-brown-medium/20 flex items-center justify-center font-heading text-xl text-brown-dark"
        >−</button>
        <button
          onClick={resetView}
          aria-label="Reset map view"
          className="w-11 h-11 rounded-full bg-parchment/80 backdrop-blur border border-brown-medium/20 flex items-center justify-center text-brown-medium"
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Recipe sidebar placeholder — real sheet arrives in Task 9 */}
      {selectedCountry && recipesByCountry.has(selectedCountry) && (
        <div className="fixed bottom-0 inset-x-0 bg-parchment border-t border-brown-light/30 px-4 py-3 z-20" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center justify-between">
            <span className="font-heading text-base font-semibold text-brown-dark">{selectedCountry}</span>
            <button onClick={() => setSelectedCountry(null)} aria-label="Close" className="text-brown-medium">✕</button>
          </div>
          <p className="text-xs text-brown-medium mt-0.5">{recipesByCountry.get(selectedCountry)!.length} recipe(s)</p>
        </div>
      )}
    </div>
  );
}
