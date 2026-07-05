import PantryShelf from '@/components/pantry/PantryShelf';
import { landedPantryEntries } from '@/lib/pantry/landed';

export const metadata = {
  title: "The Pantry · Nieves' Kitchen",
  description:
    "The ingredients this kitchen leans on, from the everyday to the beloved. The sealed ones come with a story worth knowing.",
};

/**
 * The Pantry (phase 2 of the 2026-07-03 revamp). A server shell that resolves
 * which entries have real ink art on disk (see `landedPantryEntries`), then
 * hands the shelf to the client.
 */
export default function PantryPage() {
  const entries = landedPantryEntries();

  return (
    <div className="max-w-4xl mx-auto px-5 pt-6 sm:pt-10 pb-24">
      <header className="pt-6 pb-9">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brown-dark">The Pantry</h1>
        <p className="mt-3 text-brown-medium text-base sm:text-lg max-w-xl leading-relaxed">
          The ingredients this kitchen leans on, from the everyday to the beloved.
          The sealed ones come with a story worth knowing.
        </p>
      </header>

      <PantryShelf entries={entries} />
    </div>
  );
}
