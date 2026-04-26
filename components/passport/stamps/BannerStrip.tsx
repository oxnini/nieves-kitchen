import type { StampDesignProps } from './shared';

export default function BannerStrip({ country, date, count, color, subtitle }: StampDesignProps) {
  return (
    <svg viewBox="0 0 240 110" className="w-full h-full" aria-hidden>
      {/* Outer border */}
      <rect x={4} y={4} width={232} height={102} rx={4} stroke={color} strokeWidth={3.5} fill="none" />
      {/* Inner border — dotted */}
      <rect x={12} y={12} width={216} height={86} rx={2} stroke={color} strokeWidth={0.8} fill="none"
        strokeDasharray="3 2.5" opacity={0.3} />

      {/* Left accent bar */}
      <rect x={4} y={4} width={12} height={102} rx={4} fill={color} opacity={0.1} />
      {/* Right accent bar */}
      <rect x={224} y={4} width={12} height={102} rx={4} fill={color} opacity={0.1} />

      {/* Corner dots */}
      <circle cx={20} cy={20} r={1.8} fill={color} opacity={0.35} />
      <circle cx={220} cy={20} r={1.8} fill={color} opacity={0.35} />
      <circle cx={20} cy={90} r={1.8} fill={color} opacity={0.35} />
      <circle cx={220} cy={90} r={1.8} fill={color} opacity={0.35} />

      {/* Subtitle */}
      <text x={120} y={30} textAnchor="middle" fill={color} fontSize={6.5} fontFamily="var(--font-cutive)" letterSpacing="0.16em" opacity={0.45}>
        {subtitle}
      </text>

      {/* Top divider with star */}
      <g opacity={0.3}>
        <line x1={35} y1={36} x2={100} y2={36} stroke={color} strokeWidth={0.6} />
        <text x={120} y={39} textAnchor="middle" fill={color} fontSize={5}>✦</text>
        <line x1={140} y1={36} x2={205} y2={36} stroke={color} strokeWidth={0.6} />
      </g>

      {/* Country name */}
      <text x={120} y={60} textAnchor="middle" fill={color}
        fontSize={country.length > 10 ? 16 : country.length > 7 ? 19 : 22}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.12em">
        {country.toUpperCase()}
      </text>

      {/* Bottom divider */}
      <line x1={40} y1={68} x2={200} y2={68} stroke={color} strokeWidth={0.8} opacity={0.2} />

      {/* Date */}
      {date && (
        <text x={120} y={84} textAnchor="middle" fill={color} fontSize={13} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={120} y={98} textAnchor="middle" fill={color} fontSize={9} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* Bottom label */}
      {count <= 1 && (
        <text x={120} y={98} textAnchor="middle" fill={color} fontSize={5.5} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.35}>
          {"NIEVES' KITCHEN"}
        </text>
      )}
    </svg>
  );
}
