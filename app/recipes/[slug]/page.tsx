import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbToRecipe } from '@/lib/types';
import { getRecipe } from '@/lib/recipes/get';
import RecipeDetail from '@/components/RecipeDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) return {};

  return {
    title: `${data.title} — Nieves' Kitchen`,
    description: data.quote,
    openGraph: {
      title: `${data.title} — Nieves' Kitchen`,
      description: data.quote,
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) notFound();

  const recipe = dbToRecipe(data);
  return <RecipeDetail recipe={recipe} />;
}
