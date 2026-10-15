import { getCatalogue } from '@/lib/recipes/catalogue';
import CatalogueSeed from './CatalogueSeed';

/**
 * Server Component (the one exception in components/). Fetches the catalogue
 * on the server and seeds the browser's `useRecipes` cache with it, so the
 * recipes are in the page's first HTML instead of arriving after an
 * HTML → JS → Supabase round trip (audit F5). Search engines and link
 * previews see real recipes; people see cards instead of skeletons.
 *
 * With nothing to hand over (see getCatalogue) it renders its children
 * untouched and `useRecipes` fetches in the browser as before.
 */
export default async function CatalogueBoundary({ children }: { children: React.ReactNode }) {
  const recipes = await getCatalogue();
  if (!recipes) return children;
  return (
    <CatalogueSeed recipes={recipes} fetchedAt={Date.now()}>
      {children}
    </CatalogueSeed>
  );
}
