import PaintedHero from '@/components/home/PaintedHero';
import CookSomethingNew from '@/components/home/CookSomethingNew';
import WaysIn from '@/components/home/WaysIn';
import { RuleDiamond } from '@/components/courtyard';
import CatalogueBoundary from '@/components/CatalogueBoundary';
import { landedPantryEntries } from '@/lib/pantry/landed';

/**
 * Home (premium revamp, spec 2026-09-25 §6): painted hero, then the newest
 * recipes, a section break, and the three collections. Nothing sits between
 * the hero and the first section on purpose.
 *
 * Static, rebuilt at most every CATALOGUE_REVALIDATE seconds: the newest
 * recipes and the collection counts are in the HTML (audit F5).
 */
export const revalidate = 300; // = CATALOGUE_REVALIDATE (segment config must be a literal)

export default function HomePage() {
  return (
    <div className="pb-12">
      <PaintedHero />
      <CatalogueBoundary>
        <CookSomethingNew />
        <div className="mx-auto max-w-[1160px] px-4 sm:px-10"><RuleDiamond /></div>
        <WaysIn pantrySunnah={landedPantryEntries().filter((e) => e.prophetic).length} />
      </CatalogueBoundary>
    </div>
  );
}
