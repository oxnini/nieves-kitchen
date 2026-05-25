'use client';

/**
 * Landscape-viewBox mobile map with east-west wrap (Option C+).
 *
 * - viewBox 1600x900 so a portrait phone slice fills both axes by cropping
 *   east/west (no whitespace top/bottom).
 * - World rendered 3x at lng offsets -1600 / 0 / +1600. The shell's
 *   useMobileMapPosition({ wrapLongitude: true }) normalises lng back into
 *   [-180, 180] on onMoveEnd. Visual position is identical because the
 *   duplicate copies cover the seam, so the snap is invisible.
 * - translateExtent is wide-open so users can pan freely past the "real"
 *   world bounds into the wrap zone.
 */

import { useCallback, useMemo } from 'react';
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup,
} from 'react-simple-maps';
import type { Topology } from 'topojson-specification';

import type { Recipe, CulinaryRegion } from '@/lib/types';

/* ── Landscape projection constants ───────────────────────────────── */
export const M_VIEWBOX_WIDTH = 1600;
export const M_VIEWBOX_HEIGHT = 900;
// World width fits exactly inside the viewBox; world height (2π·scale)
// overflows vertically by ~700 units, cropping >±60° latitude (no recipes
// up there anyway).
export const M_PROJ_SCALE = M_VIEWBOX_WIDTH / (2 * Math.PI);
export const M_WORLD_WIDTH = 2 * Math.PI * M_PROJ_SCALE; // = 1600

// Very wide pan extent so users can swipe freely into the wrap zone.
// The wrap normalisation in handleMoveEnd keeps state sane.
const M_PAN_X = 4000;
const M_PAN_Y = 200;
export const M_PAN_EXTENT: [[number, number], [number, number]] = [
  [M_VIEWBOX_WIDTH / 2 - M_PAN_X, -M_PAN_Y],
  [M_VIEWBOX_WIDTH / 2 + M_PAN_X, M_VIEWBOX_HEIGHT + M_PAN_Y],
];

// Lowered from 1.0 (= "world fills the phone width") because smoke testing
// said the default felt "too zoomed into Africa with whitespace below".
// 0.75 shows ~120° of longitude in one frame on a portrait phone — wide
// enough to suggest "look at all these places to cook from" without
// tiling into a second world copy.
export const M_DEFAULT_ZOOM = 0.75;
// Mid-Atlantic, slightly north of the equator. Frames Western Europe +
// all of Africa + the eastern edge of the Americas in one shot.
export const M_DEFAULT_CENTER: [number, number] = [-10, 10];

export const M_ZOOM = {
  /** Country dots fade in just before region-level zoom (so the user can see
   *  where to tap as they pinch in). Always-on past this point. */
  DOT_FADE_IN:    1.3,
  DOT_FULL:       1.7,
  /** Country names + counts fade in once countries are individually readable.
   *  Tuned so every REGION_TAP_ZOOM lands at or above LABEL_FULL — tapping
   *  any region produces fully opaque labels, no half-faded text. No
   *  competing layer fading out (region labels are intentionally absent
   *  from the map; the bottom rail + breadcrumb name the region). */
  LABEL_FADE_IN:  1.4,
  LABEL_FULL:     1.7,
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

export default function MobileMapCanvas({
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

  const dotOpacity   = crossfadeOpacity(liveZoom, M_ZOOM.DOT_FADE_IN,   M_ZOOM.DOT_FULL);
  const labelOpacity = crossfadeOpacity(liveZoom, M_ZOOM.LABEL_FADE_IN, M_ZOOM.LABEL_FULL);

  // Per-zoom-band overlap pass. North-south country clusters (Cyprus/Egypt,
  // Thailand/Vietnam) fall in each other's label boxes even with the
  // -24/+32 alternation, because both labels end up in the gap *between*
  // the two dots. Project each label box to screen vb at the current
  // zoom-band, then hide the "loser" of each colliding AABB pair (fewer
  // recipes; lexicographic tie-break) until the band is high enough to
  // separate them. Memoised by band so pinch doesn't churn.
  const labelZoomBand = Math.round(liveZoom * 4) / 4;
  const hiddenLabels = useMemo<Set<string>>(() => {
    if (labelZoomBand < M_ZOOM.LABEL_FADE_IN) return new Set();
    const z = labelZoomBand;
    const LABEL_H = 36;
    const CHAR_W = 15;
    const projectMercator = (lng: number, lat: number): [number, number] => {
      const latRad = (lat * Math.PI) / 180;
      const x = M_PROJ_SCALE * lng * (Math.PI / 180);
      const y = -M_PROJ_SCALE * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
      return [x, y];
    };
    type Box = { name: string; count: number; cx: number; cy: number; halfW: number };
    const boxes: Box[] = countryMarkers.map(r => {
      const [px, py] = projectMercator(r.coordinates.lng, r.coordinates.lat);
      const count = recipesByCountryCount.get(r.country) ?? 0;
      const labelText = `${r.country} · ${count}`;
      const yOffset = labelYOffsetByCountry.get(r.country) ?? -24;
      return {
        name: r.country,
        count,
        cx: px * z,
        cy: py * z + yOffset,
        halfW: (labelText.length * CHAR_W) / 2,
      };
    });
    const hidden = new Set<string>();
    for (let i = 0; i < boxes.length; i++) {
      if (hidden.has(boxes[i].name)) continue;
      for (let j = i + 1; j < boxes.length; j++) {
        if (hidden.has(boxes[j].name)) continue;
        const dx = Math.abs(boxes[i].cx - boxes[j].cx);
        const dy = Math.abs(boxes[i].cy - boxes[j].cy);
        if (dx < boxes[i].halfW + boxes[j].halfW && dy < LABEL_H) {
          const loser = (boxes[i].count < boxes[j].count) ||
            (boxes[i].count === boxes[j].count && boxes[i].name > boxes[j].name)
            ? boxes[i].name : boxes[j].name;
          hidden.add(loser);
          if (loser === boxes[i].name) break;
        }
      }
    }
    return hidden;
  }, [labelZoomBand, countryMarkers, labelYOffsetByCountry, recipesByCountryCount]);

  const geoStrokeWidth = liveZoom < M_ZOOM.REGION_FULL ? 0.4 : 0.7;

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
      projectionConfig={{ scale: M_PROJ_SCALE }}
      width={M_VIEWBOX_WIDTH}
      height={M_VIEWBOX_HEIGHT}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <ZoomableGroup
        center={controlledPos.coordinates}
        zoom={controlledPos.zoom}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        minZoom={0.7}
        maxZoom={12}
        translateExtent={M_PAN_EXTENT}
        filterZoomEvent={filterZoomEvent}
      >
        {/* Cooked-hatch pattern definition */}
        <defs>
          <pattern id="cooked-hatch-mobile" patternUnits="userSpaceOnUse" width={9} height={9} patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={9} stroke="var(--stamp-ink-terracotta)" strokeWidth={1.2} opacity={0.55} />
          </pattern>
        </defs>

        {COPIES.map(i => (
          <g key={`world-${i}`} transform={`translate(${i * M_WORLD_WIDTH} 0)`}>
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
                        fill="url(#cooked-hatch-mobile)"
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
          const label = `${recipe.country} · ${count}`;
          return (
            <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}>
              <g transform={`scale(${markerScale})`}>
                <circle r={44} fill="transparent" onClick={() => onCountryTap(recipe.country)} style={{ cursor: 'pointer' }} />
                <circle
                  r={10}
                  fill={SVG_COLORS.terracotta}
                  stroke={SVG_COLORS.parchment}
                  strokeWidth={2.5}
                  opacity={dotOpacity * 0.95}
                  pointerEvents="none"
                />
                {labelOpacity > 0 && !hiddenLabels.has(recipe.country) && (() => {
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
