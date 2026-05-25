'use client';

import { useMemo } from 'react';
import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup, useMapContext,
} from 'react-simple-maps';
import type { Topology } from 'topojson-specification';

import type { Recipe, CulinaryRegion } from '@/lib/types';
import { REGION_LABEL_POSITIONS } from '@/lib/regions';
import type { MergedOutline } from '@/hooks/useMapTopology';

/* ── Mobile projection constants ─────────────────────────────────── */
export const M_VIEWBOX_WIDTH = 900;
export const M_VIEWBOX_HEIGHT = 1600;
// Scale chosen so the clipped Mercator world fills the viewBox vertically
// (world height = 2π × scale). Desktop fills horizontally; mobile fills
// vertically — same formula, swap the dimension.
export const M_PROJ_SCALE = M_VIEWBOX_HEIGHT / (2 * Math.PI);

// World x bounds: projCx ± π·scale (≈ ±800 here). With viewBox 900 wide and
// scale ≈ 255, world width is 1600 — spills outside the viewBox horizontally,
// so the phone shows a vertical strip of the planet; pan to scroll east/west.
const M_PROJ_CX = M_VIEWBOX_WIDTH / 2;
const M_WORLD_HALF_W = Math.PI * M_PROJ_SCALE;
const M_WORLD_MARGIN_X = M_VIEWBOX_WIDTH * 0.08;
const M_WORLD_MARGIN_Y = 80;
export const M_WORLD_EXTENT: [[number, number], [number, number]] = [
  [M_PROJ_CX - M_WORLD_HALF_W - M_WORLD_MARGIN_X, -M_WORLD_MARGIN_Y],
  [M_PROJ_CX + M_WORLD_HALF_W + M_WORLD_MARGIN_X, M_VIEWBOX_HEIGHT + M_WORLD_MARGIN_Y],
];
const M_OVERSCROLL = 80;
export const M_HARD_EXTENT: [[number, number], [number, number]] = [
  [M_WORLD_EXTENT[0][0] - M_OVERSCROLL, M_WORLD_EXTENT[0][1] - M_OVERSCROLL],
  [M_WORLD_EXTENT[1][0] + M_OVERSCROLL, M_WORLD_EXTENT[1][1] + M_OVERSCROLL],
];

export const M_DEFAULT_ZOOM = 0.9;
export const M_DEFAULT_CENTER: [number, number] = [0, 20];

/* ── Zoom thresholds (same semantic levels as desktop) ──────────── */
export const M_ZOOM = {
  CONTINENT_FULL: 0.8,
  CONTINENT_FADE: 1.5,
  CONTINENT_GONE: 2.0,
  REGION_FADE_IN: 2.0,
  REGION_FULL:    2.5,
  REGION_FADE_OUT:3.5,
  REGION_GONE:    3.8,
  COUNTRY_FADE_IN: 3.8,
  COUNTRY_FULL:    4.3,
} as const;

/* ── Mobile label sizing — larger than desktop ───────────────────── */
const SVG_COLORS = {
  parchment:  'var(--color-parchment)',
  brownDark:  'var(--color-brown-dark)',
  brownMedium:'var(--color-brown-medium)',
  terracotta: 'var(--color-terracotta)',
  stroke:     'var(--color-brown-light)',
  hoverFill:  'var(--color-sage)',
} as const;
const SVG_FONT_BODY    = 'var(--font-figtree), system-ui, sans-serif';
const SVG_FONT_DISPLAY = 'var(--font-literata), Georgia, serif';

/* Crossfade helper */
function crossfadeOpacity(z: number, fadeIn: number, fullIn: number, fadeOut = Infinity, gone = Infinity): number {
  if (z < fadeIn || z > gone) return 0;
  if (z >= fullIn && z <= fadeOut) return 1;
  if (z < fullIn) return (z - fadeIn) / (fullIn - fadeIn);
  return 1 - (z - fadeOut) / (gone - fadeOut);
}

interface Props {
  recipes: Recipe[];
  topology: Topology | null;
  continentOutlines: MergedOutline[];
  controlledPos: { coordinates: [number, number]; zoom: number };
  zoom: number;
  center: [number, number];
  handleMove: (e: { x: number; y: number; zoom: number }) => void;
  handleMoveEnd: (e: { coordinates: [number, number]; zoom: number }) => void;
  fillByCountry: Map<string, string>;
  onCountryTap: (countryName: string) => void;
  uniqueCookedCountries: Set<string>;
}

const HIDDEN_COUNTRIES = new Set([
  'ATA', '010', 'SGS', '239', 'ATF', '260', 'HMD', '334', 'BVT', '074', 'FLK', '238',
]);

const GEO_STYLE_DEFAULT = { outline: 'none', transition: 'fill 0.25s cubic-bezier(0.25, 1, 0.5, 1)' };
const GEO_STYLE_HOVER   = { outline: 'none', cursor: 'pointer' };
const GEO_STYLE_PRESSED = { outline: 'none' };
const GEO_STYLE = { default: GEO_STYLE_DEFAULT, hover: GEO_STYLE_HOVER, pressed: GEO_STYLE_PRESSED };
const GEO_STYLE_HATCH = { default: { ...GEO_STYLE_DEFAULT, pointerEvents: 'none' as const }, hover: { ...GEO_STYLE_HOVER, pointerEvents: 'none' as const }, pressed: { ...GEO_STYLE_PRESSED, pointerEvents: 'none' as const } };

function MergedOutlinesLayer({ outlines, zoom, fadeIn, fullIn, fadeOut, gone, strokeWidth }: {
  outlines: MergedOutline[]; zoom: number; fadeIn: number; fullIn: number; fadeOut: number; gone: number; strokeWidth: number;
}) {
  const { path } = useMapContext();
  const opacity = crossfadeOpacity(zoom, fadeIn, fullIn, fadeOut, gone);
  if (opacity <= 0) return null;
  return (
    <>
      {outlines.map(({ key, geometry }) => {
        const d = path(geometry);
        if (!d) return null;
        return (
          <path key={`outline-${key}`} d={d}
            fill="none"
            stroke={SVG_COLORS.terracotta}
            strokeWidth={strokeWidth / zoom}
            strokeLinejoin="round"
            opacity={opacity * 0.25}
            pointerEvents="none"
          />
        );
      })}
    </>
  );
}

export default function MobileMapCanvas({
  recipes, topology, continentOutlines,
  controlledPos, zoom,
  handleMove, handleMoveEnd,
  fillByCountry, onCountryTap, uniqueCookedCountries,
}: Props) {

  const markerScale = 1 / zoom;
  const continentScale = 1 / Math.max(zoom, 0.8);

  // Unique-country marker list
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

  const recipesByCountryCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of recipes) m.set(r.country, (m.get(r.country) ?? 0) + 1);
    return m;
  }, [recipes]);

  const activeRegions = useMemo(() => {
    const counts = new Map<CulinaryRegion, number>();
    for (const r of recipes) counts.set(r.region, (counts.get(r.region) ?? 0) + 1);
    const out: { region: CulinaryRegion; count: number; position: [number, number] }[] = [];
    for (const [region, count] of counts.entries()) {
      const position = REGION_LABEL_POSITIONS[region];
      if (count > 0 && position) out.push({ region, count, position });
    }
    return out;
  }, [recipes]);

  const continentOpacity = crossfadeOpacity(zoom, 0.3, 0.6, M_ZOOM.CONTINENT_FADE, M_ZOOM.CONTINENT_GONE);
  const regionOpacity    = crossfadeOpacity(zoom, M_ZOOM.REGION_FADE_IN, M_ZOOM.REGION_FULL, M_ZOOM.REGION_FADE_OUT, M_ZOOM.REGION_GONE);
  const countryOpacity   = crossfadeOpacity(zoom, M_ZOOM.COUNTRY_FADE_IN, M_ZOOM.COUNTRY_FULL);

  const geoStrokeWidth = zoom < M_ZOOM.CONTINENT_GONE ? 0 : zoom < M_ZOOM.REGION_GONE ? 0.4 : 0.7;

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
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        minZoom={0.85}
        maxZoom={12}
        translateExtent={M_HARD_EXTENT}
        filterZoomEvent={(e: unknown) => {
          const evt = e as MouseEvent;
          if (evt.type === 'wheel') return true;
          return !evt.button;
        }}
      >
        <MergedOutlinesLayer
          outlines={continentOutlines}
          zoom={zoom}
          fadeIn={0.5}
          fullIn={M_ZOOM.CONTINENT_FULL}
          fadeOut={M_ZOOM.CONTINENT_FADE}
          gone={M_ZOOM.CONTINENT_GONE}
          strokeWidth={1.5}
        />

        {topology && (
          <Geographies geography={topology}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string; properties: { name: string } }> }) =>
              geographies
                .filter(geo => !HIDDEN_COUNTRIES.has(geo.id ?? '') && !HIDDEN_COUNTRIES.has(geo.properties.name))
                .map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillByCountry.get(geo.properties.name) ?? 'var(--color-parchment)'}
                    stroke={geoStrokeWidth > 0 ? SVG_COLORS.stroke : 'transparent'}
                    strokeWidth={geoStrokeWidth}
                    style={GEO_STYLE}
                    onClick={() => onCountryTap(geo.properties.name)}
                  />
                ))
            }
          </Geographies>
        )}

        {/* Cooked-hatch overlay (single Geographies pass over only cooked countries) */}
        <defs>
          <pattern id="cooked-hatch-mobile" patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={8} stroke="var(--stamp-ink-terracotta)" strokeWidth={1} opacity={0.55} />
          </pattern>
        </defs>
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
                    key={`cooked-${geo.rsmKey}`}
                    geography={geo}
                    fill="url(#cooked-hatch-mobile)"
                    stroke="none"
                    style={GEO_STYLE_HATCH}
                  />
                ))
            }
          </Geographies>
        )}

        {/* Continent labels (mobile-sized) */}
        {continentOpacity > 0 && [
          { name: 'Europe',        position: [20, 50]    as [number, number] },
          { name: 'Asia',          position: [80, 35]    as [number, number] },
          { name: 'Africa',        position: [22, 7]     as [number, number] },
          { name: 'N. America',    position: [-95, 45]   as [number, number] },
          { name: 'S. America',    position: [-58, -15]  as [number, number] },
          { name: 'Oceania',       position: [134, -26]  as [number, number] },
        ].map(c => (
          <Marker key={c.name} coordinates={c.position}>
            <g transform={`scale(${continentScale})`} style={{ opacity: continentOpacity, pointerEvents: 'none' }}>
              <text textAnchor="middle" y={-3} style={{ fontFamily: SVG_FONT_DISPLAY, fontSize: '30px', fontWeight: 600, fill: SVG_COLORS.brownDark, letterSpacing: '0.14em' }}>
                {c.name.toUpperCase()}
              </text>
              <circle r={6} cy={12} fill={SVG_COLORS.terracotta} stroke={SVG_COLORS.parchment} strokeWidth={2} opacity={0.9} />
            </g>
          </Marker>
        ))}

        {/* Region labels (mobile-sized) */}
        {regionOpacity > 0 && activeRegions.map(({ region, count, position }) => (
          <Marker key={region} coordinates={position}>
            <g transform={`scale(${markerScale})`} style={{ opacity: regionOpacity }}>
              <circle r={20} fill="transparent" />
              <circle r={6} fill={SVG_COLORS.parchment} stroke={SVG_COLORS.brownMedium} strokeWidth={1.6} />
              <circle r={3} fill={SVG_COLORS.brownMedium} />
              <rect x={14} y={-15} width={region.length * 8 + 44} height={26} rx={13}
                fill={SVG_COLORS.parchment} fillOpacity={0.94}
                stroke={SVG_COLORS.stroke} strokeWidth={0.7}
              />
              <text x={22} y={4} style={{ fontFamily: SVG_FONT_BODY, fontSize: '14px', fontWeight: 500, fill: SVG_COLORS.brownDark }}>
                {region}
              </text>
              <text x={22 + region.length * 8 + 4} y={4} style={{ fontFamily: SVG_FONT_BODY, fontSize: '14px', fontWeight: 700, fill: SVG_COLORS.terracotta }}>
                ({count})
              </text>
            </g>
          </Marker>
        ))}

        {/* Country markers (mobile-sized) */}
        {countryOpacity > 0 && countryMarkers.map(recipe => {
          const count = recipesByCountryCount.get(recipe.country) ?? 0;
          return (
            <Marker key={recipe.country} coordinates={[recipe.coordinates.lng, recipe.coordinates.lat]}>
              <g transform={`scale(${markerScale})`} style={{ opacity: countryOpacity }}>
                <circle r={22} fill="transparent" onClick={() => onCountryTap(recipe.country)} style={{ cursor: 'pointer' }} />
                <circle r={9} fill={SVG_COLORS.terracotta} stroke={SVG_COLORS.parchment} strokeWidth={2} opacity={0.95} />
                <text textAnchor="middle" y={-14} style={{ fontFamily: SVG_FONT_BODY, fontSize: '15px', fontWeight: 600, fill: SVG_COLORS.brownDark }}>
                  {recipe.country} ({count})
                </text>
              </g>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
}
