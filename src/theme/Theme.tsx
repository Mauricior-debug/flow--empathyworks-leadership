import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export const rainbow = ['#12A88A', '#1590E0', '#6A2FC0', '#E5321E', '#F59A1A'] as const;

const light = {
  page: '#F4F4F2',
  card: '#FFFFFF',
  sunk: '#EFEFEC',
  ink: '#1B1B1D',
  muted: '#62626A',
  line: '#E1E1DE',
  spruce: '#0B7A68',
  spruceInk: '#FFFFFF',
  spruceSoft: '#E0F3EE',
  sunrise: '#DE4419',
  sunriseSoft: '#FDEBD8',
  navy: '#152456',
  works: '#DE4419',
  good: '#1F6B45',
  bad: '#A33B32',
  warn: '#8A4E08',
  onPhoto: '#FFFFFF',
  scrim: 'rgba(12,16,28,0.55)',
  overlay: 'rgba(21,36,86,0.45)',
};

const dark = {
  page: '#111112',
  card: '#1C1C1F',
  sunk: '#26262A',
  ink: '#F3F3F4',
  muted: '#C8C8CE',
  line: '#3A3A40',
  spruce: '#3FD0B0',
  spruceInk: '#06221C',
  spruceSoft: '#163530',
  sunrise: '#F7A23B',
  sunriseSoft: '#3A2814',
  navy: '#F1F1F3',
  works: '#F26A3D',
  good: '#8ED4AE',
  bad: '#F0A8A2',
  warn: '#F0C27A',
  onPhoto: '#FFFFFF',
  scrim: 'rgba(0,0,0,0.62)',
  overlay: 'rgba(0,0,0,0.45)',
};

export type Palette = typeof light;
export type Mode = 'light' | 'dark';

type Theme = {
  mode: Mode;
  big: boolean;
  c: Palette;
  space: (n: number) => number;
  font: (n: number) => number;
  display: string;
  body: string;
  medium: string;
  semibold: string;
};

const Ctx = createContext<Theme | null>(null);

export function ThemeProvider({
  mode,
  big,
  fonts,
  children,
}: {
  mode: Mode;
  big: boolean;
  fonts: boolean;
  children: ReactNode;
}) {
  const value: Theme = {
    mode,
    big,
    c: mode === 'dark' ? dark : light,
    space: (n) => n,
    font: (n) => Math.round(n * (big ? 1.15 : 1)),
    display: fonts ? 'Newsreader_500Medium' : 'serif',
    body: fonts ? 'Inter_400Regular' : 'System',
    medium: fonts ? 'Inter_500Medium' : 'System',
    semibold: fonts ? 'Inter_600SemiBold' : 'System',
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('Theme missing');
  return v;
}

export function useMode(choice: 'auto' | 'light' | 'dark'): Mode {
  const scheme = useColorScheme();
  if (choice === 'auto') return scheme === 'dark' ? 'dark' : 'light';
  return choice;
}
