'use client';

/**
 * The wordless prophetic seal (spec §4, pick: rosette). An eight-petal rosette
 * inside a thin ring, flat brown ink at ~62% opacity: legible as "something is
 * special here" at shelf distance, explained only inside the entry view (label
 * + citation). Marks a pantry entry that carries a verified prophetic narration.
 *
 * Deliberately not a crescent, mosque, or rub' el hizb (a Quranic division
 * marker, not decoration). The dev sandbox at /dev/pantry kept the full
 * candidate set; production ships the one pick.
 */

const SEAL_INK = 'var(--stamp-ink-brown)';

export default function PropheticSeal({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
      <circle cx="16" cy="16" r="14" stroke={SEAL_INK} strokeWidth={1.4} />
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="16" cy="8.5" rx="2.6" ry="5"
          stroke={SEAL_INK} strokeWidth={1.1}
          transform={`rotate(${i * 45} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="1.4" fill={SEAL_INK} stroke="none" />
    </svg>
  );
}
