// data/pantry/lamb.ts
import type { PantryEntry } from './_types';

const entry: PantryEntry = {
  slug: 'lamb',
  name: 'Lamb',
  kind: 'meat & fish',
  note: 'The meat I reach for when a dish should taste like somewhere. It carries cumin and chile like nothing else on the shelf.',
  prophetic: {
    note: 'The shoulder of the sheep was the cut the Prophet ﷺ ate from, cutting a piece from it by hand before he rose to pray.',
    citation: 'Sahih al-Bukhari 5408, narrated by Amr ibn Umayyah',
  },
  benefits: ['Protein', 'Iron', 'Vitamin B12'],
  artSrc: '/pantry/lamb.webp',
};

export default entry;
