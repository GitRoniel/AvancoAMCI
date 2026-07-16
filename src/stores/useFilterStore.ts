import { create } from 'zustand';
import type { CondominioId, StatusKey } from '@/types';

interface FilterState {
  condominio: CondominioId | 'all';
  bloco: string | null;
  conjunto: string | null;
  status: StatusKey | 'all';
  servico: string | null;
  busca: string;
  set: (patch: Partial<Omit<FilterState, 'set' | 'reset'>>) => void;
  reset: () => void;
}

const initial = {
  condominio: 'all' as const,
  bloco: null,
  conjunto: null,
  status: 'all' as const,
  servico: null,
  busca: '',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  reset: () => set(initial),
}));
