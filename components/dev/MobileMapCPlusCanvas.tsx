'use client';

/**
 * Spike: landscape-viewBox map with east-west wrap (Option C+).
 *
 * - viewBox 1600x900 so a portrait phone slice fills both axes by
 *   cropping east/west (no whitespace top/bottom).
 * - World rendered 3x at lng-offsets -360/0/+360. handleMoveEnd
 *   normalises lng back into [-180, 180] silently — visual position
 *   is identical thanks to the duplicate copies, so the snap is
 *   invisible.
 * - translateExtent is wide-open so users can pan freely past the
 *   "real" world bounds into the wrap zone.
 *
 * NOT a shared component yet — lives under /components/dev/ until the
 * approach is validated.
 */

import { useCallback, useMemo } from 'react';
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup,
} from 'react-simple-maps';
import type { Topology } from 'topojson-specification';

import type { Recipe, CulinaryRegion } from '@/lib/types';

/* ── Landscape projection constants ───────────────────────────────── */
export const C_VIEWBOX_WIDTH = 1600;
export const C_VIEWBOX_HEIGHT = 900;
// World width fits exactly inside the viewBox; world height (2π·scale)
// overflows vertically by ~700 units, cropping >±60° latitude (no recipes
// up there anyway).
export const C_PROJ_SCALE = C_VIEWBOX_WIDTH / (2 * Math.PI);
export const C_WORLD_WIDTH = 2 * Math.PI * C_PROJ_SCALE; // = 1600

// Very wide pan extent so users can swipe freely into the wrap zone.
// The wrap normalisation in handleMoveEnd keeps state sane.
const C_PAN_X = 4000;
const C_PAN_Y = 200;
export const C_PAN_EXTENT: [[number, number], [number, number]] = [
  [C_VIEWBOX_WIDTH / 2 - C_PAN_X, -C_PAN_Y],
  [C_VIEWBOX_WIDTH / 2 + C_PAN_X, C_VIEWBOX_HEIGHT + C_PAN_Y],
];

export const C_DEFAULT_ZOOM = 1.0;
export const C_DEFAULT_CENTER: [number, number] = [20, 15];

export const C_ZOOM = {
  /** Country dots fade in just before region-level zoom (so the user can see
   *  where to tap as they pinch in). Always-on past this point. */
  DOT_FADE_IN:    1.3,
  DOT_FULL:       1.7,
  /** Country names + counts fade in once at region-level zoom. No competing
   *  layer fading out — region labels are intentionally absent from the map
   *  (the bottom rail + breadcrumb name the region). */
  LABEL_FADE_IN:  2.2,
  LABEL_FULL:     2.8,
  /** Choropleth-fill still gets a region/country blend boundary. */
  REGION_FULL:    2.5,
  REGION_FADE_OUT:3.2,
  COUNTRY_FULL:   3.6,
} as const;

const SVG_COLORS = {
  parchment:  'var(--color-parchment)',
  brownDark:  'var(--color-brown-dark)',
  brownMedium:'var(--color-brown-medium)',
  terracotta: 'var(--color-terracotta)',
  stroke:     'var(--color-brown-light)',
} as const;
const SVG_FONT_BODY = 'var(--font-figtree), system-ui, sans-serif';

function crossfadeOpacity(z: number, fadeIn: number, fullIn: number, fadeOut = Infinity, gone = Infinity): number {
  if (z < fadeIn || z > gone) return 0;
  if (z >= fullIn && z <= fadeOut) return 1;
  if (z < fullIn) return (z - fadeIn) / (fullIn - fadeIn);
  return 1 - (z - fadeOut) / (gone - fadeOut);
}

const HIDDEN_COUNTRIES = new Set([
  'ATA', '010', 'SGS', '239', 'ATF', '260', 'HMD', '334', 'BVT', '074', 'FLK', '238',
]);

const GEO_STYLE_DEFAULT = { outline: 'none', transition: 'fill 0.25s cubic-bezier(0.25, 1, 0.5, 1)' };
const GEO_STYLE = { default: GEO_STYLE_DEFAULT, hover: { outline: 'none', cursor: 'pointer' }, pressed: { outline: 'none' } };
const GEO_STYLE_HATCH = {
  default:  { ...GEO_STYLE_DEFAULT, pointerEvents: 'none' as const },
  hover:    { outline: 'none', pointerEvents: 'none' as const },
  pressed:  { outline: 'none', pointerEvents: 'none' as const },
};

interface Position { coordinates: [number, number]; zoom: number }

interface Props {
  recipes: Recipe[];
  topology: Topology | null;
  controlledPos: Position;
  liveZoom: number;
  onMove: (e: { x: number; y: number; zoom: number }) => void;
  onMoveEnd: (e: { coordinates: [number, number]; zoom: number }) => void;
  fillByCountry: Map<string, string>;
  onCountryTap: (countryName: string) => void;
  uniqueCookedCountries: Set<string>;
}

export default function MobileMapCPlusCanvas({
  recipes, topology, controlledPos, liveZoom,
  onMove, onMoveEnd, fillByCountry, onCountryTap, uniqueCookedCountries,
}: Props) {
  const markerScale = 1 / liveZoom;

  // Unique countries with at least one recipe → marker positions
  const countryMarkers = useMemo(() => {
    const seen = new Set<string>();
    const list: Recipe[] = [];
    for (const r of recipes) {
      if (seen.has(r.country)) continue;
      seen.add(r.country);
      list.push(r);
    }
    return list;
  }, [recipes]);

  // Anti-overlap: sort by lng, alternate label y-offset for adjacent labels.
  // Doubles the vertical room around dense clusters (Europe especially).
  const labelYOffsetByCountry = useMemo(() => {
    const m = new Map<string, number>();
    [...countryMarkers]
      .sort((a, b) => a.coordinates.lng - b.coordinates.lng)
      .forEach((r, i) => m.set(r.country, i % 2 === 0 ? -24 : 32));
    return m;
  }, [countryMarkers]);

  const recipesByCountryCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of recipes) m.set(r.country, (m.get(r.country) ?? 0) + 1);
    return m;
  }, [recipes]);

  const dotOpacity   = crossfadeOpacity(liveZoom, C_ZOOM.DOT_FADE_IN,   C_ZOOM.DOT_FULL);
  const labelOpacity = crossfadeOpacity(liveZoom, C_ZOOM.LABEL_FADE_IN, C_ZOOM.LABEL_FULL);

  const geoStrokeWidth = liveZoom < C_ZOOM.REGION_FULL ? 0.4 : 0.7;

  // Triple-render offsets: left copy, real, right copy
  const COPIES = [-1, 0, 1] as const;

  // d3-zoom filterZoomEvent: allow wheel + touch, block right-click
  const filterZoomEvent = useCallback((e: unknown) => {
    const evt = e as MouseEvent;
    if (evt.type === 'wheel') return true;
    return !evt.button;
  }, []);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: C_PROJ_SCALE }}
      width={C_VIEWBOX_WIDTH}
      height={C_VIEWBOX_HEIGHT}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <ZoomableGroup
        center={controlledPos.coordinates}
        zoom={controlledPos.zoom}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        minZoom={0.85}
        maxZoom={12}
        translateExtent={C_PAN_EXTENT}
        filterZoomEvent={filterZoomEvent}
      >
        {/* Cooked-hatch pattern definition */}
        <defs>
          <pattern id="cooked-hatch-cplus" patternUnits="userSpaceOnUse" width={9} height={9} patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={9} stroke="var(--stamp-ink-terracotta)" strokeWidth={1.2} opacity={0.55} />
          </pattern>
        </defs>

        {COPIES.map(i => (
          <g key={`world-${i}`} transform={`translate(${i * C_WORLD_WIDTH} 0)`}>
            {topology && (
              <Geographies geography={topology}>
                {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
                  geographies
                    .filter(geo => !HIDDEN_COUNTRIES.has(geo.id ?? '') && !HIDDEN_COUNTRIES.has(geo.properties.name))
                    .map(geo => (
                      <Geography
                        key={`${i}-${geo.rsmKey}`}
                        geography={geo}
                        fill={fillByCountry.get(geo.properties.name) ?? 'var(--color-parchment)'}
                        stroke={SVG_COLORS.stroke}
                        strokeWidth={geoStrokeWidth}
                        style={GEO_STYLE}
                        onClick={() => onCountryTap(geo.properties.name)}
                      />
                    ))
                }
              </Geographies>
            )}

            {topology && uniqueCookedCountries.size > 0 && (
              <Geographies geography={topology}>
                {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
                  geographies
                    .filter(geo =>
                      !HIDDEN_COUNTRIES.has(geo.id ?? '') &&
                      !HIDDEN_COUNTRIES.has(geo.properties.name) &&
                      uniqueCookedCountries.has(geo.properties.name),
                    )
                    .map(geo => (
                      <Geography
                        key={`cooked-${i}-${geo.rsmKey}`}
                        geography={geo}
                        fill="url(#cooked-hatch-cplus)"
                        stroke="none"
                        style={GEO_STYLE_HATCH}
                      />
                    ))
                }
              </Geographies>
            )}
          </g>
        ))}

        {/* Country markers — single render (no triple). At world zoom: small dots
            only. At region zoom: name + count appear next to the dot. No competing
            region pill layer; the bottom rail + breadcrumb name the region. */}
        {dotOpacity > 0 && countryMarkers.map(recipe => {
          const count = recipesByCountryCount.get(recipe.country) ?? 0;
          // Combined label: "Country (n)" rendered once so it never splits across pills.
          const label = `${recipe.country} · ${count}`;
          return (
            <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}>
              <g transform={`scale(${markerScale})`}>
                {/* Generous transparent hit area so finger taps work */}
                <circle r={44} fill="transparent" onClick={() => onCountryTap(recipe.country)} style={{ cursor: 'pointer' }} />
                {/* Dot — always visible past DOT_FADE_IN */}
                <circle
                  r={10}
                  fill={SVG_COLORS.terracotta}
                  stroke={SVG_COLORS.parchment}
                  strokeWidth={2.5}
                  opacity={dotOpacity * 0.95}
                  pointerEvents="none"
                />
                {/* Label — fades in once you're at region-level zoom.
                    y-offset alternates by lng-sorted index so adjacent labels
                    don't pile on top of each other. */}
                {labelOpacity > 0 && (() => {
                  const yOffset = labelYOffsetByCountry.get(recipe.country) ?? -24;
                  return (
                    <>
                      {/* Soft halo so the text reads over busy choropleth */}
                      <text
                        textAnchor="middle"
                        y={yOffset}
                        style={{
                          fontFamily: SVG_FONT_BODY,
                          fontSize: '28px',
                          fontWeight: 600,
                          fill: SVG_COLORS.parchment,
                          stroke: SVG_COLORS.parchment,
                          strokeWidth: 7,
                          strokeLinejoin: 'round',
                          opacity: labelOpacity * 0.9,
                          pointerEvents: 'none',
                        }}
                      >{label}</text>
                      <text
                        textAnchor="middle"
                        y={yOffset}
                        style={{
                          fontFamily: SVG_FONT_BODY,
                          fontSize: '28px',
                          fontWeight: 600,
                          fill: SVG_COLORS.brownDark,
                          opacity: labelOpacity,
                          pointerEvents: 'none',
                        }}
                      >{label}</text>
                    </>
                  );
                })()}
              </g>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
}

/* ── Helpers exposed for the shell ──────────────────────────────── */

/** Returns the closest region centre to a given lng/lat in degrees. */
export function findClosestRegion(
  center: [number, number],
  regionCentres: Record<CulinaryRegion, { center: [number, number] }>,
): CulinaryRegion | null {
  let best: CulinaryRegion | null = null;
  let bestDist = Infinity;
  for (const region in regionCentres) {
    const r = region as CulinaryRegion;
    const [rx, ry] = regionCentres[r].center;
    const dx = rx - center[0];
    const dy = ry - center[1];
    const d = dx * dx + dy * dy;
    if (d < bestDist) { bestDist = d; best = r; }
  }
  return best;
}

