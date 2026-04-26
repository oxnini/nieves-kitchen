import type { StampDesignProps } from './shared';

export default function Diamond({ country, date, count, color, subtitle }: StampDesignProps) {
  const outer = 'M100,6 L194,100 L100,194 L6,100 Z';
  const inner = 'M100,22 L178,100 L100,178 L22,100 Z';

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      {/* Outer diamond — thick */}
      <path d={outer} stroke={color} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
      {/* Inner diamond — thin, dot-dash */}
      <path d={inner} stroke={color} strokeWidth={1} fill="none" opacity={0.35}
        strokeLinejoin="round" strokeDasharray="8 3 2 3" />

      {/* Corner dots */}
      {[[100,6],[194,100],[100,194],[6,100]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} opacity={0.5} />
      ))}

      {/* Mid-edge ticks */}
      {[[147,53],[147,147],[53,147],[53,53]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill={color} opacity={0.3} />
      ))}

      {/* Subtitle */}
      <text x={100} y={65} textAnchor="middle" fill={color} fontSize={6.5} fontFamily="var(--font-cutive)" letterSpacing="0.12em" opacity={0.45}>
        {subtitle}
      </text>

      {/* Central dot motif — three dots */}
      <g opacity={0.4}>
        <circle cx={85} cy={78} r={1.5} fill={color} />
        <circle cx={100} cy={78} r={1.5} fill={color} />
        <circle cx={115} cy={78} r={1.5} fill={color} />
      </g>

      {/* Country name */}
      <text x={100} y={100} textAnchor="middle" dominantBaseline="central" fill={color}
        fontSize={country.length > 10 ? 13 : country.length > 7 ? 16 : 19}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.1em">
        {country.toUpperCase()}
      </text>

      {/* Divider with star */}
      <g opacity={0.4}>
        <line x1={55} y1={112} x2={88} y2={112} stroke={color} strokeWidth={0.7} />
        <text x={100} y={115} textAnchor="middle" fill={color} fontSize={6}>✦</text>
        <line x1={112} y1={112} x2={145} y2={112} stroke={color} strokeWidth={0.7} />
      </g>

      {/* Date */}
      {date && (
        <text x={100} y={130} textAnchor="middle" fill={color} fontSize={13} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={100} y={145} textAnchor="middle" fill={color} fontSize={9} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}
    </svg>
  );
}
