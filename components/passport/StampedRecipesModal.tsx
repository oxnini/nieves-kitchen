'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow } from '@/lib/passport';

interface Props {
  country: string;
  recipes: Recipe[];
  stampsByRecipe: Map<string, StampRow[]>;
  onClose: () => void;
}

export default function StampedRecipesModal({
  country,
  recipes,
  stampsByRecipe,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown-dark/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Recipes cooked from ${country}`}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className="bg-parchment rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-light/40">
          <h2 className="font-heading text-xl font-bold text-brown-dark">
            Cooked from {country}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded hover:bg-brown-light/20 text-brown-medium"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-3">
          {recipes.length === 0 && (
            <p className="text-sm text-brown-medium">No cooked recipes yet.</p>
          )}
          {recipes.map(r => {
            const rs = stampsByRecipe.get(r.id) ?? [];
            const lastDate = rs[rs.length - 1]?.cooked_at;
            return (
              <Link
                key={r.id}
                href={`/recipes/${r.id}`}
                onClick={onClose}
                className="block p-3 rounded-xl bg-white hover:bg-white/80 border border-brown-light/30 transition-colors"
              >
                <div className="font-heading text-base font-semibold text-brown-dark">
                  {r.name}
                </div>
                <div className="text-xs text-brown-medium mt-0.5">
                  Cooked {rs.length} time{rs.length === 1 ? '' : 's'}
                  {lastDate && (
                    <> — last {new Date(lastDate).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}</>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
