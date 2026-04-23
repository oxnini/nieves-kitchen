'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Timer, Gauge, Users, Minus, Plus,
  Copy, Check, Heart, Lightbulb, RefreshCw, Archive,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookProgress } from '@/hooks/useCookProgress';
import { useUnitPref } from '@/hooks/useUnitPref';
import CookedButton from './CookedButton';

const FlavorCompass = dynamic(() => import('./FlavorCompass'), {
  ssr: false,
  loading: () => <div className="w-full h-28 bg-parchment rounded-lg animate-pulse" />,
});

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const [copiedIngredients, setCopiedIngredients] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [favorites, toggleFavorite] = useFavorites();

  const isFavorited = favorites.has(recipe.id);
  const scale = servings / recipe.servings;

  const { isChecked, toggle } = useCookProgress(recipe.id);
  const { unit, toggle: toggleUnit } = useUnitPref();

  const totalTime = recipe.prepTime + recipe.cookTime;

  function displayAmount(ing: { amount: number; unit: string; metricAmount?: number; metricUnit?: string }): string {
    if (unit === 'metric' && ing.metricAmount != null && ing.metricUnit) {
      const scaled = ing.metricAmount * scale;
      return `${scaled === Math.floor(scaled) ? String(scaled) : scaled.toFixed(1)} ${ing.metricUnit}`;
    }
    return `${formatAmount(ing.amount)} ${ing.unit}`;
  }

  function formatAmount(amount: number): string {
    const scaled = amount * scale;
    return scaled === Math.floor(scaled) ? String(scaled) : scaled.toFixed(1);
  }

  function copyIngredients() {
    const text = recipe.ingredients
      .map(i => `${displayAmount(i)} ${i.name}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIngredients(true);
    setTimeout(() => setCopiedIngredients(false), 2000);
  }

  function copyFullRecipe() {
    const parts = [
      recipe.name,
      `\nServings: ${servings}`,
      `Prep: ${recipe.prepTime}m | Cook: ${recipe.cookTime}m | Total: ${totalTime}m`,
      '\n--- Ingredients ---',
      ...recipe.ingredients.map(i => `- ${displayAmount(i)} ${i.name}`),
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
            className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium rounded focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            <ArrowLeft size={18} />
            All Recipes
          </Link>
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
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
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
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={copyFullRecipe}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors text-sm font-medium text-white/90 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                >
                  {copiedRecipe ? <Check size={16} /> : <Copy size={16} />}
                  {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
                </button>
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    size={20}
                    className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-white/90'}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── Quote caption ── */}
          <p className="font-heading italic text-brown-medium text-sm leading-relaxed mt-3 mb-8 max-w-prose">
            {recipe.quote}
          </p>

          {/* ── Recipe Info ── */}
          <div className="bg-surface rounded-2xl p-5 mb-10 border border-brown-light/10">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-2 text-sm text-brown-medium mb-5">
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Clock size={14} /> {recipe.prepTime}m prep
              </span>
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Timer size={14} /> {recipe.cookTime}m cook
              </span>
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Clock size={14} /> {totalTime}m total
              </span>
              <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
                <Gauge size={14} /> {recipe.difficulty}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Nutrition */}
              <div className="flex-1">
                <h2 className="font-heading text-sm font-semibold text-brown-dark mb-2 uppercase tracking-wide">
                  Nutrition
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

              {/* Flavor Compass */}
              <div className="w-full md:w-48 shrink-0">
                <FlavorCompass profile={recipe.flavorProfile} />
              </div>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
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
          </div>

          {/* ── Cookbook Spread: Ingredients + Instructions ── */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">
            {/* Left: Ingredients */}
            <section className="w-full md:w-[340px] md:shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-xl font-semibold text-brown-dark">
                  Ingredients
                </h2>
                <div className="flex items-center gap-3">
                  {/* Unit toggle */}
                  <button
                    onClick={toggleUnit}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-brown-light/20 text-brown-medium hover:bg-parchment-dark transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  >
                    {unit === 'us' ? 'US' : 'Metric'}
                  </button>
                  {/* Servings adjuster */}
                  <div className="flex items-center gap-1.5">
                    <Users size={15} className="text-brown-medium" />
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      aria-label="Decrease servings"
                      className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-brown-dark w-6 text-center tabular-nums">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      aria-label="Increase servings"
                      className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-brown-light/10">
                {recipe.ingredients.map((ing, i) => (
                  <label
                    key={ing.name}
                    className={`flex items-center justify-between text-sm py-2 border-b border-brown-light/10 last:border-0 cursor-pointer transition-opacity ${
                      isChecked('ingredients', i) ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked('ingredients', i)}
                        onChange={() => toggle('ingredients', i)}
                        className="accent-terracotta w-4 h-4 rounded"
                      />
                      <span className={isChecked('ingredients', i) ? 'line-through' : ''}>
                        {ing.name}
                      </span>
                    </span>
                    <span className={`text-brown-medium font-medium tabular-nums ml-4 shrink-0 ${
                      isChecked('ingredients', i) ? 'line-through' : ''
                    }`}>
                      {displayAmount(ing)}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={copyIngredients}
                className="mt-2 flex items-center gap-1.5 text-sm text-teal hover:text-teal/70 transition-colors rounded focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              >
                {copiedIngredients ? <Check size={14} /> : <Copy size={14} />}
                {copiedIngredients ? 'Copied!' : 'Copy ingredients'}
              </button>
            </section>

            {/* Right: Instructions */}
            <section className="flex-1 min-w-0">
              <h2 className="font-heading text-xl font-semibold text-brown-dark mb-6">
                Instructions
              </h2>
              <ol className="space-y-5 list-none pl-0">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className={`flex gap-3 transition-opacity ${
                    isChecked('steps', i) ? 'opacity-50' : ''
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked('steps', i)}
                        onChange={() => toggle('steps', i)}
                        className="accent-terracotta w-4 h-4 rounded mt-1.5 shrink-0"
                      />
                      <span aria-hidden="true" className="shrink-0 w-8 h-8 rounded-full bg-terracotta text-white text-sm font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className={`text-sm text-brown-dark leading-relaxed max-w-prose ${
                        isChecked('steps', i) ? 'line-through' : ''
                      }`}>
                        {step}
                      </p>
                    </label>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* ── Supplementary Sections ── */}
          {(recipe.substitutions?.length || recipe.storage || hasTips) && (
            <div className="space-y-6 mb-10">
              {/* Substitutions + Storage grid */}
              {(recipe.substitutions?.length || recipe.storage) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                    <section className="bg-surface rounded-2xl p-5">
                      <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                        <RefreshCw size={18} className="text-sage" />
                        Substitutions
                      </h2>
                      <div>
                        {recipe.substitutions.map((sub, i) => (
                          <p
                            key={i}
                            className="text-sm text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
                          >
                            {sub}
                          </p>
                        ))}
                      </div>
                    </section>
                  )}

                  {recipe.storage && (
                    <section className="bg-surface rounded-2xl p-5">
                      <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                        <Archive size={18} className="text-teal" />
                        Storage &amp; Reheating
                      </h2>
                      <p className="text-sm text-brown-dark leading-relaxed">
                        {recipe.storage}
                      </p>
                    </section>
                  )}
                </div>
              )}

              {/* Tips */}
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
            </div>
          )}

          {/* ── I Cooked This ── */}
          <div className="flex justify-center py-6">
            <CookedButton recipe={recipe} />
          </div>

        </motion.div>
      </div>
    </div>
  );
}
