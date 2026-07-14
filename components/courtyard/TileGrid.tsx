/**
 * TileGrid — the atlas / journal progress motif. A grid of small squares:
 * "raw" cells are a hairline inset outline, "glazed/earned" cells are filled in
 * a rotating warm palette. Cooking a country glazes its tile.
 *
 * Presentational only — pass either an `earned` count (auto-spread across the
 * grid) or an explicit `earnedIndices` map of `{ cellIndex: paletteIndex }`.
 */
const PALETTE = [
  'var(--color-terracotta)',
  'var(--color-brass)',
  'var(--color-cream)',
  'var(--color-olive)',
];

export function TileGrid({
  total = 30,
  earned = 8,
  columns = 10,
  gap = 7,
  on = 'ink',
  earnedIndices,
  palette = PALETTE,
  className = '',
}: {
  total?: number;
  earned?: number;
  columns?: number;
  gap?: number;
  /** 'ink' = cobalt ground → cream raw outlines. 'cream' = cobalt outlines. */
  on?: 'ink' | 'cream';
  /** Explicit `{ cellIndex: paletteIndex }` map; overrides `earned`. */
  earnedIndices?: Record<number, number>;
  palette?: string[];
  className?: string;
}) {
  const rawLine = on === 'ink' ? 'rgba(244,236,220,0.5)' : 'rgba(32,64,107,0.35)';

  const map: Record<number, number> = {};
  if (earnedIndices) {
    Object.assign(map, earnedIndices);
  } else {
    const step = Math.max(1, Math.floor(total / Math.max(1, earned)));
    let placed = 0;
    for (let i = 0; i < total && placed < earned; i += step) {
      map[i] = placed % palette.length;
      placed++;
    }
  }

  return (
    <div
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const g = map[i];
        return (
          <span
            key={i}
            className="rounded-[3px]"
            style={{
              aspectRatio: '1 / 1',
              background: g != null ? palette[g] : 'transparent',
              boxShadow: g != null ? 'none' : `inset 0 0 0 1.5px ${rawLine}`,
            }}
          />
        );
      })}
    </div>
  );
}
