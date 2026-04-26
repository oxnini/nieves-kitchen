import { CompassStar, PlaneIcon, type StampDesignProps } from './shared';

export default function Triangle({ country, date, count, color, subtitle }: StampDesignProps) {
  const outer = 'M110,8 L214,188 L6,188 Z';
  const inner = 'M110,30 L198,178 L22,178 Z';
  const tiny  = 'M110,52 L182,168 L38,168 Z';

  return (
    <svg viewBox="0 0 220 200" className="w-full h-full" aria-hidden>
      {/* Outer triangle — thick */}
      <path d={outer} stroke={color} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
      {/* Inner triangle — thin solid */}
      <path d={inner} stroke={color} strokeWidth={1.2} fill="none" opacity={0.35} strokeLinejoin="round" />
      {/* Tiny inner triangle — dotted, for depth */}
      <path d={tiny} stroke={color} strokeWidth={0.6} fill="none" opacity={0.15}
        strokeLinejoin="round" strokeDasharray="3 3" />

      {/* Vertex dots */}
      <circle cx={110} cy={8} r={3.5} fill={color} opacity={0.45} />
      <circle cx={6} cy={188} r={3.5} fill={color} opacity={0.45} />
      <circle cx={214} cy={188} r={3.5} fill={color} opacity={0.45} />

      {/* Mid-edge ticks */}
      <circle cx={60} cy={98} r={1.5} fill={color} opacity={0.3} />
      <circle cx={162} cy={98} r={1.5} fill={color} opacity={0.3} />
      <circle cx={110} cy={188} r={1.5} fill={color} opacity={0.3} />

      {/* Star at apex */}
      <CompassStar cx={110} cy={52} size={7} color={color} />

      {/* Small plane icon below star */}
      <PlaneIcon cx={110} cy={76} size={6} color={color} />

      {/* Subtitle */}
      <text x={110} y={98} textAnchor="middle" fill={color} fontSize={6.5} fontFamily="var(--font-cutive)" letterSpacing="0.14em" opacity={0.45}>
        {subtitle}
      </text>

      {/* Decorative dots row */}
      <g opacity={0.3}>
        <circle cx={80} cy={107} r={1} fill={color} />
        <circle cx={95} cy={107} r={1} fill={color} />
        <circle cx={110} cy={107} r={1} fill={color} />
        <circle cx={125} cy={107} r={1} fill={color} />
        <circle cx={140} cy={107} r={1} fill={color} />
      </g>

      {/* Country name */}
      <text x={110} y={128} textAnchor="middle" fill={color}
        fontSize={country.length > 10 ? 14 : country.length > 7 ? 17 : 21}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.1em">
        {country.toUpperCase()}
      </text>

      {/* Divider with star */}
      <g opacity={0.35}>
        <line x1={52} y1={138} x2={95} y2={138} stroke={color} strokeWidth={0.7} />
        <text x={110} y={141} textAnchor="middle" fill={color} fontSize={5}>✦</text>
        <line x1={125} y1={138} x2={168} y2={138} stroke={color} strokeWidth={0.7} />
      </g>

      {/* Date */}
      {date && (
        <text x={110} y={157} textAnchor="middle" fill={color} fontSize={14} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={110} y={173} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}
    </svg>
  );
}
