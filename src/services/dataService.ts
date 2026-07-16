/**
 * Data service — single source of truth for the app's data.
 * Switches between the live Apps Script backend and the bundled seed
 * (offline demo). The seed is served as a STATIC asset (public/seed.json)
 * and fetched at runtime, so it never bloats the JS bundle.
 */
import { USE_LIVE_BACKEND } from '@/constants/app';
import { sheetsApi } from '@/api/sheetsApi';
import { offlineQueue } from '@/services/offlineQueue';
import type { SeedData } from '@/types';

let seedCache: SeedData | null = null;

async function loadSeed(): Promise<SeedData> {
  if (seedCache) return seedCache;
  const res = await fetch(`${import.meta.env.BASE_URL}seed.json`);
  if (!res.ok) throw new Error(`Falha ao carregar seed.json (${res.status})`);
  seedCache = (await res.json()) as SeedData;
  return seedCache;
}

export const dataService = {
  async getSnapshot(): Promise<SeedData> {
    if (!USE_LIVE_BACKEND) return loadSeed();
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
