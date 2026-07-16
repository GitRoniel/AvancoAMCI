import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toast: { id: number; message: string; tone: 'ok' | 'error' } | null;
  toggleSidebar: () => void;
  setSidebar: (v: boolean) => void;
  showToast: (message: string, tone?: 'ok' | 'error') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toast: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (v) => set({ sidebarOpen: v }),
  showToast: (message, tone = 'ok') => set({ toast: { id: Date.now(), message, tone } }),
  clearToast: () => set({ toast: null }),
}));
