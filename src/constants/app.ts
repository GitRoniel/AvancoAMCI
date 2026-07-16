export const APP_NAME = 'Avanço de Obras';

/** Swap to your deployed Google Apps Script Web App URL to use the live backend. */
export const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ?? '';

/** When false, the app reads bundled seed data (offline demo). */
export const USE_LIVE_BACKEND = Boolean(APPS_SCRIPT_URL);

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/mapa', label: 'Mapa', icon: 'map' },
  { to: '/historico', label: 'Histórico', icon: 'history' },
  { to: '/metas', label: 'Metas', icon: 'target' },
  { to: '/indicadores', label: 'Indicadores', icon: 'chart' },
  { to: '/fotos', label: 'Fotos', icon: 'photo' },
  { to: '/config', label: 'Config', icon: 'settings' },
] as const;

/** Bottom navigation (iPhone-style) — the essentials. */
export const BOTTOM_NAV = [
  { to: '/', label: 'Início', icon: 'dashboard' },
  { to: '/mapa', label: 'Mapa', icon: 'map' },
  { to: '/indicadores', label: 'KPIs', icon: 'chart' },
  { to: '/config', label: 'Ajustes', icon: 'settings' },
] as const;
