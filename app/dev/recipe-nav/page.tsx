import RecipeNavLab from './RecipeNavLab';

/**
 * /dev/recipe-nav: previous/next between recipes (TODO "Recipe
 * swipe/navigation"). Three treatments and three orderings on the real
 * recipe page and overlay. Design sandbox only (404s in production via
 * app/dev/layout.tsx). Nothing moves into RecipeDetail until the user picks.
 */
export default function DevRecipeNavPage() {
  return <RecipeNavLab />;
}
