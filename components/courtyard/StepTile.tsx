import { TilePattern } from './TilePattern';

/**
 * StepTile — a method step number set as a small glazed cobalt tile with a
 * Fraunces numeral in cream over a faint tile texture. Tiles, not plain digits.
 */
export function StepTile({
  n,
  size = 44,
  className = '',
}: {
  n: number | string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-md bg-cobalt ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: 'inset 0 0 0 1.5px rgba(32,64,107,0.13)',
      }}
    >
      <TilePattern line="var(--color-cream)" opacity={0.28} />
      <span
        className="relative font-heading font-normal text-cream"
        style={{ fontSize: Math.round(size * 0.48), lineHeight: 1 }}
      >
        {n}
      </span>
    </span>
  );
}
