'use client';

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/types';
import { themes, defaultTheme } from '@/lib/themes';

const STORAGE_KEY = 'spin-wheel-theme';

interface UseThemeReturn {
  theme: Theme;
  themeIndex: number;
  themes: Theme[];
  setTheme: (index: number) => void;
}

export function useTheme(): UseThemeReturn {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    // Load saved theme from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const index = parseInt(saved, 10);
        if (index >= 0 && index < themes.length) {
          setThemeIndex(index);
        }
      }
    } catch {
      // localStorage not available, use default
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables to document
    const theme = themes[themeIndex];
    const root = document.documentElement;
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-button-text', theme.buttonTextColor);
  }, [themeIndex]);

  const setTheme = useCallback((index: number) => {
    if (index >= 0 && index < themes.length) {
      setThemeIndex(index);
      try {
        localStorage.setItem(STORAGE_KEY, index.toString());
      } catch {
        // localStorage not available
      }
    }
  }, []);

  return {
    theme: themes[themeIndex],
    themeIndex,
    themes,
    setTheme,
  };
}
