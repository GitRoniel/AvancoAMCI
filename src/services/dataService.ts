/**
 * Data service — single source of truth for the app's data.
 * Automatically switches between the live Apps Script backend and the
 * bundled seed (offline demo). This is the seam that keeps the UI
 * agnostic to where data lives.
 */
import seed from '@/data/seed.json';
import { USE_LIVE_BACKEND } from '@/constants/app';
import { sheetsApi } from '@/api/sheetsApi';
import { offlineQueue } from '@/services/offlineQueue';
import type { SeedData } from '@/types';

const seedData = seed as unknown as SeedData;

export const dataService = {
  async getSnapshot(): Promise<SeedData> {
    if (!USE_LIVE_BACKEND) {
      // Simulate network latency for realistic loading states.
      await new Promise((r) => setTimeout(r, 220));
      return seedData;
    }
    return sheetsApi.getSnapshot();
  },

  async updateServico(p: {
    unidadeId: string;
    servicoItem: number;
    novoValor: number;
    usuario: string;
    obs?: string;
  }) {
    if (!USE_LIVE_BACKEND || !navigator.onLine) {
      await offlineQueue.enqueue({ type: 'updateServico', payload: p });
      return { queued: true as const };
    }
    return sheetsApi.updateServico(p);
  },
};
