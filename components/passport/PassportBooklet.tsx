'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import { regionSlug } from '@/lib/passport-pack';

import BookletShell from './BookletShell';
import BookletLoading from './BookletLoading';
import PaperTexture from './PaperTexture';
import RegionChipStrip from './RegionChipStrip';
import { useIsMobile } from '@/hooks/useIsMobile';
import StampedRecipesModal from './StampedRecipesModal';
import SpreadView from './SpreadView';
import { usePassportSpreads, type SpreadDescriptor } from './hooks/usePassportSpreads';
import { useBookletNav } from './hooks/useBookletNav';
import { usePassportOverlay } from './PassportOverlay';

export default function PassportBooklet() {
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  const { summary, cancellationsByCountry, isLoading: stampsLoading } = useCookedStamps();
  const mobile = useIsMobile();
  const spreads = usePassportSpreads({ recipes, summary });
  const nav = useBookletNav(spreads);
  const { pendingSpread, consumePendingSpread } = usePassportOverlay();
  const [modalCountry, setModalCountry] = useState<string | null>(null);
  const [bookletWidth, setBookletWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!pendingSpread) return;
    const targetIdx = spreads.findIndex(
      s => s.kind === 'region' && s.continuationIndex === 0 && regionSlug(s.region) === pendingSpread,
    );
    if (targetIdx >= 0) nav.jumpTo(targetIdx);
    consumePendingSpread();
  }, [pendingSpread, spreads, nav, consumePendingSpread]);

  const handleSize = useCallback(
    ({ openWidth }: { openWidth: number; mobile: boolean }) => {
      setBookletWidth(openWidth);
    },
    [],
  );

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
    return <BookletLoading variant="data" />;
  }

  const currentSpread = spreads[nav.index];
  const isClosed =
    !mobile && (currentSpread?.kind === 'cover' || currentSpread?.kind === 'back-cover');

  const pageLabel = describeSpread(currentSpread, nav.index, spreads.length);
  const onCooked = (country: string) => setModalCountry(country);

  return (
    <div className="relative" role="region" aria-roledescription="passport booklet" aria-label="Your culinary passport">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {pageLabel}
      </div>
      <PaperTexture />
      <div {...nav.bindSwipe}>
        <BookletShell
          openState={isClosed ? 'closed' : 'open'}
          canPrev={nav.canPrev}
          canNext={nav.canNext}
          onPrev={nav.flipPrev}
          onNext={nav.flipNext}
          navDisabled={nav.isFlipping}
          onSize={handleSize}
        >
          <div className="absolute inset-0">
            {currentSpread && (
              <SpreadView
                spread={currentSpread}
                spreads={spreads}
                summary={summary}
                stampsPerCountry={summary.stampsPerCountry}
                cancellationsByCountry={cancellationsByCountry}
                recipes={recipes}
                recipesByCountry={recipesByCountry}
                onCooked={onCooked}
                onJump={nav.jumpTo}
              />
            )}
          </div>
        </BookletShell>
      </div>

      <div className="mt-6 px-4 sm:px-0">
        <div className="mx-auto" style={bookletWidth ? { width: `${bookletWidth}px` } : undefined}>
          <RegionChipStrip
            spreads={spreads}
            index={nav.index}
            onJump={nav.jumpTo}
            width={bookletWidth}
          />
        </div>
      </div>

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

function describeSpread(
  spread: SpreadDescriptor | undefined,
  index: number,
  total: number,
): string {
  if (!spread) return '';
  const page = `Page ${index + 1} of ${total}`;
  switch (spread.kind) {
    case 'cover':        return `${page}: Cover`;
    case 'inside-front': return `${page}: Traveler profile`;
    case 'contents':     return `${page}: Contents`;
    case 'region':       return `${page}: ${spread.region}`;
    case 'back-cover':   return `${page}: Back cover`;
  }
}
