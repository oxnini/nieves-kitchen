import CourtyardHero from '@/components/home/CourtyardHero';
import PromiseLine from '@/components/home/PromiseLine';
import TileWall from '@/components/home/TileWall';
import ThisWeek from '@/components/home/ThisWeek';
import WaysIn from '@/components/home/WaysIn';

/**
 * The home page (Courtyard "The Spread" + tile wall). Section order:
 * bold Navbar (layout) -> hero -> tile wall -> This week -> Ways in -> footer.
 */
export default function HomePage() {
  return (
    <div className="pb-8 sm:pb-12">
      <CourtyardHero />
      <div className="mx-auto max-w-5xl px-6 py-4 sm:px-10">
        <PromiseLine />
      </div>
      <TileWall />
      <ThisWeek />
      <WaysIn />
    </div>
  );
}
