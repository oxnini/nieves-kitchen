import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

type MockRecipe = {
  slug: string;
  title: string;
  country: string;
  region: string;
  description: string;
  ingredients: { name: string; amount: number; unit: string }[];
  steps: string[];
  tags: string[];
  image_url: string;
  cook_time: number;
  prep_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'main' | 'dessert' | 'drink' | 'side';
  coordinates: { lat: number; lng: number };
  is_fusion: boolean;
  inspired_by: string[] | null;
  quote: string;
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  flavor_profile: { sweet: number; salty: number; sour: number; bitter: number; umami: number; spicy: number };
};

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80`;

const mocks: MockRecipe[] = [
  // Western Europe
  {
    slug: 'mock-ratatouille',
    title: 'Ratatouille',
    country: 'France',
    region: 'Western Europe',
    description: 'Slow-cooked Provençal vegetable stew.',
    ingredients: [
      { name: 'Aubergine', amount: 1, unit: 'whole' },
      { name: 'Courgette', amount: 2, unit: 'whole' },
      { name: 'Red bell pepper', amount: 1, unit: 'whole' },
      { name: 'Tomatoes', amount: 4, unit: 'whole' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Olive oil', amount: 3, unit: 'tbsp' },
      { name: 'Thyme', amount: 1, unit: 'tsp' },
    ],
    steps: [
      'Dice all vegetables into roughly equal cubes.',
      'Sauté garlic in olive oil, then add peppers and aubergine. Cook 8 minutes.',
      'Add courgette and tomatoes with thyme. Simmer 25 minutes until silky.',
      'Season and serve warm with bread.',
    ],
    tags: ['vegetarian', 'summer'],
    image_url: IMG('photo-1572453800999-e8d2d1589b7c'),
    cook_time: 40, prep_time: 15, servings: 4, difficulty: 'Easy', category: 'main',
    coordinates: { lat: 43.95, lng: 4.80 },
    is_fusion: false, inspired_by: null,
    quote: 'Anyone can cook — but only the fearless can be great.',
    nutrition: { calories: 180, protein: 4, carbs: 20, fat: 10 },
    flavor_profile: { sweet: 3, salty: 4, sour: 3, bitter: 1, umami: 5, spicy: 0 },
  },
  {
    slug: 'mock-pasteis-de-nata',
    title: 'Pastéis de Nata',
    country: 'Portugal',
    region: 'Western Europe',
    description: 'Flaky Portuguese custard tarts.',
    ingredients: [
      { name: 'Puff pastry', amount: 1, unit: 'sheet' },
      { name: 'Egg yolks', amount: 6, unit: 'whole' },
      { name: 'Sugar', amount: 200, unit: 'g' },
      { name: 'Whole milk', amount: 240, unit: 'ml' },
      { name: 'Cinnamon stick', amount: 1, unit: 'whole' },
      { name: 'Lemon peel', amount: 1, unit: 'strip' },
    ],
    steps: [
      'Cut pastry into discs and press into muffin tin.',
      'Heat milk with cinnamon and lemon, whisk into yolks and sugar.',
      'Fill cases and bake at 250°C for 12 minutes until blistered.',
      'Cool slightly, dust with cinnamon.',
    ],
    tags: ['sweet', 'bakery'],
    image_url: IMG('photo-1598233847491-f16487adee2f'),
    cook_time: 15, prep_time: 20, servings: 12, difficulty: 'Medium', category: 'dessert',
    coordinates: { lat: 38.70, lng: -9.18 },
    is_fusion: false, inspired_by: null,
    quote: 'A little burnt top is the whole point.',
    nutrition: { calories: 220, protein: 4, carbs: 28, fat: 10 },
    flavor_profile: { sweet: 8, salty: 1, sour: 1, bitter: 1, umami: 2, spicy: 0 },
  },

  // Eastern Europe
  {
    slug: 'mock-pierogi',
    title: 'Potato & Cheese Pierogi',
    country: 'Poland',
    region: 'Eastern Europe',
    description: 'Soft dumplings filled with potato and farmer cheese.',
    ingredients: [
      { name: 'All-purpose flour', amount: 400, unit: 'g' },
      { name: 'Egg', amount: 1, unit: 'whole' },
      { name: 'Warm water', amount: 180, unit: 'ml' },
      { name: 'Potatoes', amount: 500, unit: 'g' },
      { name: 'Farmer cheese', amount: 200, unit: 'g' },
      { name: 'Butter', amount: 60, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'whole' },
    ],
    steps: [
      'Boil potatoes until tender; mash with cheese and season.',
      'Knead flour, egg, water, and salt into a soft dough. Rest 30 minutes.',
      'Roll thin, cut circles, fill, and seal edges well.',
      'Boil in salted water 3 minutes. Serve with butter and fried onion.',
    ],
    tags: ['comfort', 'vegetarian'],
    image_url: IMG('photo-1619626471854-3c82c65a9c2b'),
    cook_time: 25, prep_time: 60, servings: 4, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 52.23, lng: 21.01 },
    is_fusion: false, inspired_by: null,
    quote: 'Dumplings are patience you can eat.',
    nutrition: { calories: 420, protein: 14, carbs: 62, fat: 12 },
    flavor_profile: { sweet: 2, salty: 5, sour: 1, bitter: 0, umami: 5, spicy: 0 },
  },
  {
    slug: 'mock-goulash',
    title: 'Hungarian Goulash',
    country: 'Hungary',
    region: 'Eastern Europe',
    description: 'Paprika-rich beef stew, the soul of Hungarian cooking.',
    ingredients: [
      { name: 'Beef chuck', amount: 800, unit: 'g' },
      { name: 'Onions', amount: 3, unit: 'whole' },
      { name: 'Sweet paprika', amount: 3, unit: 'tbsp' },
      { name: 'Caraway seeds', amount: 1, unit: 'tsp' },
      { name: 'Tomatoes', amount: 2, unit: 'whole' },
      { name: 'Red pepper', amount: 1, unit: 'whole' },
      { name: 'Beef stock', amount: 750, unit: 'ml' },
    ],
    steps: [
      'Brown beef cubes in batches; set aside.',
      'Soften onions until deep gold, then stir in paprika off the heat.',
      'Return beef with tomato, pepper, caraway, and stock.',
      'Simmer covered 2 hours until tender. Serve with bread or noodles.',
    ],
    tags: ['hearty', 'high-protein'],
    image_url: IMG('photo-1547424450-f0b6e69d1b0f'),
    cook_time: 130, prep_time: 20, servings: 6, difficulty: 'Easy', category: 'main',
    coordinates: { lat: 47.50, lng: 19.04 },
    is_fusion: false, inspired_by: null,
    quote: 'Paprika is not a spice here — it is a mood.',
    nutrition: { calories: 490, protein: 38, carbs: 18, fat: 28 },
    flavor_profile: { sweet: 2, salty: 5, sour: 2, bitter: 1, umami: 8, spicy: 2 },
  },

  // East Asia
  {
    slug: 'mock-mapo-tofu',
    title: 'Mapo Tofu',
    country: 'China',
    region: 'East Asia',
    description: 'Silken tofu in a numbing, spicy Sichuan sauce.',
    ingredients: [
      { name: 'Silken tofu', amount: 400, unit: 'g' },
      { name: 'Pork mince', amount: 150, unit: 'g' },
      { name: 'Doubanjiang', amount: 2, unit: 'tbsp' },
      { name: 'Fermented black beans', amount: 1, unit: 'tbsp' },
      { name: 'Sichuan peppercorns', amount: 1, unit: 'tsp' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Spring onion', amount: 2, unit: 'stalks' },
    ],
    steps: [
      'Cube tofu gently; blanch in salted water and drain.',
      'Fry pork until crisp, then add doubanjiang, garlic, and black beans.',
      'Add stock, slide in tofu, simmer 5 minutes, thicken with slurry.',
      'Finish with toasted, crushed Sichuan peppercorns and spring onion.',
    ],
    tags: ['spicy', 'quick'],
    image_url: IMG('photo-1569718212165-3a8278d5f624'),
    cook_time: 15, prep_time: 10, servings: 3, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 30.67, lng: 104.06 },
    is_fusion: false, inspired_by: null,
    quote: 'Málà — the hum you feel after the first bite.',
    nutrition: { calories: 380, protein: 24, carbs: 10, fat: 26 },
    flavor_profile: { sweet: 1, salty: 7, sour: 1, bitter: 2, umami: 9, spicy: 8 },
  },
  {
    slug: 'mock-beef-noodle-soup',
    title: 'Taiwanese Beef Noodle Soup',
    country: 'Taiwan',
    region: 'East Asia',
    description: 'Deep, spiced broth with hand-pulled noodles and tender shin.',
    ingredients: [
      { name: 'Beef shin', amount: 800, unit: 'g' },
      { name: 'Wheat noodles', amount: 400, unit: 'g' },
      { name: 'Doubanjiang', amount: 2, unit: 'tbsp' },
      { name: 'Star anise', amount: 2, unit: 'whole' },
      { name: 'Soy sauce', amount: 80, unit: 'ml' },
      { name: 'Ginger', amount: 30, unit: 'g' },
      { name: 'Bok choy', amount: 2, unit: 'whole' },
    ],
    steps: [
      'Blanch beef, then sear with aromatics and doubanjiang.',
      'Add soy, spices, and water. Simmer 2 hours until spoon-tender.',
      'Cook noodles separately and blanch bok choy.',
      'Assemble bowls with broth, beef, noodles, and greens.',
    ],
    tags: ['soup', 'hearty'],
    image_url: IMG('photo-1552611052-33e04de081de'),
    cook_time: 140, prep_time: 15, servings: 4, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 25.03, lng: 121.57 },
    is_fusion: false, inspired_by: null,
    quote: 'The broth is the recipe.',
    nutrition: { calories: 560, protein: 42, carbs: 58, fat: 18 },
    flavor_profile: { sweet: 2, salty: 7, sour: 1, bitter: 1, umami: 9, spicy: 4 },
  },

  // East Asia (Japan & Korea)
  {
    slug: 'mock-okonomiyaki',
    title: 'Okonomiyaki',
    country: 'Japan',
    region: 'East Asia',
    description: 'Osaka-style savoury cabbage pancake.',
    ingredients: [
      { name: 'Cabbage', amount: 300, unit: 'g' },
      { name: 'Flour', amount: 150, unit: 'g' },
      { name: 'Eggs', amount: 2, unit: 'whole' },
      { name: 'Dashi', amount: 150, unit: 'ml' },
      { name: 'Pork belly slices', amount: 120, unit: 'g' },
      { name: 'Okonomi sauce', amount: 3, unit: 'tbsp' },
      { name: 'Kewpie mayo', amount: 2, unit: 'tbsp' },
    ],
    steps: [
      'Shred cabbage finely. Whisk flour, egg, and dashi into a batter.',
      'Fold cabbage through; shape into thick rounds on a hot griddle.',
      'Lay pork on top, flip, and cook until cabbage is sweet and tender.',
      'Drizzle sauce, mayo, bonito, and aonori.',
    ],
    tags: ['street-food', 'savory'],
    image_url: IMG('photo-1617196034796-73dfa7b1fd56'),
    cook_time: 20, prep_time: 10, servings: 2, difficulty: 'Easy', category: 'main',
    coordinates: { lat: 34.69, lng: 135.50 },
    is_fusion: false, inspired_by: null,
    quote: '"As you like it" — okonomi literally means your call.',
    nutrition: { calories: 520, protein: 22, carbs: 48, fat: 26 },
    flavor_profile: { sweet: 3, salty: 6, sour: 1, bitter: 0, umami: 8, spicy: 0 },
  },
  {
    slug: 'mock-bibimbap',
    title: 'Bibimbap',
    country: 'South Korea',
    region: 'East Asia',
    description: 'Rice bowl layered with seasoned vegetables, beef, and gochujang.',
    ingredients: [
      { name: 'Short-grain rice', amount: 300, unit: 'g' },
      { name: 'Beef mince', amount: 200, unit: 'g' },
      { name: 'Spinach', amount: 100, unit: 'g' },
      { name: 'Bean sprouts', amount: 100, unit: 'g' },
      { name: 'Carrot', amount: 1, unit: 'whole' },
      { name: 'Gochujang', amount: 2, unit: 'tbsp' },
      { name: 'Eggs', amount: 2, unit: 'whole' },
    ],
    steps: [
      'Season beef with soy, garlic, sesame and brown quickly.',
      'Blanch spinach and sprouts; julienne and sauté carrot.',
      'Plate rice, arrange vegetables and beef in sections, top with fried egg.',
      'Serve gochujang on the side to mix at the table.',
    ],
    tags: ['balanced', 'high-protein'],
    image_url: IMG('photo-1498654896293-37aacf113fd9'),
    cook_time: 25, prep_time: 20, servings: 2, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 37.57, lng: 126.98 },
    is_fusion: false, inspired_by: null,
    quote: 'Every bite a new combination.',
    nutrition: { calories: 610, protein: 32, carbs: 72, fat: 22 },
    flavor_profile: { sweet: 3, salty: 6, sour: 1, bitter: 1, umami: 7, spicy: 4 },
  },

  // Southeast Asia
  {
    slug: 'mock-pho-bo',
    title: 'Phở Bò',
    country: 'Vietnam',
    region: 'Southeast Asia',
    description: 'Clear, fragrant beef noodle soup scented with star anise and cinnamon.',
    ingredients: [
      { name: 'Beef bones', amount: 1.5, unit: 'kg' },
      { name: 'Beef brisket', amount: 500, unit: 'g' },
      { name: 'Rice noodles', amount: 400, unit: 'g' },
      { name: 'Star anise', amount: 4, unit: 'whole' },
      { name: 'Cinnamon stick', amount: 1, unit: 'whole' },
      { name: 'Ginger', amount: 60, unit: 'g' },
      { name: 'Fish sauce', amount: 3, unit: 'tbsp' },
    ],
    steps: [
      'Char onion and ginger over a flame until fragrant.',
      'Parboil bones, rinse, then simmer 3 hours with charred aromatics and spices.',
      'Season broth with fish sauce and rock sugar; slice brisket thin.',
      'Serve over noodles with herbs, chili, and lime.',
    ],
    tags: ['soup', 'fragrant'],
    image_url: IMG('photo-1555126634-323283e090fa'),
    cook_time: 180, prep_time: 30, servings: 6, difficulty: 'Hard', category: 'main',
    coordinates: { lat: 21.03, lng: 105.85 },
    is_fusion: false, inspired_by: null,
    quote: 'A bowl of phở is breakfast, lunch, and a hug.',
    nutrition: { calories: 480, protein: 32, carbs: 60, fat: 12 },
    flavor_profile: { sweet: 2, salty: 6, sour: 2, bitter: 1, umami: 8, spicy: 2 },
  },
  {
    slug: 'mock-rendang',
    title: 'Beef Rendang',
    country: 'Indonesia',
    region: 'Southeast Asia',
    description: 'Slow-cooked dry curry from West Sumatra, deeply spiced.',
    ingredients: [
      { name: 'Beef chuck', amount: 1, unit: 'kg' },
      { name: 'Coconut milk', amount: 800, unit: 'ml' },
      { name: 'Shallots', amount: 8, unit: 'whole' },
      { name: 'Garlic', amount: 6, unit: 'cloves' },
      { name: 'Ginger', amount: 40, unit: 'g' },
      { name: 'Galangal', amount: 40, unit: 'g' },
      { name: 'Dried chilies', amount: 10, unit: 'whole' },
    ],
    steps: [
      'Blitz shallots, garlic, ginger, galangal, and chilies into a paste.',
      'Fry paste in oil until fragrant, then add beef and coconut milk.',
      'Simmer uncovered 2 hours, stirring often, until oil separates.',
      'Keep cooking until meat is dark and dry-coated in spice.',
    ],
    tags: ['spicy', 'slow-cooked'],
    image_url: IMG('photo-1631292784640-2b24be784d5d'),
    cook_time: 180, prep_time: 20, servings: 6, difficulty: 'Hard', category: 'main',
    coordinates: { lat: -0.95, lng: 100.35 },
    is_fusion: false, inspired_by: null,
    quote: 'Patience is the final spice.',
    nutrition: { calories: 620, protein: 38, carbs: 10, fat: 48 },
    flavor_profile: { sweet: 2, salty: 5, sour: 1, bitter: 1, umami: 8, spicy: 7 },
  },

  // South Asia
  {
    slug: 'mock-chole-bhature',
    title: 'Chole Bhature',
    country: 'India',
    region: 'South Asia',
    description: 'Spiced chickpea curry with fluffy fried bread.',
    ingredients: [
      { name: 'Chickpeas (dried)', amount: 250, unit: 'g' },
      { name: 'Onions', amount: 2, unit: 'whole' },
      { name: 'Tomatoes', amount: 3, unit: 'whole' },
      { name: 'Garam masala', amount: 2, unit: 'tsp' },
      { name: 'Amchur', amount: 1, unit: 'tsp' },
      { name: 'All-purpose flour', amount: 300, unit: 'g' },
      { name: 'Yogurt', amount: 100, unit: 'g' },
    ],
    steps: [
      'Soak chickpeas overnight; pressure cook with tea bag for color.',
      'Build masala with onion, tomato, garlic-ginger and spices.',
      'Combine with chickpeas; simmer until thick.',
      'Knead dough with yogurt, rest, roll, and deep-fry bhature until puffed.',
    ],
    tags: ['street-food', 'vegetarian'],
    image_url: IMG('photo-1585937421612-70a008356fbe'),
    cook_time: 60, prep_time: 30, servings: 4, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 28.70, lng: 77.10 },
    is_fusion: false, inspired_by: null,
    quote: 'Sunday brunch, Delhi-style.',
    nutrition: { calories: 640, protein: 22, carbs: 92, fat: 20 },
    flavor_profile: { sweet: 2, salty: 5, sour: 3, bitter: 1, umami: 6, spicy: 5 },
  },
  {
    slug: 'mock-kottu-roti',
    title: 'Kottu Roti',
    country: 'Sri Lanka',
    region: 'South Asia',
    description: 'Chopped flatbread stir-fried with egg, vegetables, and curry.',
    ingredients: [
      { name: 'Godamba roti', amount: 4, unit: 'whole' },
      { name: 'Chicken curry', amount: 300, unit: 'g' },
      { name: 'Leek', amount: 1, unit: 'whole' },
      { name: 'Carrot', amount: 1, unit: 'whole' },
      { name: 'Eggs', amount: 2, unit: 'whole' },
      { name: 'Green chili', amount: 2, unit: 'whole' },
      { name: 'Curry leaves', amount: 1, unit: 'sprig' },
    ],
    steps: [
      'Chop roti into thin strips.',
      'Stir-fry leek, carrot, chili, and curry leaves in hot oil.',
      'Scramble eggs, then toss in roti and curry meat with sauce.',
      'Chop rhythmically on the griddle for 2 minutes before serving.',
    ],
    tags: ['street-food', 'quick'],
    image_url: IMG('photo-1625944525533-473f1e3d2d40'),
    cook_time: 15, prep_time: 15, servings: 2, difficulty: 'Easy', category: 'main',
    coordinates: { lat: 6.93, lng: 79.85 },
    is_fusion: false, inspired_by: null,
    quote: 'You hear kottu before you taste it.',
    nutrition: { calories: 580, protein: 26, carbs: 64, fat: 24 },
    flavor_profile: { sweet: 1, salty: 6, sour: 2, bitter: 1, umami: 7, spicy: 5 },
  },

  // Middle East
  {
    slug: 'mock-fattoush',
    title: 'Fattoush',
    country: 'Lebanon',
    region: 'Middle East',
    description: 'Bright Levantine salad with sumac and crisp pita.',
    ingredients: [
      { name: 'Pita bread', amount: 2, unit: 'whole' },
      { name: 'Romaine lettuce', amount: 1, unit: 'head' },
      { name: 'Cucumber', amount: 1, unit: 'whole' },
      { name: 'Tomatoes', amount: 3, unit: 'whole' },
      { name: 'Radish', amount: 4, unit: 'whole' },
      { name: 'Sumac', amount: 1, unit: 'tbsp' },
      { name: 'Pomegranate molasses', amount: 1, unit: 'tbsp' },
    ],
    steps: [
      'Toast pita until golden and snap into shards.',
      'Chop vegetables into bite-sized pieces.',
      'Whisk olive oil, lemon, sumac, and pomegranate molasses.',
      'Toss everything just before serving so pita stays crunchy.',
    ],
    tags: ['fresh', 'vegetarian'],
    image_url: IMG('photo-1540189549336-e6e99c3679fe'),
    cook_time: 5, prep_time: 15, servings: 4, difficulty: 'Easy', category: 'side',
    coordinates: { lat: 33.89, lng: 35.50 },
    is_fusion: false, inspired_by: null,
    quote: 'Sumac turns every summer into Beirut.',
    nutrition: { calories: 210, protein: 6, carbs: 28, fat: 9 },
    flavor_profile: { sweet: 2, salty: 3, sour: 7, bitter: 2, umami: 3, spicy: 0 },
  },
  {
    slug: 'mock-ghormeh-sabzi',
    title: 'Ghormeh Sabzi',
    country: 'Iran',
    region: 'Middle East',
    description: 'Persian herb stew with lamb, kidney beans, and dried lime.',
    ingredients: [
      { name: 'Lamb shoulder', amount: 600, unit: 'g' },
      { name: 'Parsley', amount: 200, unit: 'g' },
      { name: 'Cilantro', amount: 100, unit: 'g' },
      { name: 'Fenugreek leaves', amount: 30, unit: 'g' },
      { name: 'Kidney beans', amount: 200, unit: 'g' },
      { name: 'Dried limes', amount: 4, unit: 'whole' },
      { name: 'Turmeric', amount: 1, unit: 'tsp' },
    ],
    steps: [
      'Finely chop herbs; sauté slowly in oil until very dark green.',
      'Brown onions and lamb with turmeric, then add pierced dried limes.',
      'Combine with herbs, beans, and water; simmer 2 hours.',
      'Serve over saffron basmati rice.',
    ],
    tags: ['stew', 'herb-forward'],
    image_url: IMG('photo-1604329760661-e71dc83f8f26'),
    cook_time: 130, prep_time: 25, servings: 5, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 35.70, lng: 51.42 },
    is_fusion: false, inspired_by: null,
    quote: 'The greener the stew, the better the cook.',
    nutrition: { calories: 520, protein: 36, carbs: 24, fat: 30 },
    flavor_profile: { sweet: 1, salty: 5, sour: 4, bitter: 3, umami: 7, spicy: 1 },
  },

  // North Africa
  {
    slug: 'mock-tagine',
    title: 'Chicken Tagine with Preserved Lemon',
    country: 'Morocco',
    region: 'North Africa',
    description: 'Slow-braised chicken with olives, preserved lemon, and saffron.',
    ingredients: [
      { name: 'Chicken thighs', amount: 1, unit: 'kg' },
      { name: 'Onion', amount: 2, unit: 'whole' },
      { name: 'Preserved lemon', amount: 1, unit: 'whole' },
      { name: 'Green olives', amount: 150, unit: 'g' },
      { name: 'Saffron', amount: 1, unit: 'pinch' },
      { name: 'Ginger', amount: 1, unit: 'tsp' },
      { name: 'Cilantro', amount: 1, unit: 'bunch' },
    ],
    steps: [
      'Marinate chicken with saffron, ginger, garlic, and olive oil.',
      'Layer onions in a tagine, nestle chicken on top, add preserved lemon.',
      'Cover and cook gently 45 minutes without stirring.',
      'Scatter olives and cilantro to finish.',
    ],
    tags: ['aromatic', 'one-pot'],
    image_url: IMG('photo-1535648530671-ff37f0d01dd9'),
    cook_time: 55, prep_time: 20, servings: 4, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 31.63, lng: -7.99 },
    is_fusion: false, inspired_by: null,
    quote: 'The tagine steams its own secrets.',
    nutrition: { calories: 480, protein: 38, carbs: 12, fat: 30 },
    flavor_profile: { sweet: 2, salty: 6, sour: 4, bitter: 1, umami: 7, spicy: 1 },
  },
  {
    slug: 'mock-koshari',
    title: 'Koshari',
    country: 'Egypt',
    region: 'North Africa',
    description: 'Egypt\'s national stacked bowl of rice, lentils, pasta, and tomato sauce.',
    ingredients: [
      { name: 'Rice', amount: 200, unit: 'g' },
      { name: 'Brown lentils', amount: 150, unit: 'g' },
      { name: 'Macaroni', amount: 150, unit: 'g' },
      { name: 'Chickpeas (cooked)', amount: 200, unit: 'g' },
      { name: 'Tomato passata', amount: 400, unit: 'g' },
      { name: 'Garlic', amount: 4, unit: 'cloves' },
      { name: 'Onions', amount: 2, unit: 'whole' },
    ],
    steps: [
      'Fry sliced onions until dark and crisp; reserve.',
      'Cook lentils, rice, and pasta separately.',
      'Make tomato sauce with garlic, vinegar, and chili.',
      'Layer everything; top with sauce, chickpeas, and crispy onions.',
    ],
    tags: ['vegetarian', 'budget'],
    image_url: IMG('photo-1540189549336-e6e99c3679fe'),
    cook_time: 40, prep_time: 15, servings: 4, difficulty: 'Easy', category: 'main',
    coordinates: { lat: 30.05, lng: 31.23 },
    is_fusion: false, inspired_by: null,
    quote: 'Four starches, one soul.',
    nutrition: { calories: 590, protein: 22, carbs: 108, fat: 8 },
    flavor_profile: { sweet: 2, salty: 5, sour: 3, bitter: 1, umami: 6, spicy: 2 },
  },

  // Sub-Saharan Africa
  {
    slug: 'mock-bobotie',
    title: 'Bobotie',
    country: 'South Africa',
    region: 'Sub-Saharan Africa',
    description: 'Spiced minced beef baked under a savoury egg custard.',
    ingredients: [
      { name: 'Beef mince', amount: 700, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'whole' },
      { name: 'Curry powder', amount: 2, unit: 'tbsp' },
      { name: 'Bread', amount: 2, unit: 'slices' },
      { name: 'Milk', amount: 300, unit: 'ml' },
      { name: 'Eggs', amount: 2, unit: 'whole' },
      { name: 'Apricot jam', amount: 2, unit: 'tbsp' },
      { name: 'Bay leaves', amount: 4, unit: 'whole' },
    ],
    steps: [
      'Sauté onion, add beef, curry powder, jam, vinegar, and soaked bread.',
      'Press into a dish and tuck bay leaves on top.',
      'Whisk eggs with remaining milk; pour over.',
      'Bake at 180°C for 30 minutes until golden and set.',
    ],
    tags: ['comfort', 'aromatic'],
    image_url: IMG('photo-1551782450-a2132b4ba21d'),
    cook_time: 40, prep_time: 20, servings: 5, difficulty: 'Easy', category: 'main',
    coordinates: { lat: -33.92, lng: 18.42 },
    is_fusion: false, inspired_by: null,
    quote: 'Cape Malay in one dish.',
    nutrition: { calories: 520, protein: 30, carbs: 22, fat: 34 },
    flavor_profile: { sweet: 4, salty: 5, sour: 2, bitter: 0, umami: 7, spicy: 2 },
  },
  {
    slug: 'mock-doro-wat',
    title: 'Doro Wat',
    country: 'Ethiopia',
    region: 'Sub-Saharan Africa',
    description: 'Deeply spiced chicken stew with berbere and slow-cooked onions.',
    ingredients: [
      { name: 'Chicken legs', amount: 6, unit: 'whole' },
      { name: 'Red onions', amount: 4, unit: 'whole' },
      { name: 'Berbere', amount: 3, unit: 'tbsp' },
      { name: 'Niter kibbeh', amount: 3, unit: 'tbsp' },
      { name: 'Garlic', amount: 5, unit: 'cloves' },
      { name: 'Ginger', amount: 30, unit: 'g' },
      { name: 'Hard-boiled eggs', amount: 4, unit: 'whole' },
    ],
    steps: [
      'Cook onions low and slow, dry, for 45 minutes until jammy.',
      'Add niter kibbeh, berbere, garlic, and ginger; bloom the spices.',
      'Add chicken and water; simmer 40 minutes.',
      'Fold in scored boiled eggs; serve with injera.',
    ],
    tags: ['spicy', 'slow-cooked'],
    image_url: IMG('photo-1604908176997-125f25cc6f3d'),
    cook_time: 90, prep_time: 20, servings: 6, difficulty: 'Medium', category: 'main',
    coordinates: { lat: 9.03, lng: 38.74 },
    is_fusion: false, inspired_by: null,
    quote: 'Eat it with your hands; the injera is the spoon.',
    nutrition: { calories: 540, protein: 42, carbs: 14, fat: 34 },
    flavor_profile: { sweet: 1, salty: 5, sour: 1, bitter: 2, umami: 8, spicy: 7 },
  },

  // North America
  {
    slug: 'mock-mole-poblano',
    title: 'Mole Poblano',
    country: 'Mexico',
    region: 'North America',
    description: 'Complex chili and chocolate sauce served over turkey or chicken.',
    ingredients: [
      { name: 'Chicken', amount: 1.5, unit: 'kg' },
      { name: 'Dried ancho chilies', amount: 4, unit: 'whole' },
      { name: 'Dried mulato chilies', amount: 3, unit: 'whole' },
      { name: 'Dark chocolate', amount: 40, unit: 'g' },
      { name: 'Toasted almonds', amount: 50, unit: 'g' },
      { name: 'Sesame seeds', amount: 2, unit: 'tbsp' },
      { name: 'Tomatoes', amount: 2, unit: 'whole' },
    ],
    steps: [
      'Toast chilies, seeds, and nuts separately, then soak chilies.',
      'Blend everything with tomatoes, stock, and a cinnamon pinch.',
      'Fry the paste in lard 10 minutes, then add stock to a silky sauce.',
      'Poach chicken; bathe in mole and finish with sesame.',
    ],
    tags: ['festive', 'complex'],
    image_url: IMG('photo-1599974579688-8dbdd335c77f'),
    cook_time: 90, prep_time: 40, servings: 6, difficulty: 'Hard', category: 'main',
    coordinates: { lat: 19.04, lng: -98.20 },
    is_fusion: false, inspired_by: null,
    quote: 'Thirty ingredients. One afternoon. One legend.',
    nutrition: { calories: 640, protein: 44, carbs: 22, fat: 38 },
    flavor_profile: { sweet: 3, salty: 5, sour: 2, bitter: 4, umami: 7, spicy: 5 },
  },
  {
    slug: 'mock-lomo-saltado',
    title: 'Lomo Saltado',
    country: 'Peru',
    region: 'South America',
    description: 'Chifa stir-fry of beef, tomato, onion, and chilies, served with fries and rice.',
    ingredients: [
      { name: 'Beef sirloin', amount: 500, unit: 'g' },
      { name: 'Red onion', amount: 1, unit: 'whole' },
      { name: 'Tomatoes', amount: 2, unit: 'whole' },
      { name: 'Ají amarillo', amount: 1, unit: 'whole' },
      { name: 'Soy sauce', amount: 3, unit: 'tbsp' },
      { name: 'Potato fries', amount: 300, unit: 'g' },
      { name: 'Rice (cooked)', amount: 400, unit: 'g' },
    ],
    steps: [
      'Sear beef strips in a very hot wok.',
      'Add onion, tomato wedges, and ají; toss briefly.',
      'Deglaze with soy sauce and a splash of vinegar.',
      'Fold in crisp fries off the heat; plate with rice.',
    ],
    tags: ['fusion', 'quick'],
    image_url: IMG('photo-1585238342029-2b7a8f3b62a1'),
    cook_time: 15, prep_time: 15, servings: 3, difficulty: 'Easy', category: 'main',
    coordinates: { lat: -12.05, lng: -77.04 },
    is_fusion: true, inspired_by: ['Peruvian', 'Chinese'],
    quote: 'Chifa: where Canton met the Andes.',
    nutrition: { calories: 680, protein: 40, carbs: 72, fat: 26 },
    flavor_profile: { sweet: 2, salty: 7, sour: 2, bitter: 1, umami: 8, spicy: 3 },
  },
];

async function main() {
  const { error, data } = await supabase
    .from('recipes')
    .upsert(mocks, { onConflict: 'slug' })
    .select('slug');

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} mock recipes.`);
  console.log('To remove them later: delete from recipes where slug like \'mock-%\';');
}

main();
