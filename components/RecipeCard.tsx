'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Flame, Dumbbell, Heart } from 'lucide-react';
import type { Recipe } from '@/lib/types';

const MotionLink = motion(Link);

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited?: boolean;
}

export default function RecipeCard({ recipe, isFavorited = false }: RecipeCardProps) {
  return (
    <MotionLink
      href={`/recipes/${recipe.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(62, 39, 35, 0.12)' }}
      className="bg-white rounded-2xl overflow-hidden shadow-md text-left w-full group cursor-pointer block"
    >
      <div className="relative h-44 overflow-hidden bg-parchment-dark">
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

      <div className="p-4 min-w-0">
        <h3
          className="font-heading text-lg font-semibold text-brown-dark mb-2 leading-tight overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordBreak: 'break-word' }}
        >
          {recipe.name}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.tags.slice(0, 3).map(tag => (
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
