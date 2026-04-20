'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import Slider from 'rc-slider';
import type { Filters, MealFilter, CulinaryRegion } from '@/lib/types';
import { ALL_TAGS } from '@/lib/filters';

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
  'North America', 'South America',
];

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  activeFilterCount: number;
}

const CHIP = 'min-h-[44px] px-3 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta';
const CHIP_SM = 'min-h-[44px] px-3 py-2 rounded-full text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta';

export default function FilterPanel({ filters, onChange, activeFilterCount }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* First-visit pulse on filter FAB — dismissed once filters are opened */
  useEffect(() => {
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
        onClick={() => { setOpen(true); if (showPulse) dismissPulse(); }}
        className="fixed right-5 bottom-6 z-40 flex items-center gap-2 bg-terracotta text-white px-5 py-3 rounded-full shadow-lg hover:bg-terracotta/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-terracotta/30 pointer-events-none animate-[filter-pulse_2s_ease-out_infinite]" />
        )}
        <SlidersHorizontal size={18} />
        <span className="font-medium text-sm">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-white text-terracotta text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

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
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-parchment shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold text-brown-dark">Filters</h2>
                  <button onClick={() => setOpen(false)} aria-label="Close filters" className="p-2 hover:bg-parchment-dark rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta">
                    <X size={20} className="text-brown-medium" />
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Type of Meal</h4>
                  <div className="flex flex-wrap gap-2">
                    {MEAL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update({ mealType: opt.value })}
                        className={`${CHIP} ${
                          filters.mealType === opt.value
                            ? 'bg-terracotta text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-1">
                    Min Protein: <span className="text-terracotta">{filters.minProtein}g+</span>
                  </h4>
                  <div className="px-2 pt-2">
                    <Slider min={0} max={50} step={5} value={filters.minProtein}
                      onChange={v => update({ minProtein: v as number })} />
                  </div>
                  <div className="flex justify-between text-[10px] text-brown-light mt-1 px-1">
                    <span>0g</span><span>25g</span><span>50g+</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-1">
                    Max Calories: <span className="text-terracotta">{filters.maxCalories} kcal</span>
                  </h4>
                  <div className="px-2 pt-2">
                    <Slider min={100} max={800} step={50} value={filters.maxCalories}
                      onChange={v => update({ maxCalories: v as number })} />
                  </div>
                  <div className="flex justify-between text-[10px] text-brown-light mt-1 px-1">
                    <span>100</span><span>400</span><span>800</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Total Time</h4>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => update({ maxTime: opt.value })}
                        className={`${CHIP} ${
                          filters.maxTime === opt.value
                            ? 'bg-terracotta text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Region</h4>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map(region => (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`${CHIP_SM} ${
                          filters.regions.includes(region)
                            ? 'bg-teal text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brown-dark mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`${CHIP_SM} ${
                          filters.tags.includes(tag)
                            ? 'bg-sage text-white'
                            : 'bg-white text-brown-medium hover:bg-parchment-dark'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearAll}
                  className="w-full py-2.5 rounded-xl border-2 border-brown-light/30 text-brown-medium text-sm font-medium hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
