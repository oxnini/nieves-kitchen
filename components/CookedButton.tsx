'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { ChefHat, Check, Undo2 } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useLogCook, useUndoCook, type CookResult } from '@/hooks/useLogCook';

interface ToastState extends CookResult {
  recipeCountry: string;
}

export default function CookedButton({ recipe }: { recipe: Recipe }) {
  const logCook = useLogCook();
  const undoCook = useUndoCook();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleClick() {
    if (logCook.isPending) return;
    try {
      const result = await logCook.mutateAsync(recipe);
      setToast({ ...result, recipeCountry: recipe.country });
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1500);
      fireConfetti(result.tier);
    } catch (err) {
      console.error('Failed to log cook:', err);
    }
  }

  async function handleUndo(stampId: string) {
    try {
      await undoCook.mutateAsync(stampId);
      setToast(null);
    } catch (err) {
      console.error('Failed to undo cook:', err);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={logCook.isPending}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-turmeric text-brown-dark font-medium hover:bg-turmeric/90 transition-colors shadow disabled:opacity-60"
      >
        {showCheck ? <Check size={18} /> : <ChefHat size={18} />}
        {showCheck ? 'Logged!' : 'I Cooked This'}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]"
          >
            <div className="bg-brown-dark text-parchment rounded-2xl shadow-2xl px-5 py-4">
              <div className="font-heading text-base font-semibold mb-0.5">
                {toastTitle(toast)}
              </div>
              <div className="text-sm text-parchment/80">
                {toastBody(toast)}
              </div>
              {toast.titleUnlocked && toast.titleUnlocked !== 'New Explorer' && (
                <div className="mt-2 text-sm text-turmeric font-medium">
                  ✦ New title: {toast.titleUnlocked}
                </div>
              )}
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="/passport"
                  className="text-sm font-medium text-turmeric hover:underline"
                >
                  View passport →
                </Link>
                <button
                  onClick={() => handleUndo(toast.newStamp.id)}
                  disabled={undoCook.isPending}
                  className="text-sm text-parchment/60 hover:text-parchment flex items-center gap-1 disabled:opacity-50"
                >
                  <Undo2 size={13} />
                  Undo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function toastTitle(t: ToastState): string {
  if (t.tier === 'new_country') return `Stamp unlocked: ${t.recipeCountry}!`;
  if (t.tier === 'new_recipe') return `Recipe card added`;
  return `Cooked again ✦ ${t.cookCount} times total`;
}

function toastBody(t: ToastState): string {
  if (t.tier === 'new_country') return `Your first ${t.recipeCountry} dish is in the passport.`;
  if (t.tier === 'new_recipe') return `Another ${t.recipeCountry} recipe in your collection.`;
  return `You've made this recipe ${t.cookCount} times — nicely done.`;
}

function fireConfetti(tier: CookResult['tier']) {
  if (tier === 'repeat') return;

  const base = {
    colors: ['#E2725B', '#E9C46A', '#E63946', '#8A9A5B'],
    origin: { y: 0.7 },
  };

  if (tier === 'new_country') {
    confetti({ ...base, particleCount: 140, spread: 90, startVelocity: 45 });
    setTimeout(() => confetti({ ...base, particleCount: 60, spread: 120, angle: 60 }), 180);
    setTimeout(() => confetti({ ...base, particleCount: 60, spread: 120, angle: 120 }), 260);
  } else {
    confetti({ ...base, particleCount: 50, spread: 60, startVelocity: 30 });
  }
}
