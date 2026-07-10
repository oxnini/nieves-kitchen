import { landedPantryEntries } from '@/lib/pantry/landed';
import PalettePreview from './PalettePreview';

/**
 * /dev/palettes — palette exploration sandbox.
 *
 * Renders the real home sections, a real-geography atlas preview, and the
 * full RecipeDetail inside a wrapper that overrides the `--color-*` theme
 * tokens per candidate palette, in both light and dark. Nothing here touches
 * production styling; pick a winner, then migrate the tokens in globals.css.
 */
export default function DevPalettesPage() {
  const pantryEntries = landedPantryEntries();
  return <PalettePreview pantryEntries={pantryEntries} />;
}
