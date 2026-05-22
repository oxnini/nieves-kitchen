'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, Minus, Plus,
  Copy, Check, Heart, Lightbulb, RefreshCw, Archive,
} from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookProgress } from '@/hooks/useCookProgress';
import { useUnitPref } from '@/hooks/useUnitPref';
import { convertUnit, formatAmount as formatNum } from '@/lib/units';
import CookedButton from './CookedButton';
import DescriptionBlock from './recipe/DescriptionBlock';
import AttributionLine from './recipe/AttributionLine';
import InfoStrip from './recipe/InfoStrip';
import EquipmentList from './recipe/EquipmentList';
import IngredientGroupList from './recipe/IngredientGroupList';
import InstructionGroupList from './recipe/InstructionGroupList';
import VariationsCard from './recipe/VariationsCard';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 24;

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function RecipeDetail({ recipe, inModal = false }: { recipe: Recipe; inModal?: boolean }) {
  const [servings, setServings] = useState(() =>
    Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, recipe.servings)),
  );
  const [copiedIngredients, setCopiedIngredients] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [favorites, toggleFavorite] = useFavorites();

  const isFavorited = favorites.has(recipe.id);
  const scale = servings / recipe.servings;

  const { isChecked, toggle } = useCookProgress(recipe.id);
  const { unit, toggle: toggleUnit } = useUnitPref();

  function displayAmount(ing: { amount: number; unit: string; metricAmount?: number; metricUnit?: string }): string {
    if (unit === 'metric' && ing.metricAmount != null && ing.metricUnit) {
      return `${formatNum(ing.metricAmount * scale)} ${ing.metricUnit}`;
    }
    const converted = convertUnit(ing.amount * scale, ing.unit, unit);
    return `${formatNum(converted.amount)} ${converted.unit}`;
  }

  function copyIngredients() {
    const lines: string[] = [];
    const showHeadings = recipe.ingredients.length > 1 || !!recipe.ingredients[0]?.heading;
    recipe.ingredients.forEach((group, gIdx) => {
      const heading = group.heading?.trim();
      if (showHeadings && heading) {
        if (gIdx > 0) lines.push('');
        lines.push(heading);
      }
      for (const ing of group.items) {
        lines.push(`- ${displayAmount(ing)} ${ing.name}`);
      }
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedIngredients(true);
    setTimeout(() => setCopiedIngredients(false), 2000);
  }

  function copyFullRecipe() {
    const { active, total, resting } = recipe.time;
    const timeLine = [
      `Active ${formatDuration(active)}`,
      `Total ${formatDuration(total)}`,
      resting && resting > 0 ? `Rest ${formatDuration(resting)}` : null,
    ].filter(Boolean).join(' · ');

    const yieldLine = recipe.yieldText
      ? `Makes ${recipe.yieldText} · Serves ${servings}`
      : `Serves ${servings}`;

    const showIngHeadings = recipe.ingredients.length > 1 || !!recipe.ingredients[0]?.heading;
    const ingredientLines: string[] = [];
    recipe.ingredients.forEach((group, gIdx) => {
      const heading = group.heading?.trim();
      if (showIngHeadings && heading) {
        if (gIdx > 0) ingredientLines.push('');
        ingredientLines.push(heading);
      }
      for (const ing of group.items) {
        ingredientLines.push(`- ${displayAmount(ing)} ${ing.name}`);
      }
    });

    const showStepHeadings = recipe.instructions.length > 1 || !!recipe.instructions[0]?.heading;
    const stepLines: string[] = [];
    let n = 1;
    recipe.instructions.forEach((group, gIdx) => {
      const heading = group.heading?.trim();
      if (showStepHeadings && heading) {
        if (gIdx > 0) stepLines.push('');
        stepLines.push(heading);
      }
      for (const step of group.items) {
        stepLines.push(`${n}. ${step}`);
        n += 1;
      }
    });

    const parts = [
      recipe.name,
      '',
      yieldLine,
      timeLine,
      '',
      '--- Ingredients ---',
      ...ingredientLines,
      '',
      '--- Instructions ---',
      ...stepLines,
    ];
    navigator.clipboard.writeText(parts.join('\n'));
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  }

  const hasTips = recipe.tips && recipe.tips.length > 0;
  const hasSubs = recipe.substitutions && recipe.substitutions.length > 0;
  const hasVariations = recipe.variations && recipe.variations.length > 0;
  const hasStorage = !!recipe.storage;

  // 2-up grid placement: when both Variations and Substitutions are present,
  // render as siblings. When only one exists, that card goes full-width.
  const variationsSubsBothPresent = hasVariations && hasSubs;

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header bar ── */}
        {!inModal && (
          <div className="flex items-center mb-6">
            <Link
              href="/recipes"
              className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium rounded focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
            >
              <ArrowLeft size={18} />
              All Recipes
            </Link>
          </div>
        )}

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
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210]/60 via-[#1A1210]/10 to-transparent" />
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1210]/30 backdrop-blur-sm hover:bg-[#1A1210]/50 transition-colors text-sm font-medium text-white/90 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                >
                  {copiedRecipe ? <Check size={16} /> : <Copy size={16} />}
                  {copiedRecipe ? 'Copied!' : 'Copy Recipe'}
                </button>
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="p-2 rounded-full bg-[#1A1210]/30 backdrop-blur-sm hover:bg-[#1A1210]/50 transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
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

          {/* ── Editorial intro: quote + description + attribution ── */}
          <DescriptionBlock
            quote={recipe.quote}
            description={recipe.description}
            dropcap={recipe.dropcap}
          />
          <AttributionLine text={recipe.attribution} />

          {/* ── Info strip ── */}
          <InfoStrip recipe={recipe} servings={servings} />

          {/* ── Equipment ── */}
          <EquipmentList items={recipe.equipment} />

          {/* ── Cookbook Spread: Ingredients + Instructions ── */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">
            {/* Left: Ingredients */}
            <section className="w-full md:w-[340px] md:shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h2 className="font-heading text-2xl font-semibold text-brown-dark">
                  Ingredients
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleUnit}
                    className="text-[13px] font-medium px-2.5 py-1 rounded-full bg-surface border border-brown-light/20 text-brown-medium hover:bg-parchment-dark transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  >
                    {unit === 'us' ? 'US' : 'Metric'}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Users size={15} className="text-brown-medium" />
                    <button
                      onClick={() => setServings(Math.max(MIN_SERVINGS, servings - 1))}
                      aria-label="Decrease servings"
                      disabled={servings <= MIN_SERVINGS}
                      className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-brown-dark w-6 text-center tabular-nums">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(Math.min(MAX_SERVINGS, servings + 1))}
                      aria-label="Increase servings"
                      disabled={servings >= MAX_SERVINGS}
                      className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <IngredientGroupList
                groups={recipe.ingredients}
                displayAmount={displayAmount}
                isChecked={isChecked}
                toggle={toggle}
              />
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
              <h2 className="font-heading text-2xl font-semibold text-brown-dark mb-6">
                Instructions
              </h2>
              <InstructionGroupList
                groups={recipe.instructions}
                isChecked={isChecked}
                toggle={toggle}
              />
            </section>
          </div>

          {/* ── Supplementary Sections ── */}
          {(hasVariations || hasSubs || hasStorage || hasTips) && (
            <div className="space-y-6 mb-10">
              {/* Variations + Substitutions row */}
              {(hasVariations || hasSubs) && (
                <div className={variationsSubsBothPresent ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}>
                  {hasVariations && <VariationsCard items={recipe.variations} />}
                  {hasSubs && (
                    <section className="bg-surface rounded-2xl p-5">
                      <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                        <RefreshCw size={18} className="text-brown-medium" />
                        Substitutions
                      </h2>
                      <div>
                        {recipe.substitutions!.map((sub, i) => (
                          <p
                            key={i}
                            className="text-base text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
                          >
                            {sub}
                          </p>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* Storage (full width) */}
              {hasStorage && (
                <section className="bg-surface rounded-2xl p-5">
                  <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                    <Archive size={18} className="text-brown-medium" />
                    Storage &amp; Reheating
                  </h2>
                  <p className="text-base text-brown-dark leading-relaxed">
                    {recipe.storage}
                  </p>
                </section>
              )}

              {/* Tips (full width) */}
              {hasTips && (
                <section className="bg-surface rounded-2xl p-5">
                  <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-brown-medium" />
                    Tips
                  </h2>
                  <div>
                    {recipe.tips?.map((tip, i) => (
                      <p
                        key={i}
                        className="text-base text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
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
