import { hashCountry } from '@/lib/stamp-traits';
import { ForkKnife, type StampDesignProps } from './shared';

export default function OvalBadge({ country, date, count, color, subtitle }: StampDesignProps) {
  const id = `ob-${hashCountry(country)}`;
  return (
    <svg viewBox="0 0 260 170" className="w-full h-full" aria-hidden>
      <defs>
        <path id={`${id}-top`} d="M 130,85 m -85,0 a 85,50 0 1,1 170,0" fill="none" />
        <path id={`${id}-bot`} d="M 130,85 m 85,0 a 85,50 0 1,1 -170,0" fill="none" />
      </defs>

      {/* Outer oval — thick */}
      <ellipse cx={130} cy={85} rx={120} ry={76} stroke={color} strokeWidth={3.5} fill="none" />
      {/* Inner oval — dashed */}
      <ellipse cx={130} cy={85} rx={108} ry={65} stroke={color} strokeWidth={1.2} fill="none"
        strokeDasharray="4 3" opacity={0.4} />

      {/* Country curved top */}
      <text fill={color} fontSize={15} fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.16em">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {country.toUpperCase()}
        </textPath>
      </text>

      {/* Subtitle curved bottom */}
      <text fill={color} fontSize={7} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.5}>
        <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
          {subtitle}
        </textPath>
      </text>

      {/* Filled circle separators at sides */}
      <circle cx={22} cy={85} r={3} fill={color} opacity={0.4} />
      <circle cx={238} cy={85} r={3} fill={color} opacity={0.4} />

      {/* Fork & knife motif */}
      <ForkKnife cx={130} cy={70} size={7} color={color} />

      {/* Date */}
      {date && (
        <text x={130} y={100} textAnchor="middle" fill={color} fontSize={14} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={130} y={116} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}
    </svg>
  );
}
