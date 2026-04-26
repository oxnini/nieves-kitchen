import { hashCountry } from '@/lib/stamp-traits';
import type { StampDesignProps } from './shared';

export default function Postmark({ country, date, count, color }: StampDesignProps) {
  const id = `pm-${hashCountry(country)}`;
  return (
    <svg viewBox="0 0 260 200" className="w-full h-full" aria-hidden>
      <defs>
        <path id={`${id}-top`} d="M 100,100 m -58,0 a 58,58 0 1,1 116,0" fill="none" />
        <path id={`${id}-bot`} d="M 100,100 m 58,0 a 58,58 0 1,1 -116,0" fill="none" />
      </defs>

      {/* Wavy cancellation lines on the right side */}
      {[-24, -12, 0, 12, 24].map(offset => (
        <path key={offset}
          d={`M180,${100 + offset} Q200,${95 + offset} 220,${100 + offset} T260,${100 + offset}`}
          stroke={color} strokeWidth={2.2} fill="none" opacity={0.25} />
      ))}

      {/* Double circle — left portion */}
      <circle cx={100} cy={100} r={84} stroke={color} strokeWidth={3.5} fill="none" />
      <circle cx={100} cy={100} r={76} stroke={color} strokeWidth={2} fill="none" opacity={0.45} />

      {/* Country name curved top */}
      <text fill={color} fontSize={13.5} fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.16em">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {country.toUpperCase()}
        </textPath>
      </text>

      {/* Stars at 3 and 9 o'clock */}
      <text x={100} y={22} textAnchor="middle" fill={color} fontSize={10} opacity={0.5}>✦</text>
      <text x={100} y={184} textAnchor="middle" fill={color} fontSize={10} opacity={0.5}>✦</text>

      {/* "NIEVES' KITCHEN" curved bottom */}
      <text fill={color} fontSize={7} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.5}>
        <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
          {"NIEVES' KITCHEN"}
        </textPath>
      </text>

      {/* Date centered */}
      {date && (
        <text x={100} y={107} textAnchor="middle" fill={color} fontSize={15} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={100} y={123} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}
    </svg>
  );
}
