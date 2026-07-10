'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

import CoverHero from '@/components/home/CoverHero';
import PromiseLine from '@/components/home/PromiseLine';
import WhereNext from '@/components/home/WhereNext';
import PantryTeaser from '@/components/home/PantryTeaser';
import LatestFromKitchen from '@/components/home/LatestFromKitchen';
import RecipeDetail from '@/components/RecipeDetail';
import { useRecipes } from '@/hooks/useRecipes';
import { useMapTopology } from '@/hooks/useMapTopology';
import { COUNTRY_TO_REGION, COUNTRY_NAME_TO_REGION } from '@/lib/regions';
import type { CulinaryRegion } from '@/lib/types';
import type { PantryEntry } from '@/data/pantry/_types';

/* ────────────────────────────────────────────────────────────────────────
   Palette definitions. Each palette maps onto the EXISTING token roles so
   real components restyle themselves: `terracotta` = lead accent,
   `brown-*` = ink/secondary/borders, `teal` = deep cool accent, etc.
   ──────────────────────────────────────────────────────────────────────── */

interface ThemeTokens {
  parchment: string;
  parchmentDark: string;
  terracotta: string;
  turmeric: string;
  paprika: string;
  sage: string;
  teal: string;
  brownDark: string;
  brownMedium: string;
  brownLight: string;
  surface: string;
  surfaceAlt: string;
  mapBase: string;
  /** Choropleth for the atlas preview */
  choroBase: [number, number, number];
  choroBlend: [number, number, number];
  choroZero: string;
  choroEmpty: string;
}

interface Palette {
  id: string;
  name: string;
  blurb: string;
  darkName: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

const PALETTES: Palette[] = [
  {
    id: 'current',
    name: 'Old (brown)',
    blurb: 'Pre-redesign palette, kept for before/after comparison.',
    darkName: 'Sepia',
    light: {
      parchment: '#F5F0E4', parchmentDark: '#EBE5D8',
      terracotta: '#E07A50', turmeric: '#D4A843', paprika: '#E63946',
      sage: '#8DB9A4', teal: '#005E7A',
      brownDark: '#3E2723', brownMedium: '#664E4C', brownLight: '#786C68',
      surface: '#FAF7EF', surfaceAlt: '#F0EBE0', mapBase: '#F5F0E4',
      choroBase: [0, 94, 122], choroBlend: [235, 220, 205],
      choroZero: '#DBE4E7', choroEmpty: '#E6E3E1',
    },
    dark: {
      parchment: '#2A1F17', parchmentDark: '#221912',
      terracotta: '#C47A58', turmeric: '#E9C46A', paprika: '#E84A56',
      sage: '#9AB8A8', teal: '#0E7A8F',
      brownDark: '#F5EBDA', brownMedium: '#C8B8A2', brownLight: '#8D7B6F',
      surface: '#3A2C22', surfaceAlt: '#332418', mapBase: '#221912',
      choroBase: [94, 176, 200], choroBlend: [58, 44, 34],
      choroZero: '#2E3638', choroEmpty: '#2A3133',
    },
  },
  {
    id: 'a',
    name: 'A · Kitchen Garden',
    blurb: 'Forest ink, tomato lead, honey gold. Parchment kept.',
    darkName: 'Evening garden',
    light: {
      parchment: '#F5F0E4', parchmentDark: '#EBE5D8',
      terracotta: '#C94F30', turmeric: '#D9A441', paprika: '#D03B30',
      sage: '#8FB07C', teal: '#2F5D46',
      brownDark: '#253B2F', brownMedium: '#52685A', brownLight: '#7E8D7B',
      surface: '#FAF7EF', surfaceAlt: '#F0EBE0', mapBase: '#F5F0E4',
      choroBase: [47, 93, 70], choroBlend: [235, 220, 205],
      choroZero: '#DDE4DA', choroEmpty: '#E6E3DB',
    },
    dark: {
      parchment: '#17211A', parchmentDark: '#121B15',
      terracotta: '#E5714E', turmeric: '#E4BA5F', paprika: '#E86052',
      sage: '#93BB7A', teal: '#6FA98A',
      brownDark: '#F1EBDA', brownMedium: '#B9C7B2', brownLight: '#6E7F6E',
      surface: '#202E23', surfaceAlt: '#1B2820', mapBase: '#121B15',
      choroBase: [147, 187, 122], choroBlend: [35, 45, 37],
      choroZero: '#28332A', choroEmpty: '#232D26',
    },
  },
  {
    id: 'd',
    name: 'D · Teal & Ember',
    blurb: 'SHIPPED as production. Teal ink (lightened), teal lead, ember counterpoint.',
    darkName: 'Deep lagoon',
    light: {
      parchment: '#F5F0E4', parchmentDark: '#EBE5D8',
      terracotta: '#CE6B39', turmeric: '#D9A845', paprika: '#D14B3D',
      sage: '#8AB3AD', teal: '#0E7385',
      brownDark: '#1E4854', brownMedium: '#4A6A70', brownLight: '#7A8F91',
      surface: '#FAF7EF', surfaceAlt: '#F0EBE0', mapBase: '#F5F0E4',
      choroBase: [14, 115, 133], choroBlend: [235, 220, 205],
      choroZero: '#D9E4E4', choroEmpty: '#E6E3DB',
    },
    dark: {
      parchment: '#142A30', parchmentDark: '#102329',
      terracotta: '#E08653', turmeric: '#E3BB5F', paprika: '#E86052',
      sage: '#8FBCB4', teal: '#1B7D91',
      brownDark: '#F0EADA', brownMedium: '#AFC3C4', brownLight: '#5E7679',
      surface: '#1E3A41', surfaceAlt: '#183239', mapBase: '#102329',
      choroBase: [79, 176, 192], choroBlend: [27, 52, 58],
      choroZero: '#23393E', choroEmpty: '#1F3338',
    },
  },
  {
    id: 'e',
    name: 'E · Market Garden',
    blurb: 'Pine ink, marigold lead, radish red. Parchment kept.',
    darkName: 'Greenhouse dusk',
    light: {
      parchment: '#F5F0E4', parchmentDark: '#EBE5D8',
      terracotta: '#B67D14', turmeric: '#DB9A28', paprika: '#C2454E',
      sage: '#7FA88F', teal: '#2E5B4C',
      brownDark: '#22423A', brownMedium: '#4E6A60', brownLight: '#7B8D80',
      surface: '#FAF7EF', surfaceAlt: '#F0EBE0', mapBase: '#F5F0E4',
      choroBase: [34, 66, 58], choroBlend: [235, 220, 205],
      choroZero: '#DCE3DC', choroEmpty: '#E6E3DB',
    },
    dark: {
      parchment: '#13221E', parchmentDark: '#0E1B17',
      terracotta: '#E9B94F', turmeric: '#EFC96A', paprika: '#E06A6E',
      sage: '#8FBCA6', teal: '#6FA890',
      brownDark: '#F1EBDA', brownMedium: '#B5C6B9', brownLight: '#64796C',
      surface: '#1C2F2A', surfaceAlt: '#172A24', mapBase: '#0E1B17',
      choroBase: [143, 188, 166], choroBlend: [28, 47, 42],
      choroZero: '#24352E', choroEmpty: '#1F2F29',
    },
  },
  {
    id: 'f',
    name: 'F · Rose & Fig',
    blurb: 'Fig-plum ink, dusty rose lead, eucalyptus and honey. Blush parchment.',
    darkName: 'Fig at dusk',
    light: {
      parchment: '#F6EFE7', parchmentDark: '#ECE1D6',
      terracotta: '#A85D66', turmeric: '#D2A24C', paprika: '#C24756',
      sage: '#85A487', teal: '#3F7268',
      brownDark: '#43303D', brownMedium: '#6F5A68', brownLight: '#94838C',
      surface: '#FBF6EF', surfaceAlt: '#F2E9E0', mapBase: '#F6EFE7',
      choroBase: [63, 114, 104], choroBlend: [235, 222, 210],
      choroZero: '#E2DFD6', choroEmpty: '#E9E2DA',
    },
    dark: {
      parchment: '#251B22', parchmentDark: '#1E151C',
      terracotta: '#D28E93', turmeric: '#DFB55F', paprika: '#E0697A',
      sage: '#96B598', teal: '#63A396',
      brownDark: '#F3EADF', brownMedium: '#C6B2BD', brownLight: '#82707B',
      surface: '#33262F', surfaceAlt: '#2B1F28', mapBase: '#1E151C',
      choroBase: [150, 181, 152], choroBlend: [51, 38, 47],
      choroZero: '#372B34', choroEmpty: '#30252E',
    },
  },
];

function tokenStyle(t: ThemeTokens): CSSProperties {
  return {
    '--color-parchment': t.parchment,
    '--color-parchment-dark': t.parchmentDark,
    '--color-terracotta': t.terracotta,
    '--color-turmeric': t.turmeric,
    '--color-paprika': t.paprika,
    '--color-sage': t.sage,
    '--color-teal': t.teal,
    '--color-brown-dark': t.brownDark,
    '--color-brown-medium': t.brownMedium,
    '--color-brown-light': t.brownLight,
    '--color-surface': t.surface,
    '--color-surface-alt': t.surfaceAlt,
    '--color-map-base': t.mapBase,
  } as CSSProperties;
}

/* ── Atlas preview ──────────────────────────────────────────────────────
   Real world geography + real recipe densities, region-level view, with
   the choropleth base swapped per palette (mirrors getChoroplethColor). */

function choroplethFill(
  count: number,
  max: number,
  t: ThemeTokens,
  dark: boolean,
): string {
  if (count === 0) return t.choroZero;
  const frac = count / Math.max(max, 1);
  const intensity = 0.35 + (dark ? 0.55 : 0.65) * frac;
  const [br, bg, bb] = t.choroBase;
  const [lr, lg, lb] = t.choroBlend;
  const r = Math.round(br * intensity + lr * (1 - intensity));
  const g = Math.round(bg * intensity + lg * (1 - intensity));
  const b = Math.round(bb * intensity + lb * (1 - intensity));
  return `rgb(${r}, ${g}, ${b})`;
}

const SAMPLE_MARKERS: [number, number][] = [
  [-14.4, 14.5], // Senegal
  [138, 36], // Japan
  [-102, 23], // Mexico
];

function AtlasPreview({ tokens, dark }: { tokens: ThemeTokens; dark: boolean }) {
  const { topology, isLoading } = useMapTopology();
  const { data: recipes = [] } = useRecipes();

  const { byRegion, maxRegion } = useMemo(() => {
    const byRegion = new Map<CulinaryRegion, number>();
    for (const r of recipes) {
      if (!r.region) continue;
      byRegion.set(r.region, (byRegion.get(r.region) ?? 0) + 1);
    }
    const maxRegion = Math.max(1, ...byRegion.values());
    return { byRegion, maxRegion };
  }, [recipes]);

  const legendStops = [0, 0.34, 0.67, 1];

  return (
    <div className="map-bg rounded-xl border border-brown-light/30 overflow-hidden">
      {isLoading || !topology ? (
        <div className="h-72 flex items-center justify-center text-brown-medium text-sm">
          Loading world topology…
        </div>
      ) : (
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 170 }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={topology}>
            {({ geographies }) =>
              geographies
                .filter((geo) => geo.properties?.name !== 'Antarctica')
                .map((geo) => {
                  const name: string = geo.properties?.name ?? '';
                  const region =
                    COUNTRY_TO_REGION[String(geo.id)] ?? COUNTRY_NAME_TO_REGION[name];
                  const fill = region
                    ? choroplethFill(byRegion.get(region) ?? 0, maxRegion, tokens, dark)
                    : tokens.choroEmpty;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="var(--color-brown-light)"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
            }
          </Geographies>
          {SAMPLE_MARKERS.map(([lon, lat]) => (
            <Marker key={`${lon},${lat}`} coordinates={[lon, lat]}>
              <circle r={5} fill="var(--color-terracotta)" opacity={0.25} />
              <circle r={2.6} fill="var(--color-terracotta)" />
            </Marker>
          ))}
        </ComposableMap>
      )}
      <div className="flex items-center gap-3 px-4 py-2.5 border-t border-brown-light/25">
        <span className="text-[11px] uppercase tracking-wider text-brown-medium font-stamp">
          Recipes per region
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-brown-medium">fewer</span>
          {legendStops.map((s) => (
            <span
              key={s}
              className="inline-block w-4 h-4 rounded-[3px] border border-brown-light/25"
              style={{
                background:
                  s === 0
                    ? tokens.choroZero
                    : choroplethFill(s * maxRegion, maxRegion, tokens, dark),
              }}
            />
          ))}
          <span className="text-[11px] text-brown-medium">more</span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 pt-14 pb-6">
      <span className="font-stamp text-[11px] tracking-[0.24em] text-brown-medium">
        {n} · {title}
      </span>
      <span className="flex-1 border-t border-brown-light/30" />
    </div>
  );
}

export default function PalettePreview({ pantryEntries }: { pantryEntries: PantryEntry[] }) {
  const [paletteId, setPaletteId] = useState('a');
  const [dark, setDark] = useState(false);
  const { data: recipes = [] } = useRecipes();

  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const tokens = dark ? palette.dark : palette.light;
  const detailRecipe = recipes[0];

  return (
    <div>
      {/* Control bar — deliberately neutral so it reads as tooling, not site */}
      <div className="sticky top-0 z-50 bg-neutral-900 text-neutral-100 px-4 py-2.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 mr-1">
            Palette
          </span>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPaletteId(p.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                p.id === paletteId
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            >
              <span className="flex gap-0.5">
                {[p.light.brownDark, p.light.terracotta, p.light.turmeric].map((c) => (
                  <span
                    key={c}
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ background: c }}
                  />
                ))}
              </span>
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setDark((d) => !d)}
            className="ml-auto rounded-full px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700"
          >
            {dark ? `◑ ${palette.darkName} (dark)` : '◐ Parchment (light)'}
          </button>
        </div>
        <div className="max-w-6xl mx-auto mt-1 text-[11px] text-neutral-400">
          {palette.blurb} Navbar above stays production-coloured; everything below recolours.
        </div>
      </div>

      {/* Preview world: real components under overridden tokens */}
      <div
        data-theme={dark ? 'sepia' : undefined}
        style={tokenStyle(tokens)}
        className="bg-parchment text-brown-dark min-h-screen pb-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
          <SectionLabel n="01" title="Home" />
          <div className="space-y-14">
            <CoverHero pantryEntries={pantryEntries} />
            <PromiseLine />
            <PantryTeaser entries={pantryEntries} />
            <LatestFromKitchen />
            <WhereNext />
          </div>

          <SectionLabel n="02" title="Atlas" />
          <AtlasPreview tokens={tokens} dark={dark} />

          <SectionLabel n="03" title="Recipe detail" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {detailRecipe ? (
            <div className="rounded-xl border border-brown-light/30 overflow-hidden bg-surface">
              <RecipeDetail recipe={detailRecipe} />
            </div>
          ) : (
            <div className="text-brown-medium text-sm py-10">
              No recipes loaded (check Supabase env or NEXT_PUBLIC_USE_MOCK_DATA).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
