'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, Trash2 } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import InkMark from './InkMark';

interface Props {
  country: string;
  /** All recipes from this country — cooked and uncooked. */
  recipes: Recipe[];
  /** Stamps keyed by recipe id. Uncooked recipes simply have no entry. */
  stampsByRecipe: Map<string, StampRow[]>;
  /** Deletes one `passport_stamps` row. Omit it (the `/dev/journal` fixture
   *  route does) and the per-cook remove affordance is not rendered at all. */
  onRemoveStamp?: (stampId: string) => Promise<unknown>;
  onClose: () => void;
}

interface CookedEntry {
  recipe: Recipe;
  stamps: StampRow[];
  latest: string;
  count: number;
}

export default function StampedRecipesModal({
  country,
  recipes,
  stampsByRecipe,
  onRemoveStamp,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = `stamp-modal-${country.replace(/\s+/g, '-').toLowerCase()}`;

  useFocusTrap(panelRef, { onEscape: onClose, autoFocus: true });
  // Same bottom-sheet shape as RecipeModal, same pull-to-refresh exposure.
  useScrollLock();

  const { cooked, uncooked, region } = useMemo(() => {
    const cookedList: CookedEntry[] = [];
    const uncookedList: Recipe[] = [];
    for (const r of recipes) {
      const stamps = stampsByRecipe.get(r.id);
      if (stamps && stamps.length > 0) {
        cookedList.push({
          recipe: r,
          stamps,
          latest: stamps[stamps.length - 1].cooked_at,
          count: stamps.length,
        });
      } else {
        uncookedList.push(r);
      }
    }
    cookedList.sort((a, b) => (a.latest < b.latest ? 1 : -1));
    uncookedList.sort((a, b) => a.name.localeCompare(b.name));
    return {
      cooked: cookedList,
      uncooked: uncookedList,
      region: recipes[0]?.region ?? null,
    };
  }, [recipes, stampsByRecipe]);

  const total = recipes.length;
  const cookedCount = cooked.length;

  // TODO(editorial-copy): replace with authored per-country blurbs.
  // Shape is a short cookbook-voice note; for now we derive a quiet slot
  // from what we already know so the placeholder reads like real copy.
  const blurb = composeBlurb({ region, total, cookedCount });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brown-dark/45 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className={
          'bg-parchment w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85dvh] ' +
          'sm:rounded-2xl rounded-t-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] ' +
          'overflow-hidden flex flex-col outline-none ' +
          'border-t-2 sm:border-2 border-brown-dark/10'
        }
      >
        {/* Header: close button floats top-right over a typographic header block. */}
        <div className="relative px-6 pt-6 pb-4">
          <InkMark
            glyph={<X strokeWidth={1.5} size={20} />}
            label="Close"
            onClick={onClose}
            className="absolute top-2 right-2"
            hitSize={36}
            size={20}
          />


          <div
            className="font-body text-[13px] text-brown-medium mb-2 nums-tabular"
            aria-hidden
          >
            {`№ ${String(cookedCount).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
          </div>
          <h2
            id={headingId}
            className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] font-normal text-brown-dark leading-[1.05] pr-10"
          >
            {country}
          </h2>
          {region && (
            <div className="mt-2 text-sm text-brown-medium font-body">
              {region}
              <span className="mx-2 text-brown-light" aria-hidden>·</span>
              <span className="nums-tabular">
                {cookedCount === 0
                  ? `${total} recipe${total === 1 ? '' : 's'} to try`
                  : cookedCount === total
                    ? `${total} recipe${total === 1 ? '' : 's'}, all cooked`
                    : `${cookedCount} of ${total} cooked`}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pb-6 flex-1">
          {/* Editorial blurb slot */}
          <p className="font-body text-[0.95rem] leading-relaxed text-brown-dark/85 max-w-[58ch]">
            {blurb}
          </p>

          {/* Divider: a hair-thin rule flanked by a tiny stamp-style mark. */}
          <RecipesDivider />

          <ul className="flex flex-col">
            {cooked.map(({ recipe, stamps, latest, count }) => (
              <CookedRow
                key={recipe.id}
                recipe={recipe}
                stamps={stamps}
                latest={latest}
                count={count}
                onRemoveStamp={onRemoveStamp}
                onNavigate={onClose}
              />
            ))}
            {uncooked.map(recipe => (
              <UncookedRow key={recipe.id} recipe={recipe} onNavigate={onClose} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RecipesDivider() {
  return (
    <div
      className="flex items-center gap-3 my-5"
      aria-hidden
    >
      <span className="h-px flex-1 bg-line" />
      <span className="font-body text-[12px] font-semibold tracking-[0.16em] uppercase text-brown-medium">
        Recipes
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function CookedRow({
  recipe, stamps, latest, count, onRemoveStamp, onNavigate,
}: {
  recipe: Recipe;
  stamps: StampRow[];
  latest: string;
  count: number;
  onRemoveStamp?: (stampId: string) => Promise<unknown>;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const chronologyId = `chron-${recipe.id}`;

  // Dates, most recent first. Stamps arrive ascending from the summarizer.
  const chronology = useMemo(() => [...stamps].reverse(), [stamps]);

  return (
    <li className="border-b border-dotted border-brown-light/40 last:border-b-0 py-3 first:pt-0">
      <div className="flex items-baseline gap-3">
        <Link
          href={`/recipes/${encodeURIComponent(recipe.id)}`}
          onClick={onNavigate}
          className={
            'font-heading text-[1.05rem] font-normal text-brown-dark ' +
            'hover:text-terracotta transition-colors leading-snug flex-1 min-w-0 ' +
            'focus:outline-none focus-visible:underline decoration-terracotta/60 underline-offset-4'
          }
        >
          {recipe.name}
        </Link>

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={chronologyId}
          aria-label={`${open ? 'Hide' : 'Show'} cook dates for ${recipe.name}`}
          className={
            'flex items-center gap-1.5 shrink-0 ' +
            'font-body text-[14px] text-brown-medium ' +
            'hover:text-terracotta transition-colors nums-tabular ' +
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ' +
            'rounded-sm px-1 -mx-1'
          }
        >
          <span>
            {`${count} ${count === 1 ? 'cook' : 'cooks'} · ${count === 1 ? '' : 'last '}${formatChip(latest)}`}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </div>

      {/* Chronology: grid-rows 0fr → 1fr trick for smooth reveal, respects reduced motion. */}
      <div
        id={chronologyId}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <ol
            className="mt-2 font-body text-[14px] text-brown-dark nums-tabular"
            aria-label={`Cook dates for ${recipe.name}`}
          >
            {chronology.map((s, i) => (
              <LedgerRow
                key={s.id}
                stamp={s}
                recipeName={recipe.name}
                isLatest={i === 0}
                isFirst={i === chronology.length - 1}
                showMarkers={chronology.length > 1}
                onRemoveStamp={onRemoveStamp}
              />
            ))}
          </ol>
        </div>
      </div>
    </li>
  );
}

/**
 * One dated cook in a recipe's chronology, and the only place a single stamp
 * can be deleted. Removal is deliberately buried one level down (the
 * chronology is collapsed by default) and is a two-step: the row swaps to a
 * confirm prompt rather than deleting on first click. Cooking is the app's
 * only write, so an accidental delete has no other way back.
 */
function LedgerRow({
  stamp, recipeName, isLatest, isFirst, showMarkers, onRemoveStamp,
}: {
  stamp: StampRow;
  recipeName: string;
  isLatest: boolean;
  isFirst: boolean;
  showMarkers: boolean;
  onRemoveStamp?: (stampId: string) => Promise<unknown>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function confirmRemove() {
    if (!onRemoveStamp || removing) return;
    setRemoving(true);
    setFailed(false);
    try {
      await onRemoveStamp(stamp.id);
      // The row unmounts when the query invalidates; nothing to reset.
    } catch (err) {
      console.error('Failed to remove stamp:', err);
      setRemoving(false);
      setFailed(true);
    }
  }

  if (confirming) {
    return (
      <li className="flex items-center gap-3 py-1">
        <span className="tabular-nums w-[7rem]">
          {formatLedger(stamp.cooked_at)}
        </span>
        <span className="flex-1 text-[13px] text-brown-medium">
          {failed ? 'Could not remove' : <span className="hidden sm:inline">Remove this cook?</span>}
        </span>
        <button
          type="button"
          onClick={confirmRemove}
          disabled={removing}
          className="text-[13px] font-semibold text-terracotta hover:underline underline-offset-4 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm px-1 py-1"
        >
          {removing ? 'Removing…' : failed ? 'Retry' : 'Remove'}
        </button>
        <button
          type="button"
          onClick={() => { setConfirming(false); setFailed(false); }}
          disabled={removing}
          className="text-[13px] font-semibold text-brown-medium hover:text-brown-dark disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-medium rounded-sm px-1 py-1"
        >
          Keep
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-1">
      <span className="tabular-nums w-[7rem]">
        {formatLedger(stamp.cooked_at)}
      </span>
      <span className="flex-1 border-b border-dotted border-brown-light/50" />
      {isLatest && showMarkers && (
        <span className="text-[13px] font-semibold text-terracotta">Latest</span>
      )}
      {isFirst && showMarkers && !isLatest && (
        <span className="text-[13px] font-semibold text-brown-medium">First</span>
      )}
      {onRemoveStamp && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label={`Remove the ${formatLedger(stamp.cooked_at)} cook of ${recipeName}`}
          className={
            // Always rendered, never hover-only: touch devices have no hover, and
            // this is the only path to deleting a stray cook.
            'shrink-0 p-1.5 -my-1.5 rounded-sm text-brown-medium ' +
            'hover:text-terracotta transition-colors ' +
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta'
          }
        >
          <Trash2 size={17} strokeWidth={1.75} aria-hidden />
        </button>
      )}
    </li>
  );
}

function UncookedRow({
  recipe, onNavigate,
}: { recipe: Recipe; onNavigate: () => void }) {
  return (
    <li className="border-b border-dotted border-brown-light/30 last:border-b-0 py-3">
      <Link
        href={`/recipes/${encodeURIComponent(recipe.id)}`}
        onClick={onNavigate}
        className={
          'block font-heading text-[1.02rem] text-brown-medium ' +
          'hover:text-terracotta transition-colors leading-snug ' +
          'focus:outline-none focus-visible:underline decoration-terracotta/50 underline-offset-4'
        }
      >
        {recipe.name}
      </Link>
    </li>
  );
}

function composeBlurb({
  region, total, cookedCount,
}: { region: string | null; total: number; cookedCount: number }): string {
  // Placeholder voice: short, cookbook-tone, reads as editorial. Real per-country
  // copy replaces this once authored.
  if (total === 0) return 'No recipes from here yet. Stay tuned.';
  if (cookedCount === 0) {
    return `A corner of the ${region ?? 'world'} you haven't cooked from yet. ${total} recipe${total === 1 ? '' : 's'} waiting for a first stamp.`;
  }
  if (cookedCount === total) {
    return `You've cooked every recipe on this page. Quiet pride is earned.`;
  }
  return `${cookedCount} already in your passport, ${total - cookedCount} still to try.`;
}

function formatChip(iso: string): string {
  // Short: "18 Apr" — no year by default to keep the chip light.
  return new Date(iso)
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatLedger(iso: string): string {
  // Fuller ledger entry: "18 Apr 2026".
  return new Date(iso)
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    .replace(',', '');
}
