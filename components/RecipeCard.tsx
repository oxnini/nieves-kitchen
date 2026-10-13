'use client';

import { Fragment, useId, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Check } from 'lucide-react';
import type { Recipe } from '@/lib/types';

const BLUR_PLACEHOLDER =
  'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABwAQCdASoEAAMAA4BaJZgCdAFAAAD+4IMuyfRjna8O7m69a2dq2PrsAAA=';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited?: boolean;
  isCooked?: boolean;
  featured?: boolean;
  /** Above-the-fold hint for the grid's first rows; `featured` also forces it. */
  priority?: boolean;
  /** Below `sm`, render as a ruled contents-list row (88px thumbnail, meta,
      title) instead of a full-width card. Spec §7, audit F11. */
  listOnPhone?: boolean;
}

/** The configurator's `.meta span + span::before` separator: a 4px rotated
    terracotta square between meta items. Decorative only. */
function MetaDot() {
  return <span aria-hidden="true" className="inline-block h-1 w-1 shrink-0 rotate-45 bg-terracotta" />;
}

export default function RecipeCard({ recipe, isFavorited = false, isCooked = false, featured = false, priority = false, listOnPhone = false }: RecipeCardProps) {
  // The travel signal: the country that earns the stamp, or the culinary
  // region for origin-less dishes.
  const place = recipe.country ?? recipe.region;
  const blurb = recipe.description ?? recipe.quote;
  const titleId = useId();

  // Left group of the meta line: place, then an optional Fusion tag, then
  // the total time. Built as a list (rather than hard-coded separators) so
  // the dot between items only ever appears between two things that exist.
  const metaItems: { key: string; node: ReactNode }[] = [];
  if (place) metaItems.push({ key: 'place', node: <span className="truncate">{place}</span> });
  if (recipe.isFusion) {
    metaItems.push({ key: 'fusion', node: <span className="shrink-0 text-turmeric">Fusion</span> });
  }
  metaItems.push({
    key: 'time',
    node: <span className="nums-tabular shrink-0">{recipe.time.total} min</span>,
  });

  // listOnPhone: one DOM for both shapes. Below sm the link is a flex row
  // with a small thumbnail and a hairline under it; from sm up every phone
  // class is undone and it is the ruled card again. The photo's cooked badge
  // and heart are too big for an 88px thumbnail, so on phones they move to
  // the end of the meta line instead (and calories and the blurb drop out).
  const row = listOnPhone;

  return (
    <Link
      href={`/recipes/${encodeURIComponent(recipe.id)}`}
      aria-labelledby={titleId}
      className={`group w-full text-left ${
        row ? 'flex items-center gap-3.5 border-b border-line py-3 sm:block sm:border-0 sm:py-0' : 'block'
      } ${featured ? 'sm:col-span-2 sm:flex sm:flex-row sm:gap-6' : ''}`}
    >
      <div className={`relative overflow-hidden bg-parchment-dark ${
        row ? 'aspect-[4/3] w-[88px] shrink-0 sm:aspect-[3/2] sm:w-auto' : 'aspect-[3/2]'
      } ${featured ? 'sm:w-1/2' : ''}`}>
        <Image
          src={recipe.image}
          alt=""
          fill
          sizes={featured
            ? '(max-width: 639px) 100vw, (max-width: 1023px) 66vw, 50vw'
            : `(max-width: 639px) ${row ? '88px' : '100vw'}, (max-width: 1023px) 50vw, 33vw`
          }
          priority={priority || featured}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
        />
        {isCooked && (
          <span className={`absolute left-3 top-3 items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-[13px] font-semibold leading-none text-parchment shadow-sm ${row ? 'hidden sm:inline-flex' : 'inline-flex'}`}>
            <Check size={13} strokeWidth={3} aria-hidden="true" /> Cooked
          </span>
        )}
        {isFavorited && (
          <span className={`absolute right-3 top-3 rounded-full bg-surface p-1.5 ring-1 ring-line ${row ? 'hidden sm:block' : ''}`}>
            <Heart size={14} className="text-terracotta fill-terracotta" aria-hidden="true" />
            <span className="sr-only">Favorited</span>
          </span>
        )}
      </div>

      <div className={`min-w-0 ${row ? 'flex-1' : ''} ${featured ? 'sm:flex sm:w-1/2 sm:flex-col sm:justify-center' : ''}`}>
        <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[13px] text-brown-medium ${
          row ? 'sm:mt-3.5 sm:border-t sm:border-brown-dark sm:pt-2.5' : 'mt-3.5 border-t border-brown-dark pt-2.5'
        }`}>
          <span className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
            {metaItems.map((item, i) => (
              <Fragment key={item.key}>
                {i > 0 && <MetaDot />}
                {item.node}
              </Fragment>
            ))}
          </span>
          <span className={`nums-tabular shrink-0 text-brown-medium/90 ${row ? 'hidden sm:inline' : ''}`}>{recipe.nutrition.calories} cal</span>
          {row && (isCooked || isFavorited) && (
            <span className="flex shrink-0 items-center gap-2 sm:hidden">
              {isCooked && (
                <span className="inline-flex items-center gap-1 font-medium text-terracotta">
                  <Check size={13} strokeWidth={3} aria-hidden="true" /> Cooked
                </span>
              )}
              {isFavorited && (
                <>
                  <Heart size={15} className="text-terracotta fill-terracotta" aria-hidden="true" />
                  <span className="sr-only">Favorited</span>
                </>
              )}
            </span>
          )}
        </div>
        <h3
          id={titleId}
          className={`mt-1 line-clamp-2 font-heading font-normal leading-[1.2] text-brown-dark transition-colors duration-200 group-hover:text-teal ${
            featured ? 'text-[28px]' : row ? 'text-[19px] sm:text-[23px]' : 'text-[23px]'
          }`}
        >
          {recipe.name}
        </h3>
        {blurb && (
          <p className={`mt-1.5 max-w-[42ch] text-[15px] leading-normal text-brown-medium ${row ? 'hidden sm:line-clamp-2' : 'line-clamp-2'}`}>
            {blurb}
          </p>
        )}
      </div>
    </Link>
  );
}
