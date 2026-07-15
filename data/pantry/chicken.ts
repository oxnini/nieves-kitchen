// data/pantry/chicken.ts
import type { PantryEntry } from './_types';

const entry: PantryEntry = {
  slug: 'chicken',
  name: 'Chicken',
  kind: 'meat & fish',
  note: 'The everyday bird, and the most willing meat on the shelf. Poach it for soup, roast it whole for a Sunday, or char thighs over a high flame until the edges catch.',
  prophetic: {
    note: 'Abu Musa al-Ash’ari related that he saw the Prophet ﷺ eating chicken.',
    citation: 'Sahih al-Bukhari 5517, narrated by Abu Musa al-Ash’ari',
  },
  benefits: ['Lean protein', 'B vitamins'],
  artSrc: '/pantry/chicken.webp',
};

export default entry;
