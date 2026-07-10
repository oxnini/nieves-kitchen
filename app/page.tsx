import { landedPantryEntries } from '@/lib/pantry/landed';
import CoverHero from '@/components/home/CoverHero';
import PromiseLine from '@/components/home/PromiseLine';
import PantryTeaser from '@/components/home/PantryTeaser';
import LatestFromKitchen from '@/components/home/LatestFromKitchen';
import WhereNext from '@/components/home/WhereNext';

export default function HomePage() {
  const pantryEntries = landedPantryEntries();

  return (
    <div className="pb-14 sm:pb-20">
      <div className="max-w-[84rem] mx-auto px-4 sm:px-8 pt-4 sm:pt-6">
        <CoverHero pantryEntries={pantryEntries} />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24 space-y-14 sm:space-y-20">
        <PromiseLine />
        <PantryTeaser entries={pantryEntries} />
        <LatestFromKitchen />
        <WhereNext />
      </div>
    </div>
  );
}
