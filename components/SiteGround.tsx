/**
 * The frosted site background: a faint, blurred copy of the hero painting
 * behind every page (spec 2026-09-25 §6.5, picked in /dev/hero-viewport).
 * Each theme gets one tiny pre-blurred WebP (96x64, under 1 KB) in
 * public/home/frost/, stretched by the browser, with saturation and
 * brightness baked in. By day it scrolls with the page, one painting down
 * the whole page height; at night the dusk painting stays still behind the
 * content. All styling is in `.site-ground*` in globals.css. It is a CSS
 * background on purpose: a 1 KB blur gains nothing from next/image.
 *
 * Page wrappers must not paint an opaque page colour over it (RecipeDetail,
 * /journal and their loading states were cleared for this). Server-safe.
 */
export default function SiteGround() {
  return (
    <>
      <div aria-hidden="true" className="site-ground site-ground-day">
        <div className="site-ground-paint" />
        <div className="site-ground-tint" />
      </div>
      <div aria-hidden="true" className="site-ground site-ground-night">
        <div className="site-ground-paint" />
        <div className="site-ground-tint" />
      </div>
    </>
  );
}
