'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ComposableMap, Geographies, Geography,
  Marker, ZoomableGroup,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Recipe, CulinaryRegion } from '@/lib/types';
import {
  COUNTRY_TO_REGION, REGION_CENTERS, REGION_LABEL_POSITIONS,
  CHOROPLETH_BASE, CHOROPLETH_LIGHT, CHOROPLETH_EMPTY,
} from '@/lib/regions';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const HIDDEN_COUNTRIES = new Set(['ATA', '010']);

interface Position {
  coordinates: [number, number];
  zoom: number;
}

function getChoroplethColor(recipeCount: number, maxCount: number): string {
  if (recipeCount === 0) return CHOROPLETH_LIGHT;
  const t = recipeCount / maxCount;
  const intensity = 0.35 + 0.65 * t;
  const lightR = 235, lightG = 220, lightB = 205;
  const r = Math.round(CHOROPLETH_BASE.r * intensity + lightR * (1 - intensity));
  const g = Math.round(CHOROPLETH_BASE.g * intensity + lightG * (1 - intensity));
  const b = Math.round(CHOROPLETH_BASE.b * intensity + lightB * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function WorldMap({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const [position, setPosition] = useState<Position>({ coordinates: [20, 20], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<CulinaryRegion | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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
    [recipesByRegion]
  );

  const markers = useMemo(() => {
    const seen = new Set<string>();
    return recipes.filter(r => {
      if (seen.has(r.country)) return false;
      seen.add(r.country);
      return true;
    });
  }, [recipes]);

  const getFill = useCallback(
    (geo: { properties: { name: string }; id?: string }) => {
      const isoCode = (geo.id as string) ?? '';
      const region = COUNTRY_TO_REGION[isoCode];
      const countryName = geo.properties.name;
      const hasRecipes = recipesByCountry.has(countryName);
      if (selectedRegion) {
        if (region === selectedRegion) {
          if (hasRecipes) {
            const count = recipesByCountry.get(countryName)!.length;
            const regionCount = recipesByRegion.get(selectedRegion) ?? 1;
            return getChoroplethColor(count, regionCount);
          }
          return CHOROPLETH_LIGHT;
        }
        return '#EDE6DC';
      }
      if (region) return getChoroplethColor(recipesByRegion.get(region) ?? 0, maxRegionCount);
      return CHOROPLETH_EMPTY;
    },
    [selectedRegion, recipesByCountry, recipesByRegion, maxRegionCount]
  );

  function handleCountryClick(geo: { properties: { name: string }; id?: string }) {
    const countryName = geo.properties.name;
    const isoCode = (geo.id as string) ?? '';
    const region = COUNTRY_TO_REGION[isoCode];
    const countryRecipes = recipesByCountry.get(countryName);
    if (!selectedRegion && region) {
      const regionData = REGION_CENTERS[region];
      setPosition({ coordinates: regionData.center, zoom: regionData.zoom });
      setSelectedRegion(region);
      setSelectedCountry(null);
    } else if (countryRecipes && countryRecipes.length > 0) {
      setSelectedCountry(countryName);
    }
  }

  function handleMarkerClick(recipe: Recipe) {
    if (selectedCountry === recipe.country) return;
    setSelectedCountry(recipe.country);
    const regionData = REGION_CENTERS[recipe.region];
    setPosition({ coordinates: regionData.center, zoom: regionData.zoom });
    setSelectedRegion(recipe.region);
  }

  function resetView() {
    setPosition({ coordinates: [20, 20], zoom: 1 });
    setSelectedRegion(null);
    setSelectedCountry(null);
  }

  const activeRegions = useMemo(() => {
    const out: { region: CulinaryRegion; count: number; position: [number, number] }[] = [];
    for (const [region, count] of recipesByRegion.entries()) {
      if (count > 0) out.push({ region, count, position: REGION_LABEL_POSITIONS[region] });
    }
    return out;
  }, [recipesByRegion]);

  const countryRecipes = selectedCountry ? recipesByCountry.get(selectedCountry) ?? [] : [];

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm">
        <button
          onClick={resetView}
          className={`font-medium transition-colors ${!selectedRegion ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
        >
          World
        </button>
        {selectedRegion && (
          <>
            <ChevronRight size={14} className="text-brown-light" />
            <button
              onClick={() => setSelectedCountry(null)}
              className={`font-medium transition-colors ${!selectedCountry ? 'text-terracotta' : 'text-brown-medium hover:text-brown-dark'}`}
            >
              {selectedRegion}
            </button>
          </>
        )}
        {selectedCountry && (
          <>
            <ChevronRight size={14} className="text-brown-light" />
            <span className="font-medium text-terracotta">{selectedCountry}</span>
          </>
        )}
      </div>

      <div className="w-full h-full map-bg" style={{ touchAction: 'none' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            onMoveEnd={({ coordinates, zoom }: Position) => {
              setPosition({ coordinates, zoom });
              if (selectedRegion && zoom <= 1.5) {
                setSelectedRegion(null);
                setSelectedCountry(null);
              }
            }}
            maxZoom={12}
            filterZoomEvent={(e: unknown) => {
              const evt = e as MouseEvent;
              if (evt.type === 'wheel') return true;
              return !evt.button;
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
                geographies
                  .filter(geo => !HIDDEN_COUNTRIES.has(geo.id ?? '') && !HIDDEN_COUNTRIES.has(geo.properties.name))
                  .map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={hoveredCountry === geo.properties.name ? '#D4A373' : getFill(geo)}
                      stroke="#C8B9A8"
                      strokeWidth={0.6}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.2s' },
                        hover:   { outline: 'none', cursor: 'pointer' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => handleCountryClick(geo)}
                    />
                  ))
              }
            </Geographies>

            {!selectedRegion && activeRegions.map(({ region, count, position: pos }) => (
              <Marker key={region} coordinates={pos}>
                <g style={{ cursor: 'pointer' }} onClick={() => {
                  const regionData = REGION_CENTERS[region];
                  setPosition({ coordinates: regionData.center, zoom: regionData.zoom });
                  setSelectedRegion(region);
                  setSelectedCountry(null);
                }}>
                  <circle r={5} fill="#FDF6EC" stroke="#5D4037" strokeWidth={1.2} />
                  <circle r={2.5} fill="#5D4037" />
                  <rect x={12} y={-11} width={region.length * 5.5 + 30} height={18} rx={9}
                    fill="white" fillOpacity={0.92} stroke="#C8B9A8" strokeWidth={0.5} />
                  <text x={18} y={2} style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 500, fill: '#3E2723' }}>
                    {region}
                  </text>
                  <text x={18 + region.length * 5.5 + 4} y={2} style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 700, fill: '#E2725B' }}>
                    ({count})
                  </text>
                </g>
              </Marker>
            ))}

            {selectedRegion && markers
              .filter(r => r.region === selectedRegion)
              .map(recipe => {
                const count = recipesByCountry.get(recipe.country)?.length ?? 0;
                return (
                  <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}
                    onClick={() => handleMarkerClick(recipe)}>
                    <g style={{ cursor: 'pointer' }}>
                      <circle r={6} fill="#E2725B" stroke="#FDF6EC" strokeWidth={1.5} opacity={0.9} />
                      <text textAnchor="middle" y={-10} style={{ fontFamily: 'Inter', fontSize: '8px', fontWeight: 600, fill: '#3E2723' }}>
                        {recipe.country} ({count})
                      </text>
                    </g>
                  </Marker>
                );
              })
            }
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {hoveredCountry && !selectedCountry && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-medium text-brown-dark pointer-events-none z-10">
          {hoveredCountry}
          {recipesByCountry.has(hoveredCountry) && (
            <span className="text-terracotta ml-1.5">
              ({recipesByCountry.get(hoveredCountry)!.length} recipe{recipesByCountry.get(hoveredCountry)!.length > 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedCountry && countryRecipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-16 left-4 bottom-4 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto z-10"
          >
            <div className="p-4">
              <h3 className="font-heading text-lg font-bold text-brown-dark mb-1">{selectedCountry}</h3>
              <p className="text-xs text-brown-medium mb-4">
                {countryRecipes.length} recipe{countryRecipes.length > 1 ? 's' : ''}
              </p>
              <div className="space-y-3">
                {countryRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                    className="w-full bg-parchment rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow group"
                  >
                    <div className="h-28 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
