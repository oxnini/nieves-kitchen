'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import type { Filters, MealFilter, CulinaryRegion } from '@/lib/types';
import { TAG_GROUPS } from '@/lib/filters';

const MEAL_OPTIONS: { value: MealFilter; label: string }[] = [
  { value: 'all',     label: 'All'      },
  { value: 'main',    label: 'Mains'    },
  { value: 'dessert', label: 'Desserts' },
  { value: 'drink',   label: 'Drinks'   },
  { value: 'side',    label: 'Sides'    },
];

const TIME_OPTIONS = [
  { value: null, label: 'Any'       },
  { value: 15,   label: 'Under 15m' },
  { value: 30,   label: 'Under 30m' },
  { value: 45,   label: 'Under 45m' },
  { value: 60,   label: 'Under 1h'  },
] as const;

const REGIONS: CulinaryRegion[] = [
  'Western Europe', 'Eastern Europe', 'East Asia', 'Southeast Asia',
  'South Asia', 'Middle East', 'North Africa', 'Sub-Saharan Africa',
  'North America', 'South America', 'Oceania',
];

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  activeFilterCount: number;
  /**
   * 'fab'    — floating action button (used in the mobile map chrome band).
   * 'inline' — flush trigger that sits in a control row and matches the
   *            search bar's surface (used on `/recipes`).
   * 'map'    — desktop map cluster: pairs with the MapSearch pill, so it shares
   *            its parchment fill, 46px height, and shadow for a matched set.
   */
  variant?: 'fab' | 'inline' | 'map';
}

/* Pill chips — matches the site-wide control vocabulary (navbar, search,
   card tags are all rounded-full). Body font at readable size; width still
   hugs the word. Hover takes the terracotta accent like every other control. */
const CHIP_BASE =
  'inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta';
const CHIP_INACTIVE =
  'bg-transparent text-brown-medium border border-brown-light/35 hover:border-terracotta/60 hover:text-brown-dark';
const CHIP_ACTIVE_TEAL =
  'bg-teal text-parchment border border-teal';
const CHIP_ACTIVE_SAGE =
  'bg-sage text-brown-dark border border-sage';

/* Section kicker — body font small caps, modest tracking, full-opacity
   brown-medium so contrast clears WCAG AA (~7:1 on parchment). */
const SECTION_LABEL =
  'text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-medium';
const SECTION_VALUE =
  'text-[13px] font-semibold text-teal nums-tabular';
const SCALE_LABEL =
  'text-[11px] font-medium text-brown-medium nums-tabular';
/* Tag subgroup label — quieter than SECTION_LABEL, sits above each chip row inside the Tags fieldset. */
const SUBSECTION_LABEL =
  'text-[10px] font-semibold uppercase tracking-[0.14em] text-brown-light';

export default function FilterPanel({ filters, onChange, activeFilterCount, variant = 'fab' }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);
  /* The dialog portals to <body>: on the map the trigger sits inside an
     absolute z-10 control cluster, and a fixed overlay rendered in that
     stacking context paints *below* later map chrome (zoom controls,
     sidebar) — making the backdrop unclickable where they overlap. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* First-visit pulse on filter FAB — dismissed once filters are opened.
     Inline / map triggers sit in plain sight, so they don't need the hint. */
  useEffect(() => {
    if (variant !== 'fab') return;
    try {
      if (localStorage.getItem('nieves-filters-v2')) return;
      const timer = setTimeout(() => setShowPulse(true), 2000);
      return () => clearTimeout(timer);
    } catch { /* SSR / private browsing */ }
  }, []);

  const dismissPulse = useMemo(() => () => {
    setShowPulse(false);
    try { localStorage.setItem('nieves-filters-v2', '1'); } catch {}
  }, []);

  /* Focus trap: Tab/Shift+Tab cycle within the panel; Escape closes */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    /* Auto-focus the close button when panel opens */
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    }, 100);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [open, handleKeyDown]);

  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  function clearAll() {
    onChange({ mealType: 'all', minProtein: 0, maxCalories: 800, maxTime: null, regions: [], tags: [] });
  }

  function toggleTag(tag: string) {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    update({ tags });
  }

  const hasActiveFilters = activeFilterCount > 0;

  const hiddenTagCount = TAG_GROUPS.reduce((sum, group) => {
    const hidden = group.tags.slice(group.visibleCount).filter(t => !filters.tags.includes(t));
    return sum + hidden.length;
  }, 0);

  function toggleRegion(region: CulinaryRegion) {
    const regions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    update({ regions });
  }

  return (
    <>
      <button
        ref={triggerRef}
        data-filter-fab
        onClick={() => { setOpen(true); if (showPulse) dismissPulse(); }}
        aria-label={hasActiveFilters ? `Filters, ${activeFilterCount} active` : 'Filters'}
        className={[
          {
            inline: 'group relative inline-flex shrink-0 items-center justify-center gap-2 bg-surface border text-brown-dark h-[46px] w-[46px] sm:w-auto sm:px-4 rounded-full shadow-sm hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
            map: 'group relative z-10 inline-flex shrink-0 items-center justify-center gap-2 bg-parchment border text-brown-dark h-[46px] px-4 rounded-full shadow-md hover:shadow-lg transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
            fab: 'fixed right-3 top-[calc(4.5rem+env(safe-area-inset-top))] sm:right-5 sm:top-auto sm:bottom-6 z-40 inline-flex items-center justify-center gap-2 bg-parchment border text-brown-dark w-[42px] h-[42px] sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full shadow-sm hover:shadow-md transition-[border-color,box-shadow,transform,opacity] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
          }[variant],
          hasActiveFilters
            ? 'border-terracotta ring-2 ring-terracotta/30'
            : {
                inline: 'border-brown-light/25 hover:border-terracotta/60',
                map: 'border-brown-light/20 hover:border-terracotta/60',
                fab: 'border-brown-medium/30 hover:border-terracotta/60',
              }[variant],
        ].join(' ')}
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-terracotta/15 pointer-events-none animate-[filter-pulse_2s_ease-out_infinite]" />
        )}
        <SlidersHorizontal size={18} className={variant === 'fab' ? 'text-brown-medium shrink-0 sm:w-[14px] sm:h-[14px]' : 'text-brown-medium shrink-0'} aria-hidden="true" />
        {/* One trigger voice across variants — the stamp label matches the
            inline /recipes trigger so the same control reads the same everywhere. */}
        <span className="hidden sm:inline leading-none font-stamp text-xs uppercase tracking-[0.18em] text-brown-dark">Filters</span>
        {hasActiveFilters && (
          <span aria-hidden="true" className="hidden sm:flex bg-terracotta text-parchment text-[10px] font-bold w-[18px] h-[18px] rounded-full items-center justify-center leading-none nums-tabular">
            {activeFilterCount}
          </span>
        )}
      </button>

      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brown-dark/30"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filter recipes"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[min(380px,92vw)] bg-parchment shadow-2xl overflow-y-auto"
            >
              <div className="px-7 py-7">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-heading text-[28px] leading-none font-medium tracking-tight text-brown-dark">Filters</h2>
                    <p className="font-heading italic text-[14px] font-normal text-brown-light mt-2">Curate the journey</p>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Close filters" className="-mr-2 -mt-1 p-2 hover:bg-parchment-dark rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta">
                    <X size={20} className="text-brown-medium" />
                  </button>
                </div>

                <fieldset className="border-0 p-0 m-0">
                  <legend className={`${SECTION_LABEL} mb-2.5`}>Type of Meal</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {MEAL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update({ mealType: opt.value })}
                        className={`${CHIP_BASE} ${filters.mealType === opt.value ? CHIP_ACTIVE_TEAL : CHIP_INACTIVE}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0 m-0 border-t border-brown-light/15 pt-5 mt-5">
                  <legend className="contents">
                    <div className="flex items-baseline justify-between mb-2.5">
                      <span className={SECTION_LABEL}>Min Protein</span>
                      <span className={SECTION_VALUE}>{filters.minProtein} g+</span>
                    </div>
                  </legend>
                  <div className="px-1 pt-1">
                    <Slider min={0} max={50} step={5} value={filters.minProtein}
                      onChange={v => update({ minProtein: v as number })} />
                  </div>
                  <div className={`${SCALE_LABEL} flex justify-between mt-2 px-1`}>
                    <span>0</span><span>25</span><span>50+</span>
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0 m-0 border-t border-brown-light/15 pt-5 mt-5">
                  <legend className="contents">
                    <div className="flex items-baseline justify-between mb-2.5">
                      <span className={SECTION_LABEL}>Max Calories</span>
                      <span className={SECTION_VALUE}>{filters.maxCalories} kcal</span>
                    </div>
                  </legend>
                  <div className="px-1 pt-1">
                    <Slider min={100} max={800} step={50} value={filters.maxCalories}
                      onChange={v => update({ maxCalories: v as number })} />
                  </div>
                  <div className={`${SCALE_LABEL} flex justify-between mt-2 px-1`}>
                    <span>100</span><span>400</span><span>800</span>
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0 m-0 border-t border-brown-light/15 pt-5 mt-5">
                  <legend className={`${SECTION_LABEL} mb-2.5`}>Total Time</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {TIME_OPTIONS.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => update({ maxTime: opt.value })}
                        className={`${CHIP_BASE} ${filters.maxTime === opt.value ? CHIP_ACTIVE_TEAL : CHIP_INACTIVE}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0 m-0 border-t border-brown-light/15 pt-5 mt-5">
                  <legend className={`${SECTION_LABEL} mb-2.5`}>Region</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONS.map(region => (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`${CHIP_BASE} ${filters.regions.includes(region) ? CHIP_ACTIVE_TEAL : CHIP_INACTIVE}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0 m-0 border-t border-brown-light/15 pt-5 mt-5">
                  <legend className={`${SECTION_LABEL} mb-3`}>Tags</legend>
                  {TAG_GROUPS.map((group, gi) => {
                    const visibleTags = group.tags.filter((tag, i) =>
                      showMoreTags || i < group.visibleCount || filters.tags.includes(tag)
                    );
                    return (
                      <div key={group.label} className={gi === 0 ? '' : 'mt-3.5'}>
                        <div className={SUBSECTION_LABEL}>{group.label}</div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {visibleTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`${CHIP_BASE} ${filters.tags.includes(tag) ? CHIP_ACTIVE_SAGE : CHIP_INACTIVE}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {hiddenTagCount > 0 && !showMoreTags && (
                    <button
                      type="button"
                      onClick={() => setShowMoreTags(true)}
                      className="mt-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-medium hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      + {hiddenTagCount} more
                    </button>
                  )}
                  {showMoreTags && (
                    <button
                      type="button"
                      onClick={() => setShowMoreTags(false)}
                      className="mt-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-medium hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      Show fewer
                    </button>
                  )}
                </fieldset>

                {activeFilterCount > 0 && (
                  <div className="border-t border-brown-light/15 pt-6 mt-8 flex justify-end">
                    <button
                      onClick={clearAll}
                      className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-medium hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      Reset all <span className="nums-tabular">({activeFilterCount})</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}
