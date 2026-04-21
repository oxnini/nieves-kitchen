'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';

import BookletShell from './BookletShell';
import PaperTexture from './PaperTexture';
import NavChevrons from './NavChevrons';
import PageIndicator from './PageIndicator';
import StampedRecipesModal from './StampedRecipesModal';
import SpreadView from './SpreadView';
import { usePassportSpreads } from './hooks/usePassportSpreads';
import { useBookletNav } from './hooks/useBookletNav';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function PassportBooklet() {
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { summary, isLoading: stampsLoading } = useCookedStamps();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  const spreads = usePassportSpreads({ recipes, summary });
  const nav = useBookletNav(spreads);
  const [modalCountry, setModalCountry] = useState<string | null>(null);

  const recipesByCountry = useMemo(() => {
    const m = new Map<string, Recipe[]>();
    for (const r of recipes) {
      const a = m.get(r.country) ?? [];
      a.push(r);
      m.set(r.country, a);
    }
    return m;
  }, [recipes]);

  const modalRecipes: Recipe[] = useMemo(() => {
    if (!modalCountry) return [];
    return recipesByCountry.get(modalCountry) ?? [];
  }, [modalCountry, recipesByCountry]);

  const modalStampsByRecipe = useMemo(() => {
    const m = new Map<string, StampRow[]>();
    if (!modalCountry) return m;
    const stamps = summary.stampsPerCountry.get(modalCountry) ?? [];
    for (const s of stamps) {
      const a = m.get(s.recipe_slug) ?? [];
      a.push(s);
      m.set(s.recipe_slug, a);
    }
    return m;
  }, [modalCountry, summary.stampsPerCountry]);

  if (recipesLoading || stampsLoading) {
    return (
      <div className="max-w-5xl mx-auto text-brown-medium py-20 text-center">
        Opening your passport…
      </div>
    );
  }

  const currentSpread = spreads[nav.index];
  const isClosed = !mobile && currentSpread?.kind === 'cover';

  const onCooked = (country: string) => setModalCountry(country);

  return (
    <div className="relative" role="region" aria-roledescription="passport booklet" aria-label="Your culinary passport">
      <PaperTexture />
      <div {...nav.bindSwipe}>
        <BookletShell
          openState={isClosed ? 'closed' : 'open'}
          chrome={
            <NavChevrons
              canPrev={nav.canPrev}
              canNext={nav.canNext}
              onPrev={nav.flipPrev}
              onNext={nav.flipNext}
              disabled={nav.isFlipping}
            />
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={nav.index}
              className="absolute inset-0"
              initial={reduced
                ? { opacity: 0 }
                : { rotateY: nav.direction === 1 ? -90 : 90, opacity: 0 }}
              animate={reduced
                ? { opacity: 1 }
                : { rotateY: 0, opacity: 1 }}
              exit={reduced
                ? { opacity: 0 }
                : { rotateY: nav.direction === 1 ? 90 : -90, opacity: 0 }}
              transition={{
                duration: reduced ? 0.2 : (isClosed ? 0.9 : 0.6),
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: nav.direction === 1 ? 'left center' : 'right center',
                perspective: 2000,
              }}
            >
              {currentSpread && (
                <SpreadView
                  spread={currentSpread}
                  spreads={spreads}
                  summary={summary}
                  stampsPerCountry={summary.stampsPerCountry}
                  recipesByCountry={recipesByCountry}
                  onCooked={onCooked}
                  onJump={nav.jumpTo}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </BookletShell>
      </div>

      <PageIndicator count={spreads.length} index={nav.index} onJump={nav.jumpTo} />

      {modalCountry && (
        <StampedRecipesModal
          country={modalCountry}
          recipes={modalRecipes}
          stampsByRecipe={modalStampsByRecipe}
          onClose={() => setModalCountry(null)}
        />
      )}
    </div>
  );
}
