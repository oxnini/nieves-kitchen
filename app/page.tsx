import PaintedHero from '@/components/home/PaintedHero';
import CookSomethingNew from '@/components/home/CookSomethingNew';
import WaysIn from '@/components/home/WaysIn';
import { RuleDiamond } from '@/components/courtyard';

/**
 * Home (premium revamp, spec 2026-09-25 §6): painted hero, then the newest
 * recipes, a section break, and the three collections. Nothing sits between
 * the hero and the first section on purpose.
 */
export default function HomePage() {
  return (
    <div className="pb-12">
      <PaintedHero />
      <CookSomethingNew />
      <div className="mx-auto max-w-[1160px] px-4 sm:px-10"><RuleDiamond /></div>
      <WaysIn />
    </div>
  );
}
