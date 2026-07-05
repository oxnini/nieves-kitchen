import Masthead from '@/components/home/Masthead';
import TableSpreadHero from '@/components/home/TableSpreadHero';
import CollectionsRow from '@/components/home/CollectionsRow';
import PantryTeaser from '@/components/home/PantryTeaser';
import LatestFromKitchen from '@/components/home/LatestFromKitchen';
import { landedPantryEntries } from '@/lib/pantry/landed';

export default function HomePage() {
  const pantryEntries = landedPantryEntries();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-14 sm:pb-20 space-y-14 sm:space-y-20">
      <div>
        <Masthead />
        <div className="mt-6 sm:mt-8">
          <TableSpreadHero />
        </div>
      </div>
      <CollectionsRow />
      <PantryTeaser entries={pantryEntries} />
      <LatestFromKitchen />
    </div>
  );
}
