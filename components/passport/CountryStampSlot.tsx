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

/** Whether a shape uses SVG polygon outlines instead of CSS borders. */
function isPolygonShape(shape: StampShape): boolean {
  return shape === 'hexagon' || shape === 'triangle' || shape === 'diamond';
}

/** CSS border-radius for border-rendered shapes. */
function shapeRadius(shape: StampShape): string {
  switch (shape) {
    case 'circle':         return '50%';
    case 'oval-landscape': return '50%';
    case 'oval-portrait':  return '50%';
    case 'rect-landscape': return '12%';
    case 'rect-portrait':  return '12%';
    case 'pill':           return '999px';
    default:               return '0'; // polygon shapes don't use border-radius
  }
}

function borderWidthEm(weight: StampBorderWeight): string {
  return weight === 'thin' ? '0.1em' : '0.16em';
}

/** SVG stroke-dasharray for border style. Returns undefined for solid. */
function svgDashArray(style: StampBorderStyle): string | undefined {
  switch (style) {
    case 'solid':  return undefined;
    case 'dashed': return '6 3';
    case 'dotted': return '2 2';
  }
}

/**
 * SVG polygon points for shapes that can't rely on CSS borders.
 * Points are in a 0–100 coordinate space.
 */
function polygonPoints(shape: 'hexagon' | 'triangle' | 'diamond'): string {
  switch (shape) {
    case 'hexagon':  return '25,0 75,0 100,50 75,100 25,100 0,50';
    case 'triangle': return '50,5 95,90 5,90';
    case 'diamond':  return '50,0 100,50 50,100 0,50';
  }
}

/** Inset polygon points for inner detail ring. */
function innerPolygonPoints(shape: 'hexagon' | 'triangle' | 'diamond'): string {
  switch (shape) {
    case 'hexagon':  return '30,8 70,8 92,50 70,92 30,92 8,50';
    case 'triangle': return '50,15 88,85 12,85';
    case 'diamond':  return '50,10 90,50 50,90 10,50';
  }
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
  const sw = borderWeight === 'thin' ? 2 : 3.5;
  const dash = svgDashArray(borderStyle);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Outer border */}
      <polygon
        points={polygonPoints(shape)}
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={dash}
        fill="none"
        strokeLinejoin="round"
      />
      {/* Inner detail */}
      {innerDetail === 'double-ring' && (
        <polygon
          points={innerPolygonPoints(shape)}
          stroke={color}
          strokeWidth={Math.max(1, sw * 0.5)}
          strokeDasharray={dash}
          fill="none"
          strokeLinejoin="round"
          opacity={0.5}
        />
      )}
      {innerDetail === 'inner-frame' && (
        <polygon
          points={innerPolygonPoints(shape)}
          stroke={color}
          strokeWidth={1}
          fill="none"
          strokeLinejoin="round"
          opacity={0.35}
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
      {/* Outer border */}
      <span
        className="absolute inset-0 border-current"
        style={{
          borderWidth: borderWidthEm(borderWeight),
          borderStyle,
          borderRadius: radius,
        }}
      />
      {/* Inner detail */}
      {innerDetail === 'double-ring' && (
        <span
          className="absolute inset-[8%] border-current/50"
          style={{
            borderWidth: borderWeight === 'thin' ? '0.05em' : '0.06em',
            borderStyle,
            borderRadius: radius,
          }}
        />
      )}
      {innerDetail === 'inner-frame' && (
        <span
          className="absolute inset-[12%] border-current/35"
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

/* ── Main component ──────────────────────────────────────────── */

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const traits = getStampTraits(country);
  const angle = stampAngle(country);
  const firstDate = stamps[0]?.cooked_at;
  const mult = sizeMultiplier(traits.sizeBucket);
  const [aw, ah] = shapeAspect(traits.shape);
  const color = stampColorValue(traits.color);
  const polygon = isPolygonShape(traits.shape);

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
      {/* Shape outline — SVG for polygons, CSS borders for rounded shapes */}
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

      {/* Text content */}
      <span className="flex flex-col items-center justify-center px-[0.4em] relative z-[1]">
        <span className="font-heading font-bold uppercase tracking-[0.15em] leading-none text-center">
          {country}
        </span>
        {firstDate && (
          <span
            className="mt-[0.4em] font-body uppercase tracking-wider opacity-80"
            style={{ fontSize: '0.75em' }}
          >
            {formatMonth(firstDate)}
          </span>
        )}
        {stamps.length > 1 && (
          <span
            className="mt-[0.2em] font-body opacity-70"
            style={{ fontSize: '0.65em' }}
          >
            &times;{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
