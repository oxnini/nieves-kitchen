'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChefHat, Check, Undo2, Loader2, X } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { useLogCook, useUndoCook, type CookResult } from '@/hooks/useLogCook';

type ToastKind = 'success' | 'error';

interface ToastState extends CookResult {
  recipeCountry: string;
}

interface ToastData {
  kind: ToastKind;
  success?: ToastState;
  errorMessage?: string;
}

export default function CookedButton({ recipe }: { recipe: Recipe }) {
  const logCook = useLogCook();
  const undoCook = useUndoCook();
  const [toast, setToast] = useState<ToastData | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.kind === 'error' ? 8000 : 6000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleClick() {
    if (logCook.isPending) return;
    try {
      const result = await logCook.mutateAsync(recipe);
      setToast({ kind: 'success', success: { ...result, recipeCountry: recipe.country } });
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1500);
      fireConfetti(result.tier);
    } catch {
      setToast({ kind: 'error', errorMessage: 'Couldn\u2019t log this cook. Check your connection and try again.' });
    }
  }

  async function handleUndo(stampId: string) {
    try {
      await undoCook.mutateAsync(stampId);
      setToast(null);
    } catch {
      setToast({ kind: 'error', errorMessage: 'Couldn\u2019t undo. Try again in a moment.' });
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <motion.button
          onClick={handleClick}
          disabled={logCook.isPending}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="w-full max-w-md flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg border-2 border-dashed border-brown-medium/40 bg-turmeric/15 font-stamp text-sm tracking-wider text-brown-dark hover:bg-turmeric/25 hover:border-brown-medium/60 transition-colors shadow-sm disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:ring-offset-2 focus-visible:ring-offset-parchment focus-visible:outline-none"
        >
          {logCook.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : showCheck ? (
            <Check size={18} />
          ) : (
            <ChefHat size={18} />
          )}
          {logCook.isPending ? 'LOGGING\u2026' : showCheck ? 'STAMPED!' : 'I COOKED THIS'}
        </motion.button>
        <span className="text-[13px] text-brown-medium/70">
          Add this to your culinary passport
        </span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]"
          >
            {toast.kind === 'error' ? (
              <div className="bg-paprika text-white rounded-2xl shadow-2xl px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-heading text-base font-semibold mb-0.5">
                      Something went wrong
                    </div>
                    <div className="text-sm text-white/80">
                      {toast.errorMessage}
                    </div>
                  </div>
                  <button
                    onClick={() => setToast(null)}
                    className="shrink-0 p-1 rounded-full hover:bg-white/15 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : toast.success && (
              <div className="bg-brown-dark text-parchment rounded-2xl shadow-2xl px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-heading text-base font-semibold mb-0.5">
                      {toastTitle(toast.success)}
                    </div>
                    <div className="text-sm text-parchment/80">
                      {toastBody(toast.success)}
                    </div>
                    {toast.success.titleUnlocked && toast.success.titleUnlocked !== 'New Explorer' && (
                      <div className="mt-2 text-sm text-turmeric font-medium">
                        ✦ New title: {toast.success.titleUnlocked}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setToast(null)}
                    className="shrink-0 p-1 rounded-full hover:bg-white/15 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={16} className="text-parchment/60" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    href="/passport"
                    className="text-sm font-medium text-turmeric hover:underline"
                  >
                    View passport →
                  </Link>
                  <button
                    onClick={() => handleUndo(toast.success!.newStamp.id)}
                    disabled={undoCook.isPending}
                    className="text-sm text-parchment/60 hover:text-parchment flex items-center gap-1 disabled:opacity-50"
                  >
                    <Undo2 size={13} />
                    {undoCook.isPending ? 'Undoing\u2026' : 'Undo'}
                  </button>
                </div>
              </div>
            )}
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

function getTokenColors(): string[] {
  const style = getComputedStyle(document.documentElement);
  return [
    style.getPropertyValue('--color-terracotta').trim(),
    style.getPropertyValue('--color-turmeric').trim(),
    style.getPropertyValue('--color-paprika').trim(),
    style.getPropertyValue('--color-sage').trim(),
  ].filter(Boolean);
}

async function fireConfetti(tier: CookResult['tier']) {
  if (tier === 'repeat') return;

  const confetti = (await import('canvas-confetti')).default;

  const colors = getTokenColors();
  const base = {
    colors: colors.length > 0 ? colors : ['#C4563A', '#D4A843', '#E63946', '#8DB9A4'],
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
