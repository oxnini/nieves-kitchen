'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

import { initTheme, setTheme, useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  /**
   * Seated in the Navbar's icon cluster (search · favourites · theme),
   * directly on the paper `bg-surface` band. Inked a step darker than the
   * default (`text-brown-dark`, no hover text-color step, vs. the default's
   * `text-brown-medium` that darkens on hover), drawn at the configurator's
   * 19px / 1.6 stroke, with the nav's teal focus ring, to match its siblings.
   */
  onPod?: boolean;
}

export default function ThemeToggle({ onPod = false }: ThemeToggleProps = {}) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initTheme();
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const ink = onPod
    ? 'text-brown-dark hover:bg-brown-light/15 focus-visible:outline-teal'
    : 'text-brown-medium hover:bg-brown-light/15 hover:text-brown-dark focus-visible:outline-terracotta';
  const iconSize = onPod ? 19 : 18;
  const stroke = onPod ? 1.6 : 2;

  return (
    <button
      onClick={() => setTheme(theme === 'parchment' ? 'sepia' : 'parchment')}
      aria-label={theme === 'parchment' ? 'Switch to sepia theme' : 'Switch to parchment theme'}
      title={theme === 'parchment' ? 'Sepia mode' : 'Parchment mode'}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${ink}`}
    >
      {theme === 'parchment' ? (
        <Sun size={iconSize} strokeWidth={stroke} aria-hidden="true" />
      ) : (
        <Moon size={iconSize} strokeWidth={stroke} aria-hidden="true" />
      )}
    </button>
  );
}
