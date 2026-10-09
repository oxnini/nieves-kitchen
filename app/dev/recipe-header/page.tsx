import RecipeHeaderLab from './RecipeHeaderLab';

/**
 * /dev/recipe-header: audit F2 + F22. Where the dish photo sits in a recipe's
 * header, and the lede's measure, on the real recipe page and overlay. Design
 * sandbox only (404s in production via app/dev/layout.tsx). Nothing moves into
 * RecipeDetail until the user picks; the proposed spec amendment is in
 * docs/superpowers/specs/2026-09-25-premium-revamp-design.md §8.
 */
export default function DevRecipeHeaderPage() {
  return <RecipeHeaderLab />;
}
