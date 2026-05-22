'use client';

/**
 * Scratch route for picking the "cooked" indicator treatment.
 *
 * Locked in:
 *   - Map: diagonal hatch fill in stamp-ink terracotta
 *   - Card: corner postmark glyph in stamp-ink terracotta
 *
 * Open: which glyph design? Four variants below, all sharing the same
 * sample card so the differences are isolated to the corner mark.
 *
 * Not linked from anywhere; navigate to `/dev/cooked-indicator`.
 */

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Clock, Flame, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import { useMapTopology } from '@/hooks/useMapTopology';
import CookedStampMark from '@/components/CookedStampMark';

const INK = 'var(--stamp-ink-terracotta)';
const STAMP_FONT = 'var(--font-cutive-mono), ui-monospace, monospace';

const STAMPED = new Set([
  'Italy', 'France', 'Spain', 'Japan', 'India', 'Mexico', 'Morocco', 'Thailand', 'Brazil', 'Vietnam',
]);

const MAP_W = 1100;
const MAP_H = 520;

/* ---------------------------------------------------------------- */
/*  Map: hatch fill (locked)                                        */
/* ---------------------------------------------------------------- */

function HatchMap() {
  const { topology } = useMapTopology();

  return (
    <div className="rounded-xl overflow-hidden border border-brown-light/25 bg-[#EFE6D6]">
      {!topology ? (
        <div className="w-full" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }} />
      ) : (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 150, center: [10, 25] }}
          width={MAP_W}
          height={MAP_H}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <pattern
              id="hatch-locked"
              patternUnits="userSpaceOnUse"
              width={3.6} height={3.6}
              patternTransform="rotate(45)"
            >
              <line x1={0} y1={0} x2={0} y2={3.6} stroke={INK} strokeWidth={0.6} opacity={0.55} />
            </pattern>
          </defs>

          <Geographies geography={topology}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { name: string } }> }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E4D8C2"
                  stroke="#C9B894"
                  strokeWidth={0.35}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          <Geographies geography={topology}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { name: string } }> }) =>
              geographies
                .filter(geo => STAMPED.has(geo.properties.name))
                .map(geo => (
                  <Geography
                    key={`s-${geo.rsmKey}`}
                    geography={geo}
                    fill="url(#hatch-locked)"
                    stroke="none"
                    style={{
                      default: { outline: 'none', pointerEvents: 'none' },
                      hover:   { outline: 'none', pointerEvents: 'none' },
                      pressed: { outline: 'none', pointerEvents: 'none' },
                    }}
                  />
                ))
            }
          </Geographies>
        </ComposableMap>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Stamp glyph variants                                            */
/* ---------------------------------------------------------------- */

type StampVariant = 'cancellation' | 'roundel' | 'visa' | 'wavy';

const STAMP_LABEL: Record<StampVariant, string> = {
  cancellation: 'Postal cancellation circle',
  roundel:      'Round date stamp',
  visa:         'Mini visa rectangle',
  wavy:         'Wavy cancellation only',
};

const STAMP_DESC: Record<StampVariant, string> = {
  cancellation: 'Concentric ink circles with three wavy cancellation strokes sweeping across. No text. The most abstract.',
  roundel:      'Round postal datestamp with arc text — "COOKED" up top, date "18 · V · 26" along the bottom arc, tiny center mark.',
  visa:         'Miniature perforated visa rectangle. Bold "COOKED" lockup with a small date line below. Slight rotation.',
  wavy:         'Just the cancellation lines, no enclosing shape, with a small "COOKED" lockup beneath. Lightest visual weight.',
};

/* Postal cancellation circle: concentric circles + 3 wavy strokes */
function StampCancellation() {
  return (
    <svg viewBox="0 0 44 44" width={44} height={44} style={{ transform: 'rotate(-4deg)' }} aria-hidden="true">
      <circle cx={22} cy={22} r={19} fill="none" stroke={INK} strokeWidth={1.6} opacity={0.9} />
      <circle cx={22} cy={22} r={15.5} fill="none" stroke={INK} strokeWidth={0.55} opacity={0.45} />
      <path d="M 4 18 Q 12 14 22 17 T 40 16" stroke={INK} strokeWidth={1.4} fill="none" opacity={0.9} strokeLinecap="round" />
      <path d="M 4 23 Q 12 19 22 22 T 40 21" stroke={INK} strokeWidth={1.4} fill="none" opacity={0.9} strokeLinecap="round" />
      <path d="M 4 28 Q 12 24 22 27 T 40 26" stroke={INK} strokeWidth={1.4} fill="none" opacity={0.9} strokeLinecap="round" />
    </svg>
  );
}

/* Round datestamp with arc text */
function StampRoundel() {
  return (
    <svg viewBox="0 0 44 44" width={44} height={44} style={{ transform: 'rotate(-3deg)' }} aria-hidden="true">
      <defs>
        <path id="rd-top" d="M 6.5 22 A 15.5 15.5 0 0 1 37.5 22" fill="none" />
        <path id="rd-bot" d="M 8 23.5 A 14 14 0 0 0 36 23.5" fill="none" />
      </defs>
      <circle cx={22} cy={22} r={19} fill="none" stroke={INK} strokeWidth={1.6} opacity={0.9} />
      <circle cx={22} cy={22} r={14.5} fill="none" stroke={INK} strokeWidth={0.55} opacity={0.45} />
      <text fontSize={5.6} fontFamily={STAMP_FONT} fontWeight={700} fill={INK} letterSpacing="1.3" opacity={0.95}>
        <textPath href="#rd-top" startOffset="50%" textAnchor="middle">★ COOKED ★</textPath>
      </text>
      <text fontSize={4.6} fontFamily={STAMP_FONT} fontWeight={500} fill={INK} letterSpacing="1.6" opacity={0.85}>
        <textPath href="#rd-bot" startOffset="50%" textAnchor="middle">18 · V · 26</textPath>
      </text>
      <circle cx={22} cy={22} r={1.1} fill={INK} opacity={0.85} />
    </svg>
  );
}

/* Mini visa rectangle with perforated edge */
function StampVisa() {
  return (
    <svg viewBox="0 0 60 38" width={60} height={38} style={{ transform: 'rotate(-4deg)' }} aria-hidden="true">
      <rect
        x={1.5} y={1.5} width={57} height={35} rx={1.5}
        fill="none" stroke={INK} strokeWidth={1.4}
        strokeDasharray="2 1.4"
        opacity={0.9}
      />
      <rect
        x={4} y={4} width={52} height={30} rx={0.5}
        fill="none" stroke={INK} strokeWidth={0.5}
        opacity={0.5}
      />
      <text
        x={30} y={17.5}
        fontSize={9.2} fontFamily={STAMP_FONT} fontWeight={700} fill={INK}
        textAnchor="middle" letterSpacing="1.2" opacity={0.95}
      >
        COOKED
      </text>
      <line x1={9} y1={21.5} x2={51} y2={21.5} stroke={INK} strokeWidth={0.4} opacity={0.4} />
      <text
        x={30} y={29}
        fontSize={5.2} fontFamily={STAMP_FONT} fontWeight={500} fill={INK}
        textAnchor="middle" letterSpacing="1.6" opacity={0.85}
      >
        18 · V · 26
      </text>
    </svg>
  );
}

/* Wavy cancellation — uses the production CookedStampMark component */
function StampWavy() {
  return <CookedStampMark width={64} />;
}

function renderStamp(variant: StampVariant) {
  switch (variant) {
    case 'cancellation': return <StampCancellation />;
    case 'roundel':      return <StampRoundel />;
    case 'visa':         return <StampVisa />;
    case 'wavy':         return <StampWavy />;
  }
}

/* ---------------------------------------------------------------- */
/*  Card preview                                                    */
/* ---------------------------------------------------------------- */

const SAMPLE = {
  name: 'Lamb Tagine with Apricots',
  country: 'Morocco',
  prepTime: 20,
  cookTime: 95,
  protein: 38,
  calories: 540,
  image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  tags: ['Slow', 'Comfort', 'Sweet & savory'],
};

function CardWithStamp({ variant }: { variant: StampVariant }) {
  return (
    <div className="relative bg-surface rounded-2xl overflow-hidden shadow-md block">
      <div className="relative h-44 overflow-hidden bg-parchment-dark">
        <Image
          src={SAMPLE.image}
          alt={SAMPLE.name}
          fill
          sizes="(max-width: 700px) 100vw, 380px"
          className="object-cover"
        />
        <span className="absolute top-3 right-3 max-w-[55%] truncate bg-white/90 backdrop-blur text-brown-dark text-xs font-medium px-2.5 py-1 rounded-full shadow">
          {SAMPLE.country}
        </span>
        {/* Stamp glyph, top-left of image */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          {renderStamp(variant)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-brown-dark mb-2 leading-tight">
          {SAMPLE.name}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SAMPLE.tags.map(t => (
            <span key={t} className="text-xs font-medium px-2 py-0.5 rounded-full bg-parchment-dark text-brown-medium">
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[13px] text-brown-medium nums-tabular">
          <span className="flex items-center gap-1"><Clock size={14} />{SAMPLE.prepTime + SAMPLE.cookTime}m</span>
          <span className="flex items-center gap-1"><Dumbbell size={14} />{SAMPLE.protein}g protein</span>
          <span className="flex items-center gap-1"><Flame size={14} />{SAMPLE.calories} cal</span>
        </div>
      </div>
    </div>
  );
}

/* Standalone stamp swatch (against parchment) so you can see the mark itself */
function StampSwatch({ variant }: { variant: StampVariant }) {
  return (
    <div className="flex items-center justify-center h-24 rounded-lg bg-parchment border border-brown-light/25">
      {renderStamp(variant)}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Page                                                            */
/* ---------------------------------------------------------------- */

export default function CookedIndicatorDevPage() {
  const variants: StampVariant[] = ['cancellation', 'roundel', 'visa', 'wavy'];

  return (
    <div className="min-h-screen bg-parchment text-brown-dark">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <p className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium mb-3">
            DEV · COOKED INDICATOR
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold mb-3">
            Stamp glyph designs
          </h1>
          <p className="text-brown-medium max-w-2xl">
            Picks locked in: <span className="font-medium text-brown-dark">diagonal hatch fill</span> on the map,
            <span className="font-medium text-brown-dark"> corner postmark glyph</span> on recipe cards, both in
            <span className="font-medium text-brown-dark"> stamp-ink terracotta</span>. Open question:
            <em> which stamp design?</em>
          </p>
        </header>

        {/* Locked map */}
        <section className="mb-16">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium">LOCKED</span>
            <h2 className="font-heading text-2xl font-semibold">Map: diagonal hatch fill</h2>
          </div>
          <HatchMap />
        </section>

        {/* Stamp design comparison */}
        <section>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium">OPEN</span>
            <h2 className="font-heading text-2xl font-semibold">Stamp glyph designs</h2>
          </div>
          <p className="text-brown-medium text-sm mb-6 max-w-2xl">
            Each stamp appears twice: once on its own against parchment (so you can read the design),
            and once in context on a recipe card (so you can see how it sits next to the country pill and image).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
            {variants.map((v, i) => (
              <figure key={v}>
                <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <StampSwatch variant={v} />
                  <CardWithStamp variant={v} />
                </div>
                <figcaption className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium">
                      Option {i + 1}
                    </span>
                    <h3 className="font-heading text-lg font-semibold">{STAMP_LABEL[v]}</h3>
                  </div>
                  <p className="text-sm text-brown-medium mt-1">{STAMP_DESC[v]}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
