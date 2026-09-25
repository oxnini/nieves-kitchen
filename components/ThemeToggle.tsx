'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

import { initTheme, setTheme, useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  /**
   * Seated in the Navbar's utility pod, directly on the paper `bg-surface`
   * band (no chip beneath it any more). Inked a step darker than the default
   * (`text-brown-dark`, no hover text-color step, vs. the default's
   * `text-brown-medium` that darkens on hover) to match its two siblings in
   * the pod.
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
    ? 'text-brown-dark hover:bg-brown-light/15'
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
