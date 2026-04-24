import { useState, useEffect, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { MultiPolygon, Polygon } from 'geojson';
import { COUNTRY_TO_REGION } from '@/lib/regions';
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
        topology as unknown as Parameters<typeof topojson.merge>[0],
        geos as unknown as Parameters<typeof topojson.merge>[1],
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
        topology as unknown as Parameters<typeof topojson.merge>[0],
        geos as unknown as Parameters<typeof topojson.merge>[1],
      );
      const d = pathGenerator(merged);
      if (d) outlines.push({ key: region, path: d });
    }
    return outlines;
  }, [topology]);

  return { topology, continentOutlines, regionOutlines, isLoading };
}
