'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Minus, Plus,
  Copy, Check,
} from 'lucide-react';
import type { Ingredient, Recipe, RecipeImage } from '@/lib/types';
import type { PantryPlate } from '@/data/pantry';
import { Button, Eyebrow } from '@/components/courtyard';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookProgress } from '@/hooks/useCookProgress';
import { useUnitPref } from '@/hooks/useUnitPref';
import { useWakeLock } from '@/hooks/useWakeLock';
import { usePageTimer } from '@/hooks/usePageTimer';
import { useStepPointer } from '@/hooks/useStepPointer';
import { formatRemaining } from '@/lib/recipes/timer-format';
import { useModalScrollRef } from './recipe/ModalScrollContext';
import { convertUnit, formatAmount as formatNum } from '@/lib/units';
import CookedButton from './CookedButton';
import DescriptionBlock from './recipe/DescriptionBlock';
import AttributionLine from './recipe/AttributionLine';
import ServingFacts from './recipe/ServingFacts';
import RecipeTags from './recipe/RecipeTags';
import EquipmentList from './recipe/EquipmentList';
import PantryLinks from './recipe/PantryLinks';
import IngredientGroupList from './recipe/IngredientGroupList';
import InstructionGroupList from './recipe/InstructionGroupList';
import SupplementarySections from './recipe/SupplementarySections';
import RecipeNotes from './recipe/RecipeNotes';
import RecipeNav from './recipe/RecipeNav';
import { Ribbon } from './NavIcons';
import CookModeEntry from './recipe/CookModeEntry';
import CookModeHero from './recipe/CookModeHero';
import StickyStepCard from './recipe/StickyStepCard';
import { PageTimerContext } from './recipe/PageTimerContext';
import { detectDurations } from '@/lib/recipes/duration-detect';
import { MarginGallery, BandGallery } from './recipe/RecipeImageGallery';
import RecipeImageLightbox from './recipe/RecipeImageLightbox';
import PhotoPending from './recipe/PhotoPending';
import { useGalleryPlacement } from './recipe/useGalleryPlacement';
import { formatMinutes } from '@/lib/recipes/format';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 24;

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/* Shared by both hero plate render sites (phone after the facts row, desktop
   in the header's right column). Identical `sizes` on both means the browser
   picks the same srcset candidate for each, so the photo downloads once. From
   md the desktop plate is 48% of the header, at most about 460px. */
const PLATE_SIZES = '(max-width: 767px) 100vw, 480px';

/* Over this many characters a title steps down a size, so a long one sits in
   two lines beside the plate rather than three (Gochujang Double-Fried
   Chicken is 30; Congee is 6). */
const LONG_TITLE = 22;

interface RecipeDetailProps {
  recipe: Recipe;
  /** The recipe's featured ingredients that have landed in the pantry,
      resolved on the server (`landedPantryPlates`). */
  pantry?: PantryPlate[];
  inModal?: boolean;
  /** For dev routes: force a starting mode. Defaults to 'read'. */
  initialMode?: 'read' | 'cook';
}

export default function RecipeDetail({ recipe, pantry = [], inModal = false, initialMode = 'read' }: RecipeDetailProps) {
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

  // Title eyebrow: where the dish comes from (country · region), plus
  // "Fusion" when it applies. Uppercased by <Eyebrow>.
  const eyebrow = [
    recipe.country,
    recipe.region,
    recipe.isFusion ? 'Fusion' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // Italic line under the title: the recipe's attribution, then what it riffs
  // on (e.g. "A Nieves's Kitchen take · Inspired by Turkey, Mexico").
  const attributionText = [
    recipe.attribution?.trim() || null,
    recipe.inspiredBy && recipe.inspiredBy.length > 0
      ? `Inspired by ${recipe.inspiredBy.join(', ')}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // The title shares the header with the plate from md, so it runs a step
  // smaller than a full-width title, and a step smaller again when long. The
  // 880px modal sheet is narrower still.
  const isLongTitle = recipe.name.length > LONG_TITLE;
  const titleSize = isLongTitle
    ? (inModal ? 'text-[clamp(1.9rem,2.8vw,2.2rem)]' : 'text-[clamp(2rem,3vw,2.6rem)]')
    : (inModal ? 'text-[clamp(2.2rem,3.4vw,2.7rem)]' : 'text-[clamp(2.4rem,4vw,3.4rem)]');

  const facts: { label: string; value: string }[] = [
    { label: 'Total', value: formatMinutes(recipe.time.total) },
    { label: 'Active', value: formatMinutes(recipe.time.active) },
    ...(recipe.time.resting && recipe.time.resting > 0
      ? [{ label: 'Rest', value: formatMinutes(recipe.time.resting) }]
      : []),
    { label: 'Difficulty', value: recipe.difficulty },
  ];

  // Step ticks are scoped to the mode: what you check off in cook mode stays
  // in cook mode, so closing it leaves the read-mode instruction list as you
  // found it. Ingredient ticks are shared across both.
  const { isChecked, toggle } = useCookProgress(recipe.id, mode);
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

  // The countdown rides in the tab title, so a cook who has switched tabs
  // still sees it (audit C9). Restored when the timer stops.
  const timerTitle =
    pageTimer.status === 'running'
      ? `${formatRemaining(pageTimer.remainingMs)} · ${recipe.name}`
      : pageTimer.status === 'done'
        ? `Time's up · ${recipe.name}`
        : null;
  useEffect(() => {
    if (!timerTitle) return;
    const previous = document.title;
    document.title = timerTitle;
    return () => {
      document.title = previous;
    };
  }, [timerTitle]);

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

  // An amount of 0 ("salt, to taste") shows nothing rather than "0".
  function displayAmount(ing: { amount: number; unit: string; metricAmount?: number; metricUnit?: string }): string {
    if (unit === 'metric' && ing.metricAmount != null && ing.metricUnit) {
      const scaled = ing.metricAmount * scale;
      if (scaled === 0) return '';
      return `${formatNum(scaled, ing.metricUnit)} ${ing.metricUnit}`;
    }
    const scaled = ing.amount * scale;
    if (scaled === 0) return '';
    const converted = convertUnit(scaled, ing.unit, unit);
    return `${formatNum(converted.amount, converted.unit)} ${converted.unit}`.trim();
  }

  /** One plain-text ingredient line; no double space when the amount is empty. */
  function ingredientLine(ing: Ingredient): string {
    const amount = displayAmount(ing);
    const note = ing.note ? ` (note ${ing.note})` : '';
    return amount ? `- ${amount} ${ing.name}${note}` : `- ${ing.name}${note}`;
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
        lines.push(ingredientLine(ing));
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
        ingredientLines.push(ingredientLine(ing));
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
      ...(recipe.notes?.length
        ? ['', '--- Notes ---', ...recipe.notes.map((note, i) => `${i + 1}. ${note}`)]
        : []),
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

  // Raised-page padding. The 880px modal sheet never gets lg room, so it
  // stops at sm:p-8; the full page opens up to the configurator's 56px at lg.
  const pagePad = inModal ? 'p-5 sm:p-8' : 'p-5 sm:p-8 lg:p-14';

  // Extra photos (beyond the hero) render in read mode only. Placement is
  // measured: as many extras as fit in the white space under the Ingredients
  // column (beside the taller Instructions column) render there; the rest
  // form a baseline row below the spread.
  const extraImages = recipe.images ?? [];
  const { ingredientsRef, instructionsRef, marginGalleryRef, marginCount, maxHeightClass } =
    useGalleryPlacement(extraImages, !isCook);
  const showExtras = !isCook && extraImages.length > 0;

  // ── Cook-mode scrolling ──
  // The recipe scrolls in the window on the full page and in the sheet's own
  // container in the overlay.
  const modalScrollRef = useModalScrollRef();
  const scrollContainer = useCallback(
    () => (inModal ? modalScrollRef?.current ?? null : null),
    [inModal, modalScrollRef],
  );
  const smooth = () =>
    typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'smooth'
      : 'auto';

  // The step card's height, reported by the card. Phones pad the page by it
  // (audit C8), and scrolling to a step keeps the step clear of it.
  const [cardHeight, setCardHeight] = useState(0);
  const cardHeightRef = useRef(0);
  const onCardHeight = useCallback((px: number) => {
    cardHeightRef.current = px;
    setCardHeight(px);
  }, []);

  /** Bring a step to the upper third of the screen (audit C3), or higher
      when a long step would otherwise run under the step card. */
  const scrollToStep = useCallback(
    (index: number) => {
      const el = instructionsRef.current?.querySelector<HTMLElement>(`[data-step="${index}"]`);
      if (!el) return;
      const box = el.getBoundingClientRect();
      const c = scrollContainer();
      const viewH = c ? c.clientHeight : window.innerHeight;
      // From lg the full page docks the card beside the method, covering none of it.
      const docked = !c && window.matchMedia('(min-width: 1024px)').matches;
      const visible = viewH - (docked ? 0 : cardHeightRef.current) - 16;
      const minTop = c ? 16 : 88;
      let offset = viewH / 3;
      if (offset + box.height > visible) offset = Math.max(minTop, visible - box.height);
      if (c) {
        const cBox = c.getBoundingClientRect();
        c.scrollTo({ top: c.scrollTop + box.top - cBox.top - offset, behavior: smooth() });
      } else {
        window.scrollTo({ top: window.scrollY + box.top - offset, behavior: smooth() });
      }
    },
    [instructionsRef, scrollContainer],
  );

  /** Put a section's heading at the top, under the ribbon (C6, C7). */
  const scrollToSection = useCallback(
    (el: HTMLElement | null, behavior: ScrollBehavior = 'auto') => {
      el?.scrollIntoView({ block: 'start', behavior });
    },
    [],
  );

  // One step pointer, shared by the card and the Method list.
  const pointer = useStepPointer(recipe.instructions, isChecked, toggle, scrollToStep);

  // Entering or leaving cook mode removes or restores everything above the
  // spread, so the page would land wherever the old scroll offset falls.
  // Land on the Ingredients heading both ways (audit C6). Entering waits out
  // the editorial chrome's 250ms fade, which holds its height until it goes.
  const firstModeRef = useRef(true);
  useEffect(() => {
    if (firstModeRef.current) {
      firstModeRef.current = false;
      return;
    }
    const delay = isCook ? 280 : 0;
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => scrollToSection(ingredientsRef.current));
    }, delay);
    return () => window.clearTimeout(t);
  }, [isCook, ingredientsRef, scrollToSection]);

  // Phones: the fixed card sits over the foot of the page, footer included,
  // so the body is padded by the card's height (audit C8; the rule is
  // `body:has([data-cook-page])` in globals.css, off from lg where the card
  // docks in flow). The variable lives on <html> so <body> can read it.
  useEffect(() => {
    if (!isCook || inModal) return;
    const root = document.documentElement;
    root.style.setProperty('--cook-card-h', `${cardHeight}px`);
    return () => {
      root.style.removeProperty('--cook-card-h');
    };
  }, [isCook, inModal, cardHeight]);
  const marginImages = showExtras ? extraImages.slice(0, marginCount) : [];
  const bandImages = showExtras ? extraImages.slice(marginCount) : [];

  return (
    <PageTimerContext.Provider value={{ timer: pageTimer }}>
    <div
      data-cook-mode={isCook ? 'true' : undefined}
      data-cook-page={isCook && !inModal ? 'true' : undefined}
      className="min-h-screen"
    >
      {/* In the modal the read-mode header gets extra top room so the eyebrow
          clears the sheet's close/expand controls, which sit over the top edge. */}
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${inModal && !isCook ? 'pt-14 pb-6' : 'py-6'}`}>
        {/* ── Header bar ── */}
        {!inModal && !isCook && (
          <div className="flex items-center mb-6">
            <Link
              href="/recipes"
              className="flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors text-sm font-medium rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <ArrowLeft size={18} />
              All recipes
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
                {/* The header: title on paper beside the dish (spec
                    2026-09-25 §8, picked in /dev/recipe-header for audit F2).
                    From md, two columns: the text on the left, bottom-aligned
                    to the plate on the right. The same header serves the full
                    page and the modal; no text is ever laid over the photo. */}
                <div
                  className="md:grid md:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] md:items-end md:gap-10 lg:gap-12"
                >
                  <header className="min-w-0">
                    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                    <h1 className={`mt-2 font-heading font-normal text-brown-dark ${titleSize}`}>
                      {recipe.name}
                    </h1>
                    <AttributionLine text={attributionText} />

                    {/* Facts row, ruled teal above and hairline below. */}
                    <dl className="mt-6 flex flex-wrap border-t border-b border-t-teal border-b-line py-3">
                      {facts.map((f) => (
                        <div
                          key={f.label}
                          className="flex flex-col-reverse pr-4 mr-4 sm:pr-[22px] sm:mr-[22px] border-r border-line last:border-r-0 last:mr-0 last:pr-0"
                        >
                          <dt className="text-[13px] text-brown-medium">{f.label}</dt>
                          <dd className="font-heading font-normal text-[20px] leading-snug text-brown-dark">
                            {f.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {/* Phone plate: the photo keeps its place right after the
                        facts row. From md it sits in the right column. */}
                    <HeroPlate recipe={recipe} className="md:hidden mt-6" aspect="aspect-[3/2]" />

                    <ServingFacts recipe={recipe} inModal={inModal} />

                    {/* Actions. Start cooking is here and again before the
                        spread (CookModeEntry), where a cook who has read the
                        ingredients is deciding to start. The one-line hint
                        about cook mode is said once, there (audit C9). */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <Button variant="primary" onClick={() => setMode('cook')} className="mr-1">
                        Start cooking
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={copyFullRecipe}
                        iconLeft={copiedRecipe ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                      >
                        {copiedRecipe ? 'Copied!' : 'Copy recipe'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(recipe.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-brown-dark shadow-[inset_0_0_0_1px_var(--color-brown-dark)] hover:bg-brown-dark/[0.05] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                        aria-label={isFavorited ? 'Remove from saved' : 'Save this recipe'}
                      >
                        <Ribbon
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                          className={isFavorited ? 'text-terracotta fill-terracotta' : 'text-brown-dark'}
                        />
                      </button>
                    </div>
                  </header>

                  <HeroPlate recipe={recipe} className="hidden md:block" aspect="aspect-[4/3]" />
                </div>

                <div className="mt-8 md:mt-10">
                  <DescriptionBlock
                    description={recipe.description}
                    dropcap={recipe.dropcap}
                  />
                </div>

                <RecipeTags tags={recipe.tags} />

                {/* Equipment and the pantry plates share a row from md
                    (spec §8, audit F10): equipment keeps its reading measure,
                    so the plates fill the half it leaves empty. Either one
                    alone takes the full width; phones stack them. */}
                {pantry.length > 0 && recipe.equipment && recipe.equipment.length > 0 ? (
                  <div className="mb-10 grid gap-8 md:grid-cols-2 md:gap-12 [&>section]:mb-0">
                    <EquipmentList items={recipe.equipment} />
                    <PantryLinks plates={pantry} />
                  </div>
                ) : (
                  <>
                    <EquipmentList items={recipe.equipment} />
                    {pantry.length > 0 && (
                      <div className="mb-10">
                        <PantryLinks plates={pantry} />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Cook-mode hero ribbon ── */}
          {isCook && (
            <CookModeHero
              title={recipe.name}
              country={recipe.country}
              onExit={() => setMode('read')}
              onJumpIngredients={() => scrollToSection(ingredientsRef.current, smooth())}
              onJumpMethod={() => scrollToSection(instructionsRef.current, smooth())}
              inModal={inModal}
            />
          )}

          {/* ── Cook-mode entry (read mode only) ── */}
          {/* In cook mode the ribbon's Exit is the single way out, so we don't
              render a competing affordance there. */}
          {!isCook && (
            <CookModeEntry onEnter={() => setMode('cook')} inModal={inModal} />
          )}

          {/* ── Cookbook Spread: Ingredients + Instructions ── */}
          <div className={isCook ? 'cook-mode-scale' : ''}>
            {/* The raised page: Ingredients | Method on bg-surface paper with a
                hairline ring and a soft shadow. Two pages from md, split by the
                Method page's own left rule. */}
            {/* The gutter is a 1px `line` background centred on the grid
                (background-image; bg-surface sets only the colour), so it
                runs the full page height between the two equal columns even
                though both sections are md:self-start. */}
            <div className="grid md:grid-cols-2 mb-10 rounded-[3px] bg-surface ring-1 ring-line shadow-[0_30px_50px_-40px_rgba(0,0,0,0.4)] md:bg-[linear-gradient(var(--color-line),var(--color-line))] md:bg-[length:1px_100%] md:bg-center md:bg-no-repeat">
              {/* Left: Ingredients. md:self-start stops the default grid
                  stretch so offsetHeight reports true content height — the
                  gallery placement measurement depends on it. */}
              {/* In cook mode on the full page the column stretches to the
                  Method's height instead, because from lg it is the step
                  card's dock (audit C3): the card is sticky inside it, and a
                  sticky box can only travel within its containing block. The
                  gallery measurement is off in cook mode, so nothing reads the
                  stretched height. scroll-margin keeps the heading clear of
                  the navbar and the cook ribbon when scrolled to. */}
              <section
                ref={ingredientsRef}
                className={`min-w-0 ${pagePad} ${isCook && !inModal ? 'md:self-stretch' : 'md:self-start'} ${
                  inModal ? 'scroll-mt-16' : 'scroll-mt-[calc(var(--nav-h)+4rem)]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-brown-dark pb-2.5 mb-1">
                  <h2 className="font-heading text-[25px] font-normal text-brown-dark">
                    Ingredients
                  </h2>
                  <div className="flex flex-wrap items-center gap-2.5 text-sm">
                    {/* Servings stepper: a pill with round −/+ buttons. */}
                    <div className="inline-flex items-center gap-1 rounded-full ring-1 ring-inset ring-line p-0.5">
                      <button
                        type="button"
                        onClick={() => setServings(Math.max(MIN_SERVINGS, servings - 1))}
                        aria-label="Decrease servings"
                        disabled={servings <= MIN_SERVINGS}
                        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className="min-w-[5.5em] text-center text-brown-dark tabular-nums">
                        Serves <span className="font-semibold">{servings}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setServings(Math.min(MAX_SERVINGS, servings + 1))}
                        aria-label="Increase servings"
                        disabled={servings >= MAX_SERVINGS}
                        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                    {/* Unit toggle: segmented Metric | US. "US" not "Imperial":
                        lib/units converts to US customary. */}
                    <div role="group" aria-label="Units" className="inline-flex rounded-full ring-1 ring-inset ring-line p-0.5">
                      {([['metric', 'Metric'], ['us', 'US']] as const).map(([value, label]) => {
                        const selected = unit === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => { if (!selected) toggleUnit(); }}
                            className={`rounded-full px-3 py-[5px] text-[13.5px] leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                              selected
                                ? 'bg-brown-dark text-parchment'
                                : 'text-brown-medium hover:text-brown-dark'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Authored yield, raw ("Makes 5 lángos, one each"). */}
                {recipe.yieldText?.trim() && (
                  <p className="mt-2 text-[13px] text-brown-medium">{recipe.yieldText.trim()}</p>
                )}
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
                {/* The step card, mounted once (audit C9). Fixed to the
                    viewport bottom below lg, docked in this column from lg.
                    In the overlay it mounts at the sheet's foot instead. */}
                {isCook && !inModal && (
                  <StickyStepCard
                    groups={recipe.instructions}
                    isChecked={isChecked}
                    toggle={toggle}
                    pointer={pointer}
                    timerDurations={timerDurations}
                    cookedSlot={<CookedButton recipe={recipe} />}
                    onHeightChange={onCardHeight}
                  />
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

              {/* Right: Method — md:self-start for the same reason. */}
              <section
                ref={instructionsRef}
                className={`min-w-0 ${pagePad} border-t border-line md:border-t-0 md:self-start ${
                  inModal ? 'scroll-mt-16' : 'scroll-mt-[calc(var(--nav-h)+4rem)]'
                }`}
              >
                <h2 className="font-heading text-[25px] font-normal text-brown-dark border-b border-brown-dark pb-2.5 mb-1">
                  Method
                </h2>
                <InstructionGroupList
                  groups={recipe.instructions}
                  isChecked={isChecked}
                  toggle={toggle}
                  cookMode={isCook}
                  currentStep={pointer.allDone ? undefined : pointer.index}
                  onSelectStep={pointer.goTo}
                />

              </section>
            </div>
          </div>

          {/* ── Numbered notes (read and cook mode: ingredients and steps link here) ── */}
          {recipe.notes && recipe.notes.length > 0 && (
            <div className={`${pagePad} border-t border-line`}>
              <RecipeNotes notes={recipe.notes} />
            </div>
          )}

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

          {/* ── Previous / next (read-mode only) ── */}
          {!isCook && <RecipeNav recipe={recipe} inModal={inModal} />}
        </motion.div>
      </div>

      {/* Overlay: the step card sticks to the foot of the sheet's scroll.
          `contents` is load-bearing: a sticky box can only travel within its
          containing block, and a wrapper that shrink-wraps the card would
          leave it zero travel, parked at the very end of the scroll. */}
      {isCook && inModal && (
        <div className="contents">
          <StickyStepCard
            groups={recipe.instructions}
            isChecked={isChecked}
            toggle={toggle}
            pointer={pointer}
            inModal
            timerDurations={timerDurations}
            onHeightChange={onCardHeight}
            cookedSlot={<CookedButton recipe={recipe} />}
          />
        </div>
      )}

      <RecipeImageLightbox img={expandedImage} onClose={() => setExpandedImage(null)} />
    </div>
    </PageTimerContext.Provider>
  );
}

/**
 * The hero photo as a plate, the recipe's quote as an italic caption on the
 * paper below it. Rendered at two sites (phone after the facts row at 3:2,
 * desktop in the header's right column at 4:3), each hidden at the other's
 * breakpoint; both carry `priority` and the same `sizes`, so one download.
 */
function HeroPlate({ recipe, className = '', aspect }: { recipe: Recipe; className?: string; aspect: string }) {
  const caption = recipe.quote?.trim();
  return (
    <figure className={className}>
      <div className={`relative ${aspect} rounded-[3px] overflow-hidden bg-parchment-dark`}>
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            sizes={PLATE_SIZES}
            priority
            className="object-cover"
          />
        ) : (
          <PhotoPending size="hero" />
        )}
      </div>
      {caption && (
        <figcaption className="font-heading italic text-[15px] leading-relaxed text-brown-medium py-2.5 border-b border-line">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
