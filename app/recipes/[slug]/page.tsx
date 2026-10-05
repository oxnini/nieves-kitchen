import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbToRecipe } from '@/lib/types';
import { getRecipe } from '@/lib/recipes/get';
import { recipeJsonLd } from '@/lib/recipes/jsonld';
import { SITE_NAME } from '@/lib/site';
import RecipeDetail from '@/components/RecipeDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRecipe(slug);

  // An unknown slug renders the branded 404 from the page's notFound(). It
  // answers HTTP 200, because loading.tsx starts the stream first, but Next
  // adds <meta name="robots" content="noindex"> so it is never indexed.
  if (!data) return {};

  const title = `${data.title} · ${SITE_NAME}`;
  // The share image comes from ./opengraph-image.tsx (the dish photo as a
  // 1200x630 JPEG) as og:image; X falls back to it for the large card.
  return {
    title,
    description: data.quote,
    alternates: { canonical: `/recipes/${slug}` },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: 'en_GB',
      title,
      description: data.quote,
      url: `/recipes/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: data.quote,
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) notFound();

  const recipe = dbToRecipe(data);
  // `<` escaped so recipe text can never close the script element.
  const jsonLd = JSON.stringify(recipeJsonLd(recipe, slug)).replace(/</g, '\\u003c');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <RecipeDetail recipe={recipe} />
    </>
  );
}
