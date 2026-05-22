import type { Recipe, CulinaryRegion } from './types';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';

function mock(
  id: string, name: string, country: string, region: CulinaryRegion,
  lat: number, lng: number, category: Recipe['category'] = 'main',
): Recipe {
  return {
    id, name, country, region,
    coordinates: { lat, lng },
    category,
    tags: ['mock'],
    isFusion: false,
    quote: 'A mock recipe for testing.',
    image: PLACEHOLDER_IMG,
    time: { active: 15, total: 45, resting: 0 },
    servings: 4,
    difficulty: 'Easy',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    ingredients: [{ items: [{ name: 'Ingredient', amount: 1, unit: 'cup' }] }],
    instructions: [{ items: ['Cook the thing.'] }],
    nutrition: { calories: 400, protein: 20, carbs: 40, fat: 15 },
    flavorProfile: { sweet: 3, salty: 5, sour: 2, bitter: 1, umami: 4, spicy: 2 },
  };
}

/**
 * ~50 mock recipes spread across continents/regions/countries
 * with deliberate count variation for choropleth testing.
 *
 * Distribution:
 *   Europe (20): Western Europe 12, Eastern Europe 8
 *   Asia (18):   East Asia 9, Southeast Asia 5, South Asia 2, Middle East 2
 *   Africa (5):  North Africa 3, Sub-Saharan Africa 2
 *   N. America (3), S. America (3)
 */
export const MOCK_RECIPES: Recipe[] = [
  // ── Western Europe (12) ──────────────────────────────
  // France (4)
  mock('mock-croissant',       'Croissant',         'France', 'Western Europe', 48.86,  2.35, 'dessert'),
  mock('mock-ratatouille',     'Ratatouille',       'France', 'Western Europe', 43.70,  7.27),
  mock('mock-coq-au-vin',      'Coq au Vin',        'France', 'Western Europe', 47.32,  5.04),
  mock('mock-quiche-lorraine', 'Quiche Lorraine',   'France', 'Western Europe', 48.69,  6.18),
  // Italy (3)
  mock('mock-carbonara',       'Carbonara',         'Italy', 'Western Europe', 41.90, 12.50),
  mock('mock-risotto',         'Risotto alla Milanese','Italy','Western Europe', 45.46,  9.19),
  mock('mock-tiramisu',        'Tiramisu',          'Italy', 'Western Europe', 45.44, 12.33, 'dessert'),
  // Spain (3)
  mock('mock-paella',          'Paella',            'Spain', 'Western Europe', 39.47, -0.38),
  mock('mock-gazpacho',        'Gazpacho',          'Spain', 'Western Europe', 37.39, -5.99, 'side'),
  mock('mock-churros',         'Churros',           'Spain', 'Western Europe', 40.42, -3.70, 'dessert'),
  // Germany (2)
  mock('mock-schnitzel',       'Wiener Schnitzel',  'Germany', 'Western Europe', 48.14, 11.58),
  mock('mock-brezel',          'Brezel',            'Germany', 'Western Europe', 48.78,  9.18, 'side'),

  // ── Eastern Europe (8) ──────────────────────────────
  // Greece (3)
  mock('mock-moussaka',        'Moussaka',          'Greece', 'Eastern Europe', 37.98, 23.73),
  mock('mock-souvlaki',        'Souvlaki',          'Greece', 'Eastern Europe', 35.34, 25.13),
  mock('mock-spanakopita',     'Spanakopita',       'Greece', 'Eastern Europe', 39.64, 19.92, 'side'),
  // Poland (2)
  mock('mock-pierogi',         'Pierogi',           'Poland', 'Eastern Europe', 52.23, 21.01),
  mock('mock-bigos',           'Bigos',             'Poland', 'Eastern Europe', 50.06, 19.94),
  // Turkey (2)
  mock('mock-kebab',           'Adana Kebab',       'Turkey', 'Eastern Europe', 37.00, 35.32),
  mock('mock-baklava',         'Baklava',           'Turkey', 'Eastern Europe', 41.01, 28.98, 'dessert'),
  // Romania (1)
  mock('mock-sarmale',         'Sarmale',           'Romania', 'Eastern Europe', 44.43, 26.10),

  // ── East Asia (9) ──────────────────────────────
  // China (3)
  mock('mock-kung-pao',        'Kung Pao Chicken',  'China', 'East Asia', 30.57, 104.07),
  mock('mock-mapo-tofu',       'Mapo Tofu',         'China', 'East Asia', 29.57, 106.55),
  mock('mock-dim-sum',         'Dim Sum',           'China', 'East Asia', 22.32, 114.17),
  // Japan (3)
  mock('mock-ramen',           'Tonkotsu Ramen',    'Japan', 'East Asia', 33.59, 130.40),
  mock('mock-sushi',           'Nigiri Sushi',      'Japan', 'East Asia', 35.68, 139.69),
  mock('mock-tempura',         'Tempura',           'Japan', 'East Asia', 34.69, 135.50),
  // South Korea (2)
  mock('mock-bibimbap',        'Bibimbap',          'South Korea', 'East Asia', 37.57, 126.98),
  mock('mock-kimchi-jjigae',   'Kimchi Jjigae',     'South Korea', 'East Asia', 35.18, 129.08),
  // Mongolia (1)
  mock('mock-buuz',            'Buuz',              'Mongolia', 'East Asia', 47.92, 106.91),

  // ── Southeast Asia (5) ──────────────────────────────
  // Thailand (3)
  mock('mock-pad-thai',        'Pad Thai',          'Thailand', 'Southeast Asia', 13.76, 100.50),
  mock('mock-green-curry',     'Green Curry',       'Thailand', 'Southeast Asia', 18.79, 98.98),
  mock('mock-tom-yum',         'Tom Yum Goong',     'Thailand', 'Southeast Asia', 7.88,  98.39),
  // Vietnam (2)
  mock('mock-pho',             'Pho Bo',            'Vietnam', 'Southeast Asia', 21.03, 105.85),
  mock('mock-banh-mi',         'Banh Mi',           'Vietnam', 'Southeast Asia', 10.82, 106.63),

  // ── South Asia (2) ──────────────────────────────
  // India (2)
  mock('mock-butter-chicken',  'Butter Chicken',    'India', 'South Asia', 28.61, 77.21),
  mock('mock-dosa',            'Masala Dosa',       'India', 'South Asia', 12.97, 77.59),

  // ── Middle East (2) ──────────────────────────────
  mock('mock-kibbeh',          'Kibbeh',            'Lebanon', 'Middle East', 33.89, 35.50),
  mock('mock-ghormeh-sabzi',   'Ghormeh Sabzi',     'Iran', 'Middle East', 35.69, 51.39),

  // ── Rich seed: every Phase 2 field populated. Visual harness for the read view. ──
  {
    id: 'mock-rich-fatayer',
    name: 'Spinach Fatayer',
    country: 'Lebanon',
    region: 'Middle East',
    coordinates: { lat: 33.89, lng: 35.50 },
    category: 'main',
    tags: ['vegetarian', 'meal-prep friendly', 'weekend feast'],
    isFusion: false,
    inspiredBy: ['Lebanese village cooking'],
    quote: 'Folded, pinched, and crisped to bronze, these little parcels carry the perfume of sumac and the bite of citrus.',
    description: 'Fatayer are the small folded pies of the Lebanese pantry, dough pulled thin around a filling of spinach, onion, and sumac. The trick is the salt-and-drain on the spinach, which keeps the pies from steaming open in the oven. Make them on a quiet afternoon. They keep well, travel well, and reheat into a school lunch with no complaint.',
    attribution: 'Adapted from a recipe by Sirine Jamal al-Dine, Beirut, 1962.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80',
    time: { active: 45, total: 135, resting: 60 },
    yieldText: '24 small triangles',
    servings: 6,
    difficulty: 'Medium',
    equipment: ['Stand mixer (optional)', 'Fine-mesh sieve', 'Rolling pin', 'Sheet pan'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    isDairyFree: true,
    ingredients: [
      {
        heading: 'For the dough',
        items: [
          { name: 'all-purpose flour', amount: 3, unit: 'cup', metricAmount: 420, metricUnit: 'g' },
          { name: 'instant yeast', amount: 1, unit: 'tsp', metricAmount: 4, metricUnit: 'g' },
          { name: 'sugar', amount: 1, unit: 'tsp', metricAmount: 4, metricUnit: 'g' },
          { name: 'fine sea salt', amount: 1, unit: 'tsp', metricAmount: 6, metricUnit: 'g' },
          { name: 'warm water', amount: 1, unit: 'cup', metricAmount: 240, metricUnit: 'ml' },
          { name: 'olive oil, plus more for the bowl', amount: 3, unit: 'tbsp', metricAmount: 45, metricUnit: 'ml' },
        ],
      },
      {
        heading: 'For the filling',
        items: [
          { name: 'fresh spinach, chopped', amount: 1, unit: 'lb', metricAmount: 450, metricUnit: 'g' },
          { name: 'kosher salt, for drawing water', amount: 2, unit: 'tsp', metricAmount: 10, metricUnit: 'g' },
          { name: 'small yellow onion, finely diced', amount: 1, unit: 'whole' },
          { name: 'sumac', amount: 2, unit: 'tbsp', metricAmount: 14, metricUnit: 'g' },
          { name: 'lemon juice', amount: 3, unit: 'tbsp', metricAmount: 45, metricUnit: 'ml' },
          { name: 'extra-virgin olive oil', amount: 3, unit: 'tbsp', metricAmount: 45, metricUnit: 'ml' },
          { name: 'pine nuts, lightly toasted', amount: 0.25, unit: 'cup', metricAmount: 30, metricUnit: 'g' },
          { name: 'black pepper, to taste', amount: 0.5, unit: 'tsp', metricAmount: 1, metricUnit: 'g' },
        ],
      },
      {
        heading: 'To finish',
        items: [
          { name: 'olive oil, for brushing', amount: 2, unit: 'tbsp', metricAmount: 30, metricUnit: 'ml' },
          { name: 'lemon wedges, to serve', amount: 6, unit: 'whole' },
        ],
      },
    ],
    instructions: [
      {
        heading: 'Make the dough',
        headnote: 'A wetter dough than you think you want. It tightens as it rests.',
        items: [
          'Whisk flour, yeast, sugar, and salt in a large bowl until evenly distributed.',
          'Pour in the warm water and olive oil. Stir with a wooden spoon until a shaggy mass forms, then knead in the bowl for 8 minutes until smooth and slightly tacky.',
          'Oil the bowl, turn the dough to coat, cover, and rest for 1 hour at room temperature until nearly doubled.',
        ],
      },
      {
        heading: 'Make the filling',
        items: [
          'Toss the chopped spinach with the kosher salt in a colander set over a bowl. Let stand 20 minutes to draw out the water, then squeeze the spinach hard in a clean towel until almost dry.',
          'In a bowl, combine the squeezed spinach, onion, sumac, lemon juice, olive oil, pine nuts, and black pepper. Taste and adjust for tartness; it should be brightly sour.',
        ],
      },
      {
        heading: 'Shape and bake',
        headnote: 'Pinch the seams firmly. A loose triangle steams open and weeps oil across the tray.',
        items: [
          'Heat the oven to 200°C / 400°F. Line a sheet pan with parchment.',
          'Divide the dough into 24 walnut-sized balls. On a lightly floured surface, roll each into a 10 cm round.',
          'Place a heaping tablespoon of filling in the centre of each round. Lift three sides up to meet in the middle, pinching firmly into a three-pointed star.',
          'Arrange on the sheet pan with space between, brush lightly with olive oil, and bake for 18-22 minutes until the dough is bronzed and the seams are still sealed.',
          'Rest 5 minutes before serving, with lemon wedges on the side.',
        ],
      },
    ],
    headnoteIngredients: 'Use a sumac that is deep maroon and lightly tart on its own. If it smells of nothing, it has aged out.',
    headnoteInstructions: 'Work in a relaxed rhythm: dough rests, filling drains, you do not need to rush either step.',
    nutrition: { calories: 310, protein: 8, carbs: 38, fat: 14 },
    flavorProfile: { sweet: 1, salty: 4, sour: 5, bitter: 2, umami: 3, spicy: 1 },
    tips: [
      'Squeeze the spinach until you think it is dry, then squeeze again. The filling should hold a shape when pressed.',
      'If the dough resists rolling, let it rest another five minutes. Gluten relaxes faster than you think.',
    ],
    substitutions: [
      'Swiss chard or beet greens stand in for spinach with no other changes; both want the same salt-and-drain treatment.',
      'Pomegranate molasses can replace lemon juice for a deeper, less bright tartness.',
    ],
    variations: [
      'Cheese fatayer: replace the spinach with a 50/50 mix of crumbled feta and shredded akkawi, and skip the salt-draining step.',
      'Meat fatayer (sfeeha): swap the spinach mixture for spiced ground lamb with onion, pine nuts, and a spoonful of pomegranate molasses.',
      'Mini-bites: roll 5 cm rounds instead of 10 cm for a one-bite size; reduce bake time to 12-14 minutes.',
    ],
    storage: 'Cool completely, then store in an airtight container at room temperature for 2 days or refrigerated for 5. Reheat in a 180°C / 350°F oven for 6-8 minutes to crisp the dough.',
    dropcap: true,
  },

  // ── North Africa (3) ──────────────────────────────
  // Morocco (2)
  mock('mock-tagine',          'Chicken Tagine',    'Morocco', 'North Africa', 31.63, -8.01),
  mock('mock-couscous',        'Couscous Royale',   'Morocco', 'North Africa', 34.02, -6.84),
  // Egypt (1)
  mock('mock-koshari',         'Koshari',           'Egypt', 'North Africa', 30.04, 31.24),

  // ── Sub-Saharan Africa (2) ──────────────────────────────
  mock('mock-injera',          'Injera & Doro Wat', 'Ethiopia', 'Sub-Saharan Africa', 9.02, 38.75),
  mock('mock-jollof',          'Jollof Rice',       'Nigeria', 'Sub-Saharan Africa', 6.52, 3.38),

  // ── North America (3) ──────────────────────────────
  // Mexico (2)
  mock('mock-tacos',           'Tacos al Pastor',   'Mexico', 'North America', 19.43, -99.13),
  mock('mock-mole',            'Mole Poblano',      'Mexico', 'North America', 19.04, -98.20),
  // Cuba (1)
  mock('mock-ropa-vieja',      'Ropa Vieja',        'Cuba', 'North America', 23.11, -82.37),

  // ── South America (3) ──────────────────────────────
  // Brazil (2)
  mock('mock-feijoada',        'Feijoada',          'Brazil', 'South America', -22.91, -43.17),
  mock('mock-pao-de-queijo',   'Pao de Queijo',     'Brazil', 'South America', -19.92, -43.94, 'side'),
  // Peru (1)
  mock('mock-ceviche',         'Ceviche',           'Peru', 'South America', -12.05, -77.04),

  // ════════════════════════════════════════════════════════════
  //  Batch 2 — 50 more recipes (30 Europe/Asia, 20 elsewhere)
  // ════════════════════════════════════════════════════════════

  // ── Western Europe (8 more) ──────────────────────────────
  // France (2 more → total 6)
  mock('mock-coq-au-vin',       'Coq au Vin',            'France', 'Western Europe', 47.32, 5.04),
  mock('mock-quiche-lorraine',  'Quiche Lorraine',       'France', 'Western Europe', 48.69, 6.18),
  // Italy (2 more → total 5)
  mock('mock-osso-buco',        'Osso Buco',             'Italy', 'Western Europe', 45.46, 9.19),
  mock('mock-panna-cotta',      'Panna Cotta',           'Italy', 'Western Europe', 44.41, 8.93, 'dessert'),
  // Spain (2 more → total 5)
  mock('mock-tortilla-esp',     'Tortilla Española',     'Spain', 'Western Europe', 40.42, -3.70),
  mock('mock-patatas-bravas',   'Patatas Bravas',        'Spain', 'Western Europe', 41.39, 2.17, 'side'),
  // Germany (1 more → total 3)
  mock('mock-sauerbraten',      'Sauerbraten',           'Germany', 'Western Europe', 50.94, 6.96),
  // United Kingdom (1 → total 1)
  mock('mock-fish-and-chips',   'Fish and Chips',        'United Kingdom', 'Western Europe', 51.51, -0.13),

  // ── Eastern Europe (7 more) ──────────────────────────────
  // Greece (2 more → total 5)
  mock('mock-moussaka',         'Moussaka',              'Greece', 'Eastern Europe', 37.98, 23.73),
  mock('mock-spanakopita',      'Spanakopita',           'Greece', 'Eastern Europe', 39.64, 19.92, 'side'),
  // Ukraine (1 → total 1)
  mock('mock-borscht',          'Borscht',               'Ukraine', 'Eastern Europe', 50.45, 30.52),
  // Romania (1 more → total 2)
  mock('mock-sarmale',          'Sarmale',               'Romania', 'Eastern Europe', 44.43, 26.10),
  // Georgia (1 → total 1)
  mock('mock-khachapuri',       'Khachapuri',            'Georgia', 'Eastern Europe', 41.72, 44.79),
  // Serbia (1 → total 1)
  mock('mock-pljeskavica',      'Pljeskavica',           'Serbia', 'Eastern Europe', 44.79, 20.46),
  // Bosnia (1 → total 1)
  mock('mock-cevapcici',        'Ćevapčići',             'Bosnia and Herzegovina', 'Eastern Europe', 43.86, 18.41),

  // ── East Asia (8 more) ──────────────────────────────
  // China (3 more → total 6)
  mock('mock-xiao-long-bao',    'Xiao Long Bao',        'China', 'East Asia', 31.23, 121.47),
  mock('mock-har-gow',          'Har Gow',               'China', 'East Asia', 22.32, 114.17),
  mock('mock-kung-pao',         'Kung Pao Chicken',      'China', 'East Asia', 30.57, 104.07),
  // Japan (2 more → total 5)
  mock('mock-tonkotsu',         'Tonkotsu Ramen',        'Japan', 'East Asia', 33.59, 130.40),
  mock('mock-okonomiyaki',      'Okonomiyaki',           'Japan', 'East Asia', 34.69, 135.50),
  // South Korea (2 more → total 4)
  mock('mock-kimchi-jjigae2',   'Kimchi Jjigae',         'South Korea', 'East Asia', 37.57, 126.98),
  mock('mock-japchae',          'Japchae',               'South Korea', 'East Asia', 35.18, 129.08),
  // Mongolia (1 more → total 2)
  mock('mock-khuushuur',        'Khuushuur',             'Mongolia', 'East Asia', 47.92, 106.91),

  // ── Southeast Asia (4 more) ──────────────────────────────
  mock('mock-green-curry',      'Green Curry',           'Thailand', 'Southeast Asia', 13.76, 100.50),
  mock('mock-nasi-goreng',      'Nasi Goreng',           'Indonesia', 'Southeast Asia', -6.21, 106.85),
  mock('mock-adobo',            'Chicken Adobo',         'Philippines', 'Southeast Asia', 14.60, 120.98),
  mock('mock-laksa',            'Laksa',                 'Malaysia', 'Southeast Asia', 3.14, 101.69),

  // ── South Asia (3 more) ──────────────────────────────
  mock('mock-biryani',          'Hyderabadi Biryani',    'India', 'South Asia', 17.39, 78.49),
  mock('mock-dal-makhani',      'Dal Makhani',           'India', 'South Asia', 28.70, 77.10),
  mock('mock-kottu2',           'Hoppers',               'Sri Lanka', 'South Asia', 6.93, 79.84),

  // ── Middle East (3 more) ──────────────────────────────
  mock('mock-shawarma',         'Chicken Shawarma',      'Lebanon', 'Middle East', 33.89, 35.50),
  mock('mock-kabsa',            'Kabsa',                 'Saudi Arabia', 'Middle East', 24.71, 46.68),
  mock('mock-mansaf',           'Mansaf',                'Jordan', 'Middle East', 31.95, 35.93),

  // ── North Africa (3 more) ──────────────────────────────
  mock('mock-shakshuka',        'Shakshuka',             'Morocco', 'North Africa', 33.97, -6.85),
  mock('mock-bastilla',         'Bastilla',              'Morocco', 'North Africa', 34.02, -6.84),
  mock('mock-ful-medames',      'Ful Medames',           'Egypt', 'North Africa', 30.04, 31.24),

  // ── Sub-Saharan Africa (4 more) ──────────────────────────────
  mock('mock-suya',             'Suya',                  'Nigeria', 'Sub-Saharan Africa', 9.06, 7.49),
  mock('mock-bunny-chow',       'Bunny Chow',            'South Africa', 'Sub-Saharan Africa', -29.86, 31.02),
  mock('mock-tibs',             'Tibs',                  'Ethiopia', 'Sub-Saharan Africa', 9.02, 38.75),
  mock('mock-nyama-choma',      'Nyama Choma',           'Kenya', 'Sub-Saharan Africa', -1.29, 36.82),

  // ── North America (3 more) ──────────────────────────────
  mock('mock-jerk-chicken',     'Jerk Chicken',          'Jamaica', 'North America', 18.11, -77.30),
  mock('mock-pupusas',          'Pupusas',               'El Salvador', 'North America', 13.69, -89.22),
  mock('mock-poutine',          'Poutine',               'Canada', 'North America', 45.50, -73.57),

  // ── South America (3 more) ──────────────────────────────
  mock('mock-empanadas',        'Empanadas',             'Argentina', 'South America', -34.60, -58.38),
  mock('mock-arepas',           'Arepas Reina Pepiada',  'Venezuela', 'South America', 10.49, -66.88),
  mock('mock-lomo-saltado',     'Lomo Saltado',          'Peru', 'South America', -12.05, -77.04),
];
