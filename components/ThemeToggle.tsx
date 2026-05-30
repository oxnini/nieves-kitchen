'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

import { initTheme, setTheme, useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initTheme();
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'parchment' ? 'sepia' : 'parchment')}
      aria-label={theme === 'parchment' ? 'Switch to sepia theme' : 'Switch to parchment theme'}
      title={theme === 'parchment' ? 'Sepia mode' : 'Parchment mode'}
      className="flex items-center justify-center w-9 h-9 rounded-full text-brown-medium hover:bg-brown-light/15 hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      {theme === 'parchment' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
