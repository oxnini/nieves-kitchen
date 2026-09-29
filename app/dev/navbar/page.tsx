import PaintedHero from '@/components/home/PaintedHero';
import NavbarLab from './NavbarLab';

/**
 * /dev/navbar: refining the navbar's right-hand cluster (search, favourites,
 * theme) and the band height. Same components, four directions plus live
 * knobs, on the real home hero or an interior page. Design sandbox only
 * (404s in production via app/dev/layout.tsx). Nothing moves into
 * components/Navbar.tsx until the user picks.
 */
export default function DevNavbarPage() {
  return <NavbarLab hero={<PaintedHero />} />;
}
