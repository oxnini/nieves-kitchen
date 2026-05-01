export function PassportIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="passport-globe-clip">
          <circle cx="50" cy="44" r="10" />
        </clipPath>
      </defs>

      {/* Four compass arcs – 70° each, gaps at N/S/E/W */}
      <path d="M 56.6,12.6 A 38,38 0 0 1 87.4,43.4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 87.4,56.6 A 38,38 0 0 1 56.6,87.4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 43.4,87.4 A 38,38 0 0 1 12.6,56.6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 12.6,43.4 A 38,38 0 0 1 43.4,12.6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

      {/* Compass arrows – N, S, E, W */}
      <polygon points="50,7 43.4,12.6 56.6,12.6" fill="var(--color-terracotta)" />
      <polygon points="50,93 56.6,87.4 43.4,87.4" fill="var(--color-terracotta)" />
      <polygon points="93,50 87.4,43.4 87.4,56.6" fill="var(--color-terracotta)" />
      <polygon points="7,50 12.6,56.6 12.6,43.4" fill="var(--color-terracotta)" />

      {/* Passport body */}
      <rect x="35" y="31" width="30" height="38" rx="2" fill="currentColor" />

      {/* Globe grid clipped to circle */}
      <g clipPath="url(#passport-globe-clip)">
        <line x1="40" y1="39" x2="60" y2="39" stroke="var(--color-parchment)" strokeWidth="1.3" />
        <line x1="40" y1="44" x2="60" y2="44" stroke="var(--color-parchment)" strokeWidth="1.3" />
        <line x1="40" y1="49" x2="60" y2="49" stroke="var(--color-parchment)" strokeWidth="1.3" />
        <line x1="50" y1="34" x2="50" y2="54" stroke="var(--color-parchment)" strokeWidth="1.3" />
        <path d="M 50,34 Q 44,44 50,54" stroke="var(--color-parchment)" strokeWidth="1.3" />
        <path d="M 50,34 Q 56,44 50,54" stroke="var(--color-parchment)" strokeWidth="1.3" />
      </g>
      <circle cx="50" cy="44" r="10" stroke="var(--color-parchment)" strokeWidth="1.3" />

      {/* Heart */}
      <path
        d="M 50,63 C 50,63 44,59 44,57 C 44,55 46,54 48,54 C 49,54 50,55 50,55 C 50,55 51,54 52,54 C 54,54 56,55 56,57 C 56,59 50,63 50,63 Z"
        fill="var(--color-terracotta)"
      />
    </svg>
  );
}
