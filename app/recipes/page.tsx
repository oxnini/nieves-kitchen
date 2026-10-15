import { connection } from 'next/server';
import CatalogueBoundary from '@/components/CatalogueBoundary';
import RecipesBrowse from './RecipesBrowse';

/**
 * /recipes renders per request (audit F5). The browse UI reads the query
 * (?collection=, ?country=, ?q=), and a static page can't know it, so its
 * HTML used to stop at "Gathering recipes…". Rendered per request, the HTML
 * holds the cards already narrowed by the query. The catalogue itself comes
 * from Next's data cache (getCatalogue), not a Supabase call per visit.
 */
export default async function RecipesPage() {
  await connection();
  return (
    <CatalogueBoundary>
      <RecipesBrowse />
    </CatalogueBoundary>
  );
}
