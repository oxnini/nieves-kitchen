import fs from 'node:fs';
import path from 'node:path';
import { PANTRY, type PantryEntry } from '@/data/pantry';
import PantryShelf from '@/components/pantry/PantryShelf';

export const metadata = {
  title: "The Pantry · Nieves' Kitchen",
  description:
    "The ingredients this kitchen leans on, from the everyday to the beloved. The sealed ones come with a story worth knowing.",
};

/**
 * The Pantry (phase 2 of the 2026-07-03 revamp). A server shell that resolves
 * which entries have real ink art on disk, then hands the shelf to the client.
 *
 * No placeholder assets ship: an entry appears only once its
 * `public/pantry/<slug>.webp` exists, so the shelf can launch partial and fill
 * in as renders land. The check is a build/request-time directory read, cheap
 * and dependency-free.
 */
function entriesWithArt(): PantryEntry[] {
  const dir = path.join(process.cwd(), 'public', 'pantry');
  let landed: Set<string>;
  try {
    landed = new Set(
      fs.readdirSync(dir)
        .filter(f => f.endsWith('.webp'))
        .map(f => f.slice(0, -'.webp'.length)),
    );
  } catch {
    landed = new Set();
  }
  return PANTRY.filter(e => landed.has(e.slug));
}

export default function PantryPage() {
  const entries = entriesWithArt();

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
