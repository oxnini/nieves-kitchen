import { PlaneIcon, type StampDesignProps } from './shared';

export default function PillCapsule({ country, date, count, color, subtitle }: StampDesignProps) {
  return (
    <svg viewBox="0 0 280 120" className="w-full h-full" aria-hidden>
      {/* Outer pill */}
      <rect x={4} y={4} width={272} height={112} rx={56} stroke={color} strokeWidth={3.5} fill="none" />
      {/* Inner pill */}
      <rect x={13} y={13} width={254} height={94} rx={47} stroke={color} strokeWidth={0.8} fill="none" opacity={0.3} />

      {/* Left zone — plane icon */}
      <PlaneIcon cx={52} cy={56} size={10} color={color} />
      <line x1={80} y1={28} x2={80} y2={92} stroke={color} strokeWidth={0.8} opacity={0.2} />

      {/* Right zone — date */}
      <line x1={200} y1={28} x2={200} y2={92} stroke={color} strokeWidth={0.8} opacity={0.2} />
      {date && (
        <>
          <text x={235} y={52} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-cutive)" letterSpacing="0.04em" opacity={0.6}>
            {date.split(' ')[0]}
          </text>
          <text x={235} y={72} textAnchor="middle" fill={color} fontSize={13} fontFamily="var(--font-cutive)" fontWeight={700} opacity={0.9}>
            {date.split(' ')[1]}
          </text>
        </>
      )}

      {/* Center zone — subtitle + country */}
      <text x={140} y={40} textAnchor="middle" fill={color} fontSize={6.5} fontFamily="var(--font-cutive)" letterSpacing="0.16em" opacity={0.45}>
        {subtitle}
      </text>

      <text x={140} y={66} textAnchor="middle" fill={color}
        fontSize={country.length > 10 ? 15 : country.length > 7 ? 18 : 22}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.1em">
        {country.toUpperCase()}
      </text>

      {/* Thin divider line below country */}
      <line x1={95} y1={75} x2={185} y2={75} stroke={color} strokeWidth={0.5} opacity={0.25} />

      {/* Count */}
      {count > 1 && (
        <text x={140} y={92} textAnchor="middle" fill={color} fontSize={10} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* "NIEVES' KITCHEN" bottom of center zone */}
      {count <= 1 && (
        <text x={140} y={92} textAnchor="middle" fill={color} fontSize={5.5} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.35}>
          {"NIEVES' KITCHEN"}
        </text>
      )}
    </svg>
  );
}
