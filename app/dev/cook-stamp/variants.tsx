'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, RotateCcw, Undo2 } from 'lucide-react';
import { Eyebrow } from '@/components/courtyard';
import CountryStampSlot from '@/components/passport/CountryStampSlot';

/* The four "I cooked this" redesigns for /dev/cook-stamp. Presentational
   only: every state arrives as props from the lab's fixture state machine,
   so nothing here touches Supabase. Once the user picks one, it moves into
   components/CookedButton.tsx behind the real hooks. */

export type ButtonState = 'preparing' | 'failed' | 'idle' | 'pending' | 'cooked';

export type Knobs = {
  aButton: 'secondary' | 'primary' | 'accent'; aMark: number; aTilt: number; aInk: number;
  bAlign: 'left' | 'centre'; bStamp: number; bTilt: number; bRule: 'teal' | 'none';
  cWidth: number; cBite: number; cTilt: number; cWash: number; cPaper: 'parchment-dark' | 'surface'; cNight: 'warm' | 'dim' | 'lift'; cDim: number; cLift: number; cFrame: 'teal' | 'terracotta';
  eWidth: number; eStamp: number; eTilt: number; eSlipTilt: number; eWash: number; eNight: 'warm' | 'lift';
  dSize: number; dTilt: number; dPress: number;
  texture: 'on' | 'off';
};

export type VariantProps = {
  state: ButtonState;
  count: number;
  lastCooked: Date | null;
  country: string | null;
  slug: string;
  allowAgain: boolean;
  confirming: boolean;
  removing: boolean;
  /** Bumps on every successful cook so the press animation replays. */
  pressKey: number;
  knobs: Knobs;
  onCook: () => void;
  onAskRemove: () => void;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
};

/* ---------- shared bits ---------- */

export function longDate(d: Date): string {
  const now = new Date();
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
  });
}

function cookedTimes(n: number): string {
  return n <= 1 ? 'Cooked' : n === 2 ? 'Cooked twice' : `Cooked ${n} times`;
}

function idleLabel(state: ButtonState): string {
  if (state === 'pending') return 'Adding…';
  if (state === 'preparing') return 'Opening your journal…';
  if (state === 'failed') return 'Journal unavailable';
  return 'I cooked this';
}

function ariaFor(p: VariantProps): string {
  if (p.state === 'cooked') return `Cooked, in your Cook's Journal${p.count > 1 ? `, ${p.count} times` : ''}`;
  if (p.state === 'pending') return 'Adding this cook';
  if (p.state === 'preparing') return 'Opening your journal';
  if (p.state === 'failed') return 'Journal unavailable';
  return "I cooked this, add it to your Cook's Journal";
}

const BTN = {
  primary: 'bg-teal text-cream hover:bg-cobalt-deep hover:-translate-y-px',
  secondary: 'text-brown-dark bg-transparent shadow-[inset_0_0_0_1px_var(--color-brown-dark)] hover:bg-brown-dark/[0.05]',
  accent: 'bg-terracotta text-cream hover:bg-paprika hover:-translate-y-px',
} as const;

/** The Button primitive's look, plus the disabled state the primitive lacks. */
function ActionButton({
  variant, onClick, disabled, children, label,
}: {
  variant: keyof typeof BTN; onClick: () => void; disabled: boolean; children: ReactNode; label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-body text-[16px] font-semibold leading-none transition-[transform,background-color,box-shadow,opacity] duration-200 motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0 ${BTN[variant]}`}
    >
      {children}
    </button>
  );
}

/** Remove (two-step) and, when the lab allows it, "I cooked it again". */
function CookedActions({ p, align = 'start', journalLink = false }: { p: VariantProps; align?: 'start' | 'center'; journalLink?: boolean }) {
  const justify = align === 'center' ? 'justify-center' : 'justify-start';
  if (p.confirming) {
    return (
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-[14px] ${justify}`}>
        <span className="text-brown-dark">{p.count > 1 ? 'Remove the latest cook?' : 'Remove this cook?'}</span>
        <button
          type="button"
          onClick={p.onConfirmRemove}
          disabled={p.removing}
          className="font-semibold text-paprika underline-offset-4 hover:underline disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          {p.removing ? 'Removing…' : 'Remove'}
        </button>
        <button
          type="button"
          onClick={p.onCancelRemove}
          className="text-brown-dark underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          Keep
        </button>
      </div>
    );
  }
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-[14px] ${justify}`}>
      {journalLink && (
        <Link href="/journal" className="text-teal underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal">
          Open your journal
        </Link>
      )}
      {p.allowAgain && (
        <button
          type="button"
          onClick={p.onCook}
          className="inline-flex items-center gap-1.5 text-teal underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          <RotateCcw size={16} aria-hidden /> I cooked it again
        </button>
      )}
      <button
        type="button"
        onClick={p.onAskRemove}
        className="inline-flex items-center gap-1.5 text-brown-medium hover:text-brown-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
      >
        <Undo2 size={16} aria-hidden /> {p.count > 1 ? 'Remove the latest cook' : 'Remove this cook'}
      </button>
    </div>
  );
}

/**
 * A round postmark in stamp ink: two rings, "Cooked" over the top, the
 * kitchen's name under the bottom, the date in the middle. Decorative (the
 * same facts are always written out in real text beside it).
 */
export function Postmark({
  size, date, count = 1, top = 'COOKED', bottom = "NIEVES'S KITCHEN", className = '', style,
}: {
  size: number; date: Date | null; count?: number; top?: string; bottom?: string; className?: string; style?: CSSProperties;
}) {
  const id = useId().replace(/:/g, '');
  const d = date ?? new Date();
  const dayMonth = `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-GB', { month: 'short' }).toUpperCase()}`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className={className} style={style}>
      <defs>
        <path id={`${id}t`} d="M 20,60 A 40,40 0 0 1 100,60" />
        <path id={`${id}b`} d="M 12,60 A 48,48 0 0 0 108,60" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <g fill="currentColor" style={{ fontFamily: 'var(--font-stamp), ui-monospace, monospace' }}>
        <text fontSize="11" letterSpacing="3">
          <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">{top}</textPath>
        </text>
        <text fontSize="8.5" letterSpacing="1.6">
          <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">{bottom}</textPath>
        </text>
        <text x="60" y="58" fontSize="14" textAnchor="middle">{dayMonth}</text>
        <text x="60" y="73" fontSize={count > 1 ? 9 : 10.5} textAnchor="middle" letterSpacing="1">
          {count > 1 ? `${count} TIMES` : d.getFullYear()}
        </text>
      </g>
      <circle cx="16" cy="60" r="2" fill="currentColor" />
      <circle cx="104" cy="60" r="2" fill="currentColor" />
    </svg>
  );
}

/** The country's own journal stamp (custom art or procedural), inert. At
 *  night it rests on the warm paper plinth, as on /journal and the pantry:
 *  ink art on the dark teal page reads muddy. */
export function CountryStamp({ country, slug, size, tilt = 0 }: { country: string; slug: string; size: number; tilt?: number }) {
  const row = { id: 'lab', recipe_slug: slug, recipe_country: country, cooked_at: new Date().toISOString() };
  return (
    <div inert aria-hidden className="lab-stamp-plinth ink-plinth shrink-0 rounded-[3px]" style={{ '--stamp-size': `${size}px`, transform: `rotate(${tilt}deg)` } as CSSProperties}>
      <CountryStampSlot country={country} stamps={[row]} onClick={() => {}} />
    </div>
  );
}

const inkFilter = (k: Knobs) => (k.texture === 'on' ? 'url(#stamp-ink)' : undefined);

/* ---------- A · Quiet button, postmark when cooked ---------- */

export function VariantA(p: VariantProps) {
  const k = p.knobs;
  if (p.state === 'cooked') {
    return (
      <div className="flex w-full max-w-lg flex-col items-center gap-5 text-center @md:flex-row @md:items-center @md:text-left">
        <motion.div
          key={p.pressKey}
          initial={p.pressKey ? { scale: 1.4, opacity: 0, rotate: k.aTilt - 10 } : false}
          animate={{ scale: 1, opacity: 1, rotate: k.aTilt }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="shrink-0 text-terracotta"
        >
          <Postmark size={k.aMark} date={p.lastCooked} count={p.count} style={{ opacity: k.aInk / 100, filter: inkFilter(k) }} />
        </motion.div>
        <div className="flex flex-col gap-2">
          <p className="font-heading text-[26px] leading-tight text-brown-dark">{cookedTimes(p.count)}</p>
          <p className="font-body text-[15px] text-brown-medium">
            {p.lastCooked ? `Last on ${longDate(p.lastCooked)}. ` : ''}It is in your Cook&apos;s Journal.
          </p>
          <div className="mt-1"><CookedActions p={p} /></div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <ActionButton variant={k.aButton} onClick={p.onCook} disabled={p.state !== 'idle'} label={ariaFor(p)}>
        <Check size={18} strokeWidth={2.4} aria-hidden />
        {idleLabel(p.state)}
      </ActionButton>
      <p className="font-body text-[14px] text-brown-medium">
        {p.state === 'preparing' ? 'Setting up your journal.' : "Made it? Add it to your Cook's Journal."}
      </p>
    </div>
  );
}

/* ---------- B · Journal slip ---------- */

export function VariantB(p: VariantProps) {
  const k = p.knobs;
  const centre = k.bAlign === 'centre';
  const cooked = p.state === 'cooked';
  return (
    <div
      className={`w-full max-w-xl rounded-[3px] bg-surface p-6 ring-1 ring-line shadow-[0_14px_30px_-22px_rgba(0,0,0,0.35)] @md:p-7 ${
        k.bRule === 'teal' ? 'border-t-2 border-teal' : ''
      }`}
    >
      <div className={`flex flex-col gap-5 ${centre ? 'items-center text-center' : ''} ${cooked ? '@md:flex-row @md:items-center @md:justify-between @md:text-left' : ''}`}>
        <div className={`flex flex-col gap-2 ${centre && !cooked ? 'items-center' : ''}`}>
          <Eyebrow tone="muted">The Cook&apos;s Journal</Eyebrow>
          {cooked ? (
            <>
              <p className="font-heading text-[26px] leading-tight text-brown-dark">In your journal</p>
              <p className="font-body text-[15px] text-brown-medium">
                {cookedTimes(p.count)}{p.lastCooked ? `. Last on ${longDate(p.lastCooked)}.` : '.'}
              </p>
              <div className="mt-1"><CookedActions p={p} journalLink align={centre ? 'center' : 'start'} /></div>
            </>
          ) : (
            <>
              <p className="font-heading text-[26px] leading-tight text-brown-dark">Made this one?</p>
              <p className="max-w-[40ch] font-body text-[15px] text-brown-medium">
                {p.state === 'preparing'
                  ? 'Setting up your journal. This only takes a moment.'
                  : `Log it and it goes in your journal.${p.country ? ` Your first dish from ${p.country} brings its stamp.` : ''}`}
              </p>
              <div className="mt-2">
                <ActionButton variant="primary" onClick={p.onCook} disabled={p.state !== 'idle'} label={ariaFor(p)}>
                  {idleLabel(p.state)}
                </ActionButton>
              </div>
            </>
          )}
        </div>
        {cooked && (
          <motion.div
            key={p.pressKey}
            initial={p.pressKey ? { scale: 1.3, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="shrink-0"
          >
            {p.country ? (
              <CountryStamp country={p.country} slug={p.slug} size={k.bStamp} tilt={k.bTilt} />
            ) : (
              <Postmark size={k.bStamp * 1.4} date={p.lastCooked} count={p.count} className="text-terracotta" style={{ transform: `rotate(${k.bTilt}deg)`, filter: inkFilter(k) }} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- C · The perforated stamp, retuned ---------- */

function perforation(bite: number): CSSProperties {
  // Paper on top, the four rows of bites below it: the paper layer composites
  // as "source minus what is under it", which leaves the paper with holes.
  // (The live CookedButton lists the bites first, which current Chrome's
  // unprefixed mask-composite reads the other way round.)
  const tile = bite * 2 + 1;
  const dot = (at: string) => `radial-gradient(circle ${bite}px at ${at}, #000 99%, transparent 100%)`;
  const layers = ['linear-gradient(#000, #000)', dot('0% 50%'), dot('100% 50%'), dot('50% 0%'), dot('50% 100%')].join(', ');
  const t = `${tile}px ${tile}px`;
  const size = `100% 100%, ${t}, ${t}, ${t}, ${t}`;
  const pos = '0 0, 0 0, 100% 0, 0 0, 0 100%';
  const rep = 'no-repeat, repeat-y, repeat-y, repeat-x, repeat-x';
  return {
    WebkitMaskImage: layers, maskImage: layers,
    WebkitMaskPosition: pos, maskPosition: pos,
    WebkitMaskSize: size, maskSize: size,
    WebkitMaskRepeat: rep, maskRepeat: rep,
    WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over',
    maskComposite: 'subtract, add, add, add, add',
  };
}

export function VariantC(p: VariantProps) {
  const k = p.knobs;
  const cooked = p.state === 'cooked';
  const mask = perforation(k.cBite);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <motion.button
        type="button"
        onClick={p.onCook}
        disabled={p.state !== 'idle'}
        aria-label={ariaFor(p)}
        whileTap={p.state === 'idle' ? { scale: 0.96, rotate: -2 } : undefined}
        animate={cooked
          ? { rotate: k.cTilt, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.20))' }
          : { rotate: 0, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.10))' }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className={`group relative block w-full rounded-[2px] outline-none disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-teal ${k.cNight === 'warm' ? 'lab-warm-night' : k.cNight === 'dim' ? 'lab-dim-night' : 'lab-lift-night'}`}
        style={{ maxWidth: k.cWidth, '--lab-dim': `${k.cDim}%`, '--lab-lift': `${k.cLift}%` } as CSSProperties}
      >
        <span
          aria-hidden
          className="absolute inset-0 transition-[background-color] duration-500"
          style={{
            ...mask,
            backgroundColor: cooked
              ? `color-mix(in srgb, var(--color-terracotta) ${k.cWash}%, var(--color-${k.cPaper}))`
              : `var(--color-${k.cPaper})`,
          }}
        />
        {p.state === 'idle' && (
          <span aria-hidden className="absolute inset-0 bg-teal/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={mask} />
        )}
        <span
          aria-hidden
          className="absolute transition-colors duration-500"
          style={{
            inset: k.cBite + 4,
            border: cooked
              ? '1.5px solid var(--color-terracotta)'
              : k.cFrame === 'terracotta'
                ? '1.5px solid color-mix(in srgb, var(--color-terracotta) 70%, transparent)'
                : '1px solid color-mix(in srgb, var(--color-teal) 45%, transparent)',
          }}
        />
        {cooked && (
          <span aria-hidden className="absolute" style={{ inset: k.cBite + 8, border: '1px solid color-mix(in srgb, var(--color-terracotta) 45%, transparent)' }} />
        )}
        <span className="relative flex flex-col items-center gap-1.5 px-8 py-6">
          {cooked ? (
            <>
              <Eyebrow as="span">In your journal</Eyebrow>
              <span className="flex items-center gap-2 font-heading text-[28px] italic leading-none text-brown-dark">
                <Check size={22} strokeWidth={2.4} className="text-terracotta" aria-hidden />
                {cookedTimes(p.count)}
              </span>
              {p.lastCooked && (
                <span className="font-body text-[14px] text-brown-dark">{p.count > 1 ? 'Last on ' : ''}{longDate(p.lastCooked)}</span>
              )}
            </>
          ) : (
            <>
              <Eyebrow as="span" tone="muted">The Cook&apos;s Journal</Eyebrow>
              <span className="font-heading text-[28px] leading-none text-brown-dark">{idleLabel(p.state)}</span>
              <span className="font-body text-[14px] text-brown-dark">
                {p.state === 'preparing' ? 'One moment' : 'Tap once you have made it'}
              </span>
            </>
          )}
        </span>
      </motion.button>
      {cooked && <CookedActions p={p} align="center" />}
    </div>
  );
}

/* ---------- D · The seal you press ---------- */

function SealRing({ size, cooked, date, count, k }: { size: number; cooked: boolean; date: Date | null; count: number; k: Knobs }) {
  const id = useId().replace(/:/g, '');
  if (cooked) {
    return <Postmark size={size} date={date} count={count} className="text-terracotta" style={{ filter: inkFilter(k) }} />;
  }
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className="text-teal">
      <defs>
        <path id={`${id}r`} d="M 60,60 m -47,0 a 47,47 0 1 1 94,0 a 47,47 0 1 1 -94,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="var(--color-surface)" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <text fill="currentColor" fontSize="9" letterSpacing="2.4" style={{ fontFamily: 'var(--font-stamp), ui-monospace, monospace' }}>
        <textPath href={`#${id}r`}>THE COOK&apos;S JOURNAL · NIEVES&apos;S KITCHEN ·</textPath>
      </text>
    </svg>
  );
}

export function VariantD(p: VariantProps) {
  const k = p.knobs;
  const cooked = p.state === 'cooked';
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-5 text-center @md:flex-row @md:text-left">
      <motion.button
        type="button"
        onClick={p.onCook}
        disabled={p.state !== 'idle'}
        aria-label={ariaFor(p)}
        whileHover={p.state === 'idle' ? { rotate: -3 } : undefined}
        whileTap={p.state === 'idle' ? { scale: 1 - k.dPress / 100 } : undefined}
        animate={{ rotate: cooked ? k.dTilt : 0, opacity: p.state === 'preparing' || p.state === 'failed' ? 0.55 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="relative shrink-0 rounded-full outline-none disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        style={{ width: k.dSize, height: k.dSize }}
      >
        <motion.span
          key={cooked ? `c${p.pressKey}` : 'idle'}
          initial={cooked && p.pressKey ? { scale: 1.25, opacity: 0.2 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1.2] }}
          className="absolute inset-0 block"
        >
          <SealRing size={k.dSize} cooked={cooked} date={p.lastCooked} count={p.count} k={k} />
        </motion.span>
        {!cooked && (
          <span className="absolute inset-0 flex items-center justify-center px-6 font-heading leading-[1.1] text-brown-dark" style={{ fontSize: Math.round(k.dSize * 0.13) }}>
            {p.state === 'pending' ? 'Adding…' : p.state === 'idle' ? <span>I cooked<br />this</span> : '…'}
          </span>
        )}
      </motion.button>
      <div className="flex flex-col gap-2">
        {cooked ? (
          <>
            <p className="font-heading text-[26px] leading-tight text-brown-dark">{cookedTimes(p.count)}</p>
            <p className="font-body text-[15px] text-brown-medium">
              {p.lastCooked ? `Last on ${longDate(p.lastCooked)}. ` : ''}It is in your Cook&apos;s Journal.
            </p>
            <div className="mt-1"><CookedActions p={p} /></div>
          </>
        ) : (
          <>
            <p className="font-heading text-[26px] leading-tight text-brown-dark">Made this one?</p>
            <p className="max-w-[34ch] font-body text-[15px] text-brown-medium">
              {p.state === 'preparing' ? 'Setting up your journal.' : "Press the seal to add it to your Cook's Journal."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- E · Journal slip with the stamp (B and C together) ---------- */

export function VariantE(p: VariantProps) {
  const k = p.knobs;
  const cooked = p.state === 'cooked';
  const mask = perforation(5);
  const night = k.eNight === 'warm' ? 'lab-warm-night' : 'lab-lift-night';
  const paper = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 transition-[background-color] duration-500"
        style={{
          ...mask,
          backgroundColor: cooked
            ? `color-mix(in srgb, var(--color-terracotta) ${k.eWash}%, var(--color-parchment-dark))`
            : 'var(--color-parchment-dark)',
        }}
      />
      {p.state === 'idle' && (
        <span aria-hidden className="absolute inset-0 bg-teal/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={mask} />
      )}
      <span
        aria-hidden
        className="absolute inset-[9px] transition-colors duration-500"
        style={{ border: cooked ? '1.5px solid var(--color-terracotta)' : '1px solid color-mix(in srgb, var(--color-teal) 55%, transparent)' }}
      />
      {cooked && (
        <span aria-hidden className="absolute inset-[13px]" style={{ border: '1px solid color-mix(in srgb, var(--color-terracotta) 45%, transparent)' }} />
      )}
    </>
  );
  const shadow = cooked ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.20))' : 'drop-shadow(0 3px 6px rgba(0,0,0,0.10))';

  if (!cooked) {
    return (
      <div className="flex w-full flex-col items-center">
        <motion.button
          type="button"
          onClick={p.onCook}
          disabled={p.state !== 'idle'}
          aria-label={ariaFor(p)}
          whileTap={p.state === 'idle' ? { scale: 0.97 } : undefined}
          className={`group relative block w-full rounded-[2px] outline-none disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-teal ${night}`}
          style={{ maxWidth: k.eWidth, filter: shadow }}
        >
          {paper}
          <span className="relative flex flex-col items-center gap-1.5 px-8 py-7 text-center">
            <Eyebrow as="span" tone="muted">The Cook&apos;s Journal</Eyebrow>
            <span className="font-heading text-[30px] leading-none text-brown-dark">{idleLabel(p.state)}</span>
            <span className="max-w-[36ch] font-body text-[14px] text-brown-dark">
              {p.state === 'preparing'
                ? 'One moment'
                : p.country
                  ? `Tap once you have made it. Your first dish from ${p.country} brings its stamp.`
                  : 'Tap once you have made it'}
            </span>
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: k.eSlipTilt }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className={`relative w-full rounded-[2px] ${night}`}
        style={{ maxWidth: k.eWidth, filter: shadow }}
      >
        {paper}
        <div className="relative flex flex-col items-center gap-5 px-8 py-7 text-center @md:flex-row @md:justify-between @md:text-left">
          <div className="flex flex-col items-center gap-1.5 @md:items-start">
            <Eyebrow as="span">In your journal</Eyebrow>
            <span className="flex items-center gap-2 font-heading text-[30px] italic leading-none text-brown-dark">
              <Check size={22} strokeWidth={2.4} className="text-terracotta" aria-hidden />
              {cookedTimes(p.count)}
            </span>
            {p.lastCooked && (
              <span className="font-body text-[14px] text-brown-dark">
                {p.count > 1 ? 'Last on ' : 'On '}{longDate(p.lastCooked)}
              </span>
            )}
          </div>
          <motion.div
            key={p.pressKey}
            initial={p.pressKey ? { scale: 1.3, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="shrink-0"
          >
            {p.country ? (
              <CountryStamp country={p.country} slug={p.slug} size={k.eStamp} tilt={k.eTilt} />
            ) : (
              <Postmark size={k.eStamp * 1.4} date={p.lastCooked} count={p.count} className="text-terracotta" style={{ transform: `rotate(${k.eTilt}deg)` }} />
            )}
          </motion.div>
        </div>
      </motion.div>
      <CookedActions p={p} align="center" journalLink />
    </div>
  );
}

export const VARIANTS = { A: VariantA, B: VariantB, C: VariantC, D: VariantD, E: VariantE } as const;
export type VariantKey = keyof typeof VARIANTS;
