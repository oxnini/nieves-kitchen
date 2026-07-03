'use client';

import { useRecipes } from '@/hooks/useRecipes';
import Masthead from '@/components/home/Masthead';
import TableSpreadHero from '@/components/home/TableSpreadHero';
import CollectionsRow from '@/components/home/CollectionsRow';
import LatestFromKitchen from '@/components/home/LatestFromKitchen';

export default function HomePage() {
  const { data: recipes = [], isLoading } = useRecipes();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-14 sm:pb-20 space-y-14 sm:space-y-20">
      <Masthead />
      <TableSpreadHero recipes={recipes} isLoading={isLoading} />
      <CollectionsRow />
      <LatestFromKitchen recipes={recipes} isLoading={isLoading} />
    </div>
  );
}
