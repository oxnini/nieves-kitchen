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
    prepTime: 15, cookTime: 30, servings: 4,
    difficulty: 'Easy',
    ingredients: [{ name: 'Ingredient', amount: 1, unit: 'cup' }],
    instructions: ['Cook the thing.'],
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
];
