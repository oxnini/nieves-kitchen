'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, Minus, Plus,
  Copy, Check, Heart,
} from 'lucide-react';
import type { Recipe, RecipeImage } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookProgress } from '@/hooks/useCookProgress';
import { useUnitPref } from '@/hooks/useUnitPref';
import { useWakeLock } from '@/hooks/useWakeLock';
import { usePageTimer } from '@/hooks/usePageTimer';
import { convertUnit, formatAmount as formatNum } from '@/lib/units';
import CookedButton from './CookedButton';
import DescriptionBlock from './recipe/DescriptionBlock';
import AttributionLine from './recipe/AttributionLine';
import InfoStrip from './recipe/InfoStrip';
import EquipmentList from './recipe/EquipmentList';
import IngredientGroupList from './recipe/IngredientGroupList';
import InstructionGroupList from './recipe/InstructionGroupList';
import SupplementarySections from './recipe/SupplementarySections';
import CookModeEntry from './recipe/CookModeEntry';
import CookModeHero from './recipe/CookModeHero';
import StickyStepCard from './recipe/StickyStepCard';
import { PageTimerContext } from './recipe/PageTimerContext';
import { detectDurations } from '@/lib/recipes/duration-detect';
import { MarginGallery, BandGallery } from './recipe/RecipeImageGallery';
import RecipeImageLightbox from './recipe/RecipeImageLightbox';
import { useGalleryPlacement } from './recipe/useGalleryPlacement';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 24;

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

interface RecipeDetailProps {
  recipe: Recipe;
  inModal?: boolean;
  /** For dev routes: force a starting mode. Defaults to 'read'. */
  initialMode?: 'read' | 'cook';
  /**
   * When true, the read-mode hero image bleeds to the top and side edges of its
   * container instead of sitting as an inset rounded card. Used inside the modal
   * so the sheet opens directly on the photograph, with the close/expand
   * controls resting on the hero scrim. Defaults off so the full-page route is
   * unaffected.
   */
  heroBleed?: boolean;
}

export default function RecipeDetail({ recipe, inModal = false, initialMode = 'read', heroBleed = false }: RecipeDetailProps) {
  const [servings, setServings] = useState(() =>
    Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, recipe.servings)),
  );
  const [copiedIngredients, setCopiedIngredients] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [favorites, toggleFavorite] = useFavorites();
  const [mode, setMode] = useState<'read' | 'cook'>(initialMode);
  const [expandedImage, setExpandedImage] = useState<RecipeImage | null>(null);

  const isFavorited = favorites.has(recipe.id);
  const scale = servings / recipe.servings;

  const { isChecked, toggle } = useCookProgress(recipe.id);
  const { unit, toggle: toggleUnit } = useUnitPref();

  useWakeLock(mode === 'cook');

  // One page timer, co-located inside the sticky step card in cook mode; step
  // prose also seeds it via DurationToken. It deliberately survives leaving
  // cook mode and reloads (the hook persists it): a running timer is a
  // background utility that keeps counting and rings when it's up, rather than
  // being tied to whether the step card is on screen. Read mode simply shows
  // no timer chrome; re-entering cook mode surfaces its current state.
  const pageTimer = usePageTimer();

  // The durations this recipe's steps actually call for, seeding the timer's
  // chips (deduped, sorted, capped). Empty → the strip falls back to a
  // generic ladder.
  const timerDurations = useMemo(() => {
    const set = new Set<number>();
    recipe.instructions.forEach((g) =>
      g.items.forEach((step) => detectDurations(step).forEach((m) => set.add(m.lowerBoundMs))),
    );
    return Array.from(set).sort((a, b) => a - b).slice(0, 6);
  }, [recipe.instructions]);

  // Capture-phase ESC handler. While in cook mode this intercepts the modal's
  // own ESC listener so the first press exits cook mode (modal stays open);
  // a second press, now in read mode, lets the modal close as normal.
  useEffect(() => {
    if (mode !== 'cook') return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      e.preventDefault();
      setMode('read');
    }
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [mode]);

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

  const isCook = mode === 'cook';

  // Extra photos (beyond the hero) render in read mode only. Placement is
  // measured: as many extras as fit in the white space under the Ingredients
  // column (beside the taller Instructions column) render there; the rest
  // form a baseline row below the spread.
  const extraImages = recipe.images ?? [];
  const { ingredientsRef, instructionsRef, marginGalleryRef, marginCount, maxHeightClass } =
    useGalleryPlacement(extraImages, !isCook);
  const showExtras = !isCook && extraImages.length > 0;
  const marginImages = showExtras ? extraImages.slice(0, marginCount) : [];
  const bandImages = showExtras ? extraImages.slice(marginCount) : [];

  return (
    <PageTimerContext.Provider value={{ timer: pageTimer }}>
    <div
      data-cook-mode={isCook ? 'true' : undefined}
      className="min-h-screen bg-parchment"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header bar ── */}
        {!inModal && !isCook && (
          <div className="flex items-center mb-6">
            <Link
              href="/recipes"
              className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
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
          {/* ── Read-mode hero + editorial intro ── */}
          <AnimatePresence initial={false} mode="wait">
            {!isCook && (
              <motion.div
                key="editorial-chrome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className={
                  heroBleed
                    ? 'relative h-[240px] sm:h-[300px] overflow-hidden -mt-6 -mx-4 sm:-mx-6 lg:-mx-8'
                    : 'relative h-[320px] rounded-2xl overflow-hidden'
                }>
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scrim/60 via-scrim/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    {/* Meta line sits on its own full-width row so a longer
                        "Inspired by …" stays on one line (two at most on the
                        narrowest sheets) instead of collapsing into a stack
                        when squeezed beside the action buttons. */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {recipe.isFusion && (
                        <span className="bg-turmeric text-brown-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          FUSION
                        </span>
                      )}
                      {recipe.country && (
                        <span className="text-white/80 text-sm">{recipe.country}</span>
                      )}
                      {recipe.inspiredBy && (
                        <span className="text-white/60 text-sm">
                          &middot; Inspired by {recipe.inspiredBy.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white min-w-0">
                        {recipe.name}
                      </h1>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={copyFullRecipe}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-scrim/30 backdrop-blur-sm hover:bg-scrim/50 transition-colors text-sm font-medium text-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                        >
                          {copiedRecipe ? <Check size={16} /> : <Copy size={16} />}
                          {copiedRecipe ? 'Copied!' : 'Copy recipe'}
                        </button>
                        <button
                          onClick={() => toggleFavorite(recipe.id)}
                          className="p-2 rounded-full bg-scrim/30 backdrop-blur-sm hover:bg-scrim/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
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
                </div>

                <DescriptionBlock
                  quote={recipe.quote}
                  description={recipe.description}
                  dropcap={recipe.dropcap}
                />
                <AttributionLine text={recipe.attribution} />

                <InfoStrip recipe={recipe} servings={servings} />

                <EquipmentList items={recipe.equipment} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Cook-mode hero ribbon ── */}
          {isCook && (
            <CookModeHero
              title={recipe.name}
              country={recipe.country}
              onExit={() => setMode('read')}
              inModal={inModal}
            />
          )}

          {/* ── Cook-mode entry (read mode only) ── */}
          {/* In cook mode the ribbon's ✕ is the single exit, so we don't render
              a competing affordance there. */}
          {!isCook && (
            <CookModeEntry onEnter={() => setMode('cook')} inModal={inModal} />
          )}

          {/* ── Cookbook Spread: Ingredients + Instructions ── */}
          <div className={isCook ? 'cook-mode-scale' : ''}>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">
              {/* Left: Ingredients. md:self-start stops the default flex
                  stretch so offsetHeight reports true content height — the
                  gallery placement measurement depends on it. */}
              <section ref={ingredientsRef} className="w-full md:w-[340px] md:shrink-0 md:self-start">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h2 className="font-heading text-2xl font-semibold text-brown-dark">
                    Ingredients
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleUnit}
                      className="text-[13px] font-medium px-2.5 py-1 rounded-full bg-surface border border-brown-light/20 text-brown-medium hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      {unit === 'us' ? 'US' : 'Metric'}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Users size={15} className="text-brown-medium" />
                      <button
                        onClick={() => setServings(Math.max(MIN_SERVINGS, servings - 1))}
                        aria-label="Decrease servings"
                        disabled={servings <= MIN_SERVINGS}
                        className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface"
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
                        className="w-7 h-7 rounded-full bg-surface hover:bg-parchment-dark flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface"
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
                {!isCook && (
                  <button
                    onClick={copyIngredients}
                    className="mt-2 flex items-center gap-1.5 text-sm text-teal hover:text-teal/70 transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    {copiedIngredients ? <Check size={14} /> : <Copy size={14} />}
                    {copiedIngredients ? 'Copied!' : 'Copy ingredients'}
                  </button>
                )}
                {marginImages.length > 0 && (
                  <div ref={marginGalleryRef}>
                    <MarginGallery
                      images={marginImages}
                      onOpen={setExpandedImage}
                      maxHeightClass={maxHeightClass}
                    />
                  </div>
                )}
              </section>

              {/* Right: Instructions — md:self-start for the same reason. */}
              <section ref={instructionsRef} className="flex-1 min-w-0 md:self-start">
                <h2 className="font-heading text-2xl font-semibold text-brown-dark mb-6">
                  Instructions
                </h2>
                <InstructionGroupList
                  groups={recipe.instructions}
                  isChecked={isChecked}
                  toggle={toggle}
                  cookMode={isCook}
                />

                {/* Desktop standalone: sticky step card pins to the right
                    column bottom. The mobile/modal placements are rendered
                    elsewhere below. */}
                {isCook && !inModal && (
                  <div className="hidden lg:block">
                    <StickyStepCard
                      groups={recipe.instructions}
                      isChecked={isChecked}
                      toggle={toggle}
                      timerDurations={timerDurations}
                      cookedSlot={<CookedButton recipe={recipe} />}
                    />
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* ── Extra photos: band placement (whatever didn't fit the margin) ── */}
          {bandImages.length > 0 && (
            <BandGallery images={bandImages} onOpen={setExpandedImage} />
          )}

          {/* ── Supplementary Sections (read-mode only) ── */}
          <AnimatePresence initial={false}>
            {!isCook && (hasVariations || hasSubs || hasStorage || hasTips) && (
              <motion.div
                key="supplementary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-10"
              >
                <SupplementarySections recipe={recipe} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── I Cooked This (read-mode only) ── */}
          {!isCook && (
            <div className="flex justify-center py-6">
              <CookedButton recipe={recipe} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Cook-mode sticky step card. Mobile fixed-bottom and the in-modal
          sticky-inside-scroll placements render here; the desktop standalone
          placement renders inside the instructions column above. */}
      {isCook && (
        <div className={inModal ? '' : 'lg:hidden'}>
          <StickyStepCard
            groups={recipe.instructions}
            isChecked={isChecked}
            toggle={toggle}
            inModal={inModal}
            timerDurations={timerDurations}
            cookedSlot={<CookedButton recipe={recipe} />}
          />
        </div>
      )}

      <RecipeImageLightbox img={expandedImage} onClose={() => setExpandedImage(null)} />
    </div>
    </PageTimerContext.Provider>
  );
}
