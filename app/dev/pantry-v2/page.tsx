'use client';

/**
 * DEV PROTOTYPE — Pantry redesign (1B backbone: reading spread + checklist cook).
 *
 * Rough visual only, self-contained mock data. Not wired to Supabase, not the
 * production shelf. Palette is the Courtyard cobalt/brass set so it matches the
 * Claude Design mocks. Art uses real /pantry/*.webp where it exists, a labelled
 * placeholder plinth otherwise.
 *
 * View at /dev/pantry-v2. Decisions baked in from brainstorming:
 *  - two modes: The shelf (browse) + Cook from what I have (checklist)
 *  - standalone plinth art (not an arch), no `tag` subheadings
 *  - "Good for you" = a few labelled points, shown for any ingredient worth it
 *  - Sunnah foods carry the hadith block; label keeps the ﷺ
 *  - new: figs, pumpkin (gourd), cucumber as Sunnah foods; beef as a plain staple
 */

import { useMemo, useState } from 'react';
import Image from 'next/image';

/* ── Courtyard palette (inline; not on main's parchment theme) ───────────── */
const C = {
  cream: '#F4ECDC',
  creamDeep: '#EBE0C8',
  creamHi: '#FBF6EA',
  cobalt: '#20406B',
  cobaltDeep: '#16324F',
  terracotta: '#C4623C',
  brass: '#C69A4E',
  olive: '#6F7A47',
  ink: '#2A2A2E',
  ring: 'rgba(32,64,107,0.13)',
  ring2: 'rgba(32,64,107,0.22)',
};

const eyebrow: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
};

/* ── Types + mock data ───────────────────────────────────────────────────── */
type Kind =
  | 'grains & staples'
  | 'vegetables & greens'
  | 'fruits & sweetness'
  | 'dairy & eggs'
  | 'aromatics & preserved'
  | 'meat & fish';

const KIND_ORDER: Kind[] = [
  'grains & staples',
  'vegetables & greens',
  'fruits & sweetness',
  'dairy & eggs',
  'aromatics & preserved',
  'meat & fish',
];

interface Ing {
  slug: string;
  name: string;
  kind: Kind;
  note: string;
  benefits?: string[];
  prophetic?: { note: string; quote?: string; citation: string };
  hasArt?: boolean;
}

const ART = new Set([
  'barley', 'butter', 'dates', 'eggs', 'garlic', 'honey', 'lamb', 'olive-oil', 'yoghurt',
]);

const INGREDIENTS: Ing[] = [
  {
    slug: 'barley', name: 'Barley', kind: 'grains & staples',
    note: 'Nutty and chewy, at home in a slow soup or a warm grain salad. It keeps you full through a long day.',
    benefits: ['High in fibre', 'Beta-glucan, kind to cholesterol', 'Slow, steady energy'],
    prophetic: {
      note: 'The barley in talbina, a soft broth the Prophet ﷺ turned to for a grieving or ailing heart.',
      quote: 'The talbina soothes the heart of the sick and takes away some of his grief.',
      citation: 'Sahih al-Bukhari 5417 (Aisha)',
    },
  },
  {
    slug: 'bulgur', name: 'Bulgur', kind: 'grains & staples',
    note: 'Steamed cracked wheat, ready in minutes. The base for kofte, pilaf, and stuffed vegetables.',
    benefits: ['High in fibre', 'Quick to cook'],
  },
  {
    slug: 'cucumber', name: 'Cucumber', kind: 'vegetables & greens',
    note: 'Cool and crisp, chopped into salad or sliced alongside sweet fruit the way it was always eaten.',
    benefits: ['Hydrating', 'Cooling', 'Vitamin K'],
    prophetic: {
      note: 'The Prophet ﷺ ate fresh dates together with cucumber, the cool balancing the sweet.',
      quote: 'I saw the Messenger of Allah ﷺ eating fresh dates with cucumber.',
      citation: 'Sahih al-Bukhari 5440; Sahih Muslim 2043 (Abdullah ibn Ja’far)',
    },
  },
  {
    slug: 'pumpkin', name: 'Pumpkin', kind: 'vegetables & greens',
    note: 'Sweet gourd for a slow-cooked stew or a soup. It melts down and turns a plain pot golden.',
    benefits: ['Beta-carotene, vitamin A', 'High in fibre', 'Light on the stomach'],
    prophetic: {
      note: 'The gourd (dubbā’) was beloved to the Prophet ﷺ, who would seek out its pieces from around the dish.',
      quote: 'From that day I have loved gourd, seeing the Prophet ﷺ favour it.',
      citation: 'Sahih al-Bukhari 5433 (Anas ibn Malik)',
    },
  },
  {
    slug: 'dates', name: 'Dates', kind: 'fruits & sweetness',
    note: 'The pantry’s built-in dessert. A few with coffee after dinner, and nothing else is needed.',
    benefits: ['High in fibre', 'Potassium', 'Natural sugars for quick energy'],
    prophetic: {
      note: 'Seven ajwa dates in the morning were his ﷺ counsel, and he said a household that keeps dates will never go hungry.',
      quote: 'Whoever eats seven ajwa dates in the morning will not be harmed that day by poison or magic.',
      citation: 'Sahih al-Bukhari 5445 (Sa’d); Sahih Muslim 2046a (Aisha)',
    },
  },
  {
    slug: 'figs', name: 'Figs', kind: 'fruits & sweetness',
    note: 'Honeyed and jammy, torn over yoghurt or set beside cheese. Good fresh, good dried.',
    benefits: ['High in fibre', 'Calcium', 'Potassium'],
    prophetic: {
      note: 'The fig is sworn by in the Qur’an, set beside the olive at the opening of its own surah.',
      quote: 'By the fig and the olive.',
      citation: 'The Qur’an, Surah at-Tin 95:1',
    },
  },
  {
    slug: 'honey', name: 'Honey', kind: 'fruits & sweetness',
    note: 'Raw and cloudy is best. Stir into yoghurt, spoon over warm bread, or loosen with water for syrup.',
    benefits: ['Antioxidants', 'Soothes a sore throat'],
    prophetic: {
      note: 'Honey is named in the Qur’an as a drink in which there is healing for people.',
      quote: 'From their bellies comes a drink of varying colours, in which there is healing for people.',
      citation: 'The Qur’an, Surah an-Nahl 16:69',
    },
  },
  {
    slug: 'pomegranate', name: 'Pomegranate', kind: 'fruits & sweetness',
    note: 'Jewelled seeds for scattering, or cooked-down molasses for a tart, dark sweetness in dressings.',
    benefits: ['Antioxidants', 'Vitamin C'],
  },
  {
    slug: 'butter', name: 'Butter', kind: 'dairy & eggs',
    note: 'For paprika butter over eggs, for pastry, for the top of the rice. Unsalted, so you decide.',
  },
  {
    slug: 'eggs', name: 'Eggs', kind: 'dairy & eggs',
    note: 'Soft-poached over yoghurt, baked in tomatoes, or turned into custard. The quick answer to most meals.',
    benefits: ['Complete protein', 'Vitamin B12'],
  },
  {
    slug: 'yoghurt', name: 'Yoghurt', kind: 'dairy & eggs',
    note: 'Thick and cold, garlicky under hot eggs, or sweetened with honey. Strain it overnight for labneh.',
    benefits: ['Protein', 'Live cultures', 'Calcium'],
  },
  {
    slug: 'olive-oil', name: 'Olive oil', kind: 'aromatics & preserved',
    note: 'The good bottle for finishing, a plainer one for the pan. Green and peppery over salad and warm bread.',
    benefits: ['Heart-healthy fats', 'Vitamin E', 'Anti-inflammatory'],
    prophetic: {
      note: 'The Prophet ﷺ praised the olive and its oil as coming from a blessed tree.',
      quote: 'Eat olive oil and anoint yourselves with it, for it comes from a blessed tree.',
      citation: 'Jami‘ at-Tirmidhi 1851; Sunan Ibn Majah 3319',
    },
  },
  {
    slug: 'garlic', name: 'Garlic', kind: 'aromatics & preserved',
    note: 'The start of most things. Grate it raw into yoghurt, or soften it slow and sweet in butter.',
    benefits: ['Immune support'],
  },
  {
    slug: 'sumac', name: 'Sumac', kind: 'aromatics & preserved',
    note: 'Deep red, tart, and a little fruity. Over eggs, salad, and grilled lamb, or rubbed into onions.',
  },
  {
    slug: 'lamb', name: 'Lamb', kind: 'meat & fish',
    note: 'Slow-cooked until it gives, or minced with spice and grilled. The centre of the table on a good day.',
    benefits: ['Protein', 'Iron', 'Vitamin B12'],
  },
  {
    slug: 'beef', name: 'Beef', kind: 'meat & fish',
    note: 'Braised low for stew, or minced for kofte and kebabs. A workhorse when the pot needs to feed many.',
    benefits: ['Protein', 'Iron', 'Zinc'],
  },
];

interface MockRecipe {
  id: string;
  title: string;
  country: string;
  minutes: number;
  featured: string[];
}

const RECIPES: MockRecipe[] = [
  { id: 'cilbir', title: 'Cılbır, poached eggs over yoghurt', country: 'Türkiye', minutes: 25, featured: ['eggs', 'yoghurt', 'butter', 'garlic'] },
  { id: 'mezze', title: 'A slow breakfast mezze', country: 'Levant', minutes: 15, featured: ['olive-oil', 'dates', 'honey', 'yoghurt', 'eggs', 'barley'] },
  { id: 'gemista', title: 'Gemista, baked stuffed tomatoes', country: 'Greece', minutes: 60, featured: ['bulgur', 'olive-oil', 'garlic', 'lamb'] },
  { id: 'coban', title: 'Çoban salatası, shepherd’s salad', country: 'Türkiye', minutes: 10, featured: ['olive-oil', 'sumac', 'cucumber', 'pomegranate'] },
  { id: 'stew', title: 'Beef and pumpkin stew', country: 'Anatolia', minutes: 90, featured: ['beef', 'pumpkin', 'garlic', 'olive-oil'] },
  { id: 'figbowl', title: 'Figs, honey, and yoghurt', country: 'Levant', minutes: 5, featured: ['figs', 'honey', 'yoghurt'] },
  { id: 'baklava', title: 'Pistachio baklava', country: 'Levant', minutes: 120, featured: ['butter', 'honey'] },
];

/* ── Small pieces ────────────────────────────────────────────────────────── */
function Keystone({ size = 10 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size, height: size, background: C.brass,
        transform: 'rotate(45deg)', display: 'inline-block', flex: 'none',
      }}
    />
  );
}

function Plinth({ ing, size = 200 }: { ing: Ing; size?: number }) {
  const src = ART.has(ing.slug) ? `/pantry/${ing.slug}.webp` : null;
  return (
    <div
      style={{
        position: 'relative', width: size, height: size,
        background: C.creamHi, borderRadius: 14,
        boxShadow: `inset 0 0 0 1.5px ${C.ring}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 14, flex: 'none',
      }}
    >
      {src ? (
        <span style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image src={src} alt={ing.name} fill sizes="200px" style={{ objectFit: 'contain' }} />
        </span>
      ) : (
        <span
          className="font-stamp"
          style={{ ...eyebrow, color: C.olive, textAlign: 'center', letterSpacing: '0.2em' }}
        >
          {ing.name}
          <br />
          <span style={{ fontSize: 9, opacity: 0.7 }}>ink to come</span>
        </span>
      )}
    </div>
  );
}

function GoodForYou({ points }: { points: string[] }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ ...eyebrow, color: C.olive, marginBottom: 8 }}>Good for you</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {points.map((p) => (
          <span
            key={p}
            style={{
              fontSize: 13, color: C.cobalt, background: C.creamHi,
              boxShadow: `inset 0 0 0 1.5px ${C.ring}`, borderRadius: 9999,
              padding: '6px 13px',
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

function Hadith({ p }: { p: NonNullable<Ing['prophetic']> }) {
  return (
    <div style={{ marginTop: 26, maxWidth: 560 }}>
      <div style={{ ...eyebrow, color: C.brass, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Keystone size={9} /> From the Prophet’s ﷺ table
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: C.olive, margin: '0 0 12px' }}>{p.note}</p>
      {p.quote && (
        <div style={{ position: 'relative', background: C.cobaltDeep, borderRadius: 14, padding: '24px 26px 20px' }}>
          <span style={{ position: 'absolute', top: -8, left: 26, width: 15, height: 15, background: C.brass, transform: 'rotate(45deg)', boxShadow: `0 0 0 3px ${C.cobaltDeep}` }} />
          <p className="font-heading" style={{ fontStyle: 'italic', fontSize: 20, lineHeight: 1.4, color: C.cream, margin: '0 0 12px' }}>
            “{p.quote}”
          </p>
          <p style={{ ...eyebrow, color: C.brass, margin: 0 }}>{p.citation}</p>
        </div>
      )}
    </div>
  );
}

function RecipeChip({ r }: { r: MockRecipe }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, background: C.cream,
        boxShadow: `inset 0 0 0 1.5px ${C.ring}`, borderRadius: 12, padding: '10px 14px 10px 10px',
        minWidth: 240,
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 8, background: C.creamDeep, flex: 'none' }} />
      <div style={{ minWidth: 0 }}>
        <div className="font-heading" style={{ fontSize: 15, color: C.cobalt, lineHeight: 1.15 }}>{r.title.split(',')[0]}</div>
        <div style={{ fontSize: 12, color: C.olive, marginTop: 2 }}>{r.country} · {r.minutes} min</div>
      </div>
    </div>
  );
}

/* ── Reusable spread content (shared by both browse variants) ────────────── */
function SpreadContent({ ing }: { ing: Ing }) {
  const cookWith = RECIPES.filter((r) => r.featured.includes(ing.slug));
  return (
    <div>
      <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ ...eyebrow, color: C.olive, marginBottom: 8 }}>{ing.kind}</div>
          <h2 className="font-heading" style={{ fontSize: 40, lineHeight: 1.02, color: C.cobalt, margin: '0 0 16px' }}>{ing.name}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: C.ink, margin: 0, maxWidth: 460 }}>{ing.note}</p>
          {ing.benefits && <GoodForYou points={ing.benefits} />}
        </div>
        <Plinth ing={ing} size={200} />
      </div>

      {ing.prophetic && <Hadith p={ing.prophetic} />}

      <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${C.ring}` }}>
        <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 14 }}>Cook with it</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {cookWith.length ? cookWith.map((r) => <RecipeChip key={r.id} r={r} />) : (
            <p style={{ fontSize: 14, color: C.olive, fontStyle: 'italic' }}>Nothing cooks with it yet. That will not last.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SunnahFilterChip({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 13, fontWeight: 700, padding: '7px 13px', borderRadius: 9999, cursor: 'pointer',
        color: on ? C.cream : C.cobalt,
        background: on ? C.cobalt : 'transparent',
        boxShadow: `inset 0 0 0 1.5px ${on ? C.cobalt : C.ring2}`,
        border: 'none',
      }}
    >
      <Keystone size={8} /> The Prophet’s ﷺ table
    </button>
  );
}

/* ── Variant A — accordion index + in-place spread ───────────────────────── */
function ShelfAccordion() {
  const [openSlug, setOpenSlug] = useState('dates');
  const [sunnahOnly, setSunnahOnly] = useState(false);
  const [expandedKind, setExpandedKind] = useState<Kind | null>('fruits & sweetness');

  const shown = sunnahOnly ? INGREDIENTS.filter((i) => i.prophetic) : INGREDIENTS;
  const open = INGREDIENTS.find((i) => i.slug === openSlug) ?? INGREDIENTS[0];
  const byKind = KIND_ORDER.map((k) => ({ k, items: shown.filter((i) => i.kind === k) })).filter((g) => g.items.length);

  return (
    <div className="grid md:grid-cols-[300px_1fr]">
      <div style={{ background: C.creamHi, boxShadow: `inset -1px 0 0 ${C.ring}`, padding: '26px 24px 32px' }}>
        <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 6 }}>The list</div>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: C.olive, margin: '0 0 16px' }}>
          Open a shelf, then pick a line to read it.
        </p>
        <div style={{ marginBottom: 14 }}>
          <SunnahFilterChip on={sunnahOnly} toggle={() => setSunnahOnly((v) => !v)} />
        </div>

        {byKind.map(({ k, items }) => {
          const expanded = expandedKind === k;
          return (
            <div key={k} style={{ borderBottom: `1px solid ${C.ring}` }}>
              <button
                onClick={() => setExpandedKind(expanded ? null : k)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '12px 4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span style={{ ...eyebrow, color: expanded ? C.cobalt : C.olive, flex: 1 }}>{k}</span>
                <span style={{ fontSize: 12, color: C.olive }}>{items.length}</span>
                <span style={{ display: 'inline-block', color: C.olive, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
              </button>
              {expanded && (
                <div style={{ paddingBottom: 8 }}>
                  {items.map((i) => (
                    <button
                      key={i.slug}
                      onClick={() => setOpenSlug(i.slug)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                        padding: '9px 8px', borderRadius: 8, cursor: 'pointer', border: 'none',
                        background: openSlug === i.slug ? C.creamDeep : 'transparent',
                      }}
                    >
                      <span style={{ width: 10, flex: 'none', display: 'inline-flex' }}>{i.prophetic && <Keystone size={9} />}</span>
                      <span className="font-heading" style={{ fontSize: 18, color: openSlug === i.slug ? C.cobalt : C.ink }}>{i.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '32px 36px 40px' }}>
        <SpreadContent ing={open} />
      </div>
    </div>
  );
}

/* ── Variant C — full-width tile grid + spread as overlay ─────────────────── */
function ShelfGrid() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [sunnahOnly, setSunnahOnly] = useState(false);

  const shown = sunnahOnly ? INGREDIENTS.filter((i) => i.prophetic) : INGREDIENTS;
  const open = openSlug ? INGREDIENTS.find((i) => i.slug === openSlug) ?? null : null;
  const byKind = KIND_ORDER.map((k) => ({ k, items: shown.filter((i) => i.kind === k) })).filter((g) => g.items.length);

  return (
    <div style={{ padding: '30px 34px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 8 }}>The shelf</div>
          <h2 className="font-heading" style={{ fontSize: 30, lineHeight: 1.1, color: C.cobalt, margin: 0 }}>Everything within reach</h2>
        </div>
        <SunnahFilterChip on={sunnahOnly} toggle={() => setSunnahOnly((v) => !v)} />
      </div>

      {byKind.map(({ k, items }) => (
        <div key={k} style={{ marginBottom: 26 }}>
          <div style={{ ...eyebrow, color: C.olive, paddingBottom: 8, borderBottom: `1px solid ${C.ring}`, marginBottom: 14 }}>{k}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {items.map((i) => (
              <button
                key={i.slug}
                onClick={() => setOpenSlug(i.slug)}
                style={{
                  position: 'relative', width: 158, minHeight: 92, borderRadius: 12, background: C.cobalt,
                  color: C.cream, padding: '15px 16px', textAlign: 'left', border: 'none', cursor: 'pointer',
                  boxShadow: `0 8px 20px -16px ${C.cobaltDeep}`,
                }}
              >
                <span className="font-heading" style={{ fontSize: 21, lineHeight: 1.1, display: 'block' }}>{i.name}</span>
                {i.prophetic && (
                  <>
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 12, boxShadow: `inset 0 0 0 2px ${C.brass}`, pointerEvents: 'none' }} />
                    <span style={{ position: 'absolute', top: -6, left: '50%', width: 13, height: 13, background: C.brass, transform: 'translateX(-50%) rotate(45deg)', boxShadow: `0 0 0 3px ${C.cream}`, pointerEvents: 'none' }} />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => setOpenSlug(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(22,50,79,0.55)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 780, maxHeight: '85vh', overflow: 'auto', background: C.cream, borderRadius: 16, boxShadow: `0 30px 70px -30px ${C.cobaltDeep}`, padding: '34px 38px 36px' }}>
            <button
              onClick={() => setOpenSlug(null)}
              aria-label="Close"
              style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 9999, background: C.creamDeep, color: C.cobalt, border: 'none', cursor: 'pointer', boxShadow: `inset 0 0 0 1.5px ${C.ring2}`, fontSize: 16 }}
            >
              ✕
            </button>
            <SpreadContent ing={open} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Cook from what I have (checklist) ───────────────────────────────────── */
function Cook() {
  const [have, setHave] = useState<Record<string, boolean>>({});
  const haveCount = Object.values(have).filter(Boolean).length;

  const scored = useMemo(() => {
    return RECIPES
      .map((r) => {
        const haveN = r.featured.filter((x) => have[x]).length;
        const missing = r.featured.filter((x) => !have[x]);
        const missNames = missing.map((x) => INGREDIENTS.find((i) => i.slug === x)?.name ?? x);
        return {
          r, haveN, total: r.featured.length, missingCount: missing.length, missNames,
          ready: missing.length === 0,
        };
      })
      .filter((s) => s.haveN > 0)
      .sort((a, b) => a.missingCount - b.missingCount || b.haveN - a.haveN);
  }, [have]);

  const readyN = scored.filter((s) => s.ready).length;
  const byKind = KIND_ORDER.map((k) => ({ k, items: INGREDIENTS.filter((i) => i.kind === k) })).filter((g) => g.items.length);

  return (
    <div className="grid md:grid-cols-[300px_1fr]">
      {/* left checklist */}
      <div style={{ background: C.creamHi, boxShadow: `inset -1px 0 0 ${C.ring}`, padding: '26px 24px 32px' }}>
        <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 6 }}>The market list</div>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: C.olive, margin: '0 0 18px' }}>Tick what’s in your kitchen.</p>

        {byKind.map(({ k, items }) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <div style={{ ...eyebrow, color: C.olive, paddingBottom: 6, borderBottom: `1px solid ${C.ring}`, marginBottom: 4 }}>{k}</div>
            {items.map((i) => {
              const on = !!have[i.slug];
              return (
                <button
                  key={i.slug}
                  onClick={() => setHave((p) => ({ ...p, [i.slug]: !p[i.slug] }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left',
                    padding: '8px', borderRadius: 8, cursor: 'pointer', border: 'none', background: 'transparent',
                  }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: 5, flex: 'none',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: on ? C.cobalt : 'transparent', color: C.cream, fontSize: 13,
                    boxShadow: `inset 0 0 0 1.5px ${C.ring2}`,
                  }}>{on ? '✓' : ''}</span>
                  <span className="font-heading" style={{ flex: 1, fontSize: 18, color: on ? C.cobalt : C.ink }}>{i.name}</span>
                  {i.prophetic && <Keystone size={9} />}
                </button>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 8, paddingTop: 14, borderTop: `1px solid ${C.ring}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="font-heading" style={{ fontStyle: 'italic', fontSize: 16, color: C.cobalt }}>
            {haveCount === 0 ? 'Nothing ticked' : `${haveCount} ticked`}
          </span>
          <button
            onClick={() => setHave({})}
            style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: C.cobalt, background: 'transparent', border: 'none', cursor: 'pointer', boxShadow: `inset 0 0 0 1.5px ${C.ring2}`, borderRadius: 9999, padding: '6px 13px' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* right results */}
      <div style={{ padding: '32px 36px 40px' }}>
        {haveCount === 0 && (
          <div style={{ textAlign: 'center', background: C.creamHi, borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.ring}`, padding: '64px 30px' }}>
            <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 10 }}>An empty list</div>
            <p className="font-heading" style={{ fontSize: 25, color: C.cobalt, margin: '0 auto', maxWidth: 420, lineHeight: 1.3 }}>
              Tick a few things on the left and I’ll find what you can cook tonight.
            </p>
          </div>
        )}

        {haveCount > 0 && scored.length === 0 && (
          <div style={{ textAlign: 'center', background: C.creamHi, borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.ring}`, padding: '56px 30px' }}>
            <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 10 }}>No match yet</div>
            <p className="font-heading" style={{ fontSize: 23, color: C.cobalt, margin: '0 auto 6px', maxWidth: 440, lineHeight: 1.3 }}>Nothing lines up with just those.</p>
            <p style={{ fontSize: 16, color: C.olive, margin: '0 auto', maxWidth: 400 }}>Add a workhorse like eggs, olive oil, or butter and try again.</p>
          </div>
        )}

        {scored.length > 0 && (
          <>
            <div style={{ ...eyebrow, color: C.terracotta, marginBottom: 4 }}>Cook from what I have</div>
            <h2 className="font-heading" style={{ fontSize: 26, color: C.cobalt, margin: '0 0 18px' }}>
              {readyN > 0 ? `${readyN} ${readyN === 1 ? 'recipe' : 'recipes'} ready to cook` : 'Closest to your list'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scored.map(({ r, haveN, total, missingCount, missNames, ready }) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.cream, borderRadius: 14, boxShadow: `0 1px 0 ${C.ring}, inset 0 0 0 1.5px ${C.ring}`, padding: '12px 18px 12px 12px' }}>
                  <div style={{ width: 84, height: 66, borderRadius: 8, background: C.creamDeep, flex: 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...eyebrow, color: C.olive, marginBottom: 3 }}>{r.country} · {r.minutes} min</div>
                    <div className="font-heading" style={{ fontSize: 21, color: C.cobalt, lineHeight: 1.1 }}>{r.title.split(',')[0]}</div>
                    {missingCount > 0 && (
                      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: C.terracotta }}>
                        {missingCount === 1 ? `1 more: ${missNames[0]}` : `${missingCount} more to go`}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 'none', textAlign: 'right' }}>
                    {ready ? (
                      <span style={{ ...eyebrow, background: C.brass, color: C.cobaltDeep, borderRadius: 9999, padding: '5px 11px' }}>Ready</span>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.cobalt }}>{haveN} of {total}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function PantryV2Page() {
  const [mode, setMode] = useState<'shelf' | 'cook'>('shelf');
  const [browse, setBrowse] = useState<'accordion' | 'grid'>('accordion');

  const chip = (active: boolean): React.CSSProperties => ({
    fontSize: 13, fontWeight: 700, padding: '7px 15px', borderRadius: 9999, cursor: 'pointer', border: 'none',
    color: active ? C.cobalt : C.cream,
    background: active ? C.brass : 'transparent',
    boxShadow: active ? 'none' : `inset 0 0 0 1.5px rgba(244,236,220,0.4)`,
  });

  const segBtn = (active: boolean): React.CSSProperties => ({
    fontSize: 12, fontWeight: 700, padding: '6px 13px', borderRadius: 9999, cursor: 'pointer', border: 'none',
    color: active ? C.cream : C.cobalt,
    background: active ? C.cobalt : 'transparent',
  });

  return (
    <div className="font-body" style={{ background: C.cream, minHeight: '100vh', color: C.ink }}>
      {/* dev banner */}
      <div style={{ background: C.cobaltDeep, color: C.cream, fontSize: 12, padding: '8px 20px', textAlign: 'center', opacity: 0.9 }}>
        DEV PROTOTYPE · Pantry redesign (1B) · mock data, placeholder art for new ingredients · not the live shelf
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 24px 80px' }}>
        {mode === 'shelf' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ ...eyebrow, color: C.olive }}>Browse layout</span>
            <div style={{ display: 'flex', gap: 4, background: C.creamDeep, borderRadius: 9999, padding: 3, boxShadow: `inset 0 0 0 1.5px ${C.ring}` }}>
              <button style={segBtn(browse === 'accordion')} onClick={() => setBrowse('accordion')}>A · Accordion</button>
              <button style={segBtn(browse === 'grid')} onClick={() => setBrowse('grid')}>C · Grid</button>
            </div>
          </div>
        )}
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 0 1.5px ${C.ring}, 0 24px 60px -40px ${C.cobaltDeep}` }}>
          {/* header band */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.cobalt, padding: '0 26px', height: 60 }}>
            <span className="font-heading" style={{ color: C.cream, fontSize: 21, letterSpacing: '0.01em' }}>Nieves’s Kitchen</span>
            <span className="font-heading" style={{ color: C.brass, fontStyle: 'italic', fontSize: 18 }}>Pantry</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button style={chip(mode === 'shelf')} onClick={() => setMode('shelf')}>The shelf</button>
              <button style={chip(mode === 'cook')} onClick={() => setMode('cook')}>Cook from what I have</button>
            </div>
          </div>

          <div style={{ background: C.cream }}>
            {mode === 'cook' ? <Cook /> : browse === 'accordion' ? <ShelfAccordion /> : <ShelfGrid />}
          </div>
        </div>
      </div>
    </div>
  );
}
