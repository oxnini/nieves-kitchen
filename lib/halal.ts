/**
 * Content + data for the Halal Promise page (`/promise`) and the Kitchen-tested
 * trust badge.
 *
 * Sourcing rule (non-negotiable):
 * Every ingredient ruling is checked against recognised halal authorities and
 * carries a real, verifiable citation in `sources`. Never invent a ruling or a
 * citation — that would defeat the entire trust promise. `needsSource: true`
 * marks any entry still awaiting a verified citation; it must not ship as
 * authoritative until that is resolved.
 *
 * Primary authorities used: IFANCA (Islamic Food and Nutrition Council of
 * America) Halal Shopper's Guide, and published fatwa references. Where
 * scholars genuinely differ, both positions are shown with their sources.
 */

/** The promise, stated plainly. Shown as the page hero. */
export const PROMISE_HEADLINE =
  'Every recipe here, I have cooked myself and truly love. Every single one is 100% halal.';

export const PROMISE_INTRO =
  'No shortcuts, no "probably fine." Here is exactly how I keep that promise, every single time.';

/** The four-part methodology. Drawn from how Nieves actually verifies recipes. */
export interface MethodPillar {
  title: string;
  body: string;
}

export const METHODOLOGY: MethodPillar[] = [
  {
    title: 'I cook every recipe myself, and I love every one',
    body: 'Nothing here is copied from somewhere else and passed along. Every recipe on this site is one I have cooked in my own kitchen and genuinely love. I only share dishes that taste phenomenal and that I come back to again and again. If I do not love it, it does not go up.',
  },
  {
    title: 'I check every ingredient',
    body: 'Before a recipe goes up, I read through the full ingredient list. Vegan and vegetarian dishes clear most of the concern on their own, though I still watch for alcohol and a few animal-derived additives that can slip in. If anything is not halal, it does not make the cut as written.',
  },
  {
    title: 'I research the tricky ones',
    body: 'Some ingredients are not clear-cut, like rennet in cheese, cochineal, gelatin, or the alcohol that sometimes hides in packaged foods. For those I do my due diligence and verify each one against trusted, authentic sources before it ever goes on the site.',
  },
  {
    title: 'I substitute, never compromise',
    body: 'Plenty of traditional dishes call for wine or pork, especially in Chinese cooking, where Shaoxing wine turns up all the time. I rework those recipes so the substitute honours the original flavour, and honestly, many of them taste just as good without it. Anything that is not halal simply never goes in.',
  },
];

/** The honest stance on contested ingredients. Shown above the guide. */
export const DIFFERING_OPINIONS_NOTE =
  'Some ingredients sit in genuine grey areas, where sincere, knowledgeable people reach different conclusions. On those, I will not hand you a single verdict dressed up as the only truth. I lay out the positions, point to where they come from, and leave the choice with you and your own practice.';

export type HalalStatus =
  | 'generally-accepted' // widely considered permissible
  | 'depends-on-source' // permissible or not depending on origin; check the label
  | 'scholars-differ' // genuine difference of opinion
  | 'generally-avoided'; // widely considered not permissible

export interface HalalSource {
  label: string;
  url: string;
}

export interface HalalIngredient {
  name: string;
  /** E-number or common alternate name. */
  aka?: string;
  /** Factual: what it is / where it comes from. */
  whatItIs: string;
  status: HalalStatus;
  /** Conservative practical guidance. */
  guidance: string;
  /** For 'scholars-differ': the competing positions. */
  positions?: string[];
  /** Verifiable citations from recognised halal authorities. */
  sources: HalalSource[];
  /**
   * True only while an entry still awaits a verified citation. Surfaced in the
   * UI so we never imply authority we have not earned yet.
   */
  needsSource: boolean;
}

export const STATUS_LABEL: Record<HalalStatus, string> = {
  'generally-accepted': 'Generally accepted',
  'depends-on-source': 'Depends on the source',
  'scholars-differ': 'Scholars differ',
  'generally-avoided': 'Generally avoided',
};

const IFANCA_GUIDE: HalalSource = {
  label: "IFANCA — Halal Shopper's Guide to Ingredients",
  url: 'https://ifanca.org/resources/halal-shoppers-guide-to-ingredients/',
};

/**
 * Commonly-questioned ingredients, each checked against recognised halal
 * authorities and cited. Facts are stated plainly; where scholars genuinely
 * differ, both positions are shown with sources.
 */
export const INGREDIENT_GUIDE: HalalIngredient[] = [
  {
    name: 'Gelatin',
    whatItIs:
      'A setting agent made from animal collagen. It can come from pork, beef, or fish.',
    status: 'depends-on-source',
    guidance:
      'Pork-derived gelatin is not halal. Fish gelatin is accepted, since fish need no special slaughter. Beef gelatin is halal only if it comes from an animal slaughtered the halal way, so plain gelatin with no halal certification is treated as doubtful. I look for fish gelatin or a recognised halal mark.',
    sources: [
      IFANCA_GUIDE,
      {
        label: 'IslamQA — Is Gelatin Halal?',
        url: 'https://islamqa.info/en/answers/219137',
      },
    ],
    needsSource: false,
  },
  {
    name: 'Rennet (in cheese)',
    whatItIs:
      'An enzyme used to curdle milk. It can be microbial, vegetable, or animal (traditionally from a calf stomach).',
    status: 'depends-on-source',
    guidance:
      'Microbial and vegetable rennet are not animal-derived and are widely accepted as halal. Animal rennet depends on the source animal and how it was slaughtered. I look for cheese made with microbial or vegetable rennet, or a clear halal indication.',
    sources: [
      {
        label: 'IFANCA — Frequently Asked Questions (enzymes & rennet)',
        url: 'https://ifanca.org/resources/frequently-asked-questions-spring-2002/',
      },
      {
        label: 'IslamQA — Is Animal Rennet Halal?',
        url: 'https://islamqa.info/en/answers/2841',
      },
    ],
    needsSource: false,
  },
  {
    name: 'Vanilla extract',
    aka: 'natural vanilla extract',
    whatItIs:
      'Vanilla flavour is usually extracted using ethyl alcohol, so a trace of alcohol remains in the extract.',
    status: 'scholars-differ',
    guidance:
      'The widely-held view is that it is permissible, but some prefer to avoid it out of caution. I flag it so you can follow your own practice.',
    positions: [
      'Most authorities consider it permissible: the alcohol is not from an intoxicating drink, is present in trace amounts, does not intoxicate, and largely evaporates in cooking, so it is not treated as khamr.',
      'Some prefer to avoid any added alcohol as a precaution, and use alcohol-free vanilla or vanilla powder instead.',
    ],
    sources: [
      {
        label: 'IslamQA — Is Vanilla Extract Halal?',
        url: 'https://islamqa.info/en/answers/177030',
      },
      IFANCA_GUIDE,
    ],
    needsSource: false,
  },
  {
    name: 'Mono- and diglycerides',
    aka: 'E471',
    whatItIs:
      'Emulsifiers used to blend fats and water. They can be made from plant oils or from animal fat.',
    status: 'depends-on-source',
    guidance:
      'Plant-derived is fine. Animal-derived depends on the source and can include pork fat. The label rarely says which, so for doubtful cases I look for "vegetable" mono- and diglycerides or a halal-certified product.',
    sources: [IFANCA_GUIDE],
    needsSource: false,
  },
  {
    name: 'Cochineal / carmine',
    aka: 'E120',
    whatItIs:
      'A red colouring made from the dried bodies of cochineal insects.',
    status: 'generally-avoided',
    guidance:
      'Most schools and the major halal certifiers treat insect-derived carmine as not permissible, though some Maliki scholars allow it. To keep things clear, I avoid it and reach for plant-based colour such as beetroot instead.',
    sources: [
      {
        label: 'IslamQA (Hanafi) — Ruling on carmine (E120)',
        url: 'https://islamqa.org/hanafi/fatwa-tt/134340/what-is-the-ruling-of-carmine-e-120/',
      },
      IFANCA_GUIDE,
    ],
    needsSource: false,
  },
  {
    name: 'Animal shortening / lard',
    whatItIs:
      'Solid cooking fat. Lard specifically is rendered pork fat; "shortening" can be vegetable or animal.',
    status: 'generally-avoided',
    guidance:
      'Lard is pork fat and is not halal. I use butter, ghee, or vegetable shortening instead, and check that any "shortening" on a label is plant-based.',
    sources: [IFANCA_GUIDE],
    needsSource: false,
  },
  {
    name: 'L-cysteine',
    aka: 'E920',
    whatItIs:
      'A dough conditioner in some breads. It can be synthetic, or from duck or chicken feathers, or historically from human hair.',
    status: 'depends-on-source',
    guidance:
      'Synthetic or fermentation-derived L-cysteine raises no concern. Sources such as human hair or feathers from non-slaughtered birds are rejected by most scholars. Because the origin is rarely labelled, I treat unspecified cases as doubtful and look for halal certification.',
    sources: [
      {
        label: 'IslamQA — Ruling on foods containing L-cysteine (E920)',
        url: 'https://islamqa.info/en/answers/248124',
      },
    ],
    needsSource: false,
  },
  {
    name: 'Marshmallows',
    whatItIs: 'A confection that usually sets with gelatin.',
    status: 'depends-on-source',
    guidance:
      'These follow the gelatin rule above. I use marshmallows made with fish gelatin, halal-certified beef gelatin, or a gelatin-free setting agent.',
    sources: [
      IFANCA_GUIDE,
      {
        label: 'IslamQA — Is Gelatin Halal?',
        url: 'https://islamqa.info/en/answers/219137',
      },
    ],
    needsSource: false,
  },
];
