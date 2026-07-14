import Link from 'next/link';
import type { ReactNode } from 'react';
import { TilePattern } from './TilePattern';
import { Eyebrow } from './Eyebrow';

/**
 * DestinationTile — a glazed tile that navigates (Atlas, Pantry, Collections,
 * Journal). Cobalt / terracotta / cobalt-deep fill, faint tile texture, an
 * eyebrow, a Fraunces title, and a small "proof" passed as children (a TileGrid
 * for Atlas/Journal, ink drawings for Pantry, collection chips for Collections).
 * Lifts on hover.
 */
const TONE = {
  cobalt: 'bg-cobalt',
  terracotta: 'bg-terracotta',
  cobaltDeep: 'bg-cobalt-deep',
} as const;

export function DestinationTile({
  tone = 'cobalt',
  eyebrow,
  title,
  href,
  children,
  minHeight = 190,
  className = '',
}: {
  tone?: keyof typeof TONE;
  eyebrow?: string;
  title: ReactNode;
  href: string;
  children?: ReactNode;
  minHeight?: number;
  className?: string;
}) {
  const eyebrowTone = tone === 'terracotta' ? 'cream' : 'brass';
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-xl p-[22px] text-cream shadow-[0_16px_32px_-24px_rgba(22,50,79,0.5)] transition-transform duration-200 hover:-translate-y-1 ${TONE[tone]} ${className}`}
      style={{ minHeight }}
    >
      <TilePattern line="var(--color-cream)" opacity={0.14} />
      <div className="relative flex h-full flex-col">
        {eyebrow && (
          <Eyebrow tone={eyebrowTone} className="mb-2">
            {eyebrow}
          </Eyebrow>
        )}
        <h3 className="m-0 font-heading text-[24px] leading-[1.15] font-normal text-cream">{title}</h3>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </Link>
  );
}
