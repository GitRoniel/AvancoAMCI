/**
 * Thin client for the Google Apps Script Web App backend.
 * The Apps Script (see /apps-script/Code.gs) exposes a doGet/doPost JSON API
 * over the Google Sheets database. All reads/writes flow through here.
 */
import { APPS_SCRIPT_URL } from '@/constants/app';
import type { SeedData, UnitServico } from '@/types';

async function request<T>(action: string, payload?: unknown): Promise<T> {
  const url = `${APPS_SCRIPT_URL}?action=${encodeURIComponent(action)}`;
  const res = await fetch(url, {
    method: payload ? 'POST' : 'GET',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight w/ Apps Script
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) throw new Error(`Apps Script ${action} → ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data as T;
}

export const sheetsApi = {
  getSnapshot: () => request<SeedData>('snapshot'),
  updateServico: (p: {
    unidadeId: string;
    servicoItem: number;
    novoValor: number;
    usuario: string;
    obs?: string;
  }) => request<{ ok: true; registro: UnitServico }>('updateServico', p),
};
