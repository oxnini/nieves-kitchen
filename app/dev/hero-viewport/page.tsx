import FrostLab from './FrostLab';

/**
 * /dev/hero-viewport: a full-screen home hero plus a faint frosted copy of
 * the painting as the site background, with a control panel for every knob.
 * Design sandbox only (404s in production via app/dev/layout.tsx). Nothing
 * here changes the live site; the user picks numbers, then we build.
 */
export default function DevHeroViewportPage() {
  return <FrostLab />;
}
