/**
 * RESPONSIBILITY: Preserve the existing selectable accent catalogue for preference controls.
 * FLOW: AccentPreferencesProvider → drawer selection; canonical UI colors remain in light/dark themes.
 */
export const THEME_PALETTES = [
  {id: 'blue', name: 'Ocean Blue', light: '#2563EB', dark: '#60A5FA'},
  {id: 'indigo', name: 'Indigo', light: '#6366F1', dark: '#818CF8'},
  {id: 'orange', name: 'Orange', light: '#F97316', dark: '#FB923C'},
  {id: 'cyan', name: 'Sky Cyan', light: '#0891B2', dark: '#22D3EE'},
  {id: 'emerald', name: 'Emerald', light: '#10B981', dark: '#34D399'},
  {id: 'mint', name: 'Fresh Mint', light: '#14B8A6', dark: '#2DD4BF'},
  {id: 'teal', name: 'Teal', light: '#0D9488', dark: '#2DD4BF'},
  {id: 'violet', name: 'Purple', light: '#8B5CF6', dark: '#A78BFA'},
  {id: 'rose', name: 'Rose Pink', light: '#EC4899', dark: '#F472B6'},
  {id: 'coral', name: 'Coral Glow', light: '#FF6B6B', dark: '#FF8787'},
  {id: 'ruby', name: 'Ruby Wine', light: '#E11D48', dark: '#FB7185'},
  {id: 'amber', name: 'Amber Gold', light: '#F59E0B', dark: '#FBBF24'},
  {id: 'red', name: 'Crimson', light: '#EF4444', dark: '#F87171'},
  {id: 'slate', name: 'Slate', light: '#475569', dark: '#94A3B8'},
];
