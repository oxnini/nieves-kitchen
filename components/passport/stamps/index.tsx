import { hashCountry } from '@/lib/stamp-traits';
import type { StampDesignProps } from './shared';
import GrandCircle from './GrandCircle';
import Postmark from './Postmark';
import OvalBadge from './OvalBadge';
import OfficialRect from './OfficialRect';
import TallRect from './TallRect';
import Hexagonal from './Hexagonal';
import Diamond from './Diamond';
import PillCapsule from './PillCapsule';
import WavyCircle from './WavyCircle';
import BannerStrip from './BannerStrip';
import Triangle from './Triangle';

export type { StampDesignProps };

export type StampDesign =
  | 'grand-circle'
  | 'postmark'
  | 'oval-badge'
  | 'official-rect'
  | 'tall-rect'
  | 'hexagonal'
  | 'diamond'
  | 'pill-capsule'
  | 'wavy-circle'
  | 'banner-strip'
  | 'triangle';

const DESIGNS: StampDesign[] = [
  'grand-circle', 'postmark', 'oval-badge', 'official-rect',
  'tall-rect', 'hexagonal', 'diamond', 'pill-capsule', 'wavy-circle',
  'banner-strip', 'triangle',
];

export function getDesign(country: string): StampDesign {
  return DESIGNS[hashCountry(country) % DESIGNS.length];
}

const SUBTITLES = [
  'CULINARY PASSPORT', 'BON APPETIT', 'ENTRY APPROVED',
  'KITCHEN VISA', 'FLAVORS EXPLORED', 'TASTE JOURNEY',
  'RECIPE COLLECTED', 'STAMP OF FLAVOR',
];

export function getSubtitle(country: string): string {
  return SUBTITLES[hashCountry(country + '_sub') % SUBTITLES.length];
}

/** Aspect ratio [width, height] relative to the stamp's computed size. */
export function designAspect(design: StampDesign): [number, number] {
  switch (design) {
    case 'grand-circle':  return [1, 1];
    case 'postmark':      return [1.3, 1];
    case 'oval-badge':    return [1.5, 1];
    case 'official-rect': return [1.4, 1];
    case 'tall-rect':     return [0.75, 1.05];
    case 'hexagonal':     return [1, 1];
    case 'diamond':       return [1, 1];
    case 'pill-capsule':  return [1.8, 0.75];
    case 'wavy-circle':   return [1, 1];
    case 'banner-strip':  return [1.5, 0.65];
    case 'triangle':      return [1.1, 1];
  }
}

export function renderStampDesign(design: StampDesign, props: StampDesignProps) {
  switch (design) {
    case 'grand-circle':  return <GrandCircle {...props} />;
    case 'postmark':      return <Postmark {...props} />;
    case 'oval-badge':    return <OvalBadge {...props} />;
    case 'official-rect': return <OfficialRect {...props} />;
    case 'tall-rect':     return <TallRect {...props} />;
    case 'hexagonal':     return <Hexagonal {...props} />;
    case 'diamond':       return <Diamond {...props} />;
    case 'pill-capsule':  return <PillCapsule {...props} />;
    case 'wavy-circle':   return <WavyCircle {...props} />;
    case 'banner-strip':  return <BannerStrip {...props} />;
    case 'triangle':      return <Triangle {...props} />;
  }
}
