import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { dbToRecipe } from '@/lib/types';
import type { DbRecipe } from '@/lib/types';
import RecipeDetail from '@/components/RecipeDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('recipes')
    .select('title, quote')
    .eq('slug', slug)
    .single();

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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data || error) notFound();

  const recipe = dbToRecipe(data as DbRecipe);
  return <RecipeDetail recipe={recipe} />;
}
