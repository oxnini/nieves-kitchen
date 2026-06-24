'use client';

/**
 * DEV-ONLY gallery prototype for the recipe-detail extra-images feature.
 *
 * Lives under app/dev so the production RecipeDetail stays untouched while we
 * judge the look. On approval, the chosen variant lifts into
 * components/recipe/.
 *
 * Extras are shown WHOLE and UNCROPPED (object-contain), smaller than the hero,
 * sitting directly on the parchment (no background mat). Each is clickable to
 * expand in a lightbox. Read-mode only; renders nothing for hero-only recipes.
 *
 * Three layouts under comparison:
 *  - MarginGallery  — extras stack in the narrow Ingredients column.
 *  - BandGallery    — a full-width row below the spread.
 *  - UnifiedGallery — one fixed block below the spread: a single image sits
 *                     narrow + left-aligned (margin echo), 2-3 form a row.
 */

import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

export type DevRecipeImage = {
  url: string;
  caption?: string;
  /** Intrinsic dimensions, needed by next/image to reserve the right ratio. */
  width: number;
  height: number;
};

export type GalleryVariant = 'margin' | 'band';

type OpenFn = (img: DevRecipeImage) => void;

/** A single uncropped photo on the parchment, clickable to expand. */
function MountedFigure({
  img,
  sizes,
  onOpen,
  maxHeightClass = 'max-h-72',
}: {
  img: DevRecipeImage;
  sizes: string;
  onOpen: OpenFn;
  maxHeightClass?: string;
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
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-brown-dark/45 p-1.5 text-parchment opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
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

/** Shared "From the kitchen" eyebrow label. */
function Eyebrow({ className = '' }: { className?: string }) {
  return (
    <p className={`font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium/80 ${className}`}>
      From the kitchen
    </p>
  );
}

/**
 * Margin variant: extras stack vertically, sized to live in the narrow
 * Ingredients column and fill the white space beneath the ingredient list.
 */
export function MarginGallery({ images, onOpen }: { images: DevRecipeImage[]; onOpen: OpenFn }) {
  if (images.length === 0) return null;
  return (
    <div className="mt-6 space-y-5">
      <Eyebrow />
      {images.map((img, i) => (
        <MountedFigure
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

/**
 * Band variant: a dedicated centered figure row placed after the spread.
 * 1 image centers; 2 and 3 lay out side by side, aligned along a shared
 * baseline so mixed aspect ratios sit "on a shelf" rather than ragged-topped.
 */
export function BandGallery({ images, onOpen }: { images: DevRecipeImage[]; onOpen: OpenFn }) {
  if (images.length === 0) return null;
  const single = images.length === 1;
  return (
    <section className="mb-10">
      <Eyebrow className="mb-4" />
      <div
        className={
          single
            ? 'mx-auto max-w-md'
            : 'flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center'
        }
      >
        {images.map((img, i) => (
          <div key={i} className={single ? '' : 'min-w-0 flex-1 sm:basis-[240px]'}>
            <MountedFigure
              img={img}
              onOpen={onOpen}
              sizes={single ? '(max-width: 640px) 90vw, 420px' : '(max-width: 640px) 90vw, 320px'}
              maxHeightClass={single ? 'max-h-96' : 'max-h-72'}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Unified variant: ONE consistent block below the spread regardless of count.
 * A single image sits narrow and left-aligned (echoes the margin figure
 * without depending on column heights); 2-3 form a baseline-aligned row.
 */
export function UnifiedGallery({ images, onOpen }: { images: DevRecipeImage[]; onOpen: OpenFn }) {
  if (images.length === 0) return null;
  const single = images.length === 1;
  return (
    <section className="mb-10">
      <Eyebrow className="mb-4" />
      {single ? (
        <div className="max-w-sm">
          <MountedFigure
            img={images[0]}
            onOpen={onOpen}
            sizes="(max-width: 640px) 90vw, 360px"
            maxHeightClass="max-h-80"
          />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-end">
          {images.map((img, i) => (
            <div key={i} className="min-w-0 flex-1 sm:basis-[240px]">
              <MountedFigure
                img={img}
                onOpen={onOpen}
                sizes="(max-width: 640px) 90vw, 300px"
                maxHeightClass="max-h-72"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
