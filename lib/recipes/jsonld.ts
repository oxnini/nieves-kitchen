import type { Recipe } from '@/lib/types';
import { formatAmount } from '@/lib/units';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

/**
 * schema.org/Recipe for Google's recipe rich results, built only from what
 * the page already shows. Every recipe on the site is halal, so HalalDiet is
 * always present; the other diets follow the recipe's own flags.
 */

/** Authored text carries light markdown (**bold**, [text](url)); JSON-LD wants plain text. */
function plain(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
}

/** Minutes → ISO 8601 duration ("PT1H30M"). */
function isoDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `PT${h ? `${h}H` : ''}${m || !h ? `${m}M` : ''}`;
}

const CATEGORY: Record<Recipe['category'], string> = {
  main: 'Main course',
  side: 'Side dish',
  dessert: 'Dessert',
  drink: 'Drink',
};

export function recipeJsonLd(recipe: Recipe, slug: string) {
  const diets = ['https://schema.org/HalalDiet'];
  if (recipe.isVegan) diets.push('https://schema.org/VeganDiet');
  if (recipe.isVegetarian) diets.push('https://schema.org/VegetarianDiet');
  if (recipe.isGlutenFree) diets.push('https://schema.org/GlutenFreeDiet');

  const ingredients = recipe.ingredients.flatMap((group) =>
    group.items.map((ing) => {
      const amount = ing.amount ? `${formatAmount(ing.amount)} ${ing.unit}`.trim() : '';
      return plain(amount ? `${amount} ${ing.name}` : ing.name);
    }),
  );

  const toSteps = (items: string[]) =>
    items.map((text) => ({ '@type': 'HowToStep', text: plain(text) }));
  const sectioned = recipe.instructions.length > 1 && recipe.instructions.every((g) => g.heading?.trim());
  const instructions = sectioned
    ? recipe.instructions.map((g) => ({
        '@type': 'HowToSection',
        name: g.heading!.trim(),
        itemListElement: toSteps(g.items),
      }))
    : toSteps(recipe.instructions.flatMap((g) => g.items));

  const { calories, protein, carbs, fat } = recipe.nutrition;

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: plain(recipe.description || recipe.quote),
    image: [recipe.image, ...(recipe.images ?? []).map((i) => i.url)].filter(Boolean).map(absoluteUrl),
    url: `${SITE_URL}/recipes/${slug}`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    datePublished: recipe.createdAt,
    totalTime: recipe.time.total ? isoDuration(recipe.time.total) : undefined,
    recipeYield: recipe.yieldText?.trim() || `${recipe.servings} servings`,
    recipeCategory: CATEGORY[recipe.category],
    recipeCuisine: recipe.country ?? undefined,
    keywords: recipe.tags.join(', ') || undefined,
    suitableForDiet: diets,
    nutrition: calories
      ? {
          '@type': 'NutritionInformation',
          servingSize: '1 serving',
          calories: `${calories} calories`,
          proteinContent: `${protein} g`,
          carbohydrateContent: `${carbs} g`,
          fatContent: `${fat} g`,
        }
      : undefined,
    recipeIngredient: ingredients,
    recipeInstructions: instructions,
  };
}
