import { hashCountry } from '@/lib/stamp-traits';
import { DotRing, ForkKnife, scallopedPath, type StampDesignProps } from './shared';

export default function WavyCircle({ country, date, count, color, subtitle }: StampDesignProps) {
  const id = `wc-${hashCountry(country)}`;
  const wavy = scallopedPath(100, 100, 80, 20, 7);

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <defs>
        <path id={`${id}-top`} d="M 100,100 m -55,0 a 55,55 0 1,1 110,0" fill="none" />
        <path id={`${id}-bot`} d="M 100,100 m 55,0 a 55,55 0 1,1 -110,0" fill="none" />
      </defs>

      {/* Wavy outer edge */}
      <path d={wavy} stroke={color} strokeWidth={2.5} fill="none" />
      {/* Smooth inner circle */}
      <circle cx={100} cy={100} r={70} stroke={color} strokeWidth={2} fill="none" opacity={0.5} />
      {/* Dot ring */}
      <DotRing cx={100} cy={100} r={75} count={20} dotR={1.5} color={color} />

      {/* Country name curved top — well inset */}
      <text fill={color} fontSize={13} fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.16em">
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

      {/* Side stars */}
      <text x={37} cy={100} y={103} textAnchor="middle" fill={color} fontSize={8} opacity={0.4}>✦</text>
      <text x={163} cy={100} y={103} textAnchor="middle" fill={color} fontSize={8} opacity={0.4}>✦</text>

      {/* Fork & knife center motif */}
      <ForkKnife cx={100} cy={86} size={8} color={color} />

      {/* Date */}
      {date && (
        <text x={100} y={117} textAnchor="middle" fill={color} fontSize={14} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={100} y={133} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}
    </svg>
  );
}
