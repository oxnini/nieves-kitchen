import PantryShelf from '@/components/pantry/PantryShelf';
import { landedPantryEntries } from '@/lib/pantry/landed';

export const metadata = {
  title: "The pantry · Nieves's Kitchen",
  description:
    'The ingredients I cook with most. Pick one to see what it does and every recipe that uses it.',
};

interface Props {
  searchParams: Promise<{ entry?: string | string[] }>;
}

/**
 * The Pantry (spec 2026-09-25 §10, amended for audit F9). A server shell that
 * resolves which entries have real ink art on disk (see `landedPantryEntries`)
 * and which entry to open on (`?entry=<slug>`, from a recipe page's pantry
 * link), then hands the grid to the client.
 */
export default async function PantryPage({ searchParams }: Props) {
  const entries = landedPantryEntries();
  const { entry } = await searchParams;
  const initialSlug = typeof entry === 'string' ? entry : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-8 sm:pt-10">
      <header className="pb-8 pt-6">
        <h1 className="font-heading text-4xl font-normal text-brown-dark sm:text-5xl">The pantry</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-brown-medium sm:text-lg">
          The ingredients I cook with most. Pick one to see what it does and every recipe that
          uses it. Those marked Sunnah come with a hadith or a verse of the Quran, and its source.
        </p>
      </header>

      <PantryShelf entries={entries} initialSlug={initialSlug} />
    </div>
  );
}
