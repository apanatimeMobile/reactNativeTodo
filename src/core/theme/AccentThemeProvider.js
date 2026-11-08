/**
 * RESPONSIBILITY: Persist the existing selectable accent preference independently of canonical visual tokens.
 * FLOW: Saved accent identity → drawer preference controls; no duplicate theme-mode owner.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem } from '../storage/jsonStorage';
import { THEME_PALETTES } from './accentPalettes';

const THEME_ACCENT_KEY = '@todomaster/accent_color';
/** @type {import('react').Context<{accentColor: string, loading: boolean, palettes: typeof THEME_PALETTES, setAccentColor: (value: string) => void} | null>} */
const AccentContext = createContext(null);

export function AccentPreferencesProvider({ children }) {
  const [accentColor, setAccent] = useState('blue');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getItem(THEME_ACCENT_KEY, 'blue').then((saved) => {
      if (active && THEME_PALETTES.some((palette) => palette.id === saved)) setAccent(saved);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!loading) setItem(THEME_ACCENT_KEY, accentColor);
  }, [accentColor, loading]);
  const value = useMemo(() => ({
    accentColor,
    loading,
    palettes: THEME_PALETTES,
    setAccentColor: (nextAccent) => {
      if (THEME_PALETTES.some((palette) => palette.id === nextAccent)) setAccent(nextAccent);
    },
  }), [accentColor, loading]);
  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccentPreferences() {
  const context = useContext(AccentContext);
  if (!context) throw new Error('useAccentPreferences requires AccentPreferencesProvider');
  return context;
}
