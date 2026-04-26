import type { StampDesignProps } from './shared';

export default function Hexagonal({ country, date, count, color, subtitle }: StampDesignProps) {
  const outerHex = 'M100,8 L184,52 L184,148 L100,192 L16,148 L16,52 Z';
  const innerHex = 'M100,24 L170,62 L170,138 L100,176 L30,138 L30,62 Z';

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      {/* Background globe lines — very faint */}
      <circle cx={100} cy={100} r={40} stroke={color} strokeWidth={0.4} fill="none" opacity={0.12} />
      <ellipse cx={100} cy={100} rx={20} ry={40} stroke={color} strokeWidth={0.4} fill="none" opacity={0.1} />
      <line x1={60} y1={100} x2={140} y2={100} stroke={color} strokeWidth={0.3} opacity={0.1} />
      <line x1={100} y1={60} x2={100} y2={140} stroke={color} strokeWidth={0.3} opacity={0.1} />

      {/* Outer hexagon — thick */}
      <path d={outerHex} stroke={color} strokeWidth={4} fill="none" strokeLinejoin="round" />
      {/* Inner hexagon — thin solid */}
      <path d={innerHex} stroke={color} strokeWidth={1} fill="none" opacity={0.3} strokeLinejoin="round" />

      {/* Dots at vertices */}
      {[[100,8],[184,52],[184,148],[100,192],[16,148],[16,52]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={color} opacity={0.4} />
      ))}

      {/* Subtitle */}
      <text x={100} y={50} textAnchor="middle" fill={color} fontSize={6.5} fontFamily="var(--font-cutive)" letterSpacing="0.14em" opacity={0.5}>
        {subtitle}
      </text>

      {/* Country name */}
      <text x={100} y={100} textAnchor="middle" dominantBaseline="central" fill={color}
        fontSize={country.length > 10 ? 15 : country.length > 7 ? 18 : 22}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.1em">
        {country.toUpperCase()}
      </text>

      {/* Divider */}
      <g opacity={0.35}>
        <line x1={55} y1={114} x2={85} y2={114} stroke={color} strokeWidth={0.7} />
        <circle cx={100} cy={114} r={1.5} fill={color} />
        <line x1={115} y1={114} x2={145} y2={114} stroke={color} strokeWidth={0.7} />
      </g>

      {/* Date */}
      {date && (
        <text x={100} y={134} textAnchor="middle" fill={color} fontSize={14} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={100} y={150} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* Bottom label */}
      <text x={100} y={170} textAnchor="middle" fill={color} fontSize={5.5} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.35}>
        {"NIEVES' KITCHEN"}
      </text>
    </svg>
  );
}
