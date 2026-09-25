import { notFound } from 'next/navigation';
import { dbToRecipe } from '@/lib/types';
import { getRecipe } from '@/lib/recipes/get';
import RecipeDetail from '@/components/RecipeDetail';
import RecipeModal from '@/components/RecipeModal';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function InterceptedRecipePage({ params }: Props) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) notFound();

  const recipe = dbToRecipe(data);
  return (
    <RecipeModal slug={slug}>
      <RecipeDetail recipe={recipe} inModal />
    </RecipeModal>
  );
}
