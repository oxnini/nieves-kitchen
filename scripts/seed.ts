import { createClient } from '@supabase/supabase-js';
import { recipes } from '../src/data/recipes';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const rows = recipes.map(r => ({
  slug:           r.id,
  title:          r.name,
  country:        r.country,
  region:         r.region,
  description:    null,
  ingredients:    r.ingredients,
  steps:          r.instructions,
  tags:           r.tags,
  image_url:      r.image,
  cook_time:      r.cookTime,
  prep_time:      r.prepTime,
  servings:       r.servings,
  difficulty:     r.difficulty,
  category:       r.category,
  coordinates:    r.coordinates,
  is_fusion:      r.isFusion,
  inspired_by:    r.inspiredBy ?? null,
  quote:          r.quote,
  nutrition:      r.nutrition,
  flavor_profile: r.flavorProfile,
}));

const { error } = await supabase.from('recipes').insert(rows);
if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} recipes successfully.`);
