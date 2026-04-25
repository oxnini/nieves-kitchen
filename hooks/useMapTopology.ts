import { useState, useEffect, useMemo } from 'react';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { MultiPolygon } from 'geojson';
import { COUNTRY_TO_REGION, COUNTRY_NAME_TO_REGION } from '@/lib/regions';
import type { CulinaryRegion } from '@/lib/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/** Continent assignment derived from COUNTRY_TO_REGION */
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

function resolveRegion(id: string, name?: string): CulinaryRegion | undefined {
  return COUNTRY_TO_REGION[id] ?? (name ? COUNTRY_NAME_TO_REGION[name] : undefined);
}

function getContinentForGeo(id: string, name?: string): string | null {
  const region = resolveRegion(id, name);
  if (!region) return null;
  return REGION_TO_CONTINENT[region] ?? null;
}

export interface MergedOutline {
  key: string;
  /** Merged GeoJSON MultiPolygon geometry — render with the map's own path generator */
  geometry: MultiPolygon;
}

export interface MapTopologyData {
  /** Raw topology for passing to <Geographies geography={topology}> */
  topology: Topology | null;
  /** Merged continent outlines as GeoJSON geometries */
  continentOutlines: MergedOutline[];
  /** Merged region outlines as GeoJSON geometries */
  regionOutlines: MergedOutline[];
  /** Whether data is still loading */
  isLoading: boolean;
}

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
      const name = (geo.properties as { name?: string })?.name;
      const continent = getContinentForGeo(geo.id as string, name);
      if (!continent) continue;
      const list = groups.get(continent) ?? [];
      list.push(geo);
      groups.set(continent, list);
    }

    // Merge each group into a single outline
    const outlines: MergedOutline[] = [];
    for (const [continent, geos] of groups.entries()) {
      const merged = topojson.merge(
        topology as unknown as Parameters<typeof topojson.merge>[0],
        geos as unknown as Parameters<typeof topojson.merge>[1],
      );
      outlines.push({ key: continent, geometry: merged as MultiPolygon });
    }
    return outlines;
  }, [topology]);

  const regionOutlines = useMemo(() => {
    if (!topology) return [];
    const countries = (topology.objects.countries as GeometryCollection).geometries;

    // Group geometries by CulinaryRegion
    const groups = new Map<CulinaryRegion, typeof countries>();
    for (const geo of countries) {
      const name = (geo.properties as { name?: string })?.name;
      const region = resolveRegion(geo.id as string, name);
      if (!region) continue;
      const list = groups.get(region) ?? [];
      list.push(geo);
      groups.set(region, list);
    }

    const outlines: MergedOutline[] = [];
    for (const [region, geos] of groups.entries()) {
      const merged = topojson.merge(
        topology as unknown as Parameters<typeof topojson.merge>[0],
        geos as unknown as Parameters<typeof topojson.merge>[1],
      );
      outlines.push({ key: region, geometry: merged as MultiPolygon });
    }
    return outlines;
  }, [topology]);

  return { topology, continentOutlines, regionOutlines, isLoading };
}
