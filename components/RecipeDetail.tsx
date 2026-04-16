'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, ChefHat, Users, Minus, Plus,
  Copy, Check, Flame, Dumbbell, Wheat, Droplets, Heart,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import FlavorCompass from './FlavorCompass';
import { useFavorites } from '@/hooks/useFavorites';

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const [copiedIngredients, setCopiedIngredients] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [favorites, toggleFavorite] = useFavorites();

  const isFavorited = favorites.has(recipe.id);
  const scale = servings / recipe.servings;

  function formatAmount(amount: number): string {
    const scaled = amount * scale;
    return scaled === Math.floor(scaled) ? String(scaled) : scaled.toFixed(1);
  }

  function copyIngredients() {
    const text = recipe.ingredients
      .map(i => `${formatAmount(i.amount)} ${i.unit} ${i.name}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIngredients(true);
    setTimeout(() => setCopiedIngredients(false), 2000);
  }

  function copyFullRecipe() {
    const parts = [
      recipe.name,
      `\nServings: ${servings}`,
      `Prep: ${recipe.prepTime}m | Cook: ${recipe.cookTime}m`,
      '\n--- Ingredients ---',
      ...recipe.ingredients.map(i => `- ${formatAmount(i.amount)} ${i.unit} ${i.name}`),
      '\n--- Instructions ---',
      ...recipe.instructions.map((s, i) => `${i + 1}. ${s}`),
    ];
    navigator.clipboard.writeText(parts.join('\n'));
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  }

  const nutritionItems = [
    { label: 'Calories', value: Math.round(recipe.nutrition.calories * scale), unit: 'kcal', icon: <Flame size={16} /> },
    { label: 'Protein',  value: Math.round(recipe.nutrition.protein  * scale), unit: 'g',    icon: <Dumbbell size={16} /> },
    { label: 'Carbs',    value: Math.round(recipe.nutrition.carbs    * scale), unit: 'g',    icon: <Wheat size={16} /> },
    { label: 'Fat',      value: Math.round(recipe.nutrition.fat      * scale), unit: 'g',    icon: <Droplets size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/recipes"
            className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            All Recipes
          </Link>
          <button
            onClick={() => toggleFavorite(recipe.id)}
            className="p-2 rounded-full bg-white shadow hover:bg-parchment-dark transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-brown-dark'} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-parchment rounded-3xl overflow-hidden"
        >
          <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-6">
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-center gap-2 mb-1">
                {recipe.isFusion && (
                  <span className="bg-turmeric text-brown-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    FUSION
                  </span>
                )}
                <span className="text-white/80 text-sm">{recipe.country}</span>
                {recipe.inspiredBy && (
                  <span className="text-white/60 text-sm">
                    &middot; Inspired by {recipe.inspiredBy.join(', ')}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">{recipe.name}</h1>
            </div>
          </div>

          <div className="space-y-6">
            <blockquote className="italic text-brown-medium border-l-4 border-terracotta pl-4 text-sm leading-relaxed">
              &ldquo;{recipe.quote}&rdquo;
            </blockquote>

            <div className="flex flex-wrap gap-3 text-sm text-brown-medium">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Clock size={15} /> Prep: {recipe.prepTime}m
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <ChefHat size={15} /> Cook: {recipe.cookTime}m
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <ChefHat size={15} /> {recipe.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-parchment-dark text-brown-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {nutritionItems.map(n => (
                <div key={n.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="flex justify-center mb-1 text-terracotta">{n.icon}</div>
                  <div className="text-lg font-bold text-brown-dark">
                    {n.value}<span className="text-xs font-normal">{n.unit}</span>
                  </div>
                  <div className="text-[10px] text-brown-medium">{n.label}</div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-brown-dark mb-2">Flavor Profile</h2>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <FlavorCompass profile={recipe.flavorProfile} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-lg font-semibold text-brown-dark">Ingredients</h2>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-brown-medium" />
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-7 h-7 rounded-full bg-parchment-dark hover:bg-terracotta-light flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold text-brown-dark w-6 text-center">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-7 h-7 rounded-full bg-parchment-dark hover:bg-terracotta-light flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-parchment-dark last:border-0">
                    <span className="text-brown-dark">{ing.name}</span>
                    <span className="text-brown-medium font-medium">{formatAmount(ing.amount)} {ing.unit}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={copyIngredients}
                className="mt-2 flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-light transition-colors"
              >
                {copiedIngredients ? <Check size={14} /> : <Copy size={14} />}
                {copiedIngredients ? 'Copied!' : 'Copy ingredients'}
              </button>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-brown-dark mb-3">Instructions</h2>
              <div className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-brown-dark leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2 pb-8">
              <button
                onClick={copyFullRecipe}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors shadow"
              >
                {copiedRecipe ? <Check size={18} /> : <Copy size={18} />}
                {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
