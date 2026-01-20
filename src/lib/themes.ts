import { Theme } from '@/types';

export const themes: Theme[] = [
  {
    name: 'Carnival',
    colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'],
    textColor: '#FFFFFF',
    accentColor: '#EF4444',
    backgroundColor: '#FEF3C7',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Ocean',
    colors: ['#0C4A6E', '#0369A1', '#0891B2', '#06B6D4'],
    textColor: '#FFFFFF',
    accentColor: '#06B6D4',
    backgroundColor: '#E0F2FE',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Sunset',
    colors: ['#F97316', '#FB923C', '#F472B6', '#EC4899'],
    textColor: '#FFFFFF',
    accentColor: '#EC4899',
    backgroundColor: '#FFF7ED',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Forest',
    colors: ['#166534', '#15803D', '#4D7C0F', '#84CC16'],
    textColor: '#FFFFFF',
    accentColor: '#22C55E',
    backgroundColor: '#ECFCCB',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Neon',
    colors: ['#F0ABFC', '#38BDF8', '#A3E635', '#C084FC'],
    textColor: '#000000',
    accentColor: '#F0ABFC',
    backgroundColor: '#18181B',
    buttonTextColor: '#000000',
  },
];

export const defaultTheme = themes[0];
