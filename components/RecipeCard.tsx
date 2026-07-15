'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, Heart, Check } from 'lucide-react';
import type { Recipe } from '@/lib/types';

const BLUR_PLACEHOLDER =
  'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABwAQCdASoEAAMAA4BaJZgCdAFAAAD+4IMuyfRjna8O7m69a2dq2PrsAAA=';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited?: boolean;
  isCooked?: boolean;
  featured?: boolean;
}

export default function RecipeCard({ recipe, isFavorited = false, isCooked = false, featured = false }: RecipeCardProps) {
  // The travel signal: the country that earns the stamp, or the culinary
  // region for origin-less dishes.
  const place = recipe.country ?? recipe.region;
  return (
    <Link
      href={`/recipes/${encodeURIComponent(recipe.id)}`}
      className={`bg-surface rounded-xl overflow-hidden text-left w-full group cursor-pointer block transition-[transform,box-shadow] duration-200 hover:-translate-y-1 shadow-[0_0_0_1.5px_rgba(32,64,107,0.13),0_16px_32px_-24px_rgba(22,50,79,0.5)] hover:shadow-[0_0_0_1.5px_rgba(32,64,107,0.22),0_20px_38px_-24px_rgba(22,50,79,0.55)] ${
        isCooked ? 'ring-1 ring-terracotta/35' : ''
      } ${featured ? 'sm:col-span-2 sm:flex sm:flex-row' : ''}`}
    >
      <div className={`relative overflow-hidden bg-parchment-dark ${
        featured ? 'h-52 sm:h-auto sm:w-1/2 sm:min-h-[16rem]' : 'h-44'
      }`}>
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          sizes={featured
            ? '(max-width: 639px) 100vw, (max-width: 1023px) 66vw, 50vw'
            : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'
          }
          priority={featured}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Photo dateline: country name in brown, Fusion tag in gold so the
            two read as separate signals. */}
        {place && (
          <span className="absolute top-3 left-3 flex max-w-[75%] items-center gap-1.5 rounded-full bg-surface/90 backdrop-blur px-2.5 py-1 text-xs shadow" title={place}>
            <span className="truncate font-semibold text-brown-dark">{place}</span>
            {recipe.isFusion && (
              <>
                <span className="text-brown-light/50">·</span>
                <span className="shrink-0 font-semibold uppercase tracking-[0.08em] text-turmeric">Fusion</span>
              </>
            )}
          </span>
        )}
        {isFavorited && (
          <span className="absolute top-3 right-3 bg-surface/90 backdrop-blur p-1.5 rounded-full shadow">
            <Heart size={14} className="text-terracotta fill-terracotta" aria-hidden="true" />
            <span className="sr-only">Favorited</span>
          </span>
        )}
      </div>

      <div className={`min-w-0 ${featured ? 'p-5 sm:p-6 sm:flex sm:flex-col sm:justify-center sm:w-1/2' : 'p-4'}`}>
        <h3
          className={`font-heading font-semibold text-brown-dark group-hover:text-terracotta transition-colors duration-200 mb-2 leading-tight overflow-hidden ${
            featured ? 'text-xl sm:text-2xl' : 'text-lg'
          }`}
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordBreak: 'break-word' }}
        >
          {recipe.name}
        </h3>
        {featured && recipe.quote && (
          <p className="text-base text-brown-medium italic mb-3 line-clamp-2">{recipe.quote}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.tags.slice(0, featured ? 4 : 3).map(tag => (
            <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full bg-parchment-dark text-brown-medium max-w-[12rem] truncate" title={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 text-[13px] text-brown-medium">
          <div className="flex items-center gap-2 nums-tabular">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {recipe.time.total} min
            </span>
            <span className="text-brown-light/60">·</span>
            <span className="flex items-center gap-1">
              <Flame size={14} />
              {recipe.nutrition.calories} cal
            </span>
          </div>
          {isCooked && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-terracotta px-2 py-[3px] text-[10px] font-stamp uppercase tracking-[0.12em] text-parchment shadow-sm">
              <Check size={11} strokeWidth={3.5} /> Cooked
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
