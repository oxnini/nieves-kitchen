'use client';

/**
 * Full-size overlay for an expanded extra recipe image.
 *
 * Capture-phase Escape with stopPropagation so that, on the intercepting modal
 * route, the first Escape closes THIS lightbox rather than the recipe modal
 * beneath it (the same technique cook mode uses in RecipeDetail). The lightbox
 * only ever opens in read mode, so it never competes with the cook-mode Escape.
 */

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { RecipeImage } from '@/lib/types';

export default function RecipeImageLightbox({
  img,
  onClose,
}: {
  img: RecipeImage | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!img) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      e.preventDefault();
      onClose();
    }
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [img, onClose]);

  return (
    <AnimatePresence>
      {img && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={img.caption ? `Expanded image: ${img.caption}` : 'Expanded image'}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brown-dark/80 p-6 backdrop-blur-sm"
        >
          <motion.figure
            key="lightbox-figure"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] max-w-[92vw]"
          >
            <Image
              src={img.url}
              alt={img.caption ?? ''}
              width={img.width}
              height={img.height}
              sizes="92vw"
              className="mx-auto h-auto max-h-[82vh] w-auto max-w-[92vw] rounded-lg object-contain shadow-2xl"
            />
            {img.caption && (
              <figcaption className="mt-3 text-center font-stamp text-[11px] uppercase tracking-[0.18em] text-parchment/85">
                {img.caption}
              </figcaption>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close expanded image"
              className="absolute -right-2 -top-2 rounded-full bg-parchment/90 p-2 text-brown-dark shadow-md transition-colors hover:bg-parchment focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
