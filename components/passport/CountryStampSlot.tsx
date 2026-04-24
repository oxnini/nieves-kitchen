'use client';

import type { Stamp as StampRow } from '@/lib/passport';
import {
  getStampTraits,
  sizeMultiplier,
  stampAngle,
  stampColorValue,
} from '@/lib/stamp-traits';

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

function stableHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ── 9 distinct stamp designs ────────────────────────────────── */

type StampDesign =
  | 'grand-circle'
  | 'postmark'
  | 'oval-badge'
  | 'official-rect'
  | 'tall-rect'
  | 'hexagonal'
  | 'diamond'
  | 'pill-capsule'
  | 'wavy-circle'
  | 'banner-strip'
  | 'triangle';

const DESIGNS: StampDesign[] = [
  'grand-circle', 'postmark', 'oval-badge', 'official-rect',
  'tall-rect', 'hexagonal', 'diamond', 'pill-capsule', 'wavy-circle',
  'banner-strip', 'triangle',
];

function getDesign(country: string): StampDesign {
  return DESIGNS[stableHash(country) % DESIGNS.length];
}

const SUBTITLES = [
  'CULINARY PASSPORT', 'BON APPETIT', 'ENTRY APPROVED',
  'KITCHEN VISA', 'FLAVORS EXPLORED', 'TASTE JOURNEY',
  'RECIPE COLLECTED', 'STAMP OF FLAVOR',
];

function getSubtitle(country: string): string {
  return SUBTITLES[stableHash(country + '_sub') % SUBTITLES.length];
}

/* ── Shared decorative helpers ───────────────────────────────── */

function DotRing({ cx, cy, r, count, dotR, color }: {
  cx: number; cy: number; r: number; count: number; dotR: number; color: string;
}) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const a = (2 * Math.PI * i) / count - Math.PI / 2;
    dots.push(<circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={dotR} fill={color} opacity={0.45} />);
  }
  return <>{dots}</>;
}

function CompassStar({ cx, cy, size, color }: {
  cx: number; cy: number; size: number; color: string;
}) {
  const s = size;
  return (
    <g opacity={0.65}>
      <path d={`M${cx},${cy - s}L${cx + s * 0.18},${cy}L${cx},${cy + s}L${cx - s * 0.18},${cy}Z`} fill={color} />
      <path d={`M${cx - s},${cy}L${cx},${cy - s * 0.18}L${cx + s},${cy}L${cx},${cy + s * 0.18}Z`} fill={color} />
      <circle cx={cx} cy={cy} r={s * 0.12} fill={color} />
    </g>
  );
}

/** Tiny airplane silhouette pointing right */
function PlaneIcon({ cx, cy, size, color }: {
  cx: number; cy: number; size: number; color: string;
}) {
  const s = size;
  return (
    <g transform={`translate(${cx},${cy})`} fill={color} opacity={0.6}>
      <path d={`M${-s},${s * 0.15} L${s * 0.3},${-s * 0.05} L${s},${-s * 0.4} L${s * 0.35},${s * 0.05} L${s * 0.5},${s * 0.5} L${s * 0.2},${s * 0.2} L${-s * 0.3},${s * 0.35} L${-s * 0.15},${s * 0.1} Z`} />
    </g>
  );
}

/** Fork and knife crossed */
function ForkKnife({ cx, cy, size, color }: {
  cx: number; cy: number; size: number; color: string;
}) {
  return (
    <g opacity={0.5} stroke={color} strokeWidth={1.4} strokeLinecap="round" fill="none">
      {/* Knife */}
      <line x1={cx + size * 0.4} y1={cy - size} x2={cx - size * 0.4} y2={cy + size} />
      {/* Fork handle */}
      <line x1={cx - size * 0.4} y1={cy - size} x2={cx + size * 0.4} y2={cy + size} />
      {/* Fork tines */}
      <line x1={cx - size * 0.4} y1={cy - size} x2={cx - size * 0.55} y2={cy - size * 0.65} />
      <line x1={cx - size * 0.4} y1={cy - size} x2={cx - size * 0.2} y2={cy - size * 1.1} />
      <line x1={cx - size * 0.4} y1={cy - size} x2={cx - size * 0.6} y2={cy - size * 1.0} />
    </g>
  );
}

/* Wavy/scalloped circle path */
function scallopedPath(cx: number, cy: number, r: number, bumps: number, depth: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= bumps; i++) {
    const a1 = (2 * Math.PI * i) / bumps;
    const a2 = (2 * Math.PI * (i + 0.5)) / bumps;
    const outerR = r + depth;
    pts.push(`${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}`);
    if (i < bumps) {
      pts.push(`${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`);
    }
  }
  let d = `M ${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` Q ${pts[i]} ${pts[i + 1] || pts[0]}`;
    i++;
  }
  d += ' Z';
  return d;
}

/* ─────────────────────────────────────────────────────────────
   DESIGN 1: Grand Circle
   Clean airport-style entry stamp. Bold country name across
   the center with thin horizontal rules. Plane icon at top.
   ───────────────────────────────────────────────────────────── */

function GrandCircle({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
  const id = `gc-${stableHash(country)}`;
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 2: Postmark
   Double circle with horizontal cancellation lines. Classic
   mail-cancel look with wavy lines.
   ───────────────────────────────────────────────────────────── */

function Postmark({ country, date, count, color }: {
  country: string; date: string | null; count: number; color: string;
}) {
  const id = `pm-${stableHash(country)}`;
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 3: Oval Badge
   Horizontal oval with dashed inner ring, side dots, and
   crossed utensils motif. Immigration-badge feel.
   ───────────────────────────────────────────────────────────── */

function OvalBadge({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
  const id = `ob-${stableHash(country)}`;
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 4: Official Rectangle (landscape)
   Chunky double-framed rectangle with corner brackets and a
   bold horizontal bar across the top. Bureaucratic visa feel.
   ───────────────────────────────────────────────────────────── */

function OfficialRect({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 5: Tall Rectangle (portrait visa)
   Vertical stamp with compass star, dashed inner border,
   and filled accent bars. Feels like a visa insert.
   ───────────────────────────────────────────────────────────── */

function TallRect({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 6: Hexagonal
   Tall hexagon with thick edges, vertex dots, and a small
   globe grid motif in the background. Geographic-authority feel.
   ───────────────────────────────────────────────────────────── */

function Hexagonal({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 7: Diamond
   Rotated square with clean interior. Minimalist but bold,
   uses a single central dot motif and strong diagonal energy.
   ───────────────────────────────────────────────────────────── */

function Diamond({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 8: Pill Capsule
   Wide horizontal capsule. Airline-luggage-tag energy.
   Vertical dividers create three "zones": left icon, center
   text, right date.
   ───────────────────────────────────────────────────────────── */

function PillCapsule({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 9: Wavy Circle
   Scalloped/cogwheel outer edge with smooth inner ring.
   Dot ring between the two. Seal/crest energy.
   ───────────────────────────────────────────────────────────── */

function WavyCircle({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
  const id = `wc-${stableHash(country)}`;
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

/* ─────────────────────────────────────────────────────────────
   DESIGN 10: Banner Strip
   Extra-wide horizontal strip — like an elongated luggage tag
   or customs banner. Thick left/right end-caps, text flows
   horizontally across the middle. Sparse, utilitarian.
   ───────────────────────────────────────────────────────────── */

function BannerStrip({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
  return (
    <svg viewBox="0 0 240 110" className="w-full h-full" aria-hidden>
      {/* Outer border */}
      <rect x={4} y={4} width={232} height={102} rx={4} stroke={color} strokeWidth={3.5} fill="none" />
      {/* Inner border — dotted */}
      <rect x={12} y={12} width={216} height={86} rx={2} stroke={color} strokeWidth={0.8} fill="none"
        strokeDasharray="3 2.5" opacity={0.3} />

      {/* Left accent bar */}
      <rect x={4} y={4} width={12} height={102} rx={4} fill={color} opacity={0.1} />
      {/* Right accent bar */}
      <rect x={224} y={4} width={12} height={102} rx={4} fill={color} opacity={0.1} />

      {/* Corner dots */}
      <circle cx={20} cy={20} r={1.8} fill={color} opacity={0.35} />
      <circle cx={220} cy={20} r={1.8} fill={color} opacity={0.35} />
      <circle cx={20} cy={90} r={1.8} fill={color} opacity={0.35} />
      <circle cx={220} cy={90} r={1.8} fill={color} opacity={0.35} />

      {/* Subtitle */}
      <text x={120} y={30} textAnchor="middle" fill={color} fontSize={6.5} fontFamily="var(--font-cutive)" letterSpacing="0.16em" opacity={0.45}>
        {subtitle}
      </text>

      {/* Top divider with star */}
      <g opacity={0.3}>
        <line x1={35} y1={36} x2={100} y2={36} stroke={color} strokeWidth={0.6} />
        <text x={120} y={39} textAnchor="middle" fill={color} fontSize={5}>✦</text>
        <line x1={140} y1={36} x2={205} y2={36} stroke={color} strokeWidth={0.6} />
      </g>

      {/* Country name */}
      <text x={120} y={60} textAnchor="middle" fill={color}
        fontSize={country.length > 10 ? 16 : country.length > 7 ? 19 : 22}
        fontFamily="var(--font-literata)" fontWeight={700} letterSpacing="0.12em">
        {country.toUpperCase()}
      </text>

      {/* Bottom divider */}
      <line x1={40} y1={68} x2={200} y2={68} stroke={color} strokeWidth={0.8} opacity={0.2} />

      {/* Date */}
      {date && (
        <text x={120} y={84} textAnchor="middle" fill={color} fontSize={13} fontFamily="var(--font-cutive)" letterSpacing="0.06em" opacity={0.9}>
          {date}
        </text>
      )}

      {/* Count */}
      {count > 1 && (
        <text x={120} y={98} textAnchor="middle" fill={color} fontSize={9} fontFamily="var(--font-figtree)" opacity={0.5}>
          ×{count}
        </text>
      )}

      {/* Bottom label */}
      {count <= 1 && (
        <text x={120} y={98} textAnchor="middle" fill={color} fontSize={5.5} fontFamily="var(--font-cutive)" letterSpacing="0.1em" opacity={0.35}>
          {"NIEVES' KITCHEN"}
        </text>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DESIGN 11: Triangle
   Equilateral triangle with an inner triangle. Text centered
   in the wider lower portion. Small star at the apex.
   ───────────────────────────────────────────────────────────── */

function Triangle({ country, date, count, color, subtitle }: {
  country: string; date: string | null; count: number; color: string; subtitle: string;
}) {
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

/* ── Design dimensions (aspect ratios) ───────────────────────── */

function designAspect(design: StampDesign): [number, number] {
  switch (design) {
    case 'grand-circle':  return [1, 1];
    case 'postmark':      return [1.3, 1];
    case 'oval-badge':    return [1.5, 1];
    case 'official-rect': return [1.4, 1];
    case 'tall-rect':     return [0.75, 1.05];
    case 'hexagonal':     return [1, 1];
    case 'diamond':       return [1, 1];
    case 'pill-capsule':  return [1.8, 0.75];
    case 'wavy-circle':   return [1, 1];
    case 'banner-strip':  return [1.5, 0.65];
    case 'triangle':      return [1.1, 1];
  }
}

/* ── Main component ──────────────────────────────────────────── */

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const traits = getStampTraits(country);
  const angle = stampAngle(country);
  const firstDate = stamps[0]?.cooked_at;
  const date = firstDate ? formatMonth(firstDate) : null;
  const mult = sizeMultiplier(traits.sizeBucket);
  const color = stampColorValue(traits.color);
  const design = getDesign(country);
  const [aw, ah] = designAspect(design);
  const subtitle = getSubtitle(country);

  const sizeStyle: React.CSSProperties = {
    width: `calc(var(--stamp-size) * ${mult * aw})`,
    height: `calc(var(--stamp-size) * ${mult * ah})`,
  };

  const props = { country, date, count: stamps.length, color, subtitle };
  const stampContent = (() => {
    switch (design) {
      case 'grand-circle':  return <GrandCircle {...props} />;
      case 'postmark':      return <Postmark {...props} />;
      case 'oval-badge':    return <OvalBadge {...props} />;
      case 'official-rect': return <OfficialRect {...props} />;
      case 'tall-rect':     return <TallRect {...props} />;
      case 'hexagonal':     return <Hexagonal {...props} />;
      case 'diamond':       return <Diamond {...props} />;
      case 'pill-capsule':  return <PillCapsule {...props} />;
      case 'wavy-circle':   return <WavyCircle {...props} />;
      case 'banner-strip':  return <BannerStrip {...props} />;
      case 'triangle':      return <Triangle {...props} />;
    }
  })();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={
        'relative flex items-center justify-center ' +
        'transition-transform focus:outline-none focus-visible:ring-2 ' +
        'focus-visible:ring-terracotta cursor-pointer ' +
        '[filter:url(#stamp-ink)] motion-reduce:[filter:none] ' +
        'hover:scale-[1.03] mix-blend-multiply [contain:layout_style_paint]'
      }
      style={{
        ...sizeStyle,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {stampContent}
    </button>
  );
}
