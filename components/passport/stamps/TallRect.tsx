import { CompassStar, type StampDesignProps } from './shared';

export default function TallRect({ country, date, count, color, subtitle }: StampDesignProps) {
  return (
    <svg viewBox="0 0 155 210" className="w-full h-full" aria-hidden>
      {/* Outer frame */}
      <rect x={5} y={5} width={145} height={200} rx={4} stroke={color} strokeWidth={3} fill="none" />
      {/* Inner frame — dashed */}
      <rect x={14} y={14} width={127} height={182} rx={2} stroke={color} strokeWidth={1} fill="none"
        strokeDasharray="6 3" opacity={0.3} />

      {/* Accent bars */}
      <rect x={5} y={5} width={145} height={10} rx={4} fill={color} opacity={0.12} />
      <rect x={5} y={195} width={145} height={10} rx={4} fill={color} opacity={0.12} />

      {/* Subtitle */}
      <text x={77.5} y={40} textAnchor="middle" fill={color} fontSize={7} fontFamily="var(--font-cutive)" letterSpacing="0.14em" opacity={0.5}>
        {subtitle}
      </text>

      {/* Compass star */}
      <CompassStar cx={77.5} cy={68} size={13} color={color} />

      {/* Divider above country */}
      <g opacity={0.3}>
        <line x1={30} y1={88} x2={125} y2={88} stroke={color} strokeWidth={0.6} />
      </g>

      {/* Country name */}
      <text x={77.5} y={110} textAnchor="middle" fill={color}
        fontSize={country.length > 10 ? 14 : country.length > 7 ? 17 : 21}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.1em">
        {country.toUpperCase()}
      </text>

      {/* Divider below country */}
      <g opacity={0.3}>
        <line x1={30} y1={118} x2={125} y2={118} stroke={color} strokeWidth={0.6} />
      </g>

      {/* Date */}
      {date && (
        <text x={77.5} y={142} textAnchor="middle" fill={color} fontSize={14} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={77.5} y={158} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* Bottom label */}
      <text x={77.5} y={185} textAnchor="middle" fill={color} fontSize={6} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.35}>
        {"NIEVES' KITCHEN"}
      </text>
    </svg>
  );
}
