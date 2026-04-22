'use client';

import type { Stamp as StampRow } from '@/lib/passport';
import {
  getStampTraits,
  sizeMultiplier,
  shapeAspect,
  stampAngle,
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

/** CSS border-radius for each shape. */
function shapeRadius(shape: StampShape): string {
  switch (shape) {
    case 'circle':         return '50%';
    case 'oval-landscape': return '50%';
    case 'oval-portrait':  return '50%';
    case 'rect-landscape': return '12%';
    case 'rect-portrait':  return '12%';
    case 'hexagon':        return '0';
    case 'triangle':       return '0';
    case 'diamond':        return '6%';
    case 'pill':           return '999px';
  }
}

/** CSS clip-path for shapes that need it; null for border-radius-only shapes. */
function shapeClipPath(shape: StampShape): string | null {
  switch (shape) {
    case 'hexagon':  return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
    case 'triangle': return 'polygon(50% 5%, 95% 90%, 5% 90%)';
    case 'diamond':  return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    default:         return null;
  }
}

function borderWidthEm(weight: StampBorderWeight): string {
  return weight === 'thin' ? '0.1em' : '0.16em';
}

function borderStyleCss(style: StampBorderStyle): string {
  return style;
}

function InnerDetail({
  detail, shape, borderStyle,
}: { detail: StampInnerDetail; shape: StampShape; borderStyle: StampBorderStyle }) {
  const clip = shapeClipPath(shape);
  const radius = shapeRadius(shape);

  switch (detail) {
    case 'none':
      return null;
    case 'double-ring':
      return (
        <span
          className="absolute inset-[8%] border-[0.06em] border-current/60"
          style={{
            borderRadius: radius,
            borderStyle: borderStyleCss(borderStyle),
            ...(clip ? { clipPath: clip } : {}),
          }}
        />
      );
    case 'corner-ticks':
      return (
        <>
          <span className="absolute top-[10%] left-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute top-[10%] left-[10%] w-px h-[12%] bg-current/50" />
          <span className="absolute top-[10%] right-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute top-[10%] right-[10%] w-px h-[12%] bg-current/50" />
          <span className="absolute bottom-[10%] left-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute bottom-[10%] left-[10%] w-px h-[12%] bg-current/50" />
          <span className="absolute bottom-[10%] right-[10%] w-[12%] h-px bg-current/50" />
          <span className="absolute bottom-[10%] right-[10%] w-px h-[12%] bg-current/50" />
        </>
      );
    case 'inner-frame':
      return (
        <span
          className="absolute inset-[12%] border-[0.04em] border-current/40"
          style={{
            borderRadius: radius,
            borderStyle: 'solid',
            ...(clip ? { clipPath: clip } : {}),
          }}
        />
      );
  }
}

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const traits = getStampTraits(country);
  const angle = stampAngle(country);
  const firstDate = stamps[0]?.cooked_at;
  const mult = sizeMultiplier(traits.sizeBucket);
  const [aw, ah] = shapeAspect(traits.shape);
  const clip = shapeClipPath(traits.shape);
  const radius = shapeRadius(traits.shape);

  const sizeStyle: React.CSSProperties = {
    width: `calc(var(--stamp-size) * ${mult * aw})`,
    height: `calc(var(--stamp-size) * ${mult * ah})`,
    fontSize: `calc(var(--stamp-size) * ${mult} * 0.11)`,
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
        'text-paprika/90 [filter:url(#stamp-ink)] motion-reduce:[filter:none] ' +
        'hover:scale-[1.03] mix-blend-multiply [contain:layout_style_paint]'
      }
      style={{
        ...sizeStyle,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {/* Outer border */}
      <span
        className="absolute inset-0 border-current"
        style={{
          borderWidth: borderWidthEm(traits.borderWeight),
          borderStyle: borderStyleCss(traits.borderStyle),
          borderRadius: radius,
          ...(clip ? { clipPath: clip } : {}),
        }}
      />

      {/* Inner detail */}
      <InnerDetail
        detail={traits.innerDetail}
        shape={traits.shape}
        borderStyle={traits.borderStyle}
      />

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
