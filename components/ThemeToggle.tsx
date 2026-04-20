'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'parchment' | 'sepia';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('parchment');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('nieves-theme') as Theme | null;
      if (stored === 'sepia') {
        setTheme('sepia');
        document.documentElement.dataset.theme = 'sepia';
      }
    } catch { /* SSR / private browsing */ }
  }, []);

  function toggle() {
    const next: Theme = theme === 'parchment' ? 'sepia' : 'parchment';
    setTheme(next);
    if (next === 'sepia') {
      document.documentElement.dataset.theme = 'sepia';
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem('nieves-theme', next);
    } catch { /* private browsing */ }
  }

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'parchment' ? 'Switch to sepia theme' : 'Switch to parchment theme'}
      title={theme === 'parchment' ? 'Sepia mode' : 'Parchment mode'}
      className="flex items-center justify-center w-9 h-9 rounded-full text-brown-medium hover:bg-parchment-dark hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      {theme === 'parchment' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
