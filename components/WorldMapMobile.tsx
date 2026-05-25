'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Clock, RotateCcw, X } from 'lucide-react';

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
  const router = useRouter();
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

      {/* Recipe sheet — minimal interim version; full drag-to-expand arrives in Task 9 */}
      {selectedCountry && recipesByCountry.has(selectedCountry) && (
        <div
          className="fixed bottom-0 inset-x-0 z-20 bg-parchment border-t border-brown-light/30 rounded-t-2xl shadow-2xl flex flex-col max-h-[60dvh]"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          role="dialog"
          aria-label={`Recipes from ${selectedCountry}`}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
            <div className="flex items-baseline gap-2 min-w-0">
              <h3 className="font-heading text-lg font-bold text-brown-dark truncate leading-tight">
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
                onPointerEnter={() => router.prefetch(`/recipes/${encodeURIComponent(recipe.id)}`)}
                className="flex gap-3 bg-parchment rounded-xl overflow-hidden hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
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
