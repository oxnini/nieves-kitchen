'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PassportHelpModal({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-brown-dark/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How your passport works"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className="bg-parchment rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-light/40">
          <h2 className="font-heading text-xl font-bold text-brown-dark">
            How your passport works
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded hover:bg-brown-light/20 text-brown-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-5 text-sm text-brown-dark font-body">
          <section>
            <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] mb-2">
              Getting started
            </div>
            <ol className="space-y-2">
              <HelpStep numeral="①" text="Cook a recipe from anywhere in the app." />
              <HelpStep numeral="②" text="Earn a dated country stamp." />
              <HelpStep numeral="③" text="Fill your passport, unlock traveler titles." />
            </ol>
          </section>

          <section>
            <div className="text-brown-medium text-[10px] uppercase tracking-[0.3em] mb-2">
              Reading the booklet
            </div>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                A stamp appears the first time you cook any recipe from a country; cooking more recipes from the same
                country raises the <span className="font-semibold">×count</span> on the stamp.
              </li>
              <li>
                Tap any stamp to open the recipes you&rsquo;ve cooked from that country.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function HelpStep({ numeral, text }: { numeral: string; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span aria-hidden className="font-heading text-brown-medium leading-none mt-0.5">
        {numeral}
      </span>
      <span className="leading-snug">{text}</span>
    </li>
  );
}
