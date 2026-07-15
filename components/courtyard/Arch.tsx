import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * Arch — the signature horseshoe frame with a brass keystone, for hero and
 * recipe imagery only so it stays special. Full-round top, softly rounded base,
 * a layered ring (cobalt rule, cream mat, brass rule, soft drop), and a small
 * brass diamond keystone straddling the apex.
 *
 * The ring and keystone use literal Courtyard hex so the frame reads identically
 * in both themes (it is a physical object, not page chrome).
 */

const RING =
  '0 0 0 2px #20406B, 0 0 0 7px #F4ECDC, 0 0 0 8.5px #C69A4E, 0 24px 46px -28px rgba(22,50,79,0.6)';

export function Arch({
  src,
  alt,
  className = '',
  priority = false,
  ratio = 'aspect-[4/5]',
  sizes = '(max-width: 768px) 90vw, 420px',
  keystone = true,
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Tailwind aspect-ratio class for the framed image. Default 4:5. */
  ratio?: string;
  sizes?: string;
  keystone?: boolean;
  /** Optional caption bar laid over the base of the image. */
  caption?: ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      {keystone && (
        <span
          aria-hidden
          className="absolute top-[-9px] left-1/2 z-10 h-4 w-4 -translate-x-1/2 rotate-45 bg-brass"
          style={{ boxShadow: '0 0 0 3px #F4ECDC' }}
        />
      )}
      <div
        className="relative overflow-hidden rounded-t-full rounded-b-[20px] bg-cream-deep"
        style={{ boxShadow: RING }}
      >
        <div className={`relative ${ratio}`}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
        {caption && (
          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 py-2.5"
            style={{ backgroundColor: 'rgba(244,236,220,0.95)' }}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
