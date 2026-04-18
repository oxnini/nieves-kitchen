'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import type { Recipe } from '@/lib/types';
import type { PassportSummary, Stamp as StampRow } from '@/lib/passport';

import BookletShell from './BookletShell';
import PaperTexture from './PaperTexture';
import Spread from './Spread';
import CoverPage from './CoverPage';
import InsideFrontSpread from './InsideFrontSpread';
import SubRegionSpread from './SubRegionSpread';
import BackCoverSpread from './BackCoverSpread';
import NavChevrons from './NavChevrons';
import PageIndicator from './PageIndicator';
import StampedRecipesModal from './StampedRecipesModal';
import { usePassportPages, type PageDescriptor } from './hooks/usePassportPages';
import { useBookletNav } from './hooks/useBookletNav';

export default function PassportBooklet() {
  const router = useRouter();
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { summary, isLoading: stampsLoading } = useCookedStamps();
  const reduced = useReducedMotion();

  const pages = usePassportPages({ recipes, summary });
  const nav = useBookletNav(pages);
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
    const stamps = summary.stampsPerCountry.get(modalCountry) ?? [];
    const cookedSlugs = new Set(stamps.map(s => s.recipe_slug));
    return (recipesByCountry.get(modalCountry) ?? []).filter(r => cookedSlugs.has(r.id));
  }, [modalCountry, summary.stampsPerCountry, recipesByCountry]);

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
        Loading your passport…
      </div>
    );
  }

  const currentPage = pages[nav.index];
  const onCooked = (country: string) => setModalCountry(country);
  const onUncooked = (country: string) => {
    router.push(`/recipes?country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="relative">
      <PaperTexture />
      <div {...nav.bindSwipe}>
        <BookletShell openState="open">
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
                duration: reduced ? 0.2 : (currentPage?.kind === 'cover' ? 0.9 : 0.6),
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: nav.direction === 1 ? 'left center' : 'right center',
                perspective: 2000,
              }}
            >
              {renderPage(currentPage, {
                summary,
                pages,
                recipesByCountry,
                onCooked,
                onUncooked,
                onJump: nav.jumpTo,
              })}
            </motion.div>
          </AnimatePresence>

          <NavChevrons
            canPrev={nav.canPrev}
            canNext={nav.canNext}
            onPrev={nav.flipPrev}
            onNext={nav.flipNext}
            disabled={nav.isFlipping}
          />
        </BookletShell>
      </div>

      <PageIndicator count={pages.length} index={nav.index} onJump={nav.jumpTo} />

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

interface RenderCtx {
  summary: PassportSummary;
  pages: PageDescriptor[];
  recipesByCountry: Map<string, Recipe[]>;
  onCooked: (country: string) => void;
  onUncooked: (country: string) => void;
  onJump: (i: number) => void;
}

function renderPage(page: PageDescriptor | undefined, ctx: RenderCtx) {
  if (!page) return null;
  switch (page.kind) {
    case 'cover':
      return <CoverPage summary={ctx.summary} />;
    case 'inside-front':
      return (
        <Spread>
          <InsideFrontSpread
            summary={ctx.summary}
            pages={ctx.pages}
            stampsPerCountry={ctx.summary.stampsPerCountry}
            onJumpToSubRegion={ctx.onJump}
          />
        </Spread>
      );
    case 'sub-region':
      return (
        <Spread withSpine={false}>
          <SubRegionSpread
            subRegion={page.subRegion}
            countries={page.countries}
            stampsPerCountry={ctx.summary.stampsPerCountry}
            recipesByCountry={ctx.recipesByCountry}
            onCookedClick={ctx.onCooked}
            onUncookedClick={ctx.onUncooked}
          />
        </Spread>
      );
    case 'back-cover':
      return (
        <Spread>
          <BackCoverSpread summary={ctx.summary} />
        </Spread>
      );
  }
}
