'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Flame, Dumbbell, Heart } from 'lucide-react';
import type { Recipe } from '@/lib/types';

const MotionLink = motion(Link);

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited?: boolean;
  featured?: boolean;
}

export default function RecipeCard({ recipe, isFavorited = false, featured = false }: RecipeCardProps) {
  return (
    <MotionLink
      href={`/recipes/${recipe.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(62, 39, 35, 0.12)' }}
      className={`bg-surface rounded-2xl overflow-hidden shadow-md text-left w-full group cursor-pointer block ${
        featured ? 'sm:col-span-2 sm:flex sm:flex-row' : ''
      }`}
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
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {recipe.isFusion && (
          <span className="absolute top-3 left-3 bg-turmeric text-brown-dark text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            FUSION
          </span>
        )}
        <span className="absolute top-3 right-3 max-w-[55%] truncate bg-white/90 backdrop-blur text-brown-dark text-xs font-medium px-2.5 py-1 rounded-full shadow" title={recipe.country}>
          {recipe.country}
        </span>
        {isFavorited && (
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full shadow">
            <Heart size={14} className="text-terracotta fill-terracotta" />
          </span>
        )}
      </div>

      <div className={`min-w-0 ${featured ? 'p-5 sm:p-6 sm:flex sm:flex-col sm:justify-center sm:w-1/2' : 'p-4'}`}>
        <h3
          className={`font-heading font-semibold text-brown-dark mb-2 leading-tight overflow-hidden ${
            featured ? 'text-xl sm:text-2xl' : 'text-lg'
          }`}
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordBreak: 'break-word' }}
        >
          {recipe.name}
        </h3>
        {featured && recipe.quote && (
          <p className="text-sm text-brown-medium italic mb-3 line-clamp-2">{recipe.quote}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.tags.slice(0, featured ? 4 : 3).map(tag => (
            <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-parchment-dark text-brown-medium max-w-[12rem] truncate" title={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-brown-medium nums-tabular">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {recipe.prepTime + recipe.cookTime}m
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell size={14} />
            {recipe.nutrition.protein}g protein
          </span>
          <span className="flex items-center gap-1">
            <Flame size={14} />
            {recipe.nutrition.calories} cal
          </span>
        </div>
      </div>
    </MotionLink>
  );
}
