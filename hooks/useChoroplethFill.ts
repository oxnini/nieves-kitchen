'use client';

import { useMemo } from 'react';

import {
  CHOROPLETH_BASE, CHOROPLETH_LIGHT, CHOROPLETH_EMPTY,
  COUNTRY_NAME_TO_REGION, COUNTRY_TO_REGION,
  SEPIA_CHOROPLETH_BASE, SEPIA_CHOROPLETH_EMPTY, SEPIA_CHOROPLETH_LIGHT,
} from '@/lib/regions';
import type { CulinaryRegion } from '@/lib/types';

interface ZoomBands {
  /** When choropleth begins to fade from continent-blend to region-blend */
  continentFade: number;
  /** When choropleth is fully at region-blend */
  regionFull: number;
  /** When choropleth begins fading from region-blend to country-blend */
  regionFadeOut: number;
  /** When choropleth is fully at country-blend */
  countryFull: number;
}

interface Input {
  /** Quantised zoom band (e.g. Math.round(zoom * 4) / 4) so the map is rebuilt only at zoom-band boundaries */
  zoomBand: number;
  bands: ZoomBands;
  isSepia: boolean;
  recipesByContinent: Map<string, number>;
  maxContinentCount: number;
  recipesByRegion: Map<CulinaryRegion, number>;
  maxRegionCount: number;
  recipesPerCountry: Map<string, number>;
  maxCountryCount: number;
  /** Country names to compute fills for (skip everything else) */
  countryNames: Iterable<string>;
  /** ISO id lookups for the country (used to resolve region) */
  countryIsoById?: Map<string, string>;
}

const REGION_TO_CONTINENT: Record<CulinaryRegion, string> = {
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

function parseRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  const m = color.match(/(\d+)/g);
  return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0];
}

function lerpColor(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const [ar, ag, ab] = parseRgb(a);
  const [br, bg, bb] = parseRgb(b);
  return `rgb(${Math.round(ar + (br - ar) * t)}, ${Math.round(ag + (bg - ag) * t)}, ${Math.round(ab + (bb - ab) * t)})`;
}

function blendFactor(zoom: number, start: number, end: number): number {
  if (zoom <= start) return 0;
  if (zoom >= end) return 1;
  return (zoom - start) / (end - start);
}

function getChoroplethColor(recipeCount: number, maxCount: number, isSepia: boolean): string {
  const base = isSepia ? SEPIA_CHOROPLETH_BASE : CHOROPLETH_BASE;
  const light = isSepia ? SEPIA_CHOROPLETH_LIGHT : CHOROPLETH_LIGHT;
  if (recipeCount === 0) return light;
  const t = recipeCount / maxCount;
  const maxIntensity = isSepia ? 0.55 : 0.65;
  const intensity = 0.35 + maxIntensity * t;
  // Low-density blend floor: warm cream in light, deep cobalt (#16324F) at night.
  const lightR = isSepia ? 22 : 235;
  const lightG = isSepia ? 50 : 220;
  const lightB = isSepia ? 79 : 205;
  const r = Math.round(base.r * intensity + lightR * (1 - intensity));
  const g = Math.round(base.g * intensity + lightG * (1 - intensity));
  const b = Math.round(base.b * intensity + lightB * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Returns a Map<countryName, rgbColor>. Recomputed only when the quantised
 *  zoom band changes (or when filter-driven recipe counts change). */
export function useChoroplethFill(input: Input): Map<string, string> {
  const {
    zoomBand, bands, isSepia,
    recipesByContinent, maxContinentCount,
    recipesByRegion, maxRegionCount,
    recipesPerCountry, maxCountryCount,
    countryNames, countryIsoById,
  } = input;

  return useMemo(() => {
    const empty = isSepia ? SEPIA_CHOROPLETH_EMPTY : CHOROPLETH_EMPTY;
    const t1 = blendFactor(zoomBand, bands.continentFade, bands.regionFull);
    const t2 = blendFactor(zoomBand, bands.regionFadeOut, bands.countryFull);
    const fills = new Map<string, string>();

    for (const name of countryNames) {
      const iso = countryIsoById?.get(name) ?? '';
      const region = COUNTRY_TO_REGION[iso] ?? COUNTRY_NAME_TO_REGION[name];
      if (!region) {
        fills.set(name, empty);
        continue;
      }
      const continent = REGION_TO_CONTINENT[region];
      const macroColor = getChoroplethColor(
        continent ? (recipesByContinent.get(continent) ?? 0) : 0,
        maxContinentCount, isSepia,
      );
      const mesoColor = getChoroplethColor(
        recipesByRegion.get(region) ?? 0, maxRegionCount, isSepia,
      );
      const microColor = getChoroplethColor(
        recipesPerCountry.get(name) ?? 0, maxCountryCount, isSepia,
      );
      let color: string;
      if (t1 < 1) color = lerpColor(macroColor, mesoColor, t1);
      else if (t2 < 1) color = lerpColor(mesoColor, microColor, t2);
      else color = microColor;
      fills.set(name, color);
    }
    return fills;
  }, [
    zoomBand, bands.continentFade, bands.regionFull, bands.regionFadeOut, bands.countryFull,
    isSepia,
    recipesByContinent, maxContinentCount,
    recipesByRegion, maxRegionCount,
    recipesPerCountry, maxCountryCount,
    countryNames, countryIsoById,
  ]);
}

export { getChoroplethColor };
