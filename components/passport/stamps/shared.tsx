export interface StampDesignProps {
  country: string;
  date: string | null;
  count: number;
  color: string;
  subtitle: string;
}

export function DotRing({ cx, cy, r, count, dotR, color }: {
  cx: number; cy: number; r: number; count: number; dotR: number; color: string;
}) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const a = (2 * Math.PI * i) / count - Math.PI / 2;
    dots.push(<circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={dotR} fill={color} opacity={0.45} />);
  }
  return <>{dots}</>;
}

export function CompassStar({ cx, cy, size, color }: {
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
export function PlaneIcon({ cx, cy, size, color }: {
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
export function ForkKnife({ cx, cy, size, color }: {
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

/** Wavy/scalloped circle path */
export function scallopedPath(cx: number, cy: number, r: number, bumps: number, depth: number): string {
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
