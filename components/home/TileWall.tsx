import Image from 'next/image';
import Link from 'next/link';
import { DestinationTile, Eyebrow } from '@/components/courtyard';

/**
 * Tile wall (Courtyard "1B") — "Pick a tile, pick a place". A curated, static
 * glazed-zellige country grid that links into the recipe list and the atlas.
 * This is NOT the interactive glaze-on-cook atlas (still deferred); it is a
 * hand-picked entry rack. Mixes photo tiles (real dishes), glazed cobalt tiles
 * (country name over the tile texture), one terracotta accent tile, and a
 * cobalt-deep "see every place" tile.
 */

const TILE_MIN = 168;

/** A photo tile: a real dish crop with a cobalt country pill. */
function PhotoTile({
  href,
  image,
  country,
}: {
  href: string;
  image: string;
  country: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block h-full min-w-0 overflow-hidden rounded-xl bg-cream-deep shadow-[0_16px_32px_-24px_rgba(22,50,79,0.5)] transition-transform duration-200 hover:-translate-y-1"
      style={{ minHeight: TILE_MIN }}
    >
      <Image
        src={image}
        alt={`${country} recipes`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(22,50,79,0.55), rgba(22,50,79,0) 55%)' }}
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-cobalt px-3 py-1 font-body text-[13px] font-semibold text-cream">
        {country}
      </span>
    </Link>
  );
}

export default function TileWall() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <Eyebrow tone="terracotta">The atlas, in tiles</Eyebrow>
      <h2 className="mt-2 font-heading text-[clamp(1.7rem,4vw,2.4rem)] font-normal leading-tight text-brown-dark">
        Pick a tile, pick a place.
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        <PhotoTile href="/recipes?country=Turkey" image="/recipes/turkish-eggs-hero.webp" country="Turkey" />

        <DestinationTile tone="cobalt" eyebrow="Recipes" title="Italy" href="/recipes?country=Italy" minHeight={TILE_MIN} className="h-full min-w-0" />

        <PhotoTile href="/recipes?country=China" image="/recipes/xinjiang-lamb-dumplings-hero.webp" country="China" />

        <DestinationTile tone="cobalt" eyebrow="On the map" title="Morocco" href="/atlas" minHeight={TILE_MIN} className="h-full min-w-0" />

        <DestinationTile tone="terracotta" eyebrow="Ingredients" title="The pantry" href="/pantry" minHeight={TILE_MIN} className="h-full min-w-0">
          <p className="font-body text-[13px] text-cream/85">Every ingredient, drawn in ink.</p>
        </DestinationTile>

        <DestinationTile tone="cobalt" eyebrow="On the map" title="Japan" href="/atlas" minHeight={TILE_MIN} className="h-full min-w-0" />

        <DestinationTile tone="cobalt" eyebrow="On the map" title="Lebanon" href="/atlas" minHeight={TILE_MIN} className="h-full min-w-0" />

        <DestinationTile tone="cobaltDeep" eyebrow="More places" title="See every place" href="/atlas" minHeight={TILE_MIN} className="h-full min-w-0">
          <p className="font-body text-[13px] text-cream/80">Browse the whole atlas.</p>
        </DestinationTile>
      </div>
    </section>
  );
}
