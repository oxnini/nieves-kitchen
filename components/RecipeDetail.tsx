'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Timer, Gauge, Users, Minus, Plus,
  Copy, Check, Heart, Lightbulb,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import FlavorCompass from './FlavorCompass';
import { useFavorites } from '@/hooks/useFavorites';
import CookedButton from './CookedButton';

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
    { label: 'Calories', value: Math.round(recipe.nutrition.calories * scale), unit: 'kcal' },
    { label: 'Protein',  value: Math.round(recipe.nutrition.protein  * scale), unit: 'g'    },
    { label: 'Carbs',    value: Math.round(recipe.nutrition.carbs    * scale), unit: 'g'    },
    { label: 'Fat',      value: Math.round(recipe.nutrition.fat      * scale), unit: 'g'    },
  ];

  const hasTips = recipe.tips && recipe.tips.length > 0;

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header bar ── */}
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
            className="p-2 rounded-full bg-surface hover:bg-parchment-dark transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-brown-dark'}
            />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Hero image ── */}
          <div className="relative h-[320px] rounded-2xl overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
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
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                {recipe.name}
              </h1>
            </div>
          </div>

          {/* ── Quote caption ── */}
          <p className="font-heading italic text-brown-medium text-sm leading-relaxed mt-3 mb-8 max-w-prose">
            {recipe.quote}
          </p>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* ── Left: Sidebar ── */}
            <aside
              className="w-full md:w-[340px] md:shrink-0"
            >
              <div
                className="md:sticky md:top-24 bg-surface rounded-2xl p-5 space-y-6 border border-brown-light/10"
              >
                {/* Quick stats */}
                <div className="flex flex-wrap gap-2 text-sm text-brown-medium">
                  <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                    <Clock size={14} /> {recipe.prepTime}m prep
                  </span>
                  <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                    <Timer size={14} /> {recipe.cookTime}m cook
                  </span>
                  <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                    <Gauge size={14} /> {recipe.difficulty}
                  </span>
                </div>

                {/* Nutrition — 2x2 grid */}
                <div>
                  <h2 className="font-heading text-sm font-semibold text-brown-dark mb-2 uppercase tracking-wide">
                    Nutrition
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {nutritionItems.map(n => (
                      <div key={n.label} className="bg-parchment rounded-lg px-3 py-2 text-center">
                        <div className="text-xs uppercase tracking-[0.1em] text-brown-medium mb-0.5">
                          {n.label}
                        </div>
                        <div
                          className="font-heading text-xl text-brown-dark"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {n.value}
                          <span className="text-xs text-brown-medium ml-0.5">{n.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-parchment text-brown-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Flavor Profile */}
                <div>
                  <h2 className="font-heading text-sm font-semibold text-brown-dark mb-2 uppercase tracking-wide">
                    Flavor Profile
                  </h2>
                  <FlavorCompass profile={recipe.flavorProfile} />
                </div>

              </div>
            </aside>

            {/* ── Right: Main content ── */}
            <main className="flex-1 min-w-0 space-y-10">
              {/* Ingredients */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-heading text-xl font-semibold text-brown-dark">
                    Ingredients
                  </h2>
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-brown-medium" />
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      aria-label="Decrease servings"
                      className="w-8 h-8 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-brown-dark w-6 text-center tabular-nums">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      aria-label="Increase servings"
                      className="w-8 h-8 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-brown-light/10">
                  {recipe.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="flex justify-between text-sm py-2 border-b border-brown-light/10 last:border-0"
                    >
                      <span className="text-brown-dark">{ing.name}</span>
                      <span className="text-brown-medium font-medium tabular-nums ml-4 shrink-0">
                        {formatAmount(ing.amount)} {ing.unit}
                      </span>
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
              </section>

              {/* Instructions */}
              <section>
                <h2 className="font-heading text-xl font-semibold text-brown-dark mb-6">
                  Instructions
                </h2>
                <div className="space-y-5">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-brown-dark leading-relaxed max-w-prose">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tips (only if data exists) */}
              {hasTips && (
                <section className="bg-surface rounded-2xl p-5">
                  <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-turmeric" />
                    Tips
                  </h2>
                  <div>
                    {recipe.tips?.map((tip, i) => (
                      <p
                        key={i}
                        className="text-sm text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
                      >
                        {tip}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2 pb-8">
                <button
                  onClick={copyFullRecipe}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors shadow"
                >
                  {copiedRecipe ? <Check size={18} /> : <Copy size={18} />}
                  {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
                </button>
                <CookedButton recipe={recipe} />
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
