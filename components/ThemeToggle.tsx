'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

import { initTheme, setTheme, useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  /**
   * Seat the toggle on a fixed-cream surface (the Navbar's cobalt-band utility
   * pod). The default brown-* ink is theme-swapping and turns light in sepia,
   * which would vanish on the always-cream pod, so use the fixed cobalt ink
   * instead — stable in both themes.
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
    ? 'text-cobalt hover:bg-cobalt/10 hover:text-cobalt-deep'
    : 'text-brown-medium hover:bg-brown-light/15 hover:text-brown-dark';

  return (
    <button
      onClick={() => setTheme(theme === 'parchment' ? 'sepia' : 'parchment')}
      aria-label={theme === 'parchment' ? 'Switch to sepia theme' : 'Switch to parchment theme'}
      title={theme === 'parchment' ? 'Sepia mode' : 'Parchment mode'}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${ink}`}
    >
      {theme === 'parchment' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
