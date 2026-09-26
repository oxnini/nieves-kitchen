import PantryShelf from '@/components/pantry/PantryShelf';
import { landedPantryEntries } from '@/lib/pantry/landed';

export const metadata = {
  title: "The pantry · Nieves's Kitchen",
  description:
    'The ingredients I cook with most, what each one does, and which recipes use it.',
};

/**
 * The Pantry (phase 7 "Glazed Folio" restyle of the 2026-07-03 revamp). A
 * server shell that resolves which entries have real ink art on disk (see
 * `landedPantryEntries`), then hands the shelf to the client.
 */
export default function PantryPage() {
  const entries = landedPantryEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-8 sm:pt-10">
      <header className="pb-9 pt-6">
        <h1 className="font-heading text-4xl font-normal text-brown-dark sm:text-5xl">The pantry</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-brown-medium sm:text-lg">
          The ingredients I cook with most, what each one does, and which recipes use it.
        </p>
      </header>

      <PantryShelf entries={entries} />
    </div>
  );
}
