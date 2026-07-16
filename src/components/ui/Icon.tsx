import type { CSSProperties } from 'react';

type IconName =
  | 'dashboard' | 'map' | 'history' | 'target' | 'chart' | 'photo'
  | 'settings' | 'search' | 'close' | 'chevron' | 'refresh' | 'menu'
  | 'building' | 'alert' | 'check';

const PATHS: Record<IconName, string> = {
  dashboard: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z',
  map: 'm9 3-6 2v16l6-2 6 2 6-2V3l-6 2-6-2Zm0 0v16m6-14v16',
  history: 'M12 8v5l3 2m6-2a9 9 0 1 1-3-6.7L21 3',
  target: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  chart: 'M4 20V10m6 10V4m6 16v-7m4 7H2',
  photo: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.8l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.8L14 2h-4l-.5 2.5a8 8 0 0 0-3 1.8l-2.3-1-2 3.4 2 1.5A8 8 0 0 0 4 12c0 .6 0 1.2.2 1.8l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.8L10 22h4l.5-2.5a8 8 0 0 0 3-1.8l2.3 1 2-3.4-2-1.5c.1-.6.2-1.2.2-1.8Z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3',
  close: 'M6 6l12 12M18 6 6 18',
  chevron: 'm9 18 6-6-6-6',
  refresh: 'M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 22h12M9 6h.01M9 10h.01M9 14h.01M15 6h.01M15 10h.01M15 14h.01M10 22v-4h4v4',
  alert: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  check: 'M20 6 9 17l-5-5',
};

interface Props {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
  filled?: boolean;
}

export function Icon({ name, size = 20, stroke = 1.8, style, filled }: Props) {
  const solid = name === 'dashboard' && filled;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={style} aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export type { IconName };
