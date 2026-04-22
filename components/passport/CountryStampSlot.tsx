'use client';

import type { Stamp as StampRow } from '@/lib/passport';
import {
  getStampTraits,
  sizeMultiplier,
  shapeAspect,
  stampAngle,
  stampColorValue,
  type StampShape,
  type StampBorderStyle,
  type StampBorderWeight,
  type StampInnerDetail,
} from '@/lib/stamp-traits';

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

/* ── Shape rendering helpers ─────────────────────────────────── */

function isPolygonShape(shape: StampShape): boolean {
  return shape === 'hexagon' || shape === 'triangle' || shape === 'diamond';
}

function shapeRadius(shape: StampShape): string {
  switch (shape) {
    case 'circle':         return '50%';
    case 'oval-landscape': return '50%';
    case 'oval-portrait':  return '50%';
    case 'rect-landscape': return '12%';
    case 'rect-portrait':  return '12%';
    case 'pill':           return '999px';
    default:               return '0';
  }
}

function borderWidthEm(weight: StampBorderWeight): string {
  return weight === 'thin' ? '0.1em' : '0.16em';
}

function svgDashArray(style: StampBorderStyle): string | undefined {
  switch (style) {
    case 'solid':  return undefined;
    case 'dashed': return '6 3';
    case 'dotted': return '2 2';
  }
}

function polygonPoints(shape: 'hexagon' | 'triangle' | 'diamond'): string {
  switch (shape) {
    case 'hexagon':  return '25,0 75,0 100,50 75,100 25,100 0,50';
    case 'triangle': return '50,3 97,92 3,92';
    case 'diamond':  return '50,0 100,50 50,100 0,50';
  }
}

function innerPolygonPoints(shape: 'hexagon' | 'triangle' | 'diamond'): string {
  switch (shape) {
    case 'hexagon':  return '30,8 70,8 92,50 70,92 30,92 8,50';
    case 'triangle': return '50,14 90,87 10,87';
    case 'diamond':  return '50,10 90,50 50,90 10,50';
  }
}

/** Pick a decorative separator style deterministically. */
function decorSeparator(hash: number): 'stars' | 'dots' | 'line' | 'none' {
  const opts = ['stars', 'dots', 'line', 'none'] as const;
  return opts[hash % opts.length];
}

function stableHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ── SVG outline for polygon shapes ──────────────────────────── */

function PolygonOutline({
  shape, borderStyle, borderWeight, innerDetail, color,
}: {
  shape: 'hexagon' | 'triangle' | 'diamond';
  borderStyle: StampBorderStyle;
  borderWeight: StampBorderWeight;
  innerDetail: StampInnerDetail;
  color: string;
}) {
  const sw = borderWeight === 'thin' ? 1.8 : 2.8;
  const dash = svgDashArray(borderStyle);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polygon
        points={polygonPoints(shape)}
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={dash}
        fill="none"
        strokeLinejoin="round"
      />
      {innerDetail === 'double-ring' && (
        <polygon
          points={innerPolygonPoints(shape)}
          stroke={color}
          strokeWidth={Math.max(0.8, sw * 0.4)}
          strokeDasharray={dash}
          fill="none"
          strokeLinejoin="round"
          opacity={0.45}
        />
      )}
      {innerDetail === 'inner-frame' && (
        <polygon
          points={innerPolygonPoints(shape)}
          stroke={color}
          strokeWidth={0.8}
          fill="none"
          strokeLinejoin="round"
          opacity={0.3}
        />
      )}
    </svg>
  );
}

/* ── CSS border outline for rounded shapes ───────────────────── */

function CssBorderOutline({
  shape, borderStyle, borderWeight, innerDetail,
}: {
  shape: StampShape;
  borderStyle: StampBorderStyle;
  borderWeight: StampBorderWeight;
  innerDetail: StampInnerDetail;
}) {
  const radius = shapeRadius(shape);

  return (
    <>
      <span
        className="absolute inset-0 border-current"
        style={{
          borderWidth: borderWidthEm(borderWeight),
          borderStyle,
          borderRadius: radius,
        }}
      />
      {innerDetail === 'double-ring' && (
        <span
          className="absolute inset-[7%] border-current/45"
          style={{
            borderWidth: borderWeight === 'thin' ? '0.05em' : '0.06em',
            borderStyle,
            borderRadius: radius,
          }}
        />
      )}
      {innerDetail === 'inner-frame' && (
        <span
          className="absolute inset-[11%] border-current/30"
          style={{
            borderWidth: '0.04em',
            borderStyle: 'solid',
            borderRadius: radius,
          }}
        />
      )}
    </>
  );
}

/* ── Decorative separator between country name and date ──────── */

function Separator({ kind }: { kind: 'stars' | 'dots' | 'line' }) {
  switch (kind) {
    case 'stars':
      return (
        <span className="flex items-center gap-[0.3em] my-[0.25em] opacity-60" aria-hidden>
          <span style={{ fontSize: '0.55em' }}>&#10038;</span>
          <span className="w-[1.5em] h-px bg-current/40" />
          <span style={{ fontSize: '0.55em' }}>&#10038;</span>
        </span>
      );
    case 'dots':
      return (
        <span className="flex items-center gap-[0.25em] my-[0.25em] opacity-50" aria-hidden>
          <span className="w-[0.2em] h-[0.2em] rounded-full bg-current" />
          <span className="w-[0.2em] h-[0.2em] rounded-full bg-current" />
          <span className="w-[0.2em] h-[0.2em] rounded-full bg-current" />
        </span>
      );
    case 'line':
      return (
        <span className="block w-[70%] h-px bg-current/35 my-[0.3em] mx-auto" aria-hidden />
      );
  }
}

/* ── Main component ──────────────────────────────────────────── */

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const traits = getStampTraits(country);
  const angle = stampAngle(country);
  const firstDate = stamps[0]?.cooked_at;
  const mult = sizeMultiplier(traits.sizeBucket);
  const [aw, ah] = shapeAspect(traits.shape);
  const color = stampColorValue(traits.color);
  const polygon = isPolygonShape(traits.shape);
  const hash = stableHash(country);
  const sepKind = decorSeparator(hash >> 4);

  // Triangle/diamond text needs to be pushed toward the center where there's room
  const isTriangle = traits.shape === 'triangle';
  const isDiamond = traits.shape === 'diamond';

  const sizeStyle: React.CSSProperties = {
    width: `calc(var(--stamp-size) * ${mult * aw})`,
    height: `calc(var(--stamp-size) * ${mult * ah})`,
    fontSize: `calc(var(--stamp-size) * ${mult} * 0.11)`,
    color,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={
        'relative flex items-center justify-center ' +
        'transition-transform focus:outline-none focus-visible:ring-2 ' +
        'focus-visible:ring-terracotta cursor-pointer ' +
        '[filter:url(#stamp-ink)] motion-reduce:[filter:none] ' +
        'hover:scale-[1.03] mix-blend-multiply [contain:layout_style_paint]'
      }
      style={{
        ...sizeStyle,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {/* Shape outline */}
      {polygon ? (
        <PolygonOutline
          shape={traits.shape as 'hexagon' | 'triangle' | 'diamond'}
          borderStyle={traits.borderStyle}
          borderWeight={traits.borderWeight}
          innerDetail={traits.innerDetail}
          color={color}
        />
      ) : (
        <CssBorderOutline
          shape={traits.shape}
          borderStyle={traits.borderStyle}
          borderWeight={traits.borderWeight}
          innerDetail={traits.innerDetail}
        />
      )}

      {/* Text content — positioned toward center for polygon shapes */}
      <span
        className="flex flex-col items-center justify-center relative z-[1]"
        style={{
          paddingLeft: '0.4em',
          paddingRight: '0.4em',
          // Push text down in triangles (narrow top), center in diamonds
          ...(isTriangle ? { paddingTop: '18%' } : {}),
          ...(isDiamond ? { paddingTop: '5%' } : {}),
        }}
      >
        <span className="font-heading font-bold uppercase tracking-[0.12em] leading-none text-center">
          {country}
        </span>

        {/* Decorative separator */}
        {firstDate && sepKind !== 'none' && <Separator kind={sepKind} />}

        {firstDate && (
          <span
            className={`font-body uppercase tracking-wider opacity-75 ${sepKind === 'none' ? 'mt-[0.35em]' : ''}`}
            style={{ fontSize: '0.7em' }}
          >
            {formatMonth(firstDate)}
          </span>
        )}
        {stamps.length > 1 && (
          <span
            className="mt-[0.15em] font-body opacity-60"
            style={{ fontSize: '0.6em' }}
          >
            &times;{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
