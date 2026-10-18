// data/pantry/milk.ts
import type { PantryEntry } from './_types';

const entry: PantryEntry = {
  slug: 'milk',
  name: 'Milk',
  kind: 'dairy & eggs',
  note: 'Warmed for talbina, simmered slowly with rice into pudding, or poured into strong tea until it turns the colour of sand.',
  prophetic: {
    note: 'The Quran names the pure milk drawn from grazing livestock as a sign, pleasant to those who drink it.',
    citation: 'Quran, Surah an-Nahl 16:66',
  },
  benefits: ['Calcium', 'Protein'],
  artSrc: '/pantry/milk.webp',
};

export default entry;
