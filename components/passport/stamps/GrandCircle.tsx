import { hashCountry } from '@/lib/stamp-traits';
import { PlaneIcon, type StampDesignProps } from './shared';

export default function GrandCircle({ country, date, count, color, subtitle }: StampDesignProps) {
  const id = `gc-${hashCountry(country)}`;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <defs>
        <path id={`${id}-top`} d="M 100,100 m -62,0 a 62,62 0 1,1 124,0" fill="none" />
        <path id={`${id}-bot`} d="M 100,100 m 62,0 a 62,62 0 1,1 -124,0" fill="none" />
      </defs>

      {/* Thick outer ring */}
      <circle cx={100} cy={100} r={92} stroke={color} strokeWidth={4} fill="none" />
      {/* Thin inner ring */}
      <circle cx={100} cy={100} r={85} stroke={color} strokeWidth={1} fill="none" opacity={0.4} />

      {/* Subtitle curved top */}
      <text fill={color} fontSize={7.5} fontFamily="var(--font-cutive)" letterSpacing="0.14em" opacity={0.55}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {subtitle}
        </textPath>
      </text>

      {/* Bottom text */}
      <text fill={color} fontSize={7.5} fontFamily="var(--font-cutive)" letterSpacing="0.12em" opacity={0.55}>
        <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
          {"NIEVES' KITCHEN"}
        </textPath>
      </text>

      {/* Plane icon at top */}
      <PlaneIcon cx={100} cy={54} size={8} color={color} />

      {/* Horizontal rules framing the name */}
      <line x1={30} y1={82} x2={170} y2={82} stroke={color} strokeWidth={0.6} opacity={0.3} />
      <line x1={30} y1={114} x2={170} y2={114} stroke={color} strokeWidth={0.6} opacity={0.3} />

      {/* Bold country name — straight across center */}
      <text x={100} y={103} textAnchor="middle" dominantBaseline="central" fill={color}
        fontSize={country.length > 10 ? 17 : country.length > 7 ? 21 : 25}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.1em">
        {country.toUpperCase()}
      </text>

      {/* Date below rule */}
      {date && (
        <text x={100} y={131} textAnchor="middle" fill={color} fontSize={14} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={100} y={147} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* Dots at cardinal points */}
      <circle cx={100} cy={8} r={2.5} fill={color} opacity={0.4} />
      <circle cx={100} cy={192} r={2.5} fill={color} opacity={0.4} />
      <circle cx={8} cy={100} r={2.5} fill={color} opacity={0.4} />
      <circle cx={192} cy={100} r={2.5} fill={color} opacity={0.4} />
    </svg>
  );
}
