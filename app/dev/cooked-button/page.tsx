'use client';

/**
 * Scratch route for the "I cooked this" stamp treatment.
 *
 * The complaint (TODO.md): cooked and not-cooked look too similar. The legacy
 * face below moved two things between states (border tint, hero colour); the
 * candidate moves five (paper ink wash, doubled engraved rule, kicker wording,
 * a check glyph plus cook count, and a settled angle with a cast shadow).
 *
 * Second section previews the per-cook remove flow inside `StampedRecipesModal`
 * against fixtures, so the two-step confirm can be reviewed without a Supabase
 * session.
 *
 * Not linked from anywhere; navigate to `/dev/cooked-button`. Delete this route
 * once the treatment is signed off.
 */

import { useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { StampFace, STAMP_FACE_CLASS, stampFaceMotion } from '@/components/CookedButton';
import StampedRecipesModal from '@/components/passport/StampedRecipesModal';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';

const DATE = '02 · SEP · 2026';

/* ---------------------------------------------------------------- */
/*  Legacy face, reproduced verbatim for the A/B                    */
/* ---------------------------------------------------------------- */

const LEGACY_MASK: CSSProperties = {
  WebkitMaskImage: [
    'radial-gradient(circle 5px at 0% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 100% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 0%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 100%, #000 99%, transparent 100%)',
    'linear-gradient(#000, #000)',
  ].join(', '),
  maskImage: [
    'radial-gradient(circle 5px at 0% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 100% 50%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 0%, #000 99%, transparent 100%)',
    'radial-gradient(circle 5px at 50% 100%, #000 99%, transparent 100%)',
    'linear-gradient(#000, #000)',
  ].join(', '),
  WebkitMaskPosition: '0 0, 100% 0, 0 0, 0 100%, 0 0',
  maskPosition: '0 0, 100% 0, 0 0, 0 100%, 0 0',
  WebkitMaskSize: '11px 11px, 11px 11px, 11px 11px, 11px 11px, 100% 100%',
  maskSize: '11px 11px, 11px 11px, 11px 11px, 11px 11px, 100% 100%',
  WebkitMaskRepeat: 'repeat-y, repeat-y, repeat-x, repeat-x, no-repeat',
  maskRepeat: 'repeat-y, repeat-y, repeat-x, repeat-x, no-repeat',
  WebkitMaskComposite: 'source-out, source-out, source-out, source-out, source-over',
  maskComposite: 'subtract, subtract, subtract, subtract, add',
};

function LegacyFace({ stamped }: { stamped: boolean }) {
  return (
    <div className="relative block w-full max-w-md min-h-[88px] font-stamp mx-auto">
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          ...LEGACY_MASK,
          backgroundColor: 'var(--color-parchment-dark)',
          backgroundImage:
            'radial-gradient(ellipse at 28% 22%, oklch(0.96 0.025 70 / 0.55), transparent 60%), radial-gradient(ellipse at 80% 80%, oklch(0.45 0.04 50 / 0.06), transparent 55%)',
        }}
      />
      <span
        aria-hidden
        className="absolute inset-[7px] border"
        style={{
          borderColor: stamped ? 'oklch(0.55 0.13 35 / 0.45)' : 'oklch(0.40 0.05 50 / 0.32)',
        }}
      />
      <span className="relative flex flex-col items-center justify-center gap-1.5 py-4 px-6">
        <span className="text-[9px] tracking-[0.42em] text-brown-dark" style={{ opacity: 0.55 }}>
          PASSPORT ENTRY
        </span>
        <span
          className="text-[20px] leading-none tracking-[0.18em]"
          style={{ color: stamped ? 'oklch(0.55 0.13 35)' : 'var(--color-brown-dark)' }}
        >
          {stamped ? 'COOKED' : 'I COOKED THIS'}
        </span>
        <span className="text-[9px] tracking-[0.32em] tabular-nums text-brown-dark" style={{ opacity: stamped ? 0.7 : 0.5 }}>
          {DATE}
        </span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Candidate({
  stamped, label, kicker, cookCount = 0, interactive = false,
}: {
  stamped: boolean;
  label: string;
  kicker: string;
  cookCount?: number;
  interactive?: boolean;
}) {
  return (
    <motion.div
      animate={stampFaceMotion(stamped)}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`${STAMP_FACE_CLASS} mx-auto`}
    >
      <StampFace
        stamped={stamped}
        interactive={interactive}
        kicker={kicker}
        label={label}
        labelKey={label}
        cookCount={cookCount}
        dateLabel={DATE}
      />
    </motion.div>
  );
}


/* ---------------------------------------------------------------- */
/*  Removal flow, on fixtures                                       */
/* ---------------------------------------------------------------- */

const FIXTURE_RECIPES = [
  { id: 'turkish-eggs', name: 'Turkish Eggs', country: 'Turkey', region: 'Levant & Anatolia' },
  { id: 'menemen', name: 'Menemen', country: 'Turkey', region: 'Levant & Anatolia' },
] as unknown as Recipe[];

const FIXTURE_STAMPS = new Map<string, StampRow[]>([
  ['turkish-eggs', [
    { id: 'a', recipe_slug: 'turkish-eggs', recipe_country: 'Turkey', cooked_at: '2026-04-18T10:00:00Z' },
    { id: 'b', recipe_slug: 'turkish-eggs', recipe_country: 'Turkey', cooked_at: '2026-06-02T10:00:00Z' },
    { id: 'c', recipe_slug: 'turkish-eggs', recipe_country: 'Turkey', cooked_at: '2026-08-27T10:00:00Z' },
  ] as StampRow[]],
]);

function RemovalPreview() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4 items-start">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-md font-body font-bold text-[15px] bg-cobalt text-cream"
      >
        Open the Turkey page
      </button>
      <p className="font-body text-sm text-brown-medium max-w-[60ch]">
        Expand the cook dates on Turkish Eggs, then use the bin icon on one date.
        Nothing is deleted here: the fixture handler only logs.
      </p>
      {log.length > 0 && (
        <ul className="font-stamp text-[11px] tracking-[0.16em] text-brown-medium">
          {log.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      )}
      {open && (
        <StampedRecipesModal
          country="Turkey"
          recipes={FIXTURE_RECIPES}
          stampsByRecipe={FIXTURE_STAMPS}
          onRemoveStamp={async id => setLog(l => [...l, `would delete stamp ${id}`])}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function Cell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-stamp text-[10px] tracking-[0.3em] text-brown-medium/80">{title}</div>
      <div className="rounded-lg border border-brown-light/25 bg-surface px-6 py-10">
        {children}
      </div>
    </div>
  );
}

export default function CookedButtonSandbox() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-14">
      <header>
        <div className="font-stamp text-[10px] tracking-[0.32em] text-brown-medium">SANDBOX</div>
        <h1 className="font-heading text-3xl font-bold text-brown-dark mt-2">
          Cooked stamp, before and after
        </h1>
        <p className="font-body text-brown-medium mt-3 max-w-[60ch]">
          Same two states in both rows. Squint: in the top row the difference is a
          border tint. In the bottom row the paper itself is inked and the stamp has
          been pressed onto the page.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold text-brown-dark">Before</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <Cell title="NOT COOKED"><LegacyFace stamped={false} /></Cell>
          <Cell title="COOKED"><LegacyFace stamped /></Cell>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold text-brown-dark">After</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <Cell title="NOT COOKED">
            <Candidate stamped={false} kicker="PASSPORT ENTRY" label="I COOKED THIS" interactive />
          </Cell>
          <Cell title="COOKED">
            <Candidate stamped kicker="ENTERED" label="COOKED" cookCount={1} />
          </Cell>
          <Cell title="COOKED, REPEATED">
            <Candidate stamped kicker="ENTERED" label="COOKED" cookCount={4} />
          </Cell>
          <Cell title="PREPARING / UNAVAILABLE">
            <div className="flex flex-col gap-8">
              <Candidate stamped={false} kicker="PASSPORT ENTRY" label="PREPARING…" />
              <Candidate stamped={false} kicker="PASSPORT ENTRY" label="UNAVAILABLE" />
            </div>
          </Cell>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold text-brown-dark">
          Removing one cook
        </h2>
        <RemovalPreview />
      </section>
    </div>
  );
}
