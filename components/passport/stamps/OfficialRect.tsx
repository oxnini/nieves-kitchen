import type { StampDesignProps } from './shared';

export default function OfficialRect({ country, date, count, color, subtitle }: StampDesignProps) {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-full" aria-hidden>
      {/* Outer frame */}
      <rect x={5} y={5} width={210} height={140} rx={4} stroke={color} strokeWidth={3.5} fill="none" />
      {/* Inner frame */}
      <rect x={13} y={13} width={194} height={124} rx={2} stroke={color} strokeWidth={0.8} fill="none" opacity={0.35} />

      {/* Bold top bar */}
      <rect x={5} y={5} width={210} height={14} rx={4} fill={color} opacity={0.12} />

      {/* Subtitle in top bar */}
      <text x={110} y={16} textAnchor="middle" fill={color} fontSize={7} fontFamily="var(--font-cutive)" letterSpacing="0.2em" opacity={0.6}>
        {subtitle}
      </text>

      {/* Corner brackets */}
      {[
        'M19,28 L19,19 L28,19', 'M201,28 L201,19 L192,19',
        'M19,122 L19,131 L28,131', 'M201,122 L201,131 L192,131',
      ].map((d, i) => (
        <path key={i} d={d} stroke={color} strokeWidth={1.8} fill="none" opacity={0.45} strokeLinecap="round" />
      ))}

      {/* Big country name */}
      <text x={110} y={68} textAnchor="middle" fill={color}
        fontSize={country.length > 10 ? 18 : country.length > 7 ? 21 : 25}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.12em">
        {country.toUpperCase()}
      </text>

      {/* Thick divider */}
      <line x1={30} y1={78} x2={190} y2={78} stroke={color} strokeWidth={1.5} opacity={0.25} />

      {/* Date */}
      {date && (
        <text x={110} y={100} textAnchor="middle" fill={color} fontSize={15} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={110} y={116} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* Bottom label */}
      <text x={110} y={141} textAnchor="middle" fill={color} fontSize={6} fontFamily="var(--font-cutive)" letterSpacing="0.12em" opacity={0.35}>
        {"NIEVES' KITCHEN"}
      </text>
    </svg>
  );
}
