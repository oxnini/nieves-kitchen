import Link from 'next/link';
import Image from 'next/image';
import { Eyebrow } from './Eyebrow';

/**
 * CourtyardCard — the filmstrip recipe card. Cream card, hairline cobalt ring,
 * a 4:3 photo that zooms 1.05 on hover, an olive "country · time" eyebrow, a
 * Fraunces title, and a two-line blurb. The whole card lifts on hover.
 *
 * Presentational: give it a plain `href` + fields. Mounts inside a Filmstrip
 * (carries `snap-start shrink-0`) or any grid.
 */
const CARD_SHADOW =
  '0 0 0 1.5px rgba(32,64,107,0.13), 0 16px 32px -24px rgba(22,50,79,0.5)';

export function CourtyardCard({
  href,
  image,
  country,
  time,
  title,
  blurb,
  width = 280,
  sizes = '280px',
  priority = false,
  className = '',
}: {
  href: string;
  image: string;
  country?: string;
  time?: string;
  title: string;
  blurb?: string;
  width?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-xl bg-cream transition-transform duration-200 hover:-translate-y-1 ${className}`}
      style={{ width, boxShadow: CARD_SHADOW }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-deep">
        <Image
          src={image}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-3.5">
        {(country || time) && (
          <Eyebrow tone="olive">
            {country}
            {country && time ? ' · ' : ''}
            {time}
          </Eyebrow>
        )}
        <h3 className="mt-1 font-heading text-[20px] leading-snug font-normal text-cobalt">{title}</h3>
        {blurb && <p className="mt-1 line-clamp-2 font-body text-[13.5px] leading-normal text-ink">{blurb}</p>}
      </div>
    </Link>
  );
}
