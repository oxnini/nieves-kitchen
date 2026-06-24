'use client';

/**
 * Read-mode gallery for a recipe's extra photos (beyond the hero).
 *
 * Photos are shown WHOLE and UNCROPPED (object-contain), smaller than the hero,
 * sitting directly on the parchment. Each is a button that opens the photo in a
 * lightbox. Two layouts, chosen by count in RecipeDetail:
 *  - MarginGallery: a single extra, stacked in the narrow Ingredients column,
 *    filling the white space beside the (taller) Instructions column.
 *  - BandGallery: two or three extras, in a baseline-aligned row below the
 *    spread so mixed aspect ratios sit "on a shelf".
 *
 * Both render nothing for an empty list. Callers gate to read mode.
 */

import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import type { RecipeImage } from '@/lib/types';

type OpenFn = (img: RecipeImage) => void;

function Eyebrow({ className = '' }: { className?: string }) {
  return (
    <p className={`font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium/80 ${className}`}>
      From the kitchen
    </p>
  );
}

/** A single uncropped photo on the parchment, clickable to expand. */
function GalleryFigure({
  img,
  sizes,
  onOpen,
  maxHeightClass,
}: {
  img: RecipeImage;
  sizes: string;
  onOpen: OpenFn;
  maxHeightClass: string;
}) {
  return (
    <figure className="min-w-0">
      <button
        type="button"
        onClick={() => onOpen(img)}
        aria-label={img.caption ? `Expand image: ${img.caption}` : 'Expand image'}
        className="group relative block w-full cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <Image
          src={img.url}
          alt={img.caption ?? ''}
          width={img.width}
          height={img.height}
          sizes={sizes}
          className={`mx-auto h-auto w-auto max-w-full ${maxHeightClass} rounded-xl object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]`}
        />
        {/* Always visible on touch (no hover); hover-revealed on desktop. */}
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-brown-dark/45 p-1.5 text-parchment opacity-100 backdrop-blur-sm transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
          <ZoomIn size={14} aria-hidden="true" />
        </span>
      </button>
      {img.caption && (
        <figcaption className="mt-2 text-center font-stamp text-[11px] uppercase tracking-[0.18em] text-brown-medium">
          {img.caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Single extra, in the Ingredients column. */
export function MarginGallery({ images, onOpen }: { images: RecipeImage[]; onOpen: OpenFn }) {
  if (images.length === 0) return null;
  return (
    <div className="mt-6 space-y-5">
      <Eyebrow />
      {images.map((img, i) => (
        <GalleryFigure
          key={i}
          img={img}
          onOpen={onOpen}
          sizes="(max-width: 768px) 90vw, 340px"
          maxHeightClass="max-h-80"
        />
      ))}
    </div>
  );
}

/** Two or three extras, in a row below the spread. */
export function BandGallery({ images, onOpen }: { images: RecipeImage[]; onOpen: OpenFn }) {
  if (images.length === 0) return null;
  return (
    <section className="mb-10">
      <Eyebrow className="mb-4" />
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center">
        {images.map((img, i) => (
          <div key={i} className="min-w-0 flex-1 sm:basis-[240px]">
            <GalleryFigure
              img={img}
              onOpen={onOpen}
              sizes="(max-width: 640px) 90vw, 320px"
              maxHeightClass="max-h-72"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
