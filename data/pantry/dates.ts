// data/pantry/dates.ts
import type { PantryEntry } from './_types';

const entry: PantryEntry = {
  slug: 'dates',
  name: 'Dates',
  kind: 'fruits & sweetness',
  note: 'The pantry’s built-in dessert. A few with coffee after dinner, and nothing else is needed.',
  prophetic: {
    // Two clauses, two sources. Clause one (seven ajwa dates each morning) is
    // Bukhari 5445, narrated by Sa'd. Clause two is Muslim 2046a, narrated by
    // Aisha, whose wording is positive: a household that has dates will not go
    // hungry. Kept in that direction rather than the draft's negative inversion,
    // which the narration does not actually state.
    note: 'Seven ajwa dates in the morning were his ﷺ counsel, and he said a household that keeps dates will never go hungry.',
    citation: 'Sahih al-Bukhari 5445 (Sa’d ibn Abi Waqqas); Sahih Muslim 2046a (Aisha)',
  },
  benefits: ['High in fibre', 'Potassium', 'Natural quick energy'],
  artSrc: '/pantry/dates.webp',
};

export default entry;
