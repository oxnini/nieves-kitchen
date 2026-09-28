import CookStampLab from './CookStampLab';

/**
 * /dev/cook-stamp: four redesigns of the "I cooked this" stamp button, driven
 * entirely by fixtures. Design sandbox only (404s in production via
 * app/dev/layout.tsx). Nothing ships to components/CookedButton.tsx until
 * the user picks a variant.
 */
export default function DevCookStampPage() {
  return <CookStampLab />;
}
